# NegotiateAI

A SaaS that helps US job seekers negotiate better salaries. Paste your offer,
unlock with an access code, and instantly get a market analysis plus a
ready-to-send negotiation email. No account, no database.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + shadcn/ui-style components (dark fintech theme)
- **OpenRouter** (default `openai/gpt-4o-mini`) for the analysis
- **Access codes** sold via **Boosty** for payment (see below)
- **pdf-parse** for optional offer-letter PDF extraction
- **@react-pdf/renderer** for the downloadable PDF report
- Deploys to **Vercel**

## How payment works (Boosty + access codes)

Boosty has no API to confirm a one-off payment server-side, so access is gated
by **codes**:

1. You mint signed codes and sell them on Boosty (a paid post / subscription /
   DM to buyers).
2. On the unlock step the user clicks **“Get my access code on Boosty”**
   (`NEXT_PUBLIC_BOOSTY_URL`) and pastes the code.
3. `POST /api/analyze` verifies the code's HMAC signature **and** that it hasn't
   been used, then calls the AI and returns the result. The code is only burned
   on a successful analysis (a server hiccup never wastes a buyer's code).

Codes look like `NEGO-7Q2KX9AB-3F9C2A1B` and are validated with no database via
`ACCESS_CODE_SECRET`. Single-use is enforced in memory by default, or durably
with Upstash Redis if configured.

There's also an optional `ACCESS_CODE_STATIC` (a single shared code, e.g. placed
inside a subscribers-only Boosty post) — accepted in addition to signed codes,
but not single-use.

### Minting codes

```bash
ACCESS_CODE_SECRET=your-secret node scripts/gen-codes.mjs 50
```

## How a run works

1. User fills the multi-step form on `/` (role, numbers, optional PDF + notes).
2. On the unlock step they enter a Boosty access code.
3. `POST /api/analyze` validates the code, parses any PDF, calls the AI, returns
   structured JSON (rating, market range, counter-offer, talking points, email).
4. The result is stashed in `sessionStorage` and rendered on `/result` —
   animated reveal, market gauge, copyable email, and a **Download PDF** button.

## Local development

```bash
npm install
cp .env.local.example .env.local   # then fill in your keys
npm run dev
```

Open http://localhost:3000. Mint a test code with the command above (using the
same `ACCESS_CODE_SECRET`) to walk the full flow.

## Environment variables

| Variable                    | Purpose                                              |
| --------------------------- | ---------------------------------------------------- |
| `OPENROUTER_API_KEY`        | AI calls via OpenRouter                              |
| `OPENROUTER_MODEL`          | Optional model override (default gpt-4o-mini)        |
| `NEXT_PUBLIC_BOOSTY_URL`    | Link behind the “Get my access code” button         |
| `ACCESS_CODE_SECRET`        | Mints & verifies signed single-use codes            |
| `ACCESS_CODE_STATIC`        | Optional shared code (not single-use)               |
| `UPSTASH_REDIS_REST_URL`    | Optional — durable single-use storage               |
| `UPSTASH_REDIS_REST_TOKEN`  | Optional — Upstash auth token                        |
| `NEXT_PUBLIC_BASE_URL`      | Base URL for OG metadata                             |

## Project structure

```
app/
  layout.tsx              Root layout, Inter font, dark theme, SEO/OG metadata
  page.tsx                Landing page + multi-step offer form
  opengraph-image.tsx     Generated OG image (1200×630)
  result/page.tsx         Results page (reads result from sessionStorage)
  api/analyze/            Validates access code + calls the AI
components/               OfferForm, ResultCard, RatingBadge, OfferGauge,
  pdf/OfferReport.tsx     EmailDraft, DownloadPDFButton, AnalyzingChart, …
  ui/                     Button, Card, Badge, Input, Label, Textarea
lib/                      openai (OpenRouter), accessCodes, types, utils, storage
scripts/gen-codes.mjs     Mint signed access codes
```

## Deploy to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add the env vars above (at minimum `OPENROUTER_API_KEY`, `ACCESS_CODE_SECRET`,
   `NEXT_PUBLIC_BOOSTY_URL`).
3. For durable single-use codes across deploys, add an Upstash Redis integration
   and set the two `UPSTASH_*` vars.

> ⚠️ The landing page ships with sample testimonials and a "10,000+ offers
> analyzed" trust line. Replace these with real, substantiated numbers before
> going live — fabricated testimonials/metrics violate the FTC's rules on
> endorsements and fake reviews.
