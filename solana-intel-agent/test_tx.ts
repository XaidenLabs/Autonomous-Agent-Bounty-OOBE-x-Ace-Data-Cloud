import { createSapClient, Accounts } from "./src/oobe/client";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

async function run() {
  const { client, keypair } = createSapClient();
  const Pdas = require('./src/oobe/client').Pdas;
  const [ourAgentPda] = Pdas.getAgentPDA(keypair.publicKey);
  const ESCROW_NONCE = 0;
  const PROGRAM_ID = require('./src/oobe/client').PROGRAM_ID;
  const escrowPda = PublicKey.findProgramAddressSync([
    Buffer.from("sap_escrow_v2"),
    ourAgentPda.toBuffer(),
    keypair.publicKey.toBuffer(),
    Buffer.from(new BN(ESCROW_NONCE).toArray("le", 8))
  ], new PublicKey(PROGRAM_ID))[0];

  const acct = await Accounts.fetchEscrowAccountV2(client.connection, escrowPda);
  console.log("Escrow account data:");
  console.log({
    depositor: acct!.depositor.toBase58(),
    agent: acct!.agent.toBase58(),
    balance: acct!.balance.toString(),
    pricePerCall: acct!.pricePerCall.toString()
  });
}
run();
