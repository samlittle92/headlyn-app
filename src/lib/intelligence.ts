import { reka, HEADLYN_SYSTEM_PROMPT } from "@/lib/reka";
import type { Briefing } from "@/types/intell";

const BRIEFING_JSON_SCHEMA = `
Each item must have: id (string), timestamp (ISO 8601 string), source (string), category ("GEOPOLITICAL"|"MARKETS"|"TECH"|"SECURITY"), title (string), summary (string), verificationScore (number 0-100), isVoiceReady (boolean).
Return only a valid JSON array of exactly 3 objects, no other text.`;

/**
 * Fetches the top 3 geopolitical events from the last 24 hours using Reka Research.
 * Parses the model output into Briefing objects.
 */
export async function fetchLiveBriefings(): Promise<Briefing[]> {
  const response = await reka.chat.completions.create({
    model: "reka-flash-research",
    messages: [
      { role: "system", content: HEADLYN_SYSTEM_PROMPT },
      {
        role: "user",
        content: `List the top 3 geopolitical events from the last 24 hours. ${BRIEFING_JSON_SCHEMA}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw || typeof raw !== "string") {
    return [];
  }

  const parsed = parseBriefingsJson(raw);
  return parsed.slice(0, 3).map(normalizeBriefing);
}

function parseBriefingsJson(raw: string): unknown[] {
  const trimmed = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  let data: unknown;
  try {
    data = JSON.parse(trimmed);
  } catch {
    return [];
  }
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "briefings" in data && Array.isArray((data as { briefings: unknown[] }).briefings)) {
    return (data as { briefings: unknown[] }).briefings;
  }
  if (data && typeof data === "object" && "items" in data && Array.isArray((data as { items: unknown[] }).items)) {
    return (data as { items: unknown[] }).items;
  }
  return [];
}

function normalizeBriefing(item: unknown, index: number): Briefing {
  const o = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
  const category = (o.category === "GEOPOLITICAL" || o.category === "MARKETS" || o.category === "TECH" || o.category === "SECURITY")
    ? o.category
    : "GEOPOLITICAL";
  const verificationScore = typeof o.verificationScore === "number" && o.verificationScore >= 0 && o.verificationScore <= 100
    ? Math.round(o.verificationScore)
    : 85;
  return {
    id: typeof o.id === "string" ? o.id : `live-${index + 1}-${Date.now()}`,
    timestamp: typeof o.timestamp === "string" ? o.timestamp : new Date().toISOString(),
    source: typeof o.source === "string" ? o.source : "Reka Research",
    category,
    title: typeof o.title === "string" ? o.title : "Untitled",
    summary: typeof o.summary === "string" ? o.summary : "",
    verificationScore,
    isVoiceReady: typeof o.isVoiceReady === "boolean" ? o.isVoiceReady : false,
  };
}

/**
 * Returns the latest briefings. For now returns hardcoded data for UI testing.
 */
export function getLatestBriefings(): Briefing[] {
  return [
    {
      id: "1",
      timestamp: "2025-03-01T14:32:00Z",
      source: "Reuters",
      category: "GEOPOLITICAL",
      title: "Central bank signals shift in rate outlook amid inflation data",
      summary:
        "Officials indicated a more cautious stance on further tightening as latest figures showed cooling in core measures. Markets priced in a quarter-point cut by mid-year.",
      verificationScore: 94,
      isVoiceReady: true,
    },
    {
      id: "2",
      timestamp: "2025-03-01T12:15:00Z",
      source: "X-Intelligence",
      category: "TECH",
      title: "Major cloud provider reports outage in European region",
      summary:
        "Services were restored within two hours. Root cause is under investigation; initial reports point to a network configuration change.",
      verificationScore: 78,
      isVoiceReady: true,
    },
    {
      id: "3",
      timestamp: "2025-03-01T09:00:00Z",
      source: "Internal",
      category: "SECURITY",
      title: "New advisory on supply chain and software attestation",
      summary:
        "Agency recommends signed SBOMs and verification steps for critical dependencies. Compliance window set for next quarter.",
      verificationScore: 92,
      isVoiceReady: false,
    },
    {
      id: "4",
      timestamp: "2025-03-01T07:45:00Z",
      source: "Reuters",
      category: "MARKETS",
      title: "Equity indices open higher as earnings season continues",
      summary:
        "Strong results from several large caps supported sentiment. Traders are watching upcoming jobs data for direction on rate expectations.",
      verificationScore: 88,
      isVoiceReady: true,
    },
    {
      id: "5",
      timestamp: "2025-02-28T22:00:00Z",
      source: "X-Intelligence",
      category: "GEOPOLITICAL",
      title: "Diplomatic talks resume on trade and tariffs",
      summary:
        "Delegations met for a second round with focus on enforcement and dispute mechanisms. No timeline was given for a final agreement.",
      verificationScore: 96,
      isVoiceReady: true,
    },
  ];
}
