import { NextRequest, NextResponse } from "next/server";

import { getOpenAI, OPENROUTER_MODEL, SYSTEM_PROMPT } from "@/lib/openai";
import { consumeCode, inspectCode } from "@/lib/accessCodes";
import type {
  AnalysisResult,
  OfferContext,
  OfferInput,
  Rating,
  ResultResponse,
} from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── basic per-IP rate limit (anti brute-force on codes) ───
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, { count: number; ts: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cur = hits.get(ip);
  if (!cur || now - cur.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  cur.count += 1;
  return cur.count > MAX_PER_WINDOW;
}

// ─── result validation ─────────────────────────────────────
const RATINGS: Rating[] = ["underpaid", "fair", "above_market"];

function labelFor(rating: Rating): string {
  if (rating === "underpaid") return "Underpaid";
  if (rating === "above_market") return "Above Market";
  return "Fair";
}

const toNumber = (value: unknown, fallback: number): number =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

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

async function extractPdfText(base64: string): Promise<string> {
  try {
    const { PDFParse } = await import("pdf-parse");
    const buffer = Buffer.from(base64, "base64");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    return (result?.text ?? "").replace(/\s+/g, " ").trim().slice(0, 4000);
  } catch (err) {
    console.error("PDF parse failed:", err);
    return "";
  }
}

type AnalyzeBody = OfferInput & { code?: string };

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: AnalyzeBody;
  try {
    body = (await req.json()) as AnalyzeBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    jobTitle,
    companyName,
    salary,
    city,
    yearsOfExperience,
    notes,
    pdfBase64,
    code,
  } = body;

  if (!jobTitle || !companyName || !salary || !city || !yearsOfExperience) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // 1. Validate the access code (does NOT consume yet — only consume on a
  //    successful analysis so a buyer never loses a code to a server hiccup).
  const verdict = await inspectCode(code ?? "");
  if (!verdict.ok) {
    const message =
      verdict.reason === "used"
        ? "This access code has already been used."
        : verdict.reason === "missing"
        ? "Please enter your access code."
        : "That access code isn't valid. Double-check it and try again.";
    return NextResponse.json({ error: message, reason: verdict.reason }, {
      status: 403,
    });
  }

  // 2. Build context + optional PDF text.
  const offerText = pdfBase64 ? await extractPdfText(pdfBase64) : "";
  const context: OfferContext = {
    jobTitle: String(jobTitle).slice(0, 200),
    companyName: String(companyName).slice(0, 200),
    salary: String(salary).slice(0, 50),
    city: String(city).slice(0, 200),
    yearsOfExperience: String(yearsOfExperience).slice(0, 20),
    notes: String(notes ?? "").slice(0, 1000),
    offerText,
  };

  // 3. Generate the analysis.
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

    const completion = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      temperature: 0.6,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const content = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: "Invalid AI response" }, { status: 502 });
    }

    const analysis = coerceResult(parsed);
    if (!analysis) {
      return NextResponse.json(
        { error: "Incomplete AI response" },
        { status: 502 }
      );
    }

    // 4. Analysis succeeded — now burn the single-use code.
    if (!verdict.isStatic && verdict.serial) {
      await consumeCode(verdict.serial);
    }

    const result: ResultResponse = { ...analysis, context };
    return NextResponse.json(result);
  } catch (err) {
    console.error("OpenRouter error:", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
