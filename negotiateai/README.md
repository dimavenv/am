# NegotiateAI

A SaaS that helps US job seekers negotiate better salaries. Paste your offer,
unlock with an access code, and instantly get a market analysis plus a
ready-to-send negotiation email. No account, no database.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + shadcn/ui-style components (dark fintech theme)
- **OpenRouter** (default `openai/gpt-4o-mini`) for the analysis
- **TryBit** (CryptoCloud) for payment — see below
- **Resend** for automatic code delivery by email
- **pdf-parse** for optional offer-letter PDF extraction
- **@react-pdf/renderer** for the downloadable PDF report
- Deploys to **Vercel**

## How payment works (TryBit + auto-emailed codes)

Payment and code delivery are **fully automatic** — no Telegram, no manual DMs.
[TryBit](https://trybit.com) (a CryptoCloud-based gateway) hosts the checkout and
calls us back when the payment settles.

**Buyer flow:**

1. On the unlock step the buyer enters their **email** and clicks **Pay $9**.
2. `POST /api/create-payment` creates a TryBit invoice and opens its hosted
   checkout in a new tab. The buyer's email is signed into the `order_id` so the
   webhook can recover it with no shared database.
3. The buyer pays.
4. TryBit POSTs to `POST /api/payment-webhook`. We **verify the postback JWT**
   against the project secret, **mint a unique single-use code** (`NEGO-…`), and
   **email it** via Resend to the buyer.
5. The buyer returns to the still-open form (a "check your email" banner shows),
   pastes the code → analysis runs instantly. `POST /api/analyze` validates the
   code's HMAC signature and burns it only after a successful analysis (a server
   hiccup never wastes a code).

Webhook retries are idempotent: each `order_id`'s code is recorded, so a
re-delivered postback never mints or emails a second code.

### TryBit dashboard setup

In your TryBit project settings set the notification/postback URL to:

```
https://negotiateai.site/api/payment-webhook
```

and the success / fail return URLs to:

```
https://negotiateai.site/?paid=1#analyze
https://negotiateai.site/?paid=0#analyze
```

Then copy your **API key**, **Shop ID**, and **Secret** into the env vars below.
If TryBit's API host differs from the CryptoCloud default, set `TRYBIT_API_BASE`
to the base URL from their docs (keep the `/v2` suffix).

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
`NEXT_PUBLIC_BASE_URL` + the TryBit postback URL at the tunnel URL.

## Environment variables

| Variable                    | Purpose                                              |
| --------------------------- | ---------------------------------------------------- |
| `OPENROUTER_API_KEY`        | AI calls via OpenRouter                              |
| `OPENROUTER_MODEL`          | Optional model override (default gpt-4o-mini)        |
| `TRYBIT_API_KEY`            | TryBit API key (auth for creating invoices)          |
| `TRYBIT_SHOP_ID`            | TryBit shop/project id                               |
| `TRYBIT_SECRET`             | TryBit project secret (verifies postback JWTs)       |
| `TRYBIT_API_BASE`           | Optional API base override (default CryptoCloud /v2) |
| `PRICE_USD`                 | Optional price per analysis (default 9.00)           |
| `RESEND_API_KEY`            | Resend key for emailing codes                         |
| `EMAIL_FROM`                | Verified Resend sender for the code email            |
| `ACCESS_CODE_SECRET`        | Mints/verifies codes + signs the order id            |
| `ACCESS_CODE_STATIC`        | Optional shared code (not single-use)               |
| `UPSTASH_REDIS_REST_URL`    | Optional — durable single-use + order storage        |
| `UPSTASH_REDIS_REST_TOKEN`  | Optional — Upstash auth token                        |
| `NEXT_PUBLIC_BASE_URL`      | Public domain — return URLs, OG, email links         |

## Project structure

```
app/
  layout.tsx              Root layout, Inter font, dark theme, SEO/OG metadata
  page.tsx                Landing page + multi-step offer form
  opengraph-image.tsx     Generated OG image (1200×630)
  result/page.tsx         Results page (reads result from sessionStorage)
  api/analyze/            Validates access code + calls the AI
  api/create-payment/     Creates a TryBit invoice for the buyer
  api/payment-webhook/    Verifies the postback JWT, mints a code, emails it
components/               OfferForm, ResultCard, RatingBadge, OfferGauge,
  pdf/OfferReport.tsx     PaidBanner, DownloadPDFButton, AnalyzingChart, …
  ui/                     Button, Card, Badge, Input, Label, Textarea
lib/                      openai (OpenRouter), accessCodes, trybit, order, email,
                          types, utils, storage
scripts/gen-codes.mjs     Mint signed access codes
```

## Deploy to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add the env vars above (at minimum `OPENROUTER_API_KEY`, `ACCESS_CODE_SECRET`,
   `TRYBIT_API_KEY`, `TRYBIT_SHOP_ID`, `TRYBIT_SECRET`, `RESEND_API_KEY`,
   `EMAIL_FROM`, and `NEXT_PUBLIC_BASE_URL` set to your real domain).
3. In the TryBit dashboard, set the postback URL to
   `https://negotiateai.site/api/payment-webhook` and the return URLs to
   `https://negotiateai.site/?paid=1#analyze` (success) and `…?paid=0#analyze`
   (fail).
4. For durable single-use enforcement across deploys, add an Upstash Redis
   integration and set the two `UPSTASH_*` vars (recommended in production).

> ⚠️ The landing page ships with sample testimonials and a "10,000+ offers
> analyzed" trust line. Replace these with real, substantiated numbers before
> going live — fabricated testimonials/metrics violate the FTC's rules on
> endorsements and fake reviews.
