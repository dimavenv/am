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

Boosty has no payment API, so access is gated by **signed codes**. Delivery is
fully automatic — no Telegram, no manual DMs:

### Recommended setup: static code inside a paid Boosty post (zero maintenance)

1. Set `ACCESS_CODE_STATIC=YOUR-SECRET-CODE` in your environment.
2. Create a **paid post** on Boosty (one-time purchase or subscription tier).
3. Put the static code in the **body** of that post — Boosty's paywall hides it
   until the buyer pays.
4. Set `NEXT_PUBLIC_BOOSTY_URL` to the direct link to that post.

**Buyer flow:**
- Clicks “Pay $9 and get my code on Boosty” → lands on the Boosty post
- Pays → Boosty immediately reveals the post body with the code
- Copies the code, pastes it back on the site → analysis runs instantly

No waiting, no manual steps, no Telegram.

### Advanced: unique per-buyer signed codes (more secure)

Mint a batch of HMAC-signed, single-use codes and distribute them via email
automation (e.g. Boosty → Make.com → email):

```bash
ACCESS_CODE_SECRET=your-secret node scripts/gen-codes.mjs 50
```

Codes look like `NEGO-7Q2KX9AB-3F9C2A1B`. The server verifies the HMAC
signature and burns the code only after a successful analysis (a server hiccup
never wastes a buyer's code). Single-use is enforced in memory by default, or
durably with Upstash Redis if configured.

Both modes (static + signed) are accepted simultaneously.

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
