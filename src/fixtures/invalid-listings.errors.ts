import type { InvestorListing } from '../types';

// This module is expected to fail typechecking. Each export breaks one rule.

// Should error: 'publised' is not a ListingStatus member (typo of published).
export const invalidStatusSpelling: InvestorListing = {
  id: 'lst_inv_1001',
  title: 'Highland Multifamily Draft Typo',
  description: 'Otherwise valid published listing with a misspelled status.',
  address: {
    line1: '900 Highland Ave',
    city: 'Austin',
    region: 'TX',
    postalCode: '78752',
    country: 'US',
  },
  financials: {
    askingPrice: 9800000,
    currency: 'USD',
    projectedIrrPercent: 10.1,
    capRatePercent: 5.5,
  },
  createdAt: '2026-04-01T10:00:00Z',
  updatedAt: '2026-04-02T10:00:00Z',
  propertyType: 'multifamily',
  contacts: [
    {
      id: 'ctc_inv_1001',
      name: 'Jordan Lee',
      role: 'broker',
      email: 'jordan.lee@example.com',
    },
  ],
  primaryContactId: 'ctc_inv_1001',
  ownership: {
    ownerName: 'Highland Partners',
  },
  status: 'publised',
};

// Should error: address.city is required on Address and is missing.
export const missingAddressCity: InvestorListing = {
  id: 'lst_inv_1002',
  title: 'Domain Office Without City',
  description: 'Otherwise valid published listing whose address omits city.',
  address: {
    line1: '11410 Century Oaks Ter',
    region: 'TX',
    postalCode: '78758',
    country: 'US',
  },
  financials: {
    askingPrice: 22000000,
    currency: 'USD',
    capRatePercent: 6.1,
  },
  createdAt: '2026-04-03T09:00:00Z',
  updatedAt: '2026-04-04T09:00:00Z',
  propertyType: 'office',
  contacts: [
    {
      id: 'ctc_inv_1002',
      name: 'Alex Chen',
      role: 'owner_rep',
      email: 'alex.chen@example.com',
    },
  ],
  primaryContactId: 'ctc_inv_1002',
  ownership: {
    ownerName: 'Domain Office LLC',
    ownershipPercent: 100,
  },
  status: 'published',
};

// Should error: financials.askingPrice must be a number, not a string.
export const priceAsString: InvestorListing = {
  id: 'lst_inv_1003',
  title: 'SoCo Retail Price String',
  description: 'Otherwise valid published listing with askingPrice as text.',
  address: {
    line1: '1600 S Congress Ave',
    city: 'Austin',
    region: 'TX',
    postalCode: '78704',
    country: 'US',
  },
  financials: {
    askingPrice: '610000',
    currency: 'USD',
    capRatePercent: 7.3,
  },
  createdAt: '2026-04-05T11:00:00Z',
  updatedAt: '2026-04-06T11:00:00Z',
  propertyType: 'retail',
  contacts: [
    {
      id: 'ctc_inv_1003',
      name: 'Riley Nguyen',
      role: 'broker',
      email: 'riley.nguyen@example.com',
    },
  ],
  primaryContactId: 'ctc_inv_1003',
  ownership: {
    ownerName: 'Congress Retail Co',
  },
  status: 'published',
};

// Should error: status 'sold' requires closedAt on the sold branch of InvestorListing.
export const soldWithoutClosedAt: InvestorListing = {
  id: 'lst_inv_1004',
  title: 'Manor Industrial Sold Incomplete',
  description: 'Otherwise valid sold listing that omits closedAt.',
  address: {
    line1: '14000 Dessau Rd',
    city: 'Austin',
    region: 'TX',
    postalCode: '78754',
    country: 'US',
  },
  financials: {
    askingPrice: 15400000,
    currency: 'USD',
    projectedIrrPercent: 9.8,
    capRatePercent: 6.8,
  },
  createdAt: '2025-12-01T08:00:00Z',
  updatedAt: '2026-04-07T16:00:00Z',
  propertyType: 'industrial',
  contacts: [
    {
      id: 'ctc_inv_1004',
      name: 'Sam Okonkwo',
      role: 'owner_rep',
      email: 'sam.okonkwo@example.com',
    },
  ],
  primaryContactId: 'ctc_inv_1004',
  ownership: {
    ownerName: 'Manor Logistics LLC',
    ownershipPercent: 75,
  },
  status: 'sold',
};

// Should error: contacts must be InvestorContact[], not a single contact object.
export const contactsNotArray: InvestorListing = {
  id: 'lst_inv_1005',
  title: 'Mueller Mixed-Use Contact Shape',
  description: 'Otherwise valid published listing with contacts as one object.',
  address: {
    line1: '1900 Aldrich St',
    line2: 'Suite 400',
    city: 'Austin',
    region: 'TX',
    postalCode: '78723',
    country: 'US',
  },
  financials: {
    askingPrice: 18750000,
    currency: 'USD',
    projectedIrrPercent: 11.0,
  },
  createdAt: '2026-04-08T13:00:00Z',
  updatedAt: '2026-04-09T13:00:00Z',
  propertyType: 'mixed_use',
  contacts: {
    id: 'ctc_inv_1005',
    name: 'Casey Brooks',
    role: 'broker',
    email: 'casey.brooks@example.com',
  },
  primaryContactId: 'ctc_inv_1005',
  ownership: {
    ownerName: 'Aldrich Yard LLC',
  },
  status: 'published',
};
