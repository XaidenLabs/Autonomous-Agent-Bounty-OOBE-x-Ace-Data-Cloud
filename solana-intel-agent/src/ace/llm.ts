// src/ace/llm.ts
// Ace Data Cloud Service 1: LLM Analysis
// Uses the OpenAI-compatible chat completions endpoint.
// This is the intelligence layer — analyzes Solana ecosystem activity.

import { acePost } from "./client";

export interface LLMResult {
  analysisText: string;
  riskScore: number;
  insights: string[];
  model: string;
  tokensUsed: number;
}

export async function runLLMAnalysis(timeframe = "1h"): Promise<LLMResult> {
  console.log("[ACE/LLM] Requesting AI analysis from Ace Data Cloud...");

  const timestamp = new Date().toISOString();

  const response = await acePost<{
    choices: Array<{ message: { content: string } }>;
    usage?: { total_tokens: number };
    model?: string;
  }>("/v1/chat/completions", {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a Solana blockchain analyst. Always respond with valid JSON only. " +
          "No markdown, no explanation outside JSON. " +
          'Format: {"analysisText":"string","riskScore":number,"insights":["str","str","str"]}. ' +
          "riskScore is 0 (very healthy ecosystem) to 100 (very risky).",
      },
      {
        role: "user",
        content:
          `Analyze the current Solana ecosystem at timestamp ${timestamp}. ` +
          `Focus on the past ${timeframe}. Consider: DeFi activity and TVL trends, ` +
          `NFT mint and secondary market volume, validator health and uptime, ` +
          `developer activity and new program deployments, ` +
          `and overall network health. Return a concise JSON analysis.`,
      },
    ],
    max_tokens: 400,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content;
  // Strip any markdown code fences if present
  const clean = raw.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(clean);
    console.log(`[ACE/LLM] ✅ Analysis complete. Risk: ${parsed.riskScore}/100`);
    return {
      analysisText: parsed.analysisText ?? raw.slice(0, 300),
      riskScore:
        typeof parsed.riskScore === "number"
          ? Math.max(0, Math.min(100, parsed.riskScore))
          : 50,
      insights: Array.isArray(parsed.insights)
        ? parsed.insights.slice(0, 4)
        : ["Network active", "Monitoring continues", "Metrics stable"],
      model: response.model ?? "gpt-4o-mini",
      tokensUsed: response.usage?.total_tokens ?? 0,
    };
  } catch {
    // Fallback if JSON parse fails — don't crash the loop
    console.warn("[ACE/LLM] JSON parse failed, using structured fallback");
    return {
      analysisText: raw.slice(0, 300),
      riskScore: 50,
      insights: [
        "Network activity within normal range",
        "DeFi protocols operating normally",
        "Monitoring continues autonomously",
      ],
      model: "gpt-4o-mini",
      tokensUsed: 0,
    };
  }
}
