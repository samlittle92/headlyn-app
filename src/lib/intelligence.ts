import { reka } from './reka';
import { Briefing } from '@/types/intelligence';

export async function getLiveBriefings(): Promise<Briefing[]> {
  try {
    const response = await reka.chat.completions.create({
      model: 'reka-flash', // 2026 Agentic Research Model
      messages: [
        {
          role: 'system',
          content: `You are the Headlyn Intelligence Engine. 
          Filter global news into high-density, verified briefings.
          Output: Return ONLY a JSON object with a "briefings" key containing an array.`
        },
        {
          role: 'user',
          content: `Research the top 10 most critical events from the last 12 hours across: Global Security, Energy Markets, AI breakthroughs, geopolitics, and general markets. Format each as: { id, title, summary, category, timestamp, verificationScore }. Use category "SECURITY" for global security, "MARKETS" for energy or financial markets, "TECH" for AI or technology, "GEOPOLITICAL" for geopolitics.`
        }
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

    // Parse the string into a JS object and return the briefings array
    const parsedData = JSON.parse(content);
    return parsedData.briefings as Briefing[];

  } catch (error) {
    console.error('Error fetching briefings:', error);
    // Return empty array to prevent UI crashes
    return [];
  }
}