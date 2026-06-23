export type Rating = "underpaid" | "fair" | "above_market";

/** Shape returned by the OpenAI analysis call. */
export interface AnalysisResult {
  marketRangeLow: number;
  marketRangeHigh: number;
  rating: Rating;
  ratingLabel: string;
  counterOffer: number;
  negotiationPoints: string[];
  emailDraft: string;
}

/** Form fields collected from the user (sent to /api/create-checkout). */
export interface OfferInput {
  jobTitle: string;
  companyName: string;
  salary: string;
  city: string;
  yearsOfExperience: string;
  notes?: string;
  /** Base64-encoded PDF of the offer letter (optional). */
  pdfBase64?: string;
}

/** Echoed offer context, stored in Stripe metadata and returned with results. */
export interface OfferContext {
  jobTitle: string;
  companyName: string;
  salary: string;
  city: string;
  yearsOfExperience: string;
  notes: string;
  offerText: string;
}

/** Full payload returned by /api/get-result. */
export interface ResultResponse extends AnalysisResult {
  context: OfferContext;
}
