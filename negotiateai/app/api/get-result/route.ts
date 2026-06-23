import { NextRequest, NextResponse } from "next/server";

import { getOpenAI, OPENROUTER_MODEL, SYSTEM_PROMPT } from "@/lib/openai";
import { getStripe } from "@/lib/stripe";
import {
  getCached,
  isRateLimited,
  setCached,
  trackRequest,
} from "@/lib/analysisCache";
import type {
  AnalysisResult,
  OfferContext,
  Rating,
  ResultResponse,
} from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATINGS: Rating[] = ["underpaid", "fair", "above_market"];

function labelFor(rating: Rating): string {
  if (rating === "underpaid") return "Underpaid";
  if (rating === "above_market") return "Above Market";
  return "Fair";
}

const toNumber = (value: unknown, fallback: number): number =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

/** Validate / normalize the model output into a trusted shape. */
function coerceResult(raw: unknown): AnalysisResult | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const rating: Rating = RATINGS.includes(obj.rating as Rating)
    ? (obj.rating as Rating)
    : "fair";

  const points = Array.isArray(obj.negotiationPoints)
    ? obj.negotiationPoints.map((p) => String(p)).filter(Boolean).slice(0, 5)
    : [];

  if (typeof obj.emailDraft !== "string" || points.length === 0) return null;

  return {
    marketRangeLow: toNumber(obj.marketRangeLow, 0),
    marketRangeHigh: toNumber(obj.marketRangeHigh, 0),
    rating,
    ratingLabel:
      typeof obj.ratingLabel === "string" && obj.ratingLabel
        ? obj.ratingLabel
        : labelFor(rating),
    counterOffer: toNumber(obj.counterOffer, 0),
    negotiationPoints: points,
    emailDraft: obj.emailDraft,
  };
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  // 1. Verify the payment with Stripe. The session_id IS the auth here —
  //    only someone who paid has a paid session.
  let context: OfferContext;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 403 }
      );
    }

    const m = (session.metadata ?? {}) as Record<string, string>;
    context = {
      jobTitle: m.jobTitle ?? "",
      companyName: m.companyName ?? "",
      salary: m.salary ?? "",
      city: m.city ?? "",
      yearsOfExperience: m.yearsOfExperience ?? "",
      notes: m.notes ?? "",
      offerText: m.offerText ?? "",
    };
  } catch (err) {
    console.error("Stripe retrieve error:", err);
    return NextResponse.json({ error: "Session not found" }, { status: 403 });
  }

  // 2. Return cached analysis if we already generated one for this session.
  const cached = getCached(sessionId);
  if (cached) return NextResponse.json(cached);

  // 3. Loose rate-limit: stop runaway regeneration for the same session.
  trackRequest(sessionId);
  if (isRateLimited(sessionId)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // 4. Generate the analysis with OpenAI.
  try {
    const openai = getOpenAI();
    const userMessage = `Job Title: ${context.jobTitle}
Company: ${context.companyName}
Offered Salary: $${context.salary}
City: ${context.city}
Years of Experience: ${context.yearsOfExperience}
Additional Notes: ${context.notes || "None"}
Offer Letter Text: ${context.offerText || "None provided"}

Analyze this offer and return JSON.`;

    // Not all OpenRouter models support response_format: json_object, so we
    // instruct via the system prompt instead and parse defensively.
    const completion = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      temperature: 0.6,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    // Strip markdown code fences that some models wrap around JSON.
    const content = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Invalid AI response" },
        { status: 502 }
      );
    }

    const analysis = coerceResult(parsed);
    if (!analysis) {
      return NextResponse.json(
        { error: "Incomplete AI response" },
        { status: 502 }
      );
    }

    const result: ResultResponse = { ...analysis, context };
    setCached(sessionId, result);
    return NextResponse.json(result);
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
