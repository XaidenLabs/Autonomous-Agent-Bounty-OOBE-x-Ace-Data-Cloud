require('dotenv/config');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Pdas, createSapClient } = require('./node_modules/@oobe-protocol-labs/synapse-sap-sdk/dist/cjs');
const bs58 = require('bs58');
const BN = require('bn.js');
const crypto = require('crypto');
const PROGRAM_ID = new PublicKey('SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ');

async function test() {
  const pk = process.env.SOLANA_PRIVATE_KEY.trim();
  const kp = Keypair.fromSecretKey(new Uint8Array(JSON.parse(pk)));
  const client = createSapClient('https://api.mainnet-beta.solana.com', kp);

  const [agent] = Pdas.getAgentPDA(kp.publicKey);
  const [stats] = Pdas.getAgentStatsPDA(agent);
  
  const escrowPda = PublicKey.findProgramAddressSync([
    Buffer.from('sap_escrow_v2'),
    agent.toBuffer(),
    kp.publicKey.toBuffer(),
    Buffer.from(new BN(1).toArray('le', 8))
  ], PROGRAM_ID)[0];
  
  const serviceHash = Array.from(crypto.createHash('sha256').update('test_perms_final').digest());
  const receiptPda = PublicKey.findProgramAddressSync([
    Buffer.from('sap_recv'),
    escrowPda.toBuffer(),
    Buffer.from(serviceHash)
  ], PROGRAM_ID)[0];

  const ix = await client.escrow.settleCallsV2({
    escrowNonce: new BN(1),
    callsToSettle: new BN(1),
    serviceHash,
    wallet: kp.publicKey,
    agent: agent,
    agentStats: stats,
    escrow: escrowPda,
    settlementReceipt: receiptPda,
    signer: kp,
    remainingAccounts: []
  });

  const kWallet = { pubkey: kp.publicKey, isSigner: true, isWritable: true };
  const kAgent = { pubkey: agent, isSigner: false, isWritable: false };
  const kStats = { pubkey: stats, isSigner: false, isWritable: true };
  const kEscrow = { pubkey: escrowPda, isSigner: false, isWritable: true };
  const kSysProg = { pubkey: new PublicKey('11111111111111111111111111111111'), isSigner: false, isWritable: false };
  const kReceipt = { pubkey: receiptPda, isSigner: false, isWritable: true };

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
      let logErr = '';
      if (sim.value.logs) {
         const match = sim.value.logs.find(l => l.includes('Error'));
         if (match) logErr = match;
      }
      console.log(`Order: ${order.padEnd(40)} | Error: ${err} | Log: ${logErr}`);
    } catch (e) {}
    await new Promise(r => setTimeout(r, 400));
  }
}
test();
