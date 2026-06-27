import crypto from "node:crypto";

/**
 * Access-code verification.
 *
 * Boosty (unlike Stripe) has no API to confirm a one-off payment server-side,
 * so we gate results behind access codes that the seller hands out to buyers.
 *
 * Two kinds of code are accepted:
 *  1. Signed single-use codes: `NEGO-<serial>-<sig>` where
 *     sig = HMAC-SHA256(ACCESS_CODE_SECRET, serial). These are minted with
 *     scripts/gen-codes.mjs and verified here without any database (the
 *     signature proves authenticity). Single-use is enforced via a store.
 *  2. An optional static shared code (ACCESS_CODE_STATIC) — handy for putting
 *     inside a subscribers-only Boosty post. Not single-use.
 */

export type CodeVerdict =
  | { ok: true; isStatic: boolean; serial?: string }
  | { ok: false; reason: "missing" | "invalid" | "used" };

function sign(serial: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(serial)
    .digest("hex")
    .slice(0, 8)
    .toUpperCase();
}

export async function inspectCode(raw: string): Promise<CodeVerdict> {
  const code = (raw || "").trim().toUpperCase();
  if (!code) return { ok: false, reason: "missing" };

  const staticCode = process.env.ACCESS_CODE_STATIC?.trim().toUpperCase();
  if (staticCode && code === staticCode) return { ok: true, isStatic: true };

  const secret = process.env.ACCESS_CODE_SECRET;
  if (!secret) return { ok: false, reason: "invalid" };

  const parts = code.split("-");
  if (parts.length !== 3 || parts[0] !== "NEGO") {
    return { ok: false, reason: "invalid" };
  }
  const [, serial, sig] = parts;

  const expected = sign(serial, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: "invalid" };
  }

  if (await hasConsumed(serial)) return { ok: false, reason: "used" };
  return { ok: true, isStatic: false, serial };
}

export async function consumeCode(serial: string): Promise<void> {
  await markConsumed(serial);
}

// ─── minting (server-side, used by the payment webhook) ────
// Mirrors scripts/gen-codes.mjs so codes minted on a confirmed payment verify
// identically in inspectCode().

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32

function randomSerial(): string {
  return Array.from(crypto.randomBytes(8))
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join("");
}

export function mintCode(): string {
  const secret = process.env.ACCESS_CODE_SECRET;
  if (!secret) throw new Error("ACCESS_CODE_SECRET is not set");
  const serial = randomSerial();
  return `NEGO-${serial}-${sign(serial, secret)}`;
}

// ─── single-use store ──────────────────────────────────────
// Uses Upstash Redis (REST) when configured for durable single-use across
// deploys; otherwise falls back to in-process memory (resets on restart).

const memory = new Set<string>();
// Accept both the plain Upstash names and the ones Vercel's Upstash/KV
// integration injects (KV_REST_API_URL / KV_REST_API_TOKEN). Both point at the
// same Upstash REST endpoint, so either set works.
const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const key = (serial: string) => `nego:code:${serial}`;

async function upstash(cmd: string[]): Promise<{ result: unknown }> {
  const res = await fetch(
    `${REDIS_URL}/${cmd.map(encodeURIComponent).join("/")}`,
    { headers: { Authorization: `Bearer ${REDIS_TOKEN}` }, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  return res.json();
}

async function hasConsumed(serial: string): Promise<boolean> {
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const r = await upstash(["EXISTS", key(serial)]);
      return r.result === 1;
    } catch {
      return memory.has(serial);
    }
  }
  return memory.has(serial);
}

async function markConsumed(serial: string): Promise<void> {
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      await upstash(["SETNX", key(serial), "1"]);
      return;
    } catch {
      // fall through to memory
    }
  }
  memory.add(serial);
}

// ─── order → code store (webhook idempotency) ─────────────
// A payment provider can deliver the same webhook more than once. We record the
// code minted for each order id so retries don't mint/email a second code.

const orderMemory = new Map<string, string>();
const orderKey = (id: string) => `nego:order:${id}`;

export async function getOrderCode(orderId: string): Promise<string | null> {
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const r = await upstash(["GET", orderKey(orderId)]);
      return typeof r.result === "string" ? r.result : null;
    } catch {
      return orderMemory.get(orderId) ?? null;
    }
  }
  return orderMemory.get(orderId) ?? null;
}

export async function recordOrderCode(
  orderId: string,
  code: string
): Promise<void> {
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      await upstash(["SET", orderKey(orderId), code]);
      return;
    } catch {
      // fall through to memory
    }
  }
  orderMemory.set(orderId, code);
}
