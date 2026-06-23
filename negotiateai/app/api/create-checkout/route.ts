import { NextRequest, NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe";
import type { OfferContext, OfferInput } from "@/lib/types";

// pdf-parse + Stripe need the Node.js runtime (not Edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe metadata values are capped at 500 characters each.
const META_MAX = 500;
const clamp = (value: unknown, max = META_MAX): string =>
  (value ?? "").toString().slice(0, max);

async function extractPdfText(base64: string): Promise<string> {
  try {
    const { PDFParse } = await import("pdf-parse");
    const buffer = Buffer.from(base64, "base64");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    return (result?.text ?? "").replace(/\s+/g, " ").trim();
  } catch (err) {
    // A bad/unreadable PDF should never block checkout — we just drop the text.
    console.error("PDF parse failed:", err);
    return "";
  }
}

export async function POST(req: NextRequest) {
  let body: OfferInput;
  try {
    body = (await req.json()) as OfferInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { jobTitle, companyName, salary, city, yearsOfExperience, notes, pdfBase64 } =
    body;

  if (!jobTitle || !companyName || !salary || !city || !yearsOfExperience) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const offerText = pdfBase64 ? await extractPdfText(pdfBase64) : "";

  const metadata: OfferContext = {
    jobTitle: clamp(jobTitle),
    companyName: clamp(companyName),
    salary: clamp(salary),
    city: clamp(city),
    yearsOfExperience: clamp(yearsOfExperience),
    notes: clamp(notes ?? ""),
    offerText: clamp(offerText),
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "NegotiateAI — Offer Analysis",
              description:
                "Market rate, a counter-offer number, and a ready-to-send negotiation email.",
            },
            unit_amount: 900, // $9.00
          },
          quantity: 1,
        },
      ],
      metadata: metadata as unknown as Record<string, string>,
      success_url: `${baseUrl}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?error=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Could not create checkout session" },
      { status: 500 }
    );
  }
}
