const anchor = require('@coral-xyz/anchor');
const { Connection, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const conn = new Connection('https://api.mainnet-beta.solana.com');

async function main() {
  const idl = await anchor.Program.fetchIdl(new PublicKey('SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ'), { connection: conn });
  fs.writeFileSync('idl.json', JSON.stringify(idl, null, 2), 'utf8');
}

main().catch(console.error);
