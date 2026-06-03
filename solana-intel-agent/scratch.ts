import { Connection, PublicKey } from "@solana/web3.js";

async function main() {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const escrowPda = new PublicKey("5cLTr7UhmRyRFgPVuqR96AtkokFCw2BecCCRqVwE2CUPE4zd195dCFcpmEtF6ukYRSQP7Bsuok2VHdHrc2EF8DRC");
  const info = await connection.getAccountInfo(escrowPda);
  console.log("Lamports:", info?.lamports);
}

main().catch(console.error);
