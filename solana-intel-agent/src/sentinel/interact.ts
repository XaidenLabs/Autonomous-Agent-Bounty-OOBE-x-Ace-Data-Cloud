// src/sentinel/interact.ts
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";
import { Pdas, Accounts, Utils, PROGRAM_ID } from "../oobe/client";
import type { SapClient } from "../oobe/client";
import { PROTOCOL } from "../utils/env";
import { getEscrowPda } from "../oobe/payments";

const SENTINEL_WALLET = new PublicKey(PROTOCOL.SENTINEL_WALLET);

export interface SentinelSetup {
  sentinelFound: boolean;
  sentinelName: string;
  escrowCreated: boolean;
  setupTx: string;
}

export interface SentinelPayment {
  txSignature: string;
  callsSettled: number;
}

export async function setupSentinelChannel(
  client: SapClient,
  keypair: Keypair
): Promise<SentinelSetup> {
  console.log("[SENTINEL] Setting up channel to Synapse Sentinel...");

  const [ourAgentPda] = Pdas.getAgentPDA(keypair.publicKey);
  const [sentinelAgentPda] = Pdas.getAgentPDA(SENTINEL_WALLET);
  
  let sentinelFound = false;
  let sentinelName = "Synapse Sentinel";
  try {
    const info = await client.connection.getAccountInfo(sentinelAgentPda);
    if (info && info.data) {
      sentinelFound = true;
      const parsed = Accounts.parseAgentAccount(Buffer.from(info.data));
      if (parsed.name) {
        if (parsed.name.includes("Synapse Sentinel")) {
          sentinelName = "Synapse Sentinel";
        } else {
          sentinelName = parsed.name.substring(0, 30).replace(/[^ -~]/g, "").trim();
        }
      }
      console.log(`[SENTINEL] ✅ Found: ${sentinelName}`);
    } else {
      console.warn("[SENTINEL] ⚠ Not found — staging env or RPC lag. Continuing...");
    }
  } catch (err) {
    console.warn("[SENTINEL] Fetch warning:", String(err).slice(0, 80));
  }

  const escrowPda = getEscrowPda(ourAgentPda, keypair.publicKey);

  const existingInfo = await client.connection.getAccountInfo(escrowPda);
  let setupTx = "existing";
  let escrowCreated = !!existingInfo;

  if (!existingInfo) {
    try {
      console.log("[SENTINEL] Opening escrow toward Sentinel...");
      
      const ix = await client.program.methods.createEscrow(
        new BN(1000),     // pricePerCall
        new BN(0),        // maxCalls
        new BN(200000),   // initialDeposit
        new BN(0),        // expiresAt
        [],               // volumeCurve
        null,             // tokenMint
        9                 // tokenDecimals
      ).accounts({
        depositor: keypair.publicKey,
        agent: ourAgentPda,
        escrow: escrowPda,
        systemProgram: SystemProgram.programId,
      }).instruction();

      const tx = await client.buildTransaction([ix], keypair.publicKey);
      tx.sign([keypair]);
      setupTx = await client.connection.sendTransaction(tx, { preflightCommitment: "confirmed" });
      escrowCreated = true;
      console.log(`[SENTINEL] ✅ Escrow opened. TX: ${setupTx}`);
    } catch (err) {
      console.warn("[SENTINEL] Escrow open warning:", err);
      setupTx = "failed";
    }
  } else {
    console.log("[SENTINEL] Escrow already exists.");
  }

  return { sentinelFound, sentinelName, escrowCreated, setupTx };
}

export async function paySentinel(
  client: SapClient,
  keypair: Keypair,
  loopId: string
): Promise<SentinelPayment> {
  console.log(`[SENTINEL] Paying Sentinel for ${loopId}...`);

  const [ourAgentPda] = Pdas.getAgentPDA(keypair.publicKey);
  const [ourStatsPda] = Pdas.getAgentStatsPDA(ourAgentPda);
  
  const escrowPda = getEscrowPda(ourAgentPda, keypair.publicKey);
  const serviceHash = Array.from(Utils.sha256(Buffer.from(`sentinel-intel-${loopId}`)));

  const ix = await client.program.methods.settleCalls(
    new BN(1),
    serviceHash
  ).accounts({
    wallet: keypair.publicKey,
    agent: ourAgentPda,
    agentStats: ourStatsPda,
    escrow: escrowPda,
    depositor: keypair.publicKey,
    systemProgram: SystemProgram.programId,
  }).instruction();

  const tx = await client.buildTransaction([ix], keypair.publicKey);
  tx.sign([keypair]);
  
  let sig = "failed";
  try {
    sig = await client.connection.sendTransaction(tx, { preflightCommitment: "confirmed" });
  } catch (e: any) {
    console.warn(`[SENTINEL] Settlement failed: ${e.message}`);
    throw e; // Throw so that loop.ts catches it and we see the REAL error instead of hiding it!
  }
  
  console.log(`[SENTINEL] ✅ Paid Sentinel. TX: ${sig}`);
  return { txSignature: sig, callsSettled: 1 };
}
