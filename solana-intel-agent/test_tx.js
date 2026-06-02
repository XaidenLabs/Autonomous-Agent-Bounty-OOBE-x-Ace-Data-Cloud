const { Connection, PublicKey } = require('@solana/web3.js');
const { Pdas, PROGRAM_ID } = require('@oobe-protocol-labs/synapse-sap-sdk');
const bs58 = require('bs58');
const fs = require('fs');
const BN = require('bn.js');

const conn = new Connection('https://api.mainnet-beta.solana.com');

async function main() {
  const raw = process.env.SOLANA_PRIVATE_KEY || fs.readFileSync('id.json', 'utf8');
  const bytes = Uint8Array.from(JSON.parse(raw));
  const keypair = require('@solana/web3.js').Keypair.fromSecretKey(bytes);

  const [agentPda] = Pdas.getAgentPDA(keypair.publicKey);
  const ESCROW_NONCE = 0;

  const escrowPda = PublicKey.findProgramAddressSync([
    Buffer.from("sap_escrow_v2"),
    agentPda.toBuffer(),
    keypair.publicKey.toBuffer(),
    Buffer.from(new BN(ESCROW_NONCE).toArray("le", 8))
  ], new PublicKey(PROGRAM_ID))[0];

  console.log("Checking Escrow PDA:", escrowPda.toBase58());

  const info = await conn.getAccountInfo(escrowPda);
  if (!info) {
    console.log("Account does not exist");
    return;
  }
  
  console.log("Account data length:", info.data.length);
  
  // Decoded from expected offsets:
  // 0-7: discriminator
  // 8: bump
  // 9: version
  // 10-41: agent
  // 42-73: depositor
  
  const bump = info.data[8];
  const version = info.data[9];
  const agent = new PublicKey(info.data.subarray(10, 42));
  const depositor = new PublicKey(info.data.subarray(42, 74));
  
  console.log({
    bump,
    version,
    agent: agent.toBase58(),
    depositor: depositor.toBase58(),
    expectedAgent: agentPda.toBase58(),
    expectedDepositor: keypair.publicKey.toBase58()
  });
}

main().catch(console.error);
