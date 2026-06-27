import { NextRequest, NextResponse } from "next/server";

import { decodeOrderId } from "@/lib/order";
import { getOrderCode } from "@/lib/accessCodes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Polled by the buyer's still-open form tab after they start a payment. When the
 * TryBit webhook has settled the order it records a minted code against the
 * order id; once that exists, we hand the code back so the client can unlock and
 * run the analysis automatically — no copy-pasting from the email.
 *
 * Returning the code here is safe: the order id is HMAC-signed (decodeOrderId
 * rejects anything not minted with our secret), so it can't be forged or guessed
 * to fish out someone else's code.
 *
 * NOTE: this only works across the two serverless invocations when Upstash is
 * configured (UPSTASH_REDIS_REST_*). Without it the code lives in per-instance
 * memory and the poll may never see it.
 */
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order") || "";

  // Reject malformed/forged order ids without touching the store.
  if (!decodeOrderId(orderId)) {
    return NextResponse.json({ paid: false }, { status: 200 });
  }

  const code = await getOrderCode(orderId);
  if (code) {
    return NextResponse.json({ paid: true, code });
  }
  return NextResponse.json({ paid: false });
}
