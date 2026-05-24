// src/daemon/loop.ts
// ════════════════════════════════════════════════════════════════
// SolanaIntelAgent — Main Daemon Loop
// ════════════════════════════════════════════════════════════════
//
// Run: npm start
// Zero human input. Runs every 10 minutes forever.
//
// Every loop:
//   1. DISCOVER  — scan SAP network, verify Sentinel on-chain
//   2. ANALYZE   — Ace Data Cloud LLM (Service 1)
//   3. VISUALIZE — Ace Data Cloud image generation (Service 2)
//   4. SONIFY    — Ace Data Cloud audio generation (Service 3)
//   5. PAY       — settleCallsV2 to Sentinel escrow (mandatory)
//   6. SETTLE    — settleCallsV2 from own escrow (volume)
//   7. REMEMBER  — vault.inscribeMemory (on-chain session memory)
//   8. LOG       — append to local JSONL file
//
// HTTP API on port 3001 feeds the React dashboard.

import http from "http";
import dotenv from "dotenv";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { createSapClient, Pdas, Accounts, PROGRAM_ID } from "../oobe/client";
import { runDiscovery, DiscoveryResult } from "../oobe/discovery";
import {
  initializeEscrow,
  settleLoopPayment,
  checkAndTopUp,
} from "../oobe/payments";
import {
  ensureSessionReady,
  writeLoopToSession,
  SessionWriteResult,
} from "../oobe/session";
import { setupSentinelChannel, paySentinel } from "../sentinel/interact";
import { runLLMAnalysis, LLMResult } from "../ace/llm";
import { generateReportImage, ImageResult } from "../ace/image";
import { generateSentimentAudio, MusicResult } from "../ace/music";
import { writeLog, readLogs, countLogs } from "../utils/logger";
import { withRetry } from "../utils/retry";

dotenv.config();

const LOOP_INTERVAL_MS = parseInt(process.env.LOOP_INTERVAL_MS || "600000");
const API_PORT = parseInt(process.env.API_PORT || "3001");

// ── Global state ───────────────────────────────────────────────────────────
let loopCount = 0;
let isSetupDone = false;
let lastRunData: object | null = null;
let lastRunTimestamp: string | null = null;
let daemonStartedAt: string | null = null;
let currentPhase: string | null = null;
let agentWalletAddress: string | null = null;

// ── DASHBOARD API SERVER ───────────────────────────────────────────────────

function startApiServer(
  client: ReturnType<typeof createSapClient>["client"],
  keypair: ReturnType<typeof createSapClient>["keypair"]
): void {
  const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Content-Type", "application/json");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = req.url?.split("?")[0];

    if (url === "/api/runs") {
      res.end(JSON.stringify(readLogs(200)));
    } else if (url === "/api/status") {
      let escrowBalance = 0;
      try {
        const agentPda = Pdas.getAgentPDA(keypair.publicKey)[0];
        const escrowPda = PublicKey.findProgramAddressSync([
          Buffer.from("sap_escrow_v2"),
          agentPda.toBuffer(),
          keypair.publicKey.toBuffer(),
          Buffer.from(new BN(0).toArray("le", 8))
        ], new PublicKey(PROGRAM_ID))[0];
        escrowBalance = await client.connection.getBalance(escrowPda);
      } catch (e) {
        console.error("Balance fetch error:", e);
      }

      res.end(
        JSON.stringify({
          programId: PROGRAM_ID,
          sentinelPubkey: process.env.SENTINEL_PUBKEY || "Ccr2yK3hLALU4p8oNRqrh4dGuvPJTth5KCLMio8cE1ph",
          escrowBalance,
          loopCount,
          isSetupDone,
          currentPhase,
          agentWallet: agentWalletAddress,
          daemonStartedAt,
          lastRunTimestamp,
          lastRun: lastRunData,
          totalLoggedRuns: countLogs(),
          uptime: daemonStartedAt
            ? Date.now() - new Date(daemonStartedAt).getTime()
            : 0,
          timestamp: new Date().toISOString(),
        })
      );
    } else if (url === "/api/health") {
      res.end(JSON.stringify({ ok: true, loopCount, isSetupDone }));
    } else if (url === "/api/run-now" && req.method === "POST") {
      if (currentPhase) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Already running" }));
      } else {
        res.end(JSON.stringify({ ok: true, message: "Loop triggered" }));
        runLoop(client, keypair).catch(err => console.error("[MANUAL LOOP ERROR]", err));
      }
    } else {
      res.writeHead(404);
      res.end('{"error":"not found"}');
    }
  });

  server.listen(API_PORT, () => {
    console.log(
      `\n[API] Dashboard: http://localhost:${API_PORT}`
    );
    console.log(`[API] Endpoints: /api/runs | /api/status | /api/health | /api/run-now\n`);
  });
}

