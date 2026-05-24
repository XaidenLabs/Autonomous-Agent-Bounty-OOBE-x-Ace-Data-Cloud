# SolanaIntelAgent

> **OOBE × Ace Data Cloud Autonomous Agent Bounty 2026**  
> Category 1 — General Payment Volume on SAP (On-Chain Escrow)  
> Prize: $700 (1st) / $500 (2nd) · Deadline: June 10, 2026

---

## What This Is

A fully autonomous TypeScript daemon that runs every 10 minutes, zero human input:

```
WAKE UP → DISCOVER (SAP network) → LLM ANALYSIS (Ace Data #1)
       → IMAGE GENERATION (Ace Data #2) → AUDIO GENERATION (Ace Data #3)
       → PAY SENTINEL (mandatory) → SETTLE ESCROW (volume)
       → WRITE SESSION MEMORY → LOG → SLEEP → REPEAT
```


Every loop generates **2 real on-chain settlement transactions**. 
Running every 10 min for 7 days = **2,016 settlement transactions**.

---

## Quick Start

### 1. Setup

```bash
cd solana-intel-agent
cp .env.example .env
# Fill in your SOLANA_PRIVATE_KEY, SYNAPSE_RPC_URL, ACE_DATA_API_KEY
npm install
```

### 2. Register (one time)

```bash
npm run register
# Then verify: https://explorer.oobeprotocol.ai/agents/YOUR_WALLET
```

### 3. Publish tools (one time, after register)

```bash
npm run publish-tools
```

### 4. Start the daemon

```bash
npm start
# Runs forever. Ctrl+C to stop.
```

### 5. Start the dashboard (separate terminal)

```bash
cd dashboard
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SOLANA_PRIVATE_KEY` | ✅ | Keypair as JSON byte array `[12,34,...]` |
| `SYNAPSE_RPC_URL` | ✅ | OOBE mainnet RPC URL with API key |
| `ACE_DATA_API_KEY` | ✅ | Ace Data Cloud API token |
| `LOOP_INTERVAL_MS` | Optional | Default: `600000` (10 min) |
| `API_PORT` | Optional | Dashboard API port. Default: `3001` |

---

## Protocol Constants

| Item | Value |
|------|-------|
| SAP Program ID | `SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ` |
| Synapse Sentinel | `Ccr2yK3hLALU4p8oNRqrh4dGuvPJTth5KCLMio8cE1ph` |
| Ace Data Base URL | `https://api.acedata.cloud` |

---

## Project Structure

```
solana-intel-agent/
├── src/
│   ├── daemon/loop.ts          ← Main daemon + HTTP API (port 3001)
│   ├── setup/
│   │   ├── register.ts         ← One-time agent registration
│   │   └── publishTools.ts     ← One-time tool publishing
│   ├── oobe/
│   │   ├── client.ts           ← SapClient initialization
│   │   ├── discovery.ts        ← DiscoveryRegistry (find Sentinel + agents)
│   │   ├── session.ts          ← SessionManager (on-chain memory)
│   │   └── payments.ts         ← X402Registry + EscrowV2
│   ├── ace/
│   │   ├── client.ts           ← Base HTTP client
│   │   ├── llm.ts              ← Service 1: LLM analysis (gpt-4o-mini)
│   │   ├── image.ts            ← Service 2: Image generation
│   │   └── music.ts            ← Service 3: Audio generation (Suno)
│   ├── sentinel/
│   │   └── interact.ts         ← Synapse Sentinel payment channel
│   └── utils/
│       ├── logger.ts           ← JSONL file logger
│       ├── retry.ts            ← Exponential backoff retry
│       └── env.ts              ← Environment validation + constants
├── dashboard/                  ← React dashboard (Vite)
├── logs/runs.jsonl             ← Auto-created, one line per loop
├── agent.json                  ← Manifest for CLI registration
├── .env.example                ← Environment template
└── tsconfig.json
```

---

## Submission Checklist

### On-Chain
- [ ] Agent registered on SAP **mainnet** — visible on Synapse Explorer
- [ ] 3 capabilities: `solana:analyze`, `ace:inference`, `payment:x402`
- [ ] x402 escrow created and funded
- [ ] Real settlement transactions (50+ minimum, 500+ recommended)
- [ ] Synapse Sentinel paid every loop (mandatory)
- [ ] On-chain session memory written (SessionManager)
- [ ] At least one sealed LedgerPage (every 10 loops)

### Ace Data Cloud
- [ ] 3 distinct services called: LLM, image generation, audio generation
- [ ] All 3 appear in Usage History at `platform.acedata.cloud/console/usages`

### Twitter/X Post
- [ ] Tags: `@OOBEonSol` and `@AceDataCloud`
- [ ] Category statement: **"Category 1 — General Payment Volume"**
- [ ] GitHub repo link (public)
- [ ] 3+ Solscan TX links
- [ ] Demo video (under 3 minutes)

---

*Built for OOBE × Ace Data Cloud Autonomous Agent Bounty — June 2026*
