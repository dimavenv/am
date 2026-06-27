# NegotiateAI

A SaaS that helps US job seekers negotiate better salaries. Paste your offer,
unlock with an access code, and instantly get a market analysis plus a
ready-to-send negotiation email. No account, no database.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + shadcn/ui-style components (dark fintech theme)
- **OpenRouter** (default `openai/gpt-4o-mini`) for the analysis
- **Cryptomus** for payment (card or crypto in, crypto out) — see below
- **Resend** for automatic code delivery by email
- **pdf-parse** for optional offer-letter PDF extraction
- **@react-pdf/renderer** for the downloadable PDF report
- Deploys to **Vercel**

## How payment works (Cryptomus + auto-emailed codes)

Payment and code delivery are **fully automatic** — no Telegram, no manual DMs.
[Cryptomus](https://cryptomus.com) lets buyers pay by **card or crypto** while
you withdraw in **crypto** (ideal for a US audience with a non-US payout).

**Buyer flow:**

1. On the unlock step the buyer enters their **email** and clicks **Pay $9**.
2. `POST /api/create-payment` creates a Cryptomus invoice and opens its hosted
   checkout in a new tab.
3. The buyer pays (card / USDT / BTC / …).
4. Cryptomus calls `POST /api/payment-webhook` server-to-server. We verify the
   signature, **mint a unique single-use code** (`NEGO-…`), and **email it** via
   Resend to the address from step 1.
5. The buyer pastes the code back on the still-open form → analysis runs
   instantly. `POST /api/analyze` validates the code's HMAC signature and burns
   it only after a successful analysis (a server hiccup never wastes a code).

Webhook retries are idempotent: each `order_id`'s code is recorded, so a
re-delivered webhook never mints or emails a second code.

> Set the Cryptomus **webhook/callback** to `https://negotiateai.site/api/payment-webhook`
> (the app sends this as `url_callback` automatically from `NEXT_PUBLIC_BASE_URL`,
> so it must be your real, publicly reachable domain in production).

### Pre-minting / static codes (optional)

You can still hand out codes manually (e.g. promos, support refunds):

```bash
ACCESS_CODE_SECRET=your-secret node scripts/gen-codes.mjs 50
```

There's also an optional `ACCESS_CODE_STATIC` — a single shared code accepted in
addition to signed codes (not single-use). Handy for testing or comps.

## How a run works

1. User fills the multi-step form on `/` (role, numbers, optional PDF + notes).
2. On the unlock step they pay via Cryptomus and receive a code by email.
3. They paste the code; `POST /api/analyze` validates it, parses any PDF, calls
   the AI, and returns structured JSON (rating, market range, counter-offer,
   talking points, email).
4. The result is stashed in `sessionStorage` and rendered on `/result` —
   animated reveal, market gauge, copyable email, and a **Download PDF** button.

## Local development

```bash
npm install
cp .env.local.example .env.local   # then fill in your keys
npm run dev
```

Open http://localhost:3000. To test the unlock step without paying, mint a code
with the command above (using the same `ACCESS_CODE_SECRET`) and paste it in the
"Already have a code?" field. To test the full payment + email loop locally,
expose your dev server with a tunnel (e.g. `ngrok`) and point
`NEXT_PUBLIC_BASE_URL` + the Cryptomus webhook at the tunnel URL.

## Environment variables

| Variable                    | Purpose                                              |
| --------------------------- | ---------------------------------------------------- |
| `OPENROUTER_API_KEY`        | AI calls via OpenRouter                              |
| `OPENROUTER_MODEL`          | Optional model override (default gpt-4o-mini)        |
| `CRYPTOMUS_MERCHANT_ID`     | Cryptomus merchant id                                |
| `CRYPTOMUS_API_KEY`         | Cryptomus payment API key (signs requests/webhooks)  |
| `PRICE_USD`                 | Optional price per analysis (default 9.00)           |
| `RESEND_API_KEY`            | Resend key for emailing codes                         |
| `EMAIL_FROM`                | Verified Resend sender for the code email            |
| `ACCESS_CODE_SECRET`        | Mints & verifies signed single-use codes            |
| `ACCESS_CODE_STATIC`        | Optional shared code (not single-use)               |
| `UPSTASH_REDIS_REST_URL`    | Optional — durable single-use + order storage        |
| `UPSTASH_REDIS_REST_TOKEN`  | Optional — Upstash auth token                        |
| `NEXT_PUBLIC_BASE_URL`      | Public domain — return/callback URLs, OG, email links |

## Project structure

```
app/
  layout.tsx              Root layout, Inter font, dark theme, SEO/OG metadata
  page.tsx                Landing page + multi-step offer form
  opengraph-image.tsx     Generated OG image (1200×630)
  result/page.tsx         Results page (reads result from sessionStorage)
  api/analyze/            Validates access code + calls the AI
  api/create-payment/     Creates a Cryptomus invoice for the buyer
  api/payment-webhook/    Verifies payment, mints a code, emails it
components/               OfferForm, ResultCard, RatingBadge, OfferGauge,
  pdf/OfferReport.tsx     EmailDraft, DownloadPDFButton, AnalyzingChart, …
  ui/                     Button, Card, Badge, Input, Label, Textarea
lib/                      openai (OpenRouter), accessCodes, cryptomus, email,
                          types, utils, storage
scripts/gen-codes.mjs     Mint signed access codes
```

## Deploy to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add the env vars above (at minimum `OPENROUTER_API_KEY`, `ACCESS_CODE_SECRET`,
   `CRYPTOMUS_MERCHANT_ID`, `CRYPTOMUS_API_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`,
   and `NEXT_PUBLIC_BASE_URL` set to your real domain).
3. In the Cryptomus dashboard, set the webhook URL to
   `https://negotiateai.site/api/payment-webhook`.
4. For durable codes/orders across deploys, add an Upstash Redis integration and
   set the two `UPSTASH_*` vars (recommended in production).

> ⚠️ The landing page ships with sample testimonials and a "10,000+ offers
> analyzed" trust line. Replace these with real, substantiated numbers before
> going live — fabricated testimonials/metrics violate the FTC's rules on
> endorsements and fake reviews.
