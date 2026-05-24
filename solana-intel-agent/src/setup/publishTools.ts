// src/setup/publishTools.ts
// One-time tool publishing on SAP network.
// Run: npm run publish-tools
//
// IDL-verified arg types:
//   publishTool:
//     toolName: string
//     toolNameHash: [u8;32]
//     protocolHash: [u8;32]
//     descriptionHash: [u8;32]
//     inputSchemaHash: [u8;32]
//     outputSchemaHash: [u8;32]
//     httpMethod: u8 (0=GET, 1=POST, 2=PUT, 3=DELETE)
//     category: u8 (0=general, 1=analytics, 2=finance, ...)
//     paramsCount: u8
//     requiredParams: u8
//     isCompound: bool
//   inscribeToolSchema:
//     schemaType: u8 (0=input, 1=output, 2=combined)
//     schemaData: bytes
//     schemaHash: [u8;32]
//     compression: u8 (0=none)

import { createSapClient, Pdas, Utils } from "../oobe/client";
import { PublicKey } from "@solana/web3.js";
import dotenv from "dotenv";
dotenv.config();

function hashStr(s: string): number[] {
  return Array.from(Utils.sha256(Buffer.from(s, "utf-8")));
}

async function publishTools() {
  const { client, keypair } = createSapClient();

  const [agentPda] = Pdas.getAgentPDA(keypair.publicKey);
  const [globalPda] = Pdas.getGlobalPDA();

  console.log(`[TOOLS] Agent PDA: ${agentPda.toBase58()}`);

  const toolName = "analyzeSolanaActivity";
  const toolNameHashBuf = Buffer.from(Utils.sha256(Buffer.from(toolName, "utf-8")));
  const toolPda = PublicKey.findProgramAddressSync([
    Buffer.from("sap_tool"),
    agentPda.toBuffer(),
    toolNameHashBuf
  ], new PublicKey("SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ"))[0];
  console.log(`[TOOLS] Tool PDA:  ${toolPda.toBase58()}`);

  const inputSchema = JSON.stringify({
    type: "object",
    properties: {
      timeframe: { type: "string", enum: ["1h", "6h", "24h"] },
    },
    required: ["timeframe"],
  });

  const outputSchema = JSON.stringify({
    type: "object",
    properties: {
      riskScore: { type: "number", minimum: 0, maximum: 100 },
      insights: { type: "array", items: { type: "string" } },
      imageUrl: { type: "string" },
      audioUrl: { type: "string" },
      settlementTx: { type: "string" },
      sentinelTx: { type: "string" },
    },
  });

  // Step 1: publishTool — stores hashes on-chain (skip if already published)
  console.log("[TOOLS] Publishing tool schema hashes...");
  try {
    const publishIx = await client.tools.publishTool({
      toolName,
      toolNameHash: hashStr(toolName),
      protocolHash: hashStr("solana"),
      descriptionHash: hashStr("Analyze Solana on-chain events with AI and settle payments"),
      inputSchemaHash: hashStr(inputSchema),
      outputSchemaHash: hashStr(outputSchema),
      httpMethod: 1,          // u8: 1 = POST
      category: 1,            // u8: 1 = analytics
      paramsCount: 1,         // u8
      requiredParams: 1,      // u8
      isCompound: false,      // bool
      wallet: keypair.publicKey,
      agent: agentPda,
      tool: toolPda,
      globalRegistry: globalPda,
      signer: keypair,
      remainingAccounts: [],
    });

    const tx1 = await client.buildTransaction([publishIx], keypair.publicKey);
    tx1.sign([keypair]);
    const sig1 = await client.connection.sendTransaction(tx1, { preflightCommitment: "confirmed" });
    console.log(`[TOOLS] ✅ Tool published. TX: ${sig1}`);
  } catch (err: any) {
    if (String(err).includes("already") || String(err).includes("0x0")) {
      console.log("[TOOLS] Tool already published. Skipping to schema inscription...");
    } else {
      console.log("[TOOLS] publishTool warning (continuing):", String(err).slice(0, 100));
    }
  }

  // Step 2: inscribeToolSchema — stores full JSON in tx logs
  // schemaHash must match one of the hashes from publishTool (input or output)
  console.log("[TOOLS] Inscribing input schema...");
  const inputSchemaBuffer = Buffer.from(inputSchema, "utf-8");

  const inscribeIx = await client.tools.inscribeToolSchema({
    schemaType: 0,               // u8: 0 = input schema
    schemaData: inputSchemaBuffer,
    schemaHash: hashStr(inputSchema), // must match inputSchemaHash from publishTool
    compression: 0,              // u8: 0 = none
    wallet: keypair.publicKey,
    agent: agentPda,
    tool: toolPda,
    signer: keypair,
    remainingAccounts: [],
  });

  const tx2 = await client.buildTransaction([inscribeIx], keypair.publicKey);
  tx2.sign([keypair]);
  const sig2 = await client.connection.sendTransaction(tx2, { preflightCommitment: "confirmed" });
  console.log(`[TOOLS] ✅ Input schema inscribed. TX: ${sig2}`);

  // Step 3: inscribe output schema
  console.log("[TOOLS] Inscribing output schema...");
  const outputSchemaBuffer = Buffer.from(outputSchema, "utf-8");

  const inscribeIx2 = await client.tools.inscribeToolSchema({
    schemaType: 1,               // u8: 1 = output schema
    schemaData: outputSchemaBuffer,
    schemaHash: hashStr(outputSchema), // must match outputSchemaHash from publishTool
    compression: 0,
    wallet: keypair.publicKey,
    agent: agentPda,
    tool: toolPda,
    signer: keypair,
    remainingAccounts: [],
  });

  const tx3 = await client.buildTransaction([inscribeIx2], keypair.publicKey);
  tx3.sign([keypair]);
  const sig3 = await client.connection.sendTransaction(tx3, { preflightCommitment: "confirmed" });
  console.log(`[TOOLS] ✅ Output schema inscribed. TX: ${sig3}`);

  console.log(`\n[TOOLS] ✅ Done. Verify: https://explorer.oobeprotocol.ai/tools`);
}

publishTools().catch((err) => {
  console.error("[TOOLS FATAL]", err?.message ?? err);
  process.exit(1);
});
