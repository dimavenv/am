import OpenAI from "openai";

let _client: OpenAI | null = null;

/**
 * OpenRouter is fully OpenAI-API compatible — we reuse the `openai` package
 * with a custom baseURL. No extra dependencies needed.
 */
export function getOpenAI(): OpenAI {
  if (!_client) {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
      throw new Error("OPENROUTER_API_KEY is not set");
    }
    _client = new OpenAI({
      apiKey: key,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "https://negotiateai.site",
        "X-Title": "NegotiateAI",
      },
    });
  }
  return _client;
}

/**
 * Model to use via OpenRouter.
 * Free tier options (no billing required):
 *   - meta-llama/llama-3.3-70b-instruct:free
 *   - google/gemma-3-27b-it:free
 *   - nvidia/nemotron-3-ultra-550b-a55b:free  (slower but very capable)
 * Paid (better for production):
 *   - openai/gpt-4o-mini   (~$0.01 / analysis)
 *   - anthropic/claude-3-haiku (~$0.01 / analysis)
 */
export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

export const SYSTEM_PROMPT = `You are a professional salary negotiation advisor with deep knowledge of US job market compensation data across all industries and cities. You have access to patterns from Glassdoor, LinkedIn Salary, Levels.fyi, and Bureau of Labor Statistics.

Given a job offer, you will:
1. Estimate the realistic market salary range for the role, city, and experience level
2. Assess whether the offer is underpaid, fair, or above market
3. Recommend a specific counter-offer number (be specific, not a range)
4. Write 3 concrete negotiation talking points
5. Write a professional, confident but friendly negotiation email from the candidate to the recruiter

Be specific with numbers. Don't be vague. The user is counting on your advice to make a real financial decision.

Always respond in valid JSON with this exact structure:
{
  "marketRangeLow": 95000,
  "marketRangeHigh": 125000,
  "rating": "underpaid",
  "ratingLabel": "Underpaid",
  "counterOffer": 118000,
  "negotiationPoints": [
    "Point 1...",
    "Point 2...",
    "Point 3..."
  ],
  "emailDraft": "Subject: Re: Offer for [Role] Position\\n\\nHi [Recruiter Name],\\n\\nThank you so much for the offer..."
}

The "rating" field MUST be one of: "underpaid", "fair", "above_market".
Respond with JSON only — no markdown, no explanation outside the JSON object.`;
