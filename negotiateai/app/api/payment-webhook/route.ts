import { NextRequest, NextResponse } from "next/server";

import { isPaidStatus, verifyWebhook } from "@/lib/cryptomus";
import { getOrderCode, mintCode, recordOrderCode } from "@/lib/accessCodes";
import { sendCodeEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const payload = verifyWebhook(rawBody);
  if (!payload) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  // Always ack non-final statuses so Cryptomus stops retrying them.
  if (!isPaidStatus(payload.status)) {
    return NextResponse.json({ ok: true, ignored: payload.status });
  }

  const orderId = payload.order_id;
  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  // Idempotency: a retried webhook for an already-fulfilled order is a no-op.
  if (await getOrderCode(orderId)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  let email = "";
  try {
    email = JSON.parse(payload.additional_data || "{}").email || "";
  } catch {
    /* ignore — handled below */
  }
  if (!email) {
    console.error("payment-webhook: no email in additional_data", orderId);
    return NextResponse.json({ error: "No email" }, { status: 400 });
  }

  const code = mintCode();
  // Record before emailing so a send failure can't double-mint on retry; the
  // buyer can always recover the code from their email or by contacting support.
  await recordOrderCode(orderId, code);

  try {
    await sendCodeEmail(email, code);
  } catch (err) {
    console.error("payment-webhook: email send failed", orderId, err);
    // Still 200 so Cryptomus considers the payment handled; the code is stored.
    return NextResponse.json({ ok: true, emailed: false });
  }

  return NextResponse.json({ ok: true, emailed: true });
}
