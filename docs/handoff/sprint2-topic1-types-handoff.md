# Sprint 2 Topic 1 — Types Handoff: PREIshare Investor Listings

**Audience:** next sprint topic owners, PREIshare eng, product partners  
**Status:** Topic 1 (TypeScript foundations) complete — implementation topics not started  
**Date:** 2026-09-23

## 1. Client story recap

PREIshare was shipping investor listing data as loose objects and ad-hoc JSON. That let bad data reach production: a missing asking price, status strings spelled several ways, and nested `address` fields that disappeared on some screens. Sprint 2 Topic 1 modeled listings with **strict TypeScript types** so those mistakes fail at **compile time** — while someone is still building — instead of in front of investors. The decisions live in `docs/decisions/ADR-001-investor-listing-types.md`; this page only points at what to read next.

## 2. What we shipped this topic

| Deliverable | Path | Why it matters |
| --- | --- | --- |
| Domain brief | `docs/domain/investor-listing-domain-brief.md` | Lifecycle statuses `draft`, `published`, `under_offer`, `sold`, `archived` and the nested groups (address, financials, contacts, ownership) |
| Field inventory | `docs/domain/listing-field-inventory.md` | Required vs optional fields and shapes the types must honor |
| Types barrel | `src/types/index.ts` | Single import for `InvestorListing`, `InvestorListingBase`, `SoldInvestorListing`, `OpenInvestorListing`, `InvestorContact`, `ContactRole`, `Ownership`, `Address`, `FinancialSummary`, `ListingStatus`, and `PropertyType` |
| Core + nested types | `src/types/investor-listing.ts`, `src/types/listing-status.ts`, `src/types/property-type.ts`, `src/types/address.ts`, `src/types/financial-summary.ts`, `src/types/investor-contact.ts`, `src/types/ownership.ts` | Discriminated `InvestorListing`, closed unions, nested objects. Beginner typecheck notes: `src/types/README.md` |
| Valid fixtures | `src/fixtures/sample-investor-listings.ts` | Five listings, one per status: `sampleDraftListing` (`draft`, `land`), `samplePublishedListing` (`published`, `multifamily`), `sampleUnderOfferListing` (`under_offer`, `office`), `sampleSoldListing` (`sold`, `retail`), `sampleArchivedListing` (`archived`, `mixed_use`) |
| Invalid fixtures + expected errors | `src/fixtures/invalid-listings.errors.ts`, `docs/type-safety/expected-type-errors.md` | Five intentional failures (`invalidStatusSpelling`, `missingAddressCity`, `priceAsString`, `soldWithoutClosedAt`, `contactsNotArray`) |
| Typecheck gate + checklist | `package.json` (`"typecheck": "tsc --noEmit"`), `tsconfig.json`, `docs/type-safety/verification-checklist.md` | Repeatable safety gate |
| Decision record | `docs/decisions/ADR-001-investor-listing-types.md` | Stakeholder-facing type decisions — do not duplicate that table here |

**How to verify locally:** follow `docs/type-safety/verification-checklist.md` and run `npm run typecheck` from the repo root. That script is `"typecheck": "tsc --noEmit"` in `package.json`. Success is finishing with no errors. Valid sources include `src/types/**` and `src/fixtures/sample-investor-listings.ts`. `src/fixtures/invalid-listings.errors.ts` is **excluded on purpose** in `tsconfig.json` because it is meant to fail; do not "fix" it to make the gate green. The intended errors are listed in `docs/type-safety/expected-type-errors.md`.

## 3. What we must NOT claim is done yet

- No TanStack Start UI or listing create/edit forms are built or wired to these types. The app is still the starter Home (`/`) and About (`/about`) screens.
- No Supabase / PostgreSQL tables, migrations, or pgvector work from this model. There is no `src/lib/supabase.ts` and no `supabase/` folder.
- No HTTP API routes, request/response validation at the network boundary, or auth rules. `src/lib/user.ts` `getUser()` is a stub that returns `null`.
- No runtime schema library (for example Zod) is in `package.json`. This topic is compile-time types and fixtures only.
- No production deployment of listing create/edit flows.

Types check the **shape** of data, not whether it is true. The compiler cannot verify that `primaryContactId` points at a contact that exists in `contacts`, that `ownershipPercent` is under 100 (it is only `number | undefined` on `Ownership`), or that `title` is non-empty. Those remain runtime checks for a later topic.