// ── ONE-TIME SETUP ─────────────────────────────────────────────────────────

async function setup(
  client: ReturnType<typeof createSapClient>["client"],
  keypair: ReturnType<typeof createSapClient>["keypair"]
): Promise<void> {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║     SolanaIntelAgent — Starting Up       ║");
  console.log("║     OOBE × Ace Data Cloud Bounty 2026    ║");
  console.log("╚══════════════════════════════════════════╝\n");

  agentWalletAddress = keypair.publicKey.toBase58();

  // 1. Verify agent is registered
  currentPhase = "verify-registration";
  const [agentPda] = Pdas.getAgentPDA(keypair.publicKey);
  const info = await client.connection.getAccountInfo(agentPda);
  if (!info || !info.data) {
    throw new Error(
      "Agent not registered on-chain.\n" +
        "Run: npm run register\n" +
        "Then: npm run publish-tools"
    );
  }
  // Account exists = agent is registered. parseAgentAccount may crash on large accounts.
  try {
    const agent = Accounts.parseAgentAccount(Buffer.from(info.data));
    console.log(`[SETUP] ✅ Agent verified: ${agent.name}`);
  } catch {
    console.log(`[SETUP] ✅ Agent verified (account exists, ${info.data.length} bytes)`);
  }
  // 2. Discovery check
  currentPhase = "discovery";
  await runDiscovery(client);

  // 3. Initialize main escrow
  currentPhase = "init-escrow";
  await initializeEscrow(client, keypair);

  // 4. Set up Sentinel payment channel
  currentPhase = "sentinel-setup";
  const sentinel = await setupSentinelChannel(client, keypair);
  console.log(`[SETUP] ✅ Sentinel channel ready: ${sentinel.sentinelName}`);

  // 5. Ensure vault and session are ready
  currentPhase = "session-setup";
  await ensureSessionReady(client, keypair);

  isSetupDone = true;
  currentPhase = null;
  console.log("\n[SETUP] ✅ All setup complete. Starting autonomous loop...\n");
}

// ── MAIN LOOP ──────────────────────────────────────────────────────────────

