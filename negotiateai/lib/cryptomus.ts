import crypto from "node:crypto";

/**
 * Minimal Cryptomus client.
 *
 * Cryptomus lets buyers pay by card or crypto and lets the merchant withdraw in
 * crypto — perfect for selling to a US audience while cashing out elsewhere.
 *
 * Auth is a signature header on every request:
 *   sign = md5( base64(jsonBody) + API_KEY )
 *
 * Webhooks are verified the same way: the payload includes a `sign` field built
 * from PHP's json_encode of the body (which escapes "/" as "\/"), so we
 * reproduce that escaping before hashing.
 *
 * Docs: https://doc.cryptomus.com/
 */

const API_BASE = "https://api.cryptomus.com/v1";

function merchant(): string {
  const id = process.env.CRYPTOMUS_MERCHANT_ID;
  if (!id) throw new Error("CRYPTOMUS_MERCHANT_ID is not set");
  return id;
}

function apiKey(): string {
  const key = process.env.CRYPTOMUS_API_KEY;
  if (!key) throw new Error("CRYPTOMUS_API_KEY is not set");
  return key;
}

function signPayload(jsonBody: string): string {
  return crypto
    .createHash("md5")
    .update(Buffer.from(jsonBody).toString("base64") + apiKey())
    .digest("hex");
}

export interface CreateInvoiceOptions {
  orderId: string;
  /** Amount in USD, e.g. "9.00". */
  amount: string;
  email: string;
  /** Where Cryptomus sends the buyer back after payment. */
  returnUrl: string;
  /** Public URL Cryptomus calls server-to-server when the payment settles. */
  callbackUrl: string;
}

/** Creates a hosted payment page and returns its URL. */
export async function createInvoice(
  opts: CreateInvoiceOptions
): Promise<string> {
  const body = {
    amount: opts.amount,
    currency: "USD",
    order_id: opts.orderId,
    url_return: opts.returnUrl,
    url_success: opts.returnUrl,
    url_callback: opts.callbackUrl,
    // Echoed back verbatim in the webhook — we use it to email the buyer.
    additional_data: JSON.stringify({ email: opts.email }),
  };
  const json = JSON.stringify(body);

  const res = await fetch(`${API_BASE}/payment`, {
    method: "POST",
    headers: {
      merchant: merchant(),
      sign: signPayload(json),
      "Content-Type": "application/json",
    },
    body: json,
    cache: "no-store",
  });

  const data = (await res.json().catch(() => ({}))) as {
    result?: { url?: string };
    message?: string;
  };

  if (!res.ok || !data.result?.url) {
    throw new Error(data.message || `Cryptomus error (${res.status})`);
  }
  return data.result.url;
}

export interface WebhookPayload {
  type?: string;
  uuid?: string;
  order_id?: string;
  status?: string;
  additional_data?: string;
  [k: string]: unknown;
}

/**
 * Verifies a webhook's signature and returns the parsed payload, or null if the
 * signature doesn't match. Reproduces PHP's json_encode slash-escaping so the
 * md5 matches what Cryptomus computed.
 */
export function verifyWebhook(rawBody: string): WebhookPayload | null {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return null;
  }

  const received = data.sign;
  if (typeof received !== "string") return null;
  delete data.sign;

  const json = JSON.stringify(data).replace(/\//g, "\\/");
  const expected = signPayload(json);

  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  return data as WebhookPayload;
}

/** True for Cryptomus statuses that mean the money is in. */
export function isPaidStatus(status: string | undefined): boolean {
  return status === "paid" || status === "paid_over";
}
