import { Keypair } from "@solana/web3.js";
import { createSapClient, Pdas } from "./src/oobe/client";
import { getEscrowPda } from "./src/oobe/payments";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const { client } = await createSapClient();
  const keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.SOLANA_PRIVATE_KEY!)));
  
  const [ourAgentPda] = Pdas.getAgentPDA(keypair.publicKey);
  const escrowPda = getEscrowPda(ourAgentPda, keypair.publicKey);
  
  const escrowData = await client.program.account.escrowAccount.fetch(escrowPda);
  console.log("Internal Balance:", escrowData.balance.toString());
  console.log("Price per call:", escrowData.pricePerCall.toString());
  console.log("Total calls settled:", escrowData.totalCallsSettled.toString());
}

main().catch(console.error);