async function runLoop(
  client: ReturnType<typeof createSapClient>["client"],
  keypair: ReturnType<typeof createSapClient>["keypair"]
): Promise<void> {
  loopCount++;
  const loopId = `${loopCount}-${Date.now()}`;
  const startTime = Date.now();

  console.log(`\n${"─".repeat(56)}`);
  console.log(`LOOP ${loopCount} | ${new Date().toISOString()}`);
  console.log(`${"─".repeat(56)}`);

  let discovery: DiscoveryResult | null = null;
  let llm: LLMResult | null = null;
  let image: ImageResult | null = null;
  let music: MusicResult | null = null;
  let sentinelResult: { txSignature: string; callsSettled: number } | null = null;
  let paymentResult: { txSignature: string; callsSettled: number; amountLamports: string } | null = null;
  let session: SessionWriteResult | null = null;

  try {
    // ── 1. DISCOVERY ──────────────────────────────────────────────────────
    currentPhase = "discovery";
    discovery = await withRetry(() => runDiscovery(client), "discovery");

    // ── 2. ACE DATA — SERVICE 1: LLM ─────────────────────────────────────
    currentPhase = "llm-analysis";
    llm = await withRetry(() => runLLMAnalysis("1h"), "llm-analysis");

    // ── 3. ACE DATA — SERVICE 2: IMAGE ───────────────────────────────────
    currentPhase = "image-generation";
    image = await withRetry(
      () => generateReportImage(llm!.riskScore, llm!.insights[0] ?? ""),
      "image-generation"
    );

    // ── 4. ACE DATA — SERVICE 3: AUDIO ───────────────────────────────────
    currentPhase = "music-generation";
    music = await withRetry(
      () => generateSentimentAudio(llm!.riskScore),
      "music-generation"
    );

    // ── 5. PAY SENTINEL (mandatory every loop) ────────────────────────────
    currentPhase = "sentinel-payment";
    sentinelResult = await withRetry(
      () => paySentinel(client, keypair, loopId),
      "sentinel-payment"
    );

    // ── 6. SETTLE OWN ESCROW ──────────────────────────────────────────────
    currentPhase = "escrow-settlement";
    paymentResult = await withRetry(
      () => settleLoopPayment(client, keypair, loopId),
      "escrow-settlement"
    );

    // ── 7. WRITE TO ON-CHAIN SESSION MEMORY ──────────────────────────────
    currentPhase = "session-write";
    session = await withRetry(
      () =>
        writeLoopToSession(client, keypair, {
          loopId,
          timestamp: new Date().toISOString(),
          riskScore: llm!.riskScore,
          insights: llm!.insights,
          imageUrl: image!.imageUrl,
          audioUrl: music!.audioUrl,
          sentinelTx: sentinelResult!.txSignature,
          settlementTx: paymentResult!.txSignature,
          networkAgents: discovery!.networkAgents,
          durationMs: Date.now() - startTime,
        }),
      "session-write"
    );

    // ── 8. LOG ────────────────────────────────────────────────────────────
    currentPhase = "logging";
    const elapsed = Date.now() - startTime;

    const logEntry = {
      loopId,
      loopCount,
      timestamp: new Date().toISOString(),
      durationMs: elapsed,
      discovery: {
        networkAgents: discovery.networkAgents,
        activeAgents: discovery.activeAgents,
        totalTools: discovery.totalTools,
        totalVaults: discovery.totalVaults,
        sentinelActive: discovery.sentinelActive,
        sentinelName: discovery.sentinelName,
        a2aAgents: discovery.a2aAgents,
        x402Agents: discovery.x402Agents,
      },
      aceData: {
        riskScore: llm.riskScore,
        insights: llm.insights,
        analysisText: llm.analysisText.slice(0, 250),
        imageUrl: image.imageUrl,
        audioMood: music.mood,
        audioUrl: music.audioUrl,
        llmModel: llm.model,
        tokensUsed: llm.tokensUsed,
      },
      onChain: {
        sessionPda: session.sessionPda,
        sessionId: session.sessionId,
        sessionTx: session.txSignature,
        sessionDataBytes: session.dataSize,
        sessionSealed: session.sealed,
        sealTx: session.sealTx,
        totalSessionEntries: session.totalEntries,
        numSealedPages: session.numPages,
        sentinelTx: sentinelResult.txSignature,
        sentinelCallsSettled: sentinelResult.callsSettled,
        settlementTx: paymentResult.txSignature,
        settlementCallsSettled: paymentResult.callsSettled,
        amountLamports: paymentResult.amountLamports,
      },
    };

    writeLog(logEntry);
    lastRunData = logEntry;
    lastRunTimestamp = new Date().toISOString();

    console.log(`\n✅ LOOP ${loopCount} COMPLETE (${elapsed}ms)`);
    console.log(`   Risk Score:     ${llm.riskScore}/100 (${music.mood})`);
    console.log(`   Sentinel TX:    ${sentinelResult.txSignature}`);
    console.log(`   Settlement TX:  ${paymentResult.txSignature}`);
    console.log(`   Session PDA:    ${session.sessionPda}`);
    console.log(
      `   Session:        ${session.totalEntries} entries, ${session.numPages} sealed pages`
    );
    console.log(`   Network:        ${discovery.networkAgents} agents`);
    console.log(`   Next loop in:   ${LOOP_INTERVAL_MS / 60000} minutes\n`);
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.error(`\n[LOOP ${loopCount} ERROR] Phase: ${currentPhase}`);
    console.error(err);

    writeLog({
      loopId,
      loopCount,
      timestamp: new Date().toISOString(),
      durationMs: elapsed,
      error: String(err),
      failedPhase: currentPhase,
      partialResults: {
        discovery: discovery
          ? { networkAgents: discovery.networkAgents, sentinelActive: discovery.sentinelActive }
          : null,
        riskScore: llm?.riskScore ?? null,
        sentinelTx: sentinelResult?.txSignature ?? null,
        settlementTx: paymentResult?.txSignature ?? null,
        sessionPda: session?.sessionPda ?? null,
      },
    });
  } finally {
    currentPhase = null;
  }
}

// ── ENTRY POINT ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  daemonStartedAt = new Date().toISOString();
  const { client, keypair } = createSapClient();

  // Start API server first so dashboard shows startup state
  startApiServer(client, keypair);

  // Run setup
  await setup(client, keypair);

  // Run first loop immediately
  await runLoop(client, keypair);

  // Then run on interval
  const interval = setInterval(
    () => runLoop(client, keypair),
    LOOP_INTERVAL_MS
  );

  // Balance check every hour
  setInterval(async () => {
    try {
      await checkAndTopUp(client, keypair);
    } catch (err) {
      console.warn("[REFILL]", err);
    }
  }, 60 * 60 * 1000);

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log(`\n[DAEMON] Stopping after ${loopCount} loops.`);
    clearInterval(interval);
    process.exit(0);
  });

  // Keep alive on errors
  process.on("uncaughtException", (err) => {
    console.error("[DAEMON] Uncaught:", err);
    writeLog({ error: String(err), timestamp: new Date().toISOString(), type: "uncaughtException" });
  });
  process.on("unhandledRejection", (reason) => {
    console.error("[DAEMON] Rejection:", reason);
    writeLog({ error: String(reason), timestamp: new Date().toISOString(), type: "unhandledRejection" });
  });
}

main().catch((err) => {
  console.error("[DAEMON FATAL]", err);
  process.exit(1);
});
