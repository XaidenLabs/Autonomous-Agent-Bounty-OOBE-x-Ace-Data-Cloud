import { Keypair } from "@solana/web3.js";
import { setupSentinelChannel } from "./src/sentinel/interact";
import { SapClient } from "@oobe-protocol-labs/synapse-sap-sdk";
import bs58 from "bs58";
import "dotenv/config";

async function main() {
    const pk = process.env.SOLANA_PRIVATE_KEY!;
    const keypair = Keypair.fromSecretKey(new Uint8Array(bs58.decode(pk)));
    const client = SapClient.fromEnv();
    await setupSentinelChannel(client, keypair);
}
main().catch(console.error);
