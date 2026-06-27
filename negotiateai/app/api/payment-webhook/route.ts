import { NextRequest, NextResponse } from "next/server";

import {
  isPaidStatus,
  postbackSecret,
  verifyPostbackToken,
} from "@/lib/trybit";
import { decodeOrderId } from "@/lib/order";
import { getOrderCode, mintCode, recordOrderCode } from "@/lib/accessCodes";
import { sendCodeEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * TryBit (CryptoCloud) postback handler.
 *
 * TryBit POSTs form-encoded fields { status, invoice_id, order_id, token, … }.
 * We verify the JWT `token` against the project secret, then mint a unique code
 * and email it to the buyer (recovered from the signed order_id).
 */
export async function POST(req: NextRequest) {
  // TryBit sends application/x-www-form-urlencoded (older integrations) or, in
  // some setups, JSON. Handle both.
  let fields: Record<string, string> = {};
  const raw = await req.text();
  try {
    if (raw.trim().startsWith("{")) {
      fields = JSON.parse(raw);
    } else {
      new URLSearchParams(raw).forEach((v, k) => {
        fields[k] = v;
      });
    }
  } catch {
    return NextResponse.json({ error: "Bad body" }, { status: 400 });
  }

  const { status, order_id: orderId, token } = fields;

  // Verify the callback is genuinely from TryBit.
  if (!token || !verifyPostbackToken(token, postbackSecret())) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  // Ack anything that isn't a completed payment so TryBit stops retrying.
  if (!isPaidStatus(status)) {
    return NextResponse.json({ ok: true, ignored: status });
  }

  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  // Idempotency: a retried postback for a fulfilled order is a no-op.
  if (await getOrderCode(orderId)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const email = decodeOrderId(orderId);
  if (!email) {
    console.error("payment-webhook: couldn't recover email", orderId);
    return NextResponse.json({ error: "Bad order_id" }, { status: 400 });
  }

  const code = mintCode();
  // Record before emailing so a send failure can't double-mint on retry.
  await recordOrderCode(orderId, code);

  try {
    await sendCodeEmail(email, code);
  } catch (err) {
    console.error("payment-webhook: email send failed", orderId, err);
    // Still 200 so TryBit considers it handled; the code is stored for recovery.
    return NextResponse.json({ ok: true, emailed: false });
  }

  return NextResponse.json({ ok: true, emailed: true });
}
