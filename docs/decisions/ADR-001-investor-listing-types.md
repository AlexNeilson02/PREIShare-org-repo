# ADR-001: Investor listing TypeScript types (PREIshare)

- **Status:** Accepted (Sprint 2, Topic 1)
- **Date:** 2026-09-23
- **Owner:** Alex Neilson (@AlexNeilson02)
- **Related code:** `src/types/index.ts` (barrel export for listing types in this app)

## Context

PREIshare investor listings were previously passed around as loose objects and
ad-hoc JSON. That allowed production bugs such as a missing price, a status
spelled three different ways, or a nested address field that vanished on one
screen. Sprint 2 Topic 1 models the listing domain in strict TypeScript so
invalid shapes fail when the code is compiled — before anyone sees them.

Business inputs that drove the model:

- Domain brief: `docs/domain/investor-listing-domain-brief.md`
- Field inventory: `docs/domain/listing-field-inventory.md`
- Safety evidence: `docs/type-safety/expected-type-errors.md` and
  `docs/type-safety/verification-checklist.md`

## Decision

We adopt a small set of types in `src/types/`, centred on `InvestorListing`,
with supporting types for status, property type, address, financial summary,
investor contacts, and ownership. Everything is re-exported from
`src/types/index.ts`, so other code imports from one path rather than reaching
into individual files. This is not a separate npm package; it lives in the
single-package app (`package.json` name `preishare-org-repo`).

`src/types/index.ts` exports exactly these eleven names:
`InvestorListing`, `InvestorListingBase`, `SoldInvestorListing`,
`OpenInvestorListing`, `InvestorContact`, `ContactRole`, `Ownership`,
`Address`, `FinancialSummary`, `ListingStatus`, and `PropertyType`.

`SoldInvestorListing` is `Extract<InvestorListing, { status: 'sold' }>`.
`OpenInvestorListing` is `Exclude<InvestorListing, { status: 'sold' }>`.

## Type choices mapped to business rules

