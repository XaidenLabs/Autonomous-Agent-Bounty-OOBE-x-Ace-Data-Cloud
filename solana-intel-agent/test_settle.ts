import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { createSapClient, Pdas, Utils, PROGRAM_ID } from "./src/oobe/client";
import BN from "bn.js";
import bs58 from "bs58";
import "dotenv/config";

const SENTINEL_WALLET = new PublicKey(process.env.PROTOCOL_SENTINEL_WALLET || "Ccr2yK3hLALU4p8oNRqrh4dGuvPJTth5KCLMio8cE1ph");
const SENTINEL_ESCROW_NONCE = 1;

function getEscrowPda(agentPda: PublicKey, depositor: PublicKey, nonce: number): PublicKey {
  return PublicKey.findProgramAddressSync([
    Buffer.from("sap_escrow_v2"),
    agentPda.toBuffer(),
    depositor.toBuffer(),
    Buffer.from(new BN(nonce).toArray("le", 8))
  ], new PublicKey(PROGRAM_ID))[0];
}

async function main() {
    const { client, keypair } = createSapClient();
    
    const [ourAgentPda] = Pdas.getAgentPDA(keypair.publicKey);
    const [sentinelAgentPda] = Pdas.getAgentPDA(SENTINEL_WALLET);
    const [sentinelStatsPda] = Pdas.getAgentStatsPDA(sentinelAgentPda);
    const escrowPda = getEscrowPda(ourAgentPda, keypair.publicKey, SENTINEL_ESCROW_NONCE);
    const [receiptPda] = Pdas.getPendingSettlementPDA(escrowPda, 0);

    const serviceHash = Array.from(Utils.sha256(Buffer.from(`sentinel-intel-loop-1`)));

    const ix = await client.escrow.settleCallsV2({
        escrowNonce: new BN(SENTINEL_ESCROW_NONCE),
        callsToSettle: new BN(1),
        serviceHash,
        wallet: keypair.publicKey,
        agent: sentinelAgentPda,
        agentStats: sentinelStatsPda,
        escrow: escrowPda,
        settlementReceipt: receiptPda,
        signer: keypair,
        remainingAccounts: [],
    });

    const kWallet = ix.keys.find((k: any) => k.pubkey.equals(keypair.publicKey));
    const kAgent = ix.keys.find((k: any) => k.pubkey.equals(sentinelAgentPda));
    const kStats = ix.keys.find((k: any) => k.pubkey.equals(sentinelStatsPda));
    const kEscrow = ix.keys.find((k: any) => k.pubkey.equals(escrowPda));
    const kReceipt = ix.keys.find((k: any) => k.pubkey.equals(receiptPda));
    const kSysProg = ix.keys.find((k: any) => k.pubkey.equals(SystemProgram.programId) || k.pubkey.toString() === "11111111111111111111111111111111");

    const fallbackSysProg = { pubkey: new PublicKey("11111111111111111111111111111111"), isSigner: false, isWritable: false };

    const remaining = [
        kStats || { pubkey: sentinelStatsPda, isSigner: false, isWritable: true },
        kEscrow || { pubkey: escrowPda, isSigner: false, isWritable: true },
        kReceipt || { pubkey: receiptPda, isSigner: false, isWritable: true },
        kSysProg || fallbackSysProg
    ];

    function permute(arr: any[]): any[][] {
        if (arr.length === 0) return [[]];
        const res: any[][] = [];
        for (let i = 0; i < arr.length; i++) {
            const rest = permute(arr.slice(0, i).concat(arr.slice(i + 1)));
            for (let r of rest) {
                res.push([arr[i]].concat(r));
            }
        }
        return res;
    }

    const perms = permute(remaining);
    console.log(`Testing ${perms.length} permutations...`);

    for (let i = 0; i < perms.length; i++) {
        ix.keys = [
            kWallet || { pubkey: keypair.publicKey, isSigner: true, isWritable: true },
            kAgent || { pubkey: sentinelAgentPda, isSigner: false, isWritable: false },
            ...perms[i]
        ];

        const tx = await client.buildTransaction([ix], keypair.publicKey);
        tx.sign([keypair]);
        const sim = await client.connection.simulateTransaction(tx);
        
        if (!sim.value.err) {
            console.log(`\n✅ SUCCESS with permutation ${i}:`);
            console.log(ix.keys.map((k: any) => {
                if (k.pubkey.equals(keypair.publicKey)) return "wallet";
                if (k.pubkey.equals(sentinelAgentPda)) return "agent";
                if (k.pubkey.equals(sentinelStatsPda)) return "agent_stats";
                if (k.pubkey.equals(escrowPda)) return "escrow";
                if (k.pubkey.equals(receiptPda)) return "settlement_receipt";
                if (k.pubkey.equals(fallbackSysProg.pubkey)) return "system_program";
                return "unknown";
            }).join(', '));
            return;
        } else {
            const errStr = JSON.stringify(sim.value.err);
            if (!errStr.includes("InstructionError")) {
                 console.log(`Unexpected error for ${i}:`, errStr);
            }
        }
    }
    console.log("No permutation succeeded.");
}
main().catch(console.error);
