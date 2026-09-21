# Investor Listing Domain Brief (PREIshare)

## Purpose

Define what an **investor listing** is in PREIshare business language so TypeScript types in later steps match real workflows—not invented fields.

PREIshare needs listing data the whole team can trust. Loose objects and ad-hoc JSON let bugs slip into production: a missing price, a status spelled three different ways, or a nested address field that vanishes on one screen. This brief is the shared definition those later types must honor. Types, fixtures, and a decision record come after this document and the companion field inventory.

## Actors

- **Listing editor (internal ops)** — creates and updates listings before investors see them.
- **Investor (end user)** — browses published listings and relies on complete, consistent data.
- **Reviewer / compliance** — checks that status, price, and contact info are trustworthy before publish.
- **Future systems** — website UI, API, and database will all read the same listing shape.

## Business goals

- One shared definition of a listing across screens and teammates.
- Catch missing or invalid data before production (at compile time once types exist).
- Support nested real-world data: address, financial summary, investor contacts, ownership.

## Listing lifecycle statuses (allowed values only)

Status is a closed list. Free-text variants (`Published`, `under offer`, `UNDER_OFFER`) are invalid.

| Status | Meaning |
| --- | --- |
| `draft` | Internal only; not visible to investors. Incomplete nested data is allowed while editors work. |
| `published` | Visible to investors; must meet full validity rules. |
| `under_offer` | Active interest; still structured like a published listing. |
| `sold` | Closed deal; retained for history. Same completeness as published. |
| `archived` | Removed from active browse; not deleted. |

## Nested data groups

- **Address** — street line(s), city, region/state, postal code, country.
- **Financial summary** — asking price, currency, optional projected return metrics the team agrees to track (projected IRR and cap rate).
- **Investor contacts** — one or more people tied to the listing (name, role, email or phone).
- **Ownership** — how contacts relate to the asset (for example primary owner, co-owner, broker) and optional ownership share.

Do not add other top-level groups without updating this brief and `docs/domain/listing-field-inventory.md`.

## Core identity fields (high level)

- Stable listing id
- Human-readable title
- Property type (fixed set: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`)
- Status (from the lifecycle list above)
- Short description for investors
- Created/updated timestamps (as business concepts; wire format is ISO-8601 UTC in the field inventory)

Field names, shapes, and required-vs-optional rules live in the companion inventory.

## Success criteria — “a valid investor listing”

1. Has a non-empty id and title.
2. Status is exactly one of the allowed lifecycle values (no free-text variants).
3. Property type is exactly one of the allowed property-type values.
4. Address includes enough fields to locate the property (street, city, region/state, postal code, country).
5. Financial summary includes a numeric asking price and a currency code.
6. At least one investor contact with a name and a reachable channel (email or phone).
7. Ownership relationship for each contact is from an agreed fixed set (not free text).
8. Optional fields may be absent; required fields above must never be missing for `published`, `under_offer`, or `sold`.

`draft` and `archived` may hold incomplete nested data while editors work or after a listing leaves active browse. Types in later steps should still use the same field names; they must not invent alternate status strings to represent “incomplete.”

## Out of scope for this topic

- Building UI forms, API routes, or database tables.
- Authentication, payments, or document uploads.
- Exact TypeScript syntax (comes in later steps).

## Handoff note

Later steps must implement types that honor this brief and the companion field inventory at [`docs/domain/listing-field-inventory.md`](./listing-field-inventory.md). If a type allows a status or field not listed here, the type is wrong.
