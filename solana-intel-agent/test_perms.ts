require('ts-node').register();
require('dotenv/config');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Pdas } = require('./src/oobe/client');
const { createSapClient } = require('@oobe-protocol-labs/synapse-sap-sdk');
const bs58 = require('bs58');
const BN = require('bn.js');
const crypto = require('crypto');

async function test() {
  const pk = process.env.SOLANA_PRIVATE_KEY.trim();
  const kp = Keypair.fromSecretKey(new Uint8Array(JSON.parse(pk)));
  const client = createSapClient('https://api.devnet.solana.com', kp);

  const [agent] = Pdas.getAgentPDA(kp.publicKey);
  const [stats] = Pdas.getAgentStatsPDA(agent);
  
  const escrowPda = PublicKey.findProgramAddressSync([
    Buffer.from('sap_escrow_v2'),
    agent.toBuffer(),
    kp.publicKey.toBuffer(),
    Buffer.from(new BN(1).toArray('le', 8))
  ], new PublicKey('SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ'))[0];
  
  const [receipt] = Pdas.getPendingSettlementPDA(escrowPda, 0);

  const ix = await client.escrow.settleCallsV2({
    escrowNonce: new BN(1),
    callsToSettle: new BN(1),
    serviceHash: Array.from(crypto.createHash('sha256').update('test').digest()),
    wallet: kp.publicKey,
    agent: agent,
    agentStats: stats,
    escrow: escrowPda,
    settlementReceipt: receipt,
    signer: kp,
    remainingAccounts: []
  });

  const kWallet = { pubkey: kp.publicKey, isSigner: true, isWritable: true };
  const kAgent = { pubkey: agent, isSigner: false, isWritable: false };
  const kStats = { pubkey: stats, isSigner: false, isWritable: true };
  const kEscrow = { pubkey: escrowPda, isSigner: false, isWritable: true };
  const kSysProg = { pubkey: new PublicKey('11111111111111111111111111111111'), isSigner: false, isWritable: false };
  const kReceipt = { pubkey: receipt, isSigner: false, isWritable: true };

  const keys = [
    { name: 'stats', key: kStats },
    { name: 'escrow', key: kEscrow },
    { name: 'sysprog', key: kSysProg },
    { name: 'receipt', key: kReceipt }
  ];

  const perms = [];
  function generate(k, arr) {
    if (k === 1) { perms.push([...arr]); return; }
    generate(k - 1, arr);
    for (let i = 0; i < k - 1; i++) {
      if (k % 2 === 0) { const temp = arr[i]; arr[i] = arr[k-1]; arr[k-1] = temp; }
      else { const temp = arr[0]; arr[0] = arr[k-1]; arr[k-1] = temp; }
      generate(k - 1, arr);
    }
  }
  generate(4, keys);

  for (const p of perms) {
    ix.keys = [kWallet, kAgent, p[0].key, p[1].key, p[2].key, p[3].key];
    const tx = await client.buildTransaction([ix], kp.publicKey);
    try {
      const sim = await client.connection.simulateTransaction(tx);
      const err = sim.value.err ? JSON.stringify(sim.value.err) : 'SUCCESS';
      const order = p.map(x => x.name).join(', ');
      
      console.log(`[CANDIDATE] Order: wallet, agent, ${order} | Error: ${err}`);
    } catch (e) {}
  }
  console.log("Done testing permutations!");
}
test();
