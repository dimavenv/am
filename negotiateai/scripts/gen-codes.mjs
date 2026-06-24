#!/usr/bin/env node
// Mint signed single-use access codes to sell on Boosty.
//
// Usage:
//   ACCESS_CODE_SECRET=your-secret node scripts/gen-codes.mjs 50
//
// The signing here MUST match lib/accessCodes.ts (HMAC-SHA256, first 8 hex,
// uppercased). Codes look like:  NEGO-7Q2KX9AB-3F9C2A1B
import crypto from "node:crypto";

const secret = process.env.ACCESS_CODE_SECRET;
if (!secret) {
  console.error("Set ACCESS_CODE_SECRET in your environment first.");
  process.exit(1);
}

const count = Math.max(1, Number(process.argv[2] || 10));
const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32 (no I/L/O/U)

const sign = (serial) =>
  crypto.createHmac("sha256", secret).update(serial).digest("hex").slice(0, 8).toUpperCase();

const serial = () =>
  Array.from(crypto.randomBytes(8))
    .map((b) => alphabet[b % alphabet.length])
    .join("");

for (let i = 0; i < count; i++) {
  const s = serial();
  console.log(`NEGO-${s}-${sign(s)}`);
}
