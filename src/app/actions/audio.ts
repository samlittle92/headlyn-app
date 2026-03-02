"use server";

import { getLiveBriefings } from "@/lib/intelligence";

const ELEVENLABS_VOICE_ID = "pNInz6ovfS8qiS2mGcl7";
const ELEVENLABS_STREAM_URL = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`;

export type AudioResult = { success: true; dataUri: string } | { success: false; error: string };

/**
 * Converts text to speech via ElevenLabs and returns a Base64 data URI.
 */
export async function generateAudioBriefing(text: string): Promise<AudioResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey === "insert_key_here") {
    return { success: false, error: "ELEVENLABS_API_KEY is not set. Add your key in .env.local." };
  }

  try {
    const res = await fetch(ELEVENLABS_STREAM_URL, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        error: `ElevenLabs API error (${res.status}): ${errText.slice(0, 200)}`,
      };
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:audio/mpeg;base64,${base64}`;
    return { success: true, dataUri };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { success: false, error: message };
  }
}

/**
 * Fetches current briefings, builds a script, and returns audio as Base64 data URI.
 */
export async function triggerAudioBriefing(): Promise<AudioResult> {
  try {
    const briefings = await getLiveBriefings();
    const parts = briefings.slice(0, 10).map((b, i) => {
      return `Item ${i + 1}. ${b.title}. ${b.summary}`;
    });
    const script = parts.length ? parts.join(" ") : "No briefings available.";
    return generateAudioBriefing(script);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { success: false, error: message };
  }
}
