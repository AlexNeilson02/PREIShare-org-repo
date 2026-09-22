import type { InvestorListing } from '../types';

export const sampleDraftListing: InvestorListing = {
  id: 'lst_ev_1001',
  title: 'Westlake Land Assemblage',
  address: {
    line1: '2100 Bee Cave Rd',
    city: 'Austin',
    region: 'TX',
    postalCode: '78746',
    country: 'US',
  },
  createdAt: '2026-02-01T10:00:00Z',
  updatedAt: '2026-02-10T15:30:00Z',
  propertyType: 'land',
  contacts: [
    {
      id: 'ctc_1001',
      name: 'Jordan Lee',
      role: 'broker',
      email: 'jordan.lee@example.com',
    },
  ],
  primaryContactId: 'ctc_1001',
  ownership: {
    ownerName: 'Westlake Holdings LLC',
  },
  status: 'draft',
};

export const samplePublishedListing: InvestorListing = {
  id: 'lst_ev_1002',
  title: 'Riverfront Multifamily Offering',
  description: 'Value-add apartment community near transit and the river corridor.',
  address: {
    line1: '500 River Rd',
    line2: 'Suite 200',
    city: 'Austin',
    region: 'TX',
    postalCode: '78701',
    country: 'US',
  },
  financials: {
    askingPrice: 12500000,
    currency: 'USD',
    projectedIrrPercent: 12.5,
    capRatePercent: 5.8,
  },
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-15T16:30:00Z',
  propertyType: 'multifamily',
  contacts: [
    {
      id: 'ctc_1002',
      name: 'Alex Chen',
      role: 'owner_rep',
      email: 'alex.chen@example.com',
      phone: '+1-512-555-0142',
    },
  ],
  primaryContactId: 'ctc_1002',
  ownership: {
    ownerName: 'Riverfront Partners',
    ownershipPercent: 100,
  },
  status: 'published',
};

export const sampleUnderOfferListing: InvestorListing = {
  id: 'lst_ev_1003',
  title: 'Downtown Office Tower',
  description: 'Class B office with in-place cash flow and a lease-up plan.',
  address: {
    line1: '100 Congress Ave',
    city: 'Austin',
    region: 'TX',
    postalCode: '78701',
    country: 'US',
  },
  financials: {
    askingPrice: 42000000,
    currency: 'USD',
    projectedIrrPercent: 11.2,
    capRatePercent: 6.4,
  },
  createdAt: '2026-01-12T09:00:00Z',
  updatedAt: '2026-04-02T14:15:00Z',
  propertyType: 'office',
  contacts: [
    {
      id: 'ctc_1003a',
      name: 'Morgan Patel',
      role: 'broker',
      email: 'morgan.patel@example.com',
    },
    {
      id: 'ctc_1003b',
      name: 'Riley Nguyen',
      role: 'owner_rep',
      email: 'riley.nguyen@example.com',
      phone: '+1-512-555-0198',
    },
  ],
  primaryContactId: 'ctc_1003b',
  ownership: {
    ownerName: 'Congress Avenue Holdings',
    ownershipPercent: 80,
    notes: 'Co-owner retains a 20 percent residual interest.',
  },
  status: 'under_offer',
};

export const sampleSoldListing: InvestorListing = {
  id: 'lst_ev_1004',
  title: 'South Lamar Retail Strip',
  description: 'Neighborhood retail sold with credit tenants in place.',
  address: {
    line1: '1400 S Lamar Blvd',
    line2: 'Building B',
    city: 'Austin',
    region: 'TX',
    postalCode: '78704',
    country: 'US',
  },
  financials: {
    askingPrice: 8750000,
    currency: 'USD',
    projectedIrrPercent: 9.4,
    capRatePercent: 7.3,
  },
  createdAt: '2025-11-03T11:20:00Z',
  updatedAt: '2026-05-20T18:00:00Z',
  propertyType: 'retail',
  contacts: [
    {
      id: 'ctc_1004',
      name: 'Sam Okonkwo',
      role: 'broker',
      email: 'sam.okonkwo@example.com',
    },
  ],
  primaryContactId: 'ctc_1004',
  ownership: {
    ownerName: 'Lamar Retail LLC',
    ownershipPercent: 60,
  },
  status: 'sold',
  closedAt: '2026-05-18T17:00:00Z',
};

export const sampleArchivedListing: InvestorListing = {
  id: 'lst_ev_1005',
  title: 'Eastside Mixed-Use Warehouse',
  address: {
    line1: '3400 E 5th St',
    city: 'Austin',
    region: 'TX',
    postalCode: '78702',
    country: 'US',
  },
  createdAt: '2025-08-22T08:45:00Z',
  updatedAt: '2026-01-08T12:00:00Z',
  propertyType: 'mixed_use',
  contacts: [
    {
      id: 'ctc_1005',
      name: 'Casey Brooks',
      role: 'owner_rep',
      email: 'casey.brooks@example.com',
    },
  ],
  primaryContactId: 'ctc_1005',
  ownership: {
    ownerName: 'Eastside Yard Co',
    notes: 'Withdrawn from active browse after a change in sponsor plans.',
  },
  status: 'archived',
};

export const sampleInvestorListings: InvestorListing[] = [
  sampleDraftListing,
  samplePublishedListing,
  sampleUnderOfferListing,
  sampleSoldListing,
  sampleArchivedListing,
];
