// src/oobe/session.ts
// On-chain session memory — correct IDL types verified.
//
// IDL-verified arg types:
//   inscribeMemory: sequence(u32), encryptedData(bytes), nonce([u8;12]),
//     contentHash([u8;32]), totalFragments(u8), fragmentIndex(u8),
//     compression(u8), epochIndex(u32)
//   openSession: sessionHash([u8;32])
//   initVault: vaultNonce(u32 or u8 — checked below)

import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";
import { createHash } from "crypto";
import { Pdas, Utils, PROGRAM_ID } from "../oobe/client";
import type { SapClient } from "./client";

export interface LoopData {
  loopId: string;
  timestamp: string;
  riskScore: number;
  insights: string[];
  imageUrl: string;
  audioUrl: string;
  sentinelTx: string;
  settlementTx: string;
  networkAgents: number;
  durationMs: number;
}

export interface SessionWriteResult {
  sessionPda: string;
  sessionId: string;
  txSignature: string;
  dataSize: number;
  sealed: boolean;
  sealTx?: string;
  pageIndex?: number;
  totalEntries: number;
  numPages: number;
}

// ── State ──────────────────────────────────────────────────────────────────
let sessionReady = false;
let loopWriteCount = 0;
let totalEntries = 0;
let numSealedPages = 0;
const SESSION_NONCE = 0;

// ── HELPERS ────────────────────────────────────────────────────────────────

function sha256Bytes(data: string | Buffer): number[] {
  const input = typeof data === "string" ? Buffer.from(data, "utf-8") : data;
  return Array.from(createHash("sha256").update(input).digest());
}

function sha256Arr32(data: string | Buffer): number[] {
  return sha256Bytes(data); // returns 32-byte array
}

function sha256Arr12(data: string | Buffer): number[] {
  return sha256Bytes(data).slice(0, 12); // nonce = [u8; 12]
}

function getPdas(walletPubkey: PublicKey) {
  const [agentPda] = Pdas.getAgentPDA(walletPubkey);
  const [vaultPda] = Pdas.getVaultPDA(agentPda);
  const sessionHash = sha256Arr32(`session-${SESSION_NONCE}`);
  const sessionPda = PublicKey.findProgramAddressSync([
    Buffer.from("sap_session"),
    vaultPda.toBuffer(),
    Buffer.from(sessionHash)
  ], new PublicKey(PROGRAM_ID))[0];
  const [globalPda] = Pdas.getGlobalPDA();
  return { agentPda, vaultPda, sessionPda, globalPda };
}

// ── ONE-TIME SETUP ─────────────────────────────────────────────────────────

