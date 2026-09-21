/**
 * Core PREIshare investor listing — scalar fields only.
 * Nested types (address, financials, contacts) and unions
 * (status, property type) are added in later steps.
 *
 * Optional fields (`?`) may be absent on draft or archived listings.
 * They are required for published, under_offer, and sold.
 */
export interface InvestorListing {
  /** Stable unique id for the listing. */
  id: string;

  /** Short name shown to investors. */
  title: string;

  /** Longer investor-facing summary of the opportunity. */
  description?: string;

  /** Listed asking price as a number, not a formatted dollar string. */
  askingPrice?: number;

  /** When this listing record was created. */
  createdAt: string;

  /** When this listing was last meaningfully edited. */
  updatedAt: string;
}
