// src/utils/env.ts
// Validates all required environment variables at startup.
// Call validateEnv() once in client.ts — fail fast before doing any work.

export const REQUIRED_VARS = [
  "SOLANA_PRIVATE_KEY",
  "SYNAPSE_RPC_URL",
  "ACE_DATA_API_KEY",
] as const;

export function validateEnv(): void {
  const missing = REQUIRED_VARS.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(
      `[ENV] Missing required environment variables:\n` +
        missing.map((k) => `  • ${k}`).join("\n") +
        `\n\nCheck your .env file. See .env.example for reference.`
    );
  }
}

// Protocol constants — these never change.
export const PROTOCOL = {
  SAP_PROGRAM_ID: "SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ",
  SENTINEL_WALLET: "Ccr2yK3hLALU4p8oNRqrh4dGuvPJTth5KCLMio8cE1ph",
  GLOBAL_REGISTRY_PDA: "9odFrYBBZq6UQC6aGyzMPNXWJQn55kMtfigzhLg6S6L5",
  ACE_DATA_BASE_URL: "https://api.acedata.cloud",
  ACE_DATA_FACILITATOR: "https://facilitator.acedata.cloud",
} as const;
