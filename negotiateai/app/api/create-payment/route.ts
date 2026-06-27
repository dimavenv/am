import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

import { createInvoice } from "@/lib/cryptomus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRICE_USD = process.env.PRICE_USD || "9.00";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function baseUrl(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (env) return env;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = (await req.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const base = baseUrl(req);
  const orderId = crypto.randomUUID();

  try {
    const url = await createInvoice({
      orderId,
      amount: PRICE_USD,
      email,
      returnUrl: `${base}/?paid=1#analyze`,
      callbackUrl: `${base}/api/payment-webhook`,
    });
    return NextResponse.json({ url });
  } catch (err) {
    console.error("create-payment error:", err);
    return NextResponse.json(
      { error: "Couldn't start the payment. Please try again." },
      { status: 502 }
    );
  }
}
