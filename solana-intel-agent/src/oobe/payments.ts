// src/oobe/payments.ts
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";
import { Pdas, Utils, PROGRAM_ID } from "../oobe/client";
import type { SapClient } from "./client";

const ESCROW_NONCE = 0;

// ── HELPERS ────────────────────────────────────────────────────────────────

function getAgentPda(w: PublicKey): PublicKey {
  return Pdas.getAgentPDA(w)[0];
}
function getStatsPda(w: PublicKey): PublicKey {
  const agentPda = getAgentPda(w);
  return Pdas.getAgentStatsPDA(agentPda)[0];
}
export function getEscrowPda(agentPda: PublicKey, depositor: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync([
    Buffer.from("sap_escrow"),
    agentPda.toBuffer(),
    depositor.toBuffer()
  ], new PublicKey(PROGRAM_ID))[0];
}

// ── SETUP ──────────────────────────────────────────────────────────────────

export async function initializeEscrow(
  client: SapClient,
  keypair: Keypair
): Promise<void> {
  const agentPda = getAgentPda(keypair.publicKey);
  const escrowPda = getEscrowPda(agentPda, keypair.publicKey);

  const existingInfo = await client.connection.getAccountInfo(escrowPda);
  if (existingInfo) {
    console.log("[PAYMENTS] Escrow exists. Checking balance...");
    await checkAndTopUp(client, keypair);
    return;
  }

  console.log("[PAYMENTS] Creating x402 escrow...");

  const statsPda = getStatsPda(keypair.publicKey);

  const ix = await client.program.methods.createEscrow(
    new BN(5000),     // pricePerCall
    new BN(0),        // maxCalls
    new BN(1000000),  // initialDeposit
    new BN(0),        // expiresAt
    [],               // volumeCurve
    null,             // tokenMint
    9                 // tokenDecimals
  ).accounts({
    depositor: keypair.publicKey,
    agent: agentPda,
    escrow: escrowPda,
    systemProgram: SystemProgram.programId,
  }).instruction();

  const tx = await client.buildTransaction([ix], keypair.publicKey);
  tx.sign([keypair]);
  const sig = await client.connection.sendTransaction(tx, { preflightCommitment: "confirmed" });
  console.log("[PAYMENTS] ✅ Escrow created. TX:", sig);
}

// ── LOOP OPERATIONS ────────────────────────────────────────────────────────

export async function settleLoopPayment(
  client: SapClient,
  keypair: Keypair,
  loopId: string
): Promise<{ txSignature: string; callsSettled: number; amountLamports: string }> {
  console.log(`[PAYMENTS] Settling for loop ${loopId}...`);

  const agentPda = getAgentPda(keypair.publicKey);
  const statsPda = getStatsPda(keypair.publicKey);
  const escrowPda = getEscrowPda(agentPda, keypair.publicKey);

  const serviceHash = Array.from(Utils.sha256(Buffer.from(`intel-loop-${loopId}`)));

  const ix = await client.program.methods.settleCalls(
    new BN(1),
    serviceHash
  ).accounts({
    wallet: keypair.publicKey,
    agent: agentPda,
    agentStats: statsPda,
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
    console.warn(`[PAYMENTS] Settlement failed: ${e.message}`);
    throw e;
  }
  console.log(`[PAYMENTS] ✅ Settled loop ${loopId}. TX: ${sig}`);
  return { txSignature: sig, callsSettled: 1, amountLamports: "5000" };
}

export async function checkAndTopUp(
  client: SapClient,
  keypair: Keypair
): Promise<void> {
  const agentPda = getAgentPda(keypair.publicKey);
  const escrowPda = getEscrowPda(agentPda, keypair.publicKey);

  const existingInfo = await client.connection.getAccountInfo(escrowPda);
  if (!existingInfo) return;

  const balance = existingInfo.lamports;
  const ppc = 5000;
  const affordable = Math.floor(balance / ppc);
  console.log(`[PAYMENTS] Balance: ${balance} lamports (~${affordable} calls)`);

  if (affordable < 20) {
    console.log("[PAYMENTS] Low — depositing 1,000,000 lamports...");
    const ix = await client.program.methods.depositEscrow(
      new BN(1000000)
    ).accounts({
      depositor: keypair.publicKey,
      escrow: escrowPda,
      systemProgram: SystemProgram.programId,
    }).instruction();

    const tx = await client.buildTransaction([ix], keypair.publicKey);
    tx.sign([keypair]);
    const sig = await client.connection.sendTransaction(tx, { preflightCommitment: "confirmed" });
    console.log(`[PAYMENTS] ✅ Topped up. TX: ${sig}`);
  }
}
