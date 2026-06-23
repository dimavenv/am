import type { ResultResponse } from "./types";

/**
 * In-memory result cache keyed by Stripe session id.
 *
 * No database is needed at this scale: once an analysis is generated for a paid
 * session we cache it so repeat loads of /result don't re-bill OpenAI, and we
 * loosely rate-limit how many times a single session can trigger generation.
 *
 * NOTE: this lives in process memory, so it resets on cold starts / redeploys.
 * That's acceptable here — re-generating an analysis for a paid session is fine.
 */
type Entry = {
  result?: ResultResponse;
  requests: number;
};

const store = new Map<string, Entry>();

const MAX_REQUESTS_BEFORE_CACHE_ONLY = 5;

export function getCached(sessionId: string): ResultResponse | undefined {
  return store.get(sessionId)?.result;
}

export function setCached(sessionId: string, result: ResultResponse): void {
  const entry = store.get(sessionId) ?? { requests: 0 };
  entry.result = result;
  store.set(sessionId, entry);
}

/** Increment the request counter and return the new count. */
export function trackRequest(sessionId: string): number {
  const entry = store.get(sessionId) ?? { requests: 0 };
  entry.requests += 1;
  store.set(sessionId, entry);
  return entry.requests;
}

/**
 * True when this session has hit the request ceiling AND we have nothing cached
 * to serve — i.e. someone is hammering the endpoint without a successful result.
 */
export function isRateLimited(sessionId: string): boolean {
  const entry = store.get(sessionId);
  if (!entry) return false;
  return entry.requests > MAX_REQUESTS_BEFORE_CACHE_ONLY && !entry.result;
}
