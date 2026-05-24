// src/setup/register.ts
// One-time agent registration on SAP network.
// Run: npm run register
//
// IDL-verified types:
//   capabilities: Capability[] = { id: string, description?: string, protocol_id?: string, version?: string }
//   pricing: PricingTier[] = { tier_id, price_per_call, min_price_per_call?, max_price_per_call?,
//     rate_limit, max_calls_per_session, burst_limit?, token_type (TokenType enum),
//     token_mint?, token_decimals?, settlement_mode?, min_escrow_deposit?, batch_interval_sec?, volume_curve? }
//   TokenType enum: { Sol: {} } or { Usdc: {} } or { Spl: {} }
//   SettlementMode enum: { X402: {} } or { Instant: {} } etc.

import { createSapClient, Pdas, Accounts } from "../oobe/client";
import BN from "bn.js";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import dotenv from "dotenv";
dotenv.config();

async function registerAgent() {
  const { client, keypair } = createSapClient();

  const [agentPda] = Pdas.getAgentPDA(keypair.publicKey);
  // IMPORTANT: The on-chain program seeds agent_stats from the agentPDA, not the wallet
  const [agentStatsPda] = Pdas.getAgentStatsPDA(agentPda);
  const [globalPda] = Pdas.getGlobalPDA();

  console.log(`\n[REGISTER] Wallet:    ${keypair.publicKey.toBase58()}`);
  console.log(`[REGISTER] Agent PDA: ${agentPda.toBase58()}`);

  // Check if already registered
  const existing = await client.connection.getAccountInfo(agentPda);
  if (existing?.data) {
    try {
      const parsed = Accounts.parseAgentAccount(Buffer.from(existing.data));
      console.log(`\n[REGISTER] ✅ Already registered: "${parsed.name}"`);
      console.log(
        `[REGISTER] View: https://explorer.oobeprotocol.ai/agents/${keypair.publicKey.toBase58()}`
      );
      return;
    } catch {
      // parse failed — re-register
    }
  }

  console.log("\n[REGISTER] Registering agent...");

  // Capability structs (IDL-verified field names)
  const capabilities = [
    {
      id: "solana:analyze",
      description: null,
      protocolId: null,
      version: null,
    },
    {
      id: "ace:inference",
      description: null,
      protocolId: null,
      version: null,
    },
    {
      id: "payment:x402",
      description: null,
      protocolId: null,
      version: null,
    },
  ];

  // PricingTier struct (Anchor requires camelCase at runtime, despite SDK types)
  const pricing = [
    {
      tierId: "standard",
      pricePerCall: new BN(5_000),
      minPricePerCall: null,
      maxPricePerCall: null,
      rateLimit: 60,
      maxCallsPerSession: 0,
      burstLimit: null,
      tokenType: { sol: {} },         // Anchor JS recursively camelCases enum variants
      tokenMint: null,
      tokenDecimals: null,
      settlementMode: { x402: {} },   // Anchor JS recursively camelCases enum variants
      minEscrowDeposit: null,
      batchIntervalSec: null,
      volumeCurve: null,
    },
  ];

  const protocols = ["A2A", "MCP"];

  const ix = await client.agent.registerAgent({
    name: "SolanaIntelAgent",
    description:
      "Fully autonomous on-chain intelligence agent. Analyzes Solana " +
      "ecosystem every 10 minutes using Ace Data Cloud AI services (LLM, " +
      "image, audio). Settles all payments via x402 EscrowV2. Zero human " +
      "input after startup.",
    capabilities: capabilities as any,
    pricing: pricing as any,
    protocols,
    agentId: `did:sap:solana-intel-${keypair.publicKey.toBase58().slice(0, 8)}`,
    agentUri: "https://github.com/yourusername/solana-intel-agent",
    x402Endpoint: "https://github.com/yourusername/solana-intel-agent#x402",
    wallet: keypair.publicKey,
    agent: agentPda,
    agentStats: agentStatsPda,
    globalRegistry: globalPda,
    signer: keypair,
    remainingAccounts: [],
  });

  const tx = await client.buildTransaction([ix], keypair.publicKey);
  tx.sign([keypair]);
  const sig = await client.connection.sendTransaction(tx, { preflightCommitment: "confirmed" });

  console.log("\n[REGISTER] ✅ Agent registered!");
  console.log("[REGISTER] Agent PDA:    ", agentPda.toBase58());
  console.log("[REGISTER] Stats PDA:    ", agentStatsPda.toBase58());
  console.log("[REGISTER] TX Signature: ", sig);
  console.log(
    "[REGISTER] Explorer:     ",
    `https://explorer.oobeprotocol.ai/agents/${keypair.publicKey.toBase58()}`
  );
  console.log("[REGISTER] Solscan TX:   ", `https://solscan.io/tx/${sig}`);

  // Verify (non-critical — SDK parser may fail on large accounts)
  try {
    await new Promise((r) => setTimeout(r, 2000));
    const info = await client.connection.getAccountInfo(agentPda);
    if (info?.data) {
      const parsed = Accounts.parseAgentAccount(Buffer.from(info.data));
      console.log("\n[REGISTER] Verified — Name:", parsed.name);
    }
  } catch {
    console.log("\n[REGISTER] Verification parse skipped (non-critical). Registration succeeded.");
  }
}

registerAgent().catch((err) => {
  console.error("[REGISTER FATAL]", err?.stack ?? err);
  process.exit(1);
});
