import { Keypair, Connection } from "@solana/web3.js";
import { SapClient, Pdas } from "@oobe-protocol-labs/synapse-sap-sdk";
import dotenv from "dotenv";
import { Wallet } from "@coral-xyz/anchor";
dotenv.config({path: "./.env"});

async function main() {
  const bytes = JSON.parse(process.env.SOLANA_PRIVATE_KEY!);
  const kp = Keypair.fromSecretKey(Uint8Array.from(bytes));
  const c = new Connection("https://api.mainnet-beta.solana.com");
  const client = new SapClient(c, new Wallet(kp) as any);
  const pda = Pdas.getSessionPDA(kp.publicKey)[0];
  const acct = await client.program.account.sessionLedger.fetch(pda);
  console.log(JSON.stringify(acct, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value
  , 2));
}
main().catch(console.error);
