# NegotiateAI

A production-ready SaaS that helps US job seekers negotiate better salaries.
Paste your offer, pay **$9 once**, and instantly get a market analysis plus a
ready-to-send negotiation email. No account, no subscription, no database.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + shadcn/ui-style components (dark fintech theme)
- **OpenAI** GPT-4o for the analysis
- **Stripe** Checkout (one-time $9 payment)
- **pdf-parse** for optional offer-letter PDF extraction
- Deploys to **Vercel**

## How it works

1. User fills out the offer form on `/` (job title, salary, city, experience,
   optional offer-letter PDF, notes).
2. `POST /api/create-checkout` parses any PDF, stores the fields in Stripe
   Checkout **metadata**, and returns a Checkout URL.
3. After paying, Stripe redirects to `/result?session_id=...`.
4. `GET /api/get-result` verifies the session was **paid**, then calls GPT-4o
   and returns structured JSON (rating, market range, counter-offer, talking
   points, email draft).
5. Results render on `/result`. The email is one-click copyable.

The `session_id` is the only "auth" — only a paid session can fetch a result.
Generated analyses are cached in-memory per session so reloads don't re-bill
OpenAI.

## Local development

```bash
npm install
cp .env.local.example .env.local   # then fill in your keys
npm run dev
```

Open http://localhost:3000.

> Tip: use Stripe **test mode** keys and card `4242 4242 4242 4242` to walk the
> full flow end-to-end before going live.

## Environment variables

| Variable                  | Purpose                                            |
| ------------------------- | -------------------------------------------------- |
| `OPENAI_API_KEY`          | Server-side GPT-4o calls                            |
| `STRIPE_SECRET_KEY`       | Create + verify Checkout sessions                  |
| `STRIPE_PUBLISHABLE_KEY`  | Reserved for client Stripe.js (hosted checkout)    |
| `NEXT_PUBLIC_BASE_URL`    | Base URL for redirect + OG metadata                |

## Project structure

```
app/
  layout.tsx              Root layout, Inter font, dark theme, SEO/OG metadata
  page.tsx                Landing page + offer form
  opengraph-image.tsx     Generated OG image (1200×630)
  result/page.tsx         Results page (Suspense-wrapped)
  api/create-checkout/    Creates the Stripe Checkout session
  api/get-result/         Verifies payment + calls OpenAI
components/               OfferForm, ResultCard, RatingBadge, EmailDraft, …
  ui/                     Button, Card, Badge, Input, Label, Textarea
lib/                      stripe, openai, types, utils, analysisCache
```

## Deploy to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add the env vars above in the Vercel dashboard.
3. Set `NEXT_PUBLIC_BASE_URL` to your production domain.
4. Test in Stripe test mode, then switch to live keys.

> ⚠️ The landing page ships with sample testimonials and a "10,000+ offers
> analyzed" trust line. Replace these with real, substantiated numbers before
> going live — fabricated testimonials/metrics violate the FTC's rules on
> endorsements and fake reviews.
