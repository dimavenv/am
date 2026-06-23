import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Lazily-initialized Stripe client. Initializing lazily (rather than at module
 * scope) keeps `next build` from crashing when the secret key isn't present.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}
