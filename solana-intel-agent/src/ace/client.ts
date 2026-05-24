// src/ace/client.ts
// Base Ace Data Cloud HTTP client.
// All service modules (llm.ts, image.ts, music.ts) import from here.

import dotenv from "dotenv";
dotenv.config();

// Bypass self-signed cert errors for bounty.acedata.cloud
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const BASE_URL =
  process.env.ACE_DATA_BASE_URL || "https://api.acedata.cloud";

export async function acePost<T>(endpoint: string, body: object): Promise<T> {
  const apiKey = process.env.ACE_DATA_API_KEY;
  if (!apiKey) throw new Error("ACE_DATA_API_KEY not set in .env");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Ace Data Cloud [${response.status}] ${endpoint}: ${text.slice(0, 300)}`
    );
  }

  return response.json() as Promise<T>;
}

export async function aceGet<T>(endpoint: string): Promise<T> {
  const apiKey = process.env.ACE_DATA_API_KEY;
  if (!apiKey) throw new Error("ACE_DATA_API_KEY not set in .env");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Ace Data Cloud [${response.status}] ${endpoint}: ${text.slice(0, 300)}`
    );
  }

  return response.json() as Promise<T>;
}
