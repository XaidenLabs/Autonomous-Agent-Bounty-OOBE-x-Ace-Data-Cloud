// src/oobe/client.ts
// Creates the SapClient instance shared by all modules.
//
// Important: SapClient uses AnchorProvider internally, which requires a wallet
// that implements signTransaction/signAllTransactions. We use anchor.Wallet
// (a.k.a NodeWallet) wrapping our Keypair.
//
// The SDK's createSapClient(rpcUrl, wallet) signature says Keypair in types,
// but the runtime works fine with AnchorWallet. We use `as any` to bypass.

import {
  SapClient as SapClientClass,
  Pdas,
  Accounts,
  PROGRAM_ID,
  Utils,
} from "@oobe-protocol-labs/synapse-sap-sdk";
import { Wallet as AnchorWallet } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import dotenv from "dotenv";
import { validateEnv } from "../utils/env";

dotenv.config();

export { Pdas, Accounts, PROGRAM_ID, Utils };

// Generic `any` alias used by all modules that need the client instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SapClient = any;

function loadKeypair(): Keypair {
  const raw = process.env.SOLANA_PRIVATE_KEY!;
  try {
    const bytes = Uint8Array.from(JSON.parse(raw));
    return Keypair.fromSecretKey(bytes);
  } catch {
    throw new Error(
      "SOLANA_PRIVATE_KEY must be a JSON array of bytes.\n" +
        "Example: [12,34,56,...,78]\n" +
        "Get it: cat ~/.config/solana/id.json"
    );
  }
}

export interface SapClientContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any;
  keypair: Keypair;
  wallet: InstanceType<typeof AnchorWallet>;
}

/**
 * Call once at startup. Returns a connected SapClient, the raw Keypair,
 * and the AnchorWallet (NodeWallet) wrapping the keypair.
 */
export function createSapClient(): SapClientContext {
  validateEnv();
  const keypair = loadKeypair();
  const wallet = new AnchorWallet(keypair);

  // Construct SapClient directly with opts — bypasses the wallet type mismatch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = new (SapClientClass as any)({
    rpcUrl: process.env.SYNAPSE_RPC_URL!,
    wallet,
  });

  console.log(`[CLIENT] SAP client ready`);
  console.log(`[CLIENT] Wallet: ${keypair.publicKey.toBase58()}`);
  console.log(`[CLIENT] Program: ${PROGRAM_ID}`);

  return { client, keypair, wallet };
}
