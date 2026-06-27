import { NextRequest, NextResponse } from "next/server";

import { createInvoice } from "@/lib/trybit";
import { encodeOrderId } from "@/lib/order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRICE_USD = process.env.PRICE_USD || "9.00";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
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

  try {
    // The email is encoded (signed) into the order id so the webhook can
    // recover who to send the code to — no shared store needed between the two
    // calls. encodeOrderId throws if ACCESS_CODE_SECRET is unset, so keep it in
    // the try block to surface a clean error instead of a bare 500.
    const orderId = encodeOrderId(email);
    const url = await createInvoice({ orderId, amount: PRICE_USD, email });
    return NextResponse.json({ url });
  } catch (err) {
    console.error("create-payment error:", err);
    return NextResponse.json(
      { error: "Couldn't start the payment. Please try again." },
      { status: 502 }
    );
  }
}
