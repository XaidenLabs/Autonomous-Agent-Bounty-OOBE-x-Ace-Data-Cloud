const { Connection, PublicKey, Keypair, SystemProgram, Transaction } = require('@solana/web3.js');
const { SapClient, Pdas, Utils, PROGRAM_ID } = require('@oobe-protocol-labs/synapse-sap-sdk');
const { Wallet } = require('@coral-xyz/anchor');
const BN = require('bn.js');
const fs = require('fs');

async function main() {
  const raw = process.env.SOLANA_PRIVATE_KEY || fs.readFileSync('id.json', 'utf8');
  const bytes = Uint8Array.from(JSON.parse(raw));
  const keypair = Keypair.fromSecretKey(bytes);
  const wallet = new Wallet(keypair);
  const client = new SapClient({ rpcUrl: 'https://api.mainnet-beta.solana.com', wallet });

  const agentPda = Pdas.getAgentPDA(keypair.publicKey)[0];
  const escrowPda = PublicKey.findProgramAddressSync([
    Buffer.from("sap_escrow"),
    agentPda.toBuffer(),
    keypair.publicKey.toBuffer()
  ], new PublicKey(PROGRAM_ID))[0];

  console.log("Escrow v1 PDA:", escrowPda.toBase58());

  // Check if escrow already exists
  const info = await client.connection.getAccountInfo(escrowPda);
  if (info) {
    console.log("Escrow V1 exists! Length:", info.data.length);
  } else {
    console.log("Escrow V1 does not exist yet.");
  }
}

main().catch(console.error);
