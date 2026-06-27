import crypto from "node:crypto";

/**
 * Stateless order ids.
 *
 * TryBit's postback echoes back `order_id` but not the buyer's email, and the
 * invoice-create and webhook calls can land on different serverless instances.
 * Rather than rely on a shared store for the email, we encode it into a signed
 * order id so the webhook can recover it with no database:
 *
 *   nego.<base64url(email)>.<hmac8>
 *
 * The HMAC (over the email segment, using ACCESS_CODE_SECRET) means a forged
 * order id can't smuggle in an arbitrary email.
 */

function secret(): string {
  const s = process.env.ACCESS_CODE_SECRET;
  if (!s) throw new Error("ACCESS_CODE_SECRET is not set");
  return s;
}

function sign(part: string): string {
  return crypto
    .createHmac("sha256", secret())
    .update(part)
    .digest("hex")
    .slice(0, 8);
}

const b64url = (s: string) =>
  Buffer.from(s, "utf8").toString("base64url");

export function encodeOrderId(email: string): string {
  const part = b64url(email);
  return `nego.${part}.${sign(part)}`;
}

/** Returns the email encoded in an order id, or null if it's missing/forged. */
export function decodeOrderId(orderId: string): string | null {
  const parts = (orderId || "").split(".");
  if (parts.length !== 3 || parts[0] !== "nego") return null;
  const [, part, sig] = parts;

  const expected = sign(part);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    return Buffer.from(part, "base64url").toString("utf8");
  } catch {
    return null;
  }
}