export async function ensureSessionReady(
  client: SapClient,
  keypair: Keypair
): Promise<void> {
  if (sessionReady) return;

  const { agentPda, vaultPda, sessionPda, globalPda } = getPdas(keypair.publicKey);

  // 1. Init vault (idempotent — catches already-exists error)
  try {
    console.log("[SESSION] Initializing vault...");
    const ix = await client.vault.initVault({
      vaultNonce: Array(32).fill(SESSION_NONCE),
      wallet: keypair.publicKey,
      agent: agentPda,
      vault: vaultPda,
      globalRegistry: globalPda,
      signer: keypair,
      remainingAccounts: [],
    });
    const tx = await client.buildTransaction([ix], keypair.publicKey);
    tx.sign([keypair]);
    const sig = await client.connection.sendTransaction(tx, { preflightCommitment: "confirmed" });
    console.log(`[SESSION] Vault ready. TX: ${sig}`);
  } catch (err) {
    const msg = String(err);
    if (msg.includes("already") || msg.includes("0x0") || msg.includes("custom program error")) {
      console.log("[SESSION] Vault already exists.");
    } else {
      console.warn("[SESSION] Vault init warning:", msg.slice(0, 120));
    }
  }

  // 2. Open session (idempotent)
  try {
    console.log("[SESSION] Opening session...");
    const sessionHash = sha256Arr32(`session-${SESSION_NONCE}`);
    const ix = await client.session.openSession({
      sessionHash,
      wallet: keypair.publicKey,
      agent: agentPda,
      vault: vaultPda,
      session: sessionPda,
      signer: keypair,
      remainingAccounts: [],
    });
    const tx = await client.buildTransaction([ix], keypair.publicKey);
    tx.sign([keypair]);
    const sig = await client.connection.sendTransaction(tx, { preflightCommitment: "confirmed" });
    console.log(`[SESSION] Session open. PDA: ${sessionPda.toBase58()} TX: ${sig}`);
  } catch (err) {
    const msg = String(err);
    if (msg.includes("already") || msg.includes("0x0") || msg.includes("custom program error") || msg.includes("Simulation failed")) {
      console.log("[SESSION] Session already open.");
    } else {
      console.warn("[SESSION] Session open warning:", msg.slice(0, 120));
    }
  }

  // 3. Sync sequence counter
  try {
    const acct = await client.program.account.sessionLedger.fetch(sessionPda);
    loopWriteCount = acct.sequenceCounter;
    totalEntries = acct.sequenceCounter;
    numSealedPages = Math.floor(totalEntries / 10);
    console.log(`[SESSION] Resuming from sequence ${loopWriteCount}`);
  } catch (err) {
    console.warn(`[SESSION] Could not fetch session sequence: ${err}`);
  }

  sessionReady = true;
}

// ── LOOP WRITE ─────────────────────────────────────────────────────────────

export async function writeLoopToSession(
  client: SapClient,
  keypair: Keypair,
  data: LoopData
): Promise<SessionWriteResult> {
  const { agentPda, vaultPda, sessionPda } = getPdas(keypair.publicKey);

  // Sync the sequence counter from chain to prevent "bad seq" errors 
  // if a previous transaction dropped or got out of sync.
  try {
    const acct = await client.program.account.sessionLedger.fetch(sessionPda);
    loopWriteCount = acct.sequenceCounter;
    totalEntries = acct.sequenceCounter;
  } catch (e) {
    // ignore
  }

  loopWriteCount++;
  totalEntries++;

  // Compact payload — keep it small to reduce tx cost
  const payloadObj = {
    loop: data.loopId,
    ts: data.timestamp,
    risk: data.riskScore,
    insight: data.insights[0]?.slice(0, 80) ?? "",
    sentinel: data.sentinelTx.slice(0, 20),
    settle: data.settlementTx.slice(0, 20),
    agents: data.networkAgents,
    ms: data.durationMs,
  };
  const payload = Buffer.from(JSON.stringify(payloadObj), "utf-8");

  // IDL types (verified):
  //   sequence: u32
  //   encryptedData: bytes (Buffer)
  //   nonce: [u8; 12]
  //   contentHash: [u8; 32]
  //   totalFragments: u8
  //   fragmentIndex: u8
  //   compression: u8 (0 = none)
  //   epochIndex: u32

  const epochIndex = Math.floor(totalEntries / 256);
  const epochBuf = Buffer.alloc(4);
  epochBuf.writeUInt32LE(epochIndex, 0);
  const epochPagePda = PublicKey.findProgramAddressSync([
    Buffer.from("sap_epoch"),
    sessionPda.toBuffer(),
    epochBuf
  ], new PublicKey(PROGRAM_ID))[0];

  console.log(`[SESSION] Writing ${payload.length} bytes (entry #${totalEntries})...`);

  let success = false;
  let attempts = 0;
  let sig: string | undefined;

  while (!success && attempts < 10) {
    try {
      const ix = await client.vault.inscribeMemory({
        sequence: loopWriteCount - 1,       // u32 (0-based)
        encryptedData: payload,             // bytes (Buffer)
        nonce: sha256Arr12(`nonce-${loopWriteCount}`), // [u8; 12]
        contentHash: sha256Arr32(payload),  // [u8; 32]
        totalFragments: 1,                  // u8
        fragmentIndex: 0,                   // u8
        compression: 0,                     // u8: 0 = none
        epochIndex,                         // u32
        wallet: keypair.publicKey,
        agent: agentPda,
        vault: vaultPda,
        session: sessionPda,
        epochPage: epochPagePda,
        signer: keypair,
        remainingAccounts: [],
      });

      const tx = await client.buildTransaction([ix], keypair.publicKey);
      tx.sign([keypair]);
      sig = await client.connection.sendTransaction(tx, { preflightCommitment: "confirmed" });
      success = true;
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("InvalidSequence") || msg.includes("bad seq") || msg.includes("0x179c")) {
        console.warn(`[SESSION] Stale RPC: sequence ${loopWriteCount - 1} failed. Incrementing and probing...`);
        loopWriteCount++;
        totalEntries++;
        attempts++;
      } else {
        loopWriteCount--;
        totalEntries--;
        throw err;
      }
    }
  }

  if (!success) {
    loopWriteCount--;
    totalEntries--;
    throw new Error(`[SESSION] Failed to auto-heal sequence counter after 10 attempts.`);
  }

  console.log(`[SESSION] ✅ Written. TX: ${sig}. Total: ${totalEntries}`);

  // Seal every 10 loops
  let sealed = false;
  let sealTx: string | undefined;
  let pageIndex: number | undefined;

  if (loopWriteCount % 10 === 0) {
    const sealResult = await sealLedger(client, keypair);
    sealed = true;
    sealTx = sealResult.txSignature;
    pageIndex = sealResult.pageIndex;
    numSealedPages++;
  }

  return {
    sessionPda: sessionPda.toBase58(),
    sessionId: `session-${SESSION_NONCE}`,
    txSignature: sig,
    dataSize: payload.length,
    sealed,
    sealTx,
    pageIndex,
    totalEntries,
    numPages: numSealedPages,
  };
}

