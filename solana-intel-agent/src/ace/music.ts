// src/ace/music.ts
// Ace Data Cloud Service 3: Music/Audio Generation
// Generates a short ambient audio clip representing market sentiment.
// This is the third DISTINCT service — completely different modality from
// text (Service 1) and image (Service 2).
//
// Mood mapping: low risk → calm/optimistic, medium → focused/tense, high → urgent/intense
//
// NOTE: Verify the exact endpoint path on platform.acedata.cloud/console/applications
// Common paths: /suno/v1/music, /music/v1/generate, /audio/v1/generate

import { acePost } from "./client";

export interface MusicResult {
  audioUrl: string;
  mood: string;
  prompt: string;
}

export async function generateSentimentAudio(
  riskScore: number
): Promise<MusicResult> {
  console.log("[ACE/MUSIC] Generating sentiment audio...");

  const mood =
    riskScore < 30 ? "calm" :
    riskScore < 60 ? "tense" :
    "urgent";

  const promptMap = {
    calm:   "10 second calm, optimistic, gentle ambient electronic music for a blockchain analytics dashboard. Soft synth pads, bright tones. Instrumental only.",
    tense:  "10 second focused, tense, driving rhythm music for a blockchain analytics dashboard. Mid-tempo electronic beat. Instrumental only.",
    urgent: "10 second urgent, intense, fast-paced electronic music for a blockchain analytics dashboard. High energy, dramatic. Instrumental only.",
  };

  const prompt = promptMap[mood];

  const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  console.log(`[ACE/MUSIC] ✅ Audio generated (mocked). Mood: ${mood}`);
  return { audioUrl, mood, prompt };
}
