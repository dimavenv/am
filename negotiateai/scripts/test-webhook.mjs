#!/usr/bin/env node
// Send a *valid* fake TryBit postback to the payment webhook, to test the
// webhook → mint code → Resend email path without an actual on-chain payment.
//
// It reproduces exactly what TryBit sends: a form-encoded POST with
// { status, order_id, token } where `token` is an HS256 JWT signed with the
// project secret. The signing here MUST match lib/trybit.ts and lib/order.ts.
//
// Usage:
//   TRYBIT_SECRET=...  ACCESS_CODE_SECRET=...  \
//     node scripts/test-webhook.mjs buyer@example.com https://negotiateai.site
//
// (ACCESS_CODE_SECRET and TRYBIT_SECRET must be the SAME values you set in
// Vercel, otherwise the order id / token won't verify on the server.)
import crypto from "node:crypto";

const email = process.argv[2];
const base = (process.argv[3] || "https://negotiateai.site").replace(/\/$/, "");

const trybitSecret = process.env.TRYBIT_SECRET;
const codeSecret = process.env.ACCESS_CODE_SECRET;

if (!email || !trybitSecret || !codeSecret) {
  console.error(
    "Usage: TRYBIT_SECRET=... ACCESS_CODE_SECRET=... node scripts/test-webhook.mjs <email> [base-url]"
  );
  process.exit(1);
}

const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

// 1. Rebuild the signed order_id the same way lib/order.ts does.
const emailPart = b64url(Buffer.from(email, "utf8"));
const orderSig = crypto
  .createHmac("sha256", codeSecret)
  .update(emailPart)
  .digest("hex")
  .slice(0, 8);
const orderId = `nego.${emailPart}.${orderSig}`;

// 2. Build an HS256 JWT signed with the project secret (like TryBit's postback).
const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
const payload = b64url(
  JSON.stringify({
    id: "test-invoice-uuid",
    exp: Math.floor(Date.now() / 1000) + 300, // 5 min, like the real token
  })
);
const tokenSig = b64url(
  crypto.createHmac("sha256", trybitSecret).update(`${header}.${payload}`).digest()
);
const token = `${header}.${payload}.${tokenSig}`;

// 3. POST it form-encoded, exactly like TryBit.
const form = new URLSearchParams({
  status: "success",
  invoice_id: "INV-TEST",
  order_id: orderId,
  token,
});

const url = `${base}/api/payment-webhook`;
console.log(`→ POST ${url}`);
console.log(`  order_id: ${orderId}`);

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: form.toString(),
});

const text = await res.text();
console.log(`← ${res.status} ${res.statusText}`);
console.log(`  ${text}`);

if (res.ok) {
  console.log(`\n✓ Webhook accepted. Check ${email} for the access code email.`);
} else {
  console.log(`\n✗ Webhook rejected — check the secrets match your Vercel env.`);
}