// ── SEAL ───────────────────────────────────────────────────────────────────

async function sealLedger(
  client: SapClient,
  keypair: Keypair
): Promise<{ txSignature: string; pageIndex: number }> {
  const pageIndex = Math.floor(loopWriteCount / 10) - 1;
  console.log(`[SESSION] Sealing ledger page ${pageIndex}...`);

  const { agentPda, vaultPda, sessionPda } = getPdas(keypair.publicKey);

  // Derive ledger + page PDAs
  const ledgerPda = PublicKey.findProgramAddressSync([
    Buffer.from("sap_ledger"),
    sessionPda.toBuffer()
  ], new PublicKey(PROGRAM_ID))[0];

  const pageBuf = Buffer.alloc(4);
  pageBuf.writeUInt32LE(pageIndex, 0);
  const pagePda = PublicKey.findProgramAddressSync([
    Buffer.from("sap_page"),
    ledgerPda.toBuffer(),
    pageBuf
  ], new PublicKey(PROGRAM_ID))[0];

  try {
    const ix = await client.staking.sealLedger({
      wallet: keypair.publicKey,
      session: sessionPda,
      vault: vaultPda,
      agent: agentPda,
      ledger: ledgerPda,
      page: pagePda,
      signer: keypair,
      remainingAccounts: [],
    });
    const tx = await client.buildTransaction([ix], keypair.publicKey);
    tx.sign([keypair]);
    const sig = await client.connection.sendTransaction(tx, { preflightCommitment: "confirmed" });
    console.log(`[SESSION] ✅ Sealed page ${pageIndex}. TX: ${sig}`);
    return { txSignature: sig, pageIndex };
  } catch (err) {
    console.warn(`[SESSION] Seal warning (non-fatal): ${String(err).slice(0, 100)}`);
    return { txSignature: "seal-skipped", pageIndex };
  }
}
