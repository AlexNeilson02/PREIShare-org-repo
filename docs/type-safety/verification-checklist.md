# Investor listing types — verification checklist

Use this list before review. Check each box only when you have evidence.

## A. Domain coverage

- [ ] `InvestorListing` / `InvestorListingBase` in `src/types/investor-listing.ts` include the inventory fields from `docs/domain/listing-field-inventory.md`: `id`, `title`, `description`, `status`, `propertyType`, `createdAt`, `updatedAt`, `address`, `financials`, `contacts`, and `ownership`.
- [ ] `ListingStatus` in `src/types/listing-status.ts` is only `draft`, `published`, `under_offer`, `sold`, and `archived` — the same closed list as `docs/domain/investor-listing-domain-brief.md`.
- [ ] `PropertyType` in `src/types/property-type.ts` is only `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, and `land`.
- [ ] `Address` in `src/types/address.ts` has required `line1`, `city`, `region`, `postalCode`, and `country`, plus optional `line2`. `FinancialSummary` in `src/types/financial-summary.ts` has required `askingPrice` (number) and `currency`, plus optional `projectedIrrPercent` and `capRatePercent`.
- [ ] `InvestorContact` in `src/types/investor-contact.ts` uses `name`, `role` (`broker` | `owner_rep`), and at least one of `email` or `phone`. `Ownership` in `src/types/ownership.ts` is the single object on `InvestorListing.ownership` (`ownerName`, optional `ownershipPercent`, optional `notes`) — compare that to the inventory rows `ownership[].contactNameOrId`, `ownership[].relationship` (`primary_owner`, `co_owner`, `broker`, `property_manager`), and `ownership[].sharePercent` in `docs/domain/listing-field-inventory.md`.

## B. Type safety shape

- [ ] `src/types/index.ts` exports `InvestorListing`, `InvestorListingBase`, `SoldInvestorListing`, `OpenInvestorListing`, `InvestorContact`, `ContactRole`, `Ownership`, `Address`, `FinancialSummary`, `ListingStatus`, and `PropertyType`.
- [ ] `InvestorListing` in `src/types/investor-listing.ts` discriminates on `status`: `draft` | `archived` (no `closedAt`); `published` | `under_offer` (required `description`, `financials`, and a non-empty `contacts` tuple); `sold` (required `closedAt`, plus those published-plus fields). That sold/`closedAt` rule is the one `soldWithoutClosedAt` documents in `docs/type-safety/expected-type-errors.md`.
- [ ] `readonly` is on `id`, `createdAt`, and `updatedAt` in `InvestorListingBase` (`src/types/investor-listing.ts`).

## C. Fixtures

- [ ] `src/fixtures/sample-investor-listings.ts` typechecks and exports five listings: `sampleDraftListing` (`status: 'draft'`, `propertyType: 'land'`), `samplePublishedListing` (`published`, `multifamily`), `sampleUnderOfferListing` (`under_offer`, `office`), `sampleSoldListing` (`sold`, `retail`, `closedAt: '2026-05-18T17:00:00Z'`), and `sampleArchivedListing` (`archived`, `mixed_use`).
- [ ] `src/fixtures/invalid-listings.errors.ts` still has the five intentional failures named in `docs/type-safety/expected-type-errors.md`: `invalidStatusSpelling` (`status: 'publised'`), `missingAddressCity` (no `address.city`), `priceAsString` (`askingPrice: '610000'`), `soldWithoutClosedAt` (`status: 'sold'` with no `closedAt`), and `contactsNotArray` (a single contact object, not an array).
- [ ] The table in `docs/type-safety/expected-type-errors.md` still names those five exports and the same broken fields as the comments in `src/fixtures/invalid-listings.errors.ts` (no stale examples).

## D. Typecheck gate

- [ ] `package.json` defines `"typecheck": "tsc --noEmit"`.
- [ ] `npm run typecheck` from the project root succeeds for valid sources (`src/types/**` and `src/fixtures/sample-investor-listings.ts`).
- [ ] `tsconfig.json` `exclude` lists `src/fixtures/invalid-listings.errors.ts`, so that teaching file is not required to pass the normal gate.
- [ ] `src/types/README.md` has a Typecheck section that names `npm run typecheck`, explains `tsc --noEmit`, says success is finishing with no errors, and points at `src/fixtures/invalid-listings.errors.ts` plus `docs/type-safety/expected-type-errors.md`.

## E. Sign-off

- [ ] I re-ran `npm run typecheck` after the last edit to `tsconfig.json`, `src/types/README.md`, or this checklist.
- [ ] A teammate can run `npm run typecheck` from the repo root using only `src/types/README.md` and this file — no extra scripts or secret flags.