| Business rule (plain language) | Type choice | Why this shape |
| --- | --- | --- |
| A listing's workflow state may only be one of five known values | `ListingStatus` in `src/types/listing-status.ts` is a string union of `draft`, `published`, `under_offer`, `sold`, `archived` — not `string` | A plain `string` allows typos. A misspelled status such as `publised` fails the build instead of quietly breaking filters. |
| Property category is a closed list | `PropertyType` in `src/types/property-type.ts` is a string union of `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` — not `string` | Same reason as status — a fixed vocabulary the compiler can check. |
| Address fields travel together and must be complete enough to locate a property | Nested `Address` in `src/types/address.ts`: required `line1`, `city`, `region`, `postalCode`, `country`; optional `line2`. `address` is required on `InvestorListingBase` for every status | Stops half-present addresses. A listing either has a usable location or it does not compile (`missingAddressCity` omits `city`). |
| Money is structured data, not a formatted string | Nested `FinancialSummary` in `src/types/financial-summary.ts`: required `askingPrice: number` and `currency: string`; optional `projectedIrrPercent?: number` and `capRatePercent?: number` | `'610000'` or `"$12,500,000"` cannot be sorted or compared. Percent fields are numbers, so `5.8` means 5.8%, not a fraction of 1. `currency` is a string (example `USD`), not a closed union. |
| A listing has people attached, each reachable | `contacts` is `InvestorContact[]`. Each `InvestorContact` has `id: string`, `name: string` (not `fullName`), `role: ContactRole`, and at least one of `email` or `phone` (`InvestorContact` is a union: `{ email: string; phone?: string }` or `{ phone: string; email?: string }`) | Contacts are structured records, not a text blob. `ContactRole` is only `broker` or `owner_rep`. Email is not always required; phone is not merely optional. |
| One contact is the main point of contact | `primaryContactId: string` on `InvestorListingBase`, referring to a contact's `id` | A single field means there can only ever be one primary. Types do not check that the id exists in `contacts`. |
| Every listing records who owns the property | `ownership: Ownership` (one object, not an array) with required `ownerName`, optional `ownershipPercent?: number` and `notes?: string` | The owner is named directly, so an entity like an LLC can be recorded without being a contact. |
| A listing that is sold must record when it sold | `InvestorListing` is a discriminated union on `status`. The `sold` branch requires `closedAt: string`. The `draft` / `archived` and `published` / `under_offer` branches set `closedAt?: undefined` | A sold listing with no close date (`soldWithoutClosedAt`), or a draft with one, both fail to compile. |
| Published listings must be complete; drafts may not be | Three branches in `src/types/investor-listing.ts` (this is on the branch; PR #21 `Require published-plus listing description, financials, and contacts` is an ancestor). `draft` / `archived` keep `description?`, `financials?`, and `contacts: InvestorContact[]`. `published` / `under_offer` require `description: string`, `financials: FinancialSummary`, and `contacts: [InvestorContact, ...InvestorContact[]]`. `sold` requires those three plus `closedAt: string` | Matches the brief: drafts and archived listings may hold incomplete data while editors work; `published`, `under_offer`, and `sold` must be trustworthy. |
| A listing's identity is not rewritten by ordinary code | `readonly` on `id`, `createdAt`, and `updatedAt` in `InvestorListingBase`. `title`, `address`, `financials`, `contacts`, and `ownership` are not `readonly` | Signals that those three fields are set once. Business fields stay editable. |

## Alternatives considered

1. **Keep listings as untyped JSON.** Rejected. Fastest in the short term, but
   every mistake becomes a runtime bug in front of an investor.

2. **One flat interface with everything optional.** Rejected. Marking fields
   optional "to be safe" recreates the missing-price bug, and flattening the
   address hides the fact that those fields belong together.

3. **A single `status: ListingStatus` field instead of a discriminated union.**
   Rejected. That would make `closedAt` optional on every status, so the
   compiler could not enforce "sold listings have a close date," and could not
   require `description` / `financials` / a non-empty `contacts` list only on
   `published`, `under_offer`, and `sold`.

4. **TypeScript `enum` for the closed lists.** Not used. String unions read more
   clearly in fixtures and error messages and disappear entirely at runtime.
   Worth revisiting only if a runtime enum object becomes genuinely necessary.

5. **A runtime validation library such as Zod as the source of truth.** Out of
   scope for this topic. Compile-time types and fixtures come first; runtime
   validators can mirror these decisions later. No Zod (or other validator)
   dependency is in `package.json`.

## Consequences

**Positive**

- `src/fixtures/sample-investor-listings.ts` holds five realistic listings, one
  per status: `sampleDraftListing` (`draft`, `land`), `samplePublishedListing`
  (`published`, `multifamily`), `sampleUnderOfferListing` (`under_offer`,
  `office`), `sampleSoldListing` (`sold`, `retail`, `closedAt:
  '2026-05-18T17:00:00Z'`), and `sampleArchivedListing` (`archived`,
  `mixed_use`).
- `src/fixtures/invalid-listings.errors.ts` holds five deliberately broken
  listings proving the compiler rejects bad data: `invalidStatusSpelling`
  (`status: 'publised'`), `missingAddressCity` (no `address.city`),
  `priceAsString` (`askingPrice: '610000'`), `soldWithoutClosedAt` (`status:
  'sold'` with no `closedAt`), and `contactsNotArray` (one contact object
  instead of an array). Each is documented in
  `docs/type-safety/expected-type-errors.md`.
- `package.json` defines `"typecheck": "tsc --noEmit"`. That is the shared gate.
  `tsconfig.json` excludes `src/fixtures/invalid-listings.errors.ts` so the
  teaching file can stay in the repo without blocking the build.

**Tradeoffs**

- Authors must use exact union values (`under_offer`, not `under offer` or
  `UNDER_OFFER`). "Almost right" statuses fail on purpose.
- Fixtures and future API mappers must supply a whole `Address` object (and, on
  published-plus statuses, a whole `FinancialSummary` and a non-empty
  `contacts` tuple), not scattered fields.
- The three-branch discriminated union adds a small learning curve in exchange
  for rules the compiler enforces rather than rules people have to remember.

**What types cannot do**

Worth stating plainly for non-engineers: types check the *shape* of data, not
whether it is true. The compiler cannot confirm that `primaryContactId` points
at a contact that actually exists in `contacts`, that `ownershipPercent` is not
`150` (it is only `number | undefined`), or that `title` is not an empty
string. Those remain runtime checks.

## Out of scope for Sprint 2 Topic 1

- Database tables, migrations, or Supabase row types
- HTTP API routes and runtime request/response validation
- React form components and client-side validation
- Authentication, authorisation, and multi-tenant rules
- pgvector or search indexing
- Any production deployment or data change

## Follow-ups (for the next topic / implementers)

1. **Known mismatch between the inventory and the types.**
   `docs/domain/listing-field-inventory.md` describes ownership as a *list* of
   rows with `contactNameOrId`, `relationship` (a closed list of
   `primary_owner`, `co_owner`, `broker`, `property_manager`), and an optional
   `sharePercent`. The implemented `Ownership` in `src/types/ownership.ts` is a
   single object with `ownerName`, `ownershipPercent`, and `notes`. The types
   are authoritative today. Product should decide which model is correct before
   ownership data is collected, since the list version can express co-ownership
   splits and the single object pushes them into free-text `notes`.
2. Import domain types from `src/types/index.ts` when building UI or API layers
   rather than redefining shapes.
3. Keep `src/fixtures/sample-investor-listings.ts` passing under
   `npm run typecheck` before expanding the model.
4. If product adds a listing status or property type, extend the **union** in
   `src/types/listing-status.ts` or `src/types/property-type.ts` and update the
   fixtures and this ADR. Do not widen the field back to `string`.
5. Add runtime validation for the rules types cannot reach, listed under "What
   types cannot do" above, once API boundaries exist.
6. Use `docs/type-safety/verification-checklist.md` as the acceptance gate
   whenever these types change.

## Evidence links

- Domain brief: `docs/domain/investor-listing-domain-brief.md`
- Field inventory: `docs/domain/listing-field-inventory.md`
- Expected compile errors: `docs/type-safety/expected-type-errors.md`
- Verification checklist: `docs/type-safety/verification-checklist.md`
- Valid fixtures: `src/fixtures/sample-investor-listings.ts`
- Invalid fixtures: `src/fixtures/invalid-listings.errors.ts`
- Types entrypoint: `src/types/index.ts`
- Listing union: `src/types/investor-listing.ts`
