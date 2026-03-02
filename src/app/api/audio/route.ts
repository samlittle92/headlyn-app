import { NextRequest, NextResponse } from "next/server";

const RACHEL_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey === "insert_key_here") {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not set." },
      { status: 500 }
    );
  }

  let body: { text?: string; voiceId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body. Expect { text, voiceId? }." },
      { status: 400 }
    );
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json(
      { error: "Missing or empty text." },
      { status: 400 }
    );
  }

  const voiceId =
    typeof body.voiceId === "string" && body.voiceId
      ? body.voiceId
      : RACHEL_VOICE_ID;

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

  const res = await fetch(url, {
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
    return NextResponse.json(
      { error: `ElevenLabs error (${res.status}): ${errText.slice(0, 200)}` },
      { status: res.status }
    );
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}