If a demo only shows green typecheck on fixtures, say: **“the data model is typed and verified; product surfaces are next.”**

## 4. Next sprint pickups (use the types — do not reinvent them)

### A. TanStack Start forms (UI)

- Build create/edit listing forms whose field names and option lists match `InvestorListing` and the unions in `src/types/listing-status.ts` (`draft`, `published`, `under_offer`, `sold`, `archived`) and `src/types/property-type.ts` (`multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`).
- Import those types from `src/types/index.ts`. Do not redefine listing shapes or copy status / property-type string literals into components.
- Use `src/fixtures/sample-investor-listings.ts` as realistic form defaults (one example per status).
- Honor the three-branch rules in `src/types/investor-listing.ts`: `published` / `under_offer` require `description`, `financials`, and a non-empty `contacts` list; `sold` also requires `closedAt`. Details: `docs/decisions/ADR-001-investor-listing-types.md`.
- **Acceptance sketch:** a form cannot treat `status` as a free string. A value outside `ListingStatus` (for example `publised`) fails during development the same way `invalidStatusSpelling` does.

### B. Supabase / PostgreSQL schema alignment (data)

- Draft table columns that mirror `InvestorListing` as exported from `src/types/index.ts` — do not invent a second listing shape. Constrain `status` and `propertyType` to the same unions as `ListingStatus` and `PropertyType`.
- Nested `Address` and `FinancialSummary` may become columns or related tables; keep the field names from `src/types/address.ts` and `src/types/financial-summary.ts` (`line1`, `city`, `region`, `postalCode`, `country`, `line2`; `askingPrice`, `currency`, `projectedIrrPercent`, `capRatePercent`).
- Read ADR-001 follow-up 1 before modeling ownership: types use a single `Ownership` object (`ownerName`, `ownershipPercent`, `notes`); the inventory describes a list of rows. Document any TypeScript-optional vs database-NULL difference in a new ADR — do not silently diverge.
- **Acceptance sketch:** a row that would fail `InvestorListing` assignment (missing `address.city`, string `askingPrice`, `status: 'sold'` with no `closedAt`) is also rejected by DB constraints or insert validation.

### C. API boundaries (server)

- Define list/get/create/update request and response shapes that import or compose types from `src/types/index.ts` instead of anonymous JSON. Do not redefine `InvestorListing`.
- Keep write endpoints from accepting free-form status strings. Align with `ListingStatus` (`draft`, `published`, `under_offer`, `sold`, `archived`) and the published-plus completeness rules in `src/types/investor-listing.ts`.
- Add tests that send payloads shaped like `src/fixtures/sample-investor-listings.ts` (valid) and the known-bad cases in `docs/type-safety/expected-type-errors.md` (invalid) at the boundary.
- **Acceptance sketch:** API handlers never widen listing `status` back to plain `string` without an explicit, documented escape hatch.

```text
Client pain (loose JSON)
        |
        v
 Domain brief + field inventory
        |
        v
 Strict TS types + fixtures + typecheck + ADR-001   <-- you are here
        |
        +--> TanStack Start forms (UI)
        +--> Supabase/PostgreSQL schema (data)
        +--> API routes & validation (boundary)
```

## 5. Prompting and review self-assessment

Complete in first person:

- **Prompting habit that helped:**
- **Second prompting habit that helped:**
- **Review habit that caught an agent mistake:**
- **What I would do differently next topic:**
- **Confidence (1–5) explaining InvestorListing to a teammate:**

## 6. Handoff checklist for the next owner

- [ ] Read `docs/decisions/ADR-001-investor-listing-types.md` and this handoff before opening a UI or SQL PR
- [ ] Import listing types from `src/types/index.ts` only — do not copy `InvestorListing` into a new file
- [ ] Keep `npm run typecheck` green on valid sources (`src/types/**`, `src/fixtures/sample-investor-listings.ts`)
- [ ] Do not delete `src/fixtures/invalid-listings.errors.ts`; it is excluded in `tsconfig.json` on purpose and documented in `docs/type-safety/expected-type-errors.md`
- [ ] File a new ADR if product changes `ListingStatus`, `PropertyType`, or required fields on `published` / `under_offer` / `sold`
- [ ] Use `docs/type-safety/verification-checklist.md` as the acceptance gate whenever these types change
