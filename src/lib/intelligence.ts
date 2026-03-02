import { currentUser } from "@clerk/nextjs/server";
import { reka } from "./reka";
import type { Briefing } from "@/types/intelligence";

const DEFAULT_TOPICS =
  "Global Security, Energy Markets, AI breakthroughs, geopolitics, and general markets";

function getInterestsPrompt(interests: string[] | undefined): string {
  const topics =
    Array.isArray(interests) && interests.length > 0
      ? interests.join(", ")
      : DEFAULT_TOPICS;
  return `Research the top 10 critical events from the last 12 hours based on these specific interests: ${topics}. Format each as: { id, title, summary, category, timestamp, verificationScore }. Use category "SECURITY" for global security, "MARKETS" for energy or financial markets, "TECH" for AI or technology, "GEOPOLITICAL" for geopolitics.`;
}

export async function getLiveBriefings(): Promise<Briefing[]> {
  try {
    const user = await currentUser();
    const interests = user?.publicMetadata?.interests as
      | string[]
      | undefined;
    const userPrompt = getInterestsPrompt(interests);

    const response = await reka.chat.completions.create({
      model: "reka-flash",
      messages: [
        {
          role: "system",
          content: `You are the Headlyn Intelligence Engine. 
          Filter global news into high-density, verified briefings.
          Output: Return ONLY a JSON object with a "briefings" key containing an array.`,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: "intelligence_briefing",
          strict: true,
          schema: {
            type: "object",
            properties: {
              briefings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    summary: { type: "string" },
                    category: { type: "string", enum: ["GEOPOLITICAL", "TECH", "MARKETS", "SECURITY"] },
                    timestamp: { type: "string" },
                    verificationScore: { type: "number" }
                  },
                  required: ["id", "title", "summary", "category", "timestamp", "verificationScore"],
                  additionalProperties: false
                }
              }
            },
            required: ["briefings"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error("Reka returned an empty response.");
    }

    const parsedData = JSON.parse(content);
    const raw = (parsedData.briefings ?? []) as Record<string, unknown>[];
    return raw.map((b) => ({
      ...b,
      source: (b.source as string) ?? "Reka Research",
      isVoiceReady: true, // we always have title + summary for TTS
    })) as Briefing[];

  } catch (error) {
    console.error('Error fetching briefings:', error);
    // Return empty array to prevent UI crashes
    return [];
  }
}