import type { PropertyType } from './property-type';
import type { Address } from './address';
import type { FinancialSummary } from './financial-summary';
import type { InvestorContact } from './investor-contact';
import type { Ownership } from './ownership';

/**
 * Core PREIshare investor listing, including nested address, financials,
 * contacts, and ownership, plus closed property-type unions.
 *
 * Optional fields (`?`) may be absent on draft or archived listings.
 * They are required for published, under_offer, and sold.
 */
export interface InvestorListingBase {
  /** Stable unique id for the listing. */
  readonly id: string;

  /** Short name shown to investors. */
  title: string;

  /** Longer investor-facing summary of the opportunity. */
  description?: string;

  /** Street, city, region, postal code, and country for this listing. */
  address: Address;

  /** Asking price, currency, and optional return metrics. */
  financials?: FinancialSummary;

  /** When this listing record was created. */
  readonly createdAt: string;

  /** When this listing was last meaningfully edited. */
  readonly updatedAt: string;

  /** Asset class: multifamily, office, retail, industrial, mixed_use, or land. */
  propertyType: PropertyType;

  /** People tied to this listing. */
  contacts: InvestorContact[];

  /** Must match the id of one contact in contacts. */
  primaryContactId: string;

  /** Named owner, optional percent share, and optional notes. */
  ownership: Ownership;
}

// status is the discriminant of this union.
// closedAt is required only when sold; description, financials, and a non-empty contacts list are required for published, under_offer, and sold.
export type InvestorListing =
  | (InvestorListingBase & {
      status: 'draft' | 'archived';
      closedAt?: undefined;
    })
  | (InvestorListingBase & {
      status: 'published' | 'under_offer';
      closedAt?: undefined;
      description: string;
      financials: FinancialSummary;
      contacts: [InvestorContact, ...InvestorContact[]];
    })
  | (InvestorListingBase & {
      status: 'sold';
      closedAt: string;
      description: string;
      financials: FinancialSummary;
      contacts: [InvestorContact, ...InvestorContact[]];
    });

export type SoldInvestorListing = Extract<InvestorListing, { status: 'sold' }>;
export type OpenInvestorListing = Exclude<InvestorListing, { status: 'sold' }>;
