import crypto from "node:crypto";

/**
 * Minimal TryBit (CryptoCloud) client.
 *
 * TryBit is a rebrand of CryptoCloud and shares its v2 API:
 *   - Create invoice:  POST {API_BASE}/invoice/create
 *     header  Authorization: Token <API_KEY>
 *     body    { shop_id, amount, currency, order_id, email }
 *     returns { status: "success", result: { uuid, link, ... } }
 *   - Postback (webhook): a form-encoded POST to our notification URL with
 *     { status, invoice_id, amount_crypto, currency, order_id, token } where
 *     `token` is a JWT (HS256) signed with the project secret, carrying the
 *     invoice uuid and a 5-minute expiry. Verifying the JWT proves the callback
 *     is genuinely from TryBit.
 *
 * The API host is configurable (TRYBIT_API_BASE) so it can point at TryBit's own
 * host or the CryptoCloud host without code changes.
 */

const API_BASE = (
  process.env.TRYBIT_API_BASE || "https://api.cryptocloud.plus/v2"
).replace(/\/$/, "");

function apiKey(): string {
  const key = process.env.TRYBIT_API_KEY;
  if (!key) throw new Error("TRYBIT_API_KEY is not set");
  return key;
}

function shopId(): string {
  const id = process.env.TRYBIT_SHOP_ID;
  if (!id) throw new Error("TRYBIT_SHOP_ID is not set");
  return id;
}

export interface CreateInvoiceOptions {
  orderId: string;
  /** Amount in fiat (USD). */
  amount: string;
  email: string;
}

/** Creates a hosted invoice and returns its payment page URL. */
export async function createInvoice(
  opts: CreateInvoiceOptions
): Promise<string> {
  const body = {
    shop_id: shopId(),
    amount: Number(opts.amount),
    currency: "USD",
    order_id: opts.orderId,
    email: opts.email,
  };

  const res = await fetch(`${API_BASE}/invoice/create`, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as {
    status?: string;
    result?: { link?: string; uuid?: string };
    [k: string]: unknown;
  };

  if (!res.ok || data.status !== "success" || !data.result?.link) {
    const detail =
      typeof data === "object" ? JSON.stringify(data).slice(0, 300) : "";
    throw new Error(`TryBit invoice error (${res.status}): ${detail}`);
  }
  return data.result.link;
}

// ─── webhook (postback) verification ───────────────────────

function b64urlToBuffer(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

/**
 * Verifies a TryBit/CryptoCloud HS256 postback JWT against the project secret.
 * Returns the decoded payload, or null if the signature or expiry is invalid.
 * No JWT library needed — it's just two base64url segments + an HMAC.
 */
export function verifyPostbackToken(
  token: string,
  secret: string
): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest();
  const given = b64urlToBuffer(sigB64);
  if (
    expected.length !== given.length ||
    !crypto.timingSafeEqual(expected, given)
  ) {
    return null;
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(b64urlToBuffer(payloadB64).toString("utf8"));
  } catch {
    return null;
  }

  // Respect the token's expiry when present (TryBit tokens live ~5 min).
  if (typeof payload.exp === "number" && Date.now() / 1000 > payload.exp) {
    return null;
  }
  return payload;
}

export function postbackSecret(): string {
  const secret = process.env.TRYBIT_SECRET;
  if (!secret) throw new Error("TRYBIT_SECRET is not set");
  return secret;
}

/** True for the postback status that means the invoice is fully paid. */
export function isPaidStatus(status: string | undefined): boolean {
  return status === "success" || status === "paid";
}
