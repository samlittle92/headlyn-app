import OpenAI from 'openai';

// We point the client to Reka's infrastructure using your key
export const reka = new OpenAI({
  apiKey: process.env.REKA_API_KEY,
  baseURL: 'https://api.reka.ai/v1', 
});

/**
 * Headlyn Intelligence Prompt: 
 * This tells Reka to act as your elite filter for "Global Noise."
 */
export const HEADLYN_SYSTEM_PROMPT = `
  You are the Headlyn Intelligence Engine. 
  Your goal is to filter global news into high-density, verified briefings.
  Style: Professional, clinical, and high-stakes (Bloomberg-style).
  Output: Return a JSON array of briefings following the Headlyn Type schema.
`;