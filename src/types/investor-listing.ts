import type { ListingStatus } from './listing-status';
import type { PropertyType } from './property-type';
import type { Address } from './address';
import type { FinancialSummary } from './financial-summary';
import type { InvestorContact } from './investor-contact';
import type { Ownership } from './ownership';

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

  /** Street, city, region, postal code, and country for this listing. */
  address: Address;

  /** Asking price, currency, and optional return metrics. */
  financials?: FinancialSummary;

  /** When this listing record was created. */
  createdAt: string;

  /** When this listing was last meaningfully edited. */
  updatedAt: string;

  /** Lifecycle state: draft, published, under_offer, sold, or archived. */
  status: ListingStatus;

  /** Asset class: multifamily, office, retail, industrial, mixed_use, or land. */
  propertyType: PropertyType;

  /** People tied to this listing. */
  contacts: InvestorContact[];

  /** Must match the id of one contact in contacts. */
  primaryContactId: string;

  /** How contacts relate to the asset, including optional share. */
  ownership: Ownership[];
}
