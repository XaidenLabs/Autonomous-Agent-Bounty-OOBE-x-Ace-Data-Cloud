const { Connection, PublicKey } = require('@solana/web3.js');
const { PROGRAM_ID } = require('@oobe-protocol-labs/synapse-sap-sdk');
const fs = require('fs');

const conn = new Connection('https://api.mainnet-beta.solana.com');

async function main() {
  const escrowPda = new PublicKey('BBH8fm9YwqdgBaN3iitV7u8SNGiWpLerdhCC8SV9FLh');
  const info = await conn.getAccountInfo(escrowPda);
  
  // Fields offset check:
  // 0-7: discriminator
  // 8: bump
  // 9: version
  // 10-41: agent
  // 42-73: depositor
  // 74-105: agent_wallet
  // 106-113: escrow_nonce (u64)
  
  const escrowNonceBuffer = info.data.subarray(106, 114);
  const escrowNonce = Number(escrowNonceBuffer.readBigUInt64LE());
  
  console.log("Escrow Nonce on-chain:", escrowNonce);
}

main().catch(console.error);
