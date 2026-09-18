# Listing Field Inventory (PREIshare)

Use this table as the source of truth when defining TypeScript types. Field names are suggestions the types may adopt; meanings and shapes are mandatory.

Companion brief: [`docs/domain/investor-listing-domain-brief.md`](./investor-listing-domain-brief.md).

**Required vs optional:** unless a row says otherwise, `yes` means the field must be present for `published`, `under_offer`, and `sold`. `draft` and `archived` may omit nested completeness while still using these field names. Optional fields may be absent in every status.

## Identity and classification

| Field | Meaning | Shape | Required? | Example / allowed values |
| --- | --- | --- | --- | --- |
| id | Stable unique id for the listing | text | yes | `lst_ev_1001` |
| title | Short name shown to investors | text | yes | `Riverfront Multifamily Offering` |
| description | Longer investor-facing summary | text | yes for published+ | `Value-add asset near transit...` |
| status | Lifecycle state | fixed choice | yes | `draft`, `published`, `under_offer`, `sold`, `archived` |
| propertyType | Asset class | fixed choice | yes | `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` |
| createdAt | When the listing record was created | datetime text | yes | `2026-03-01T10:00:00Z` |
| updatedAt | Last meaningful edit | datetime text | yes | `2026-03-15T16:30:00Z` |

`published+` means `published`, `under_offer`, and `sold`.

## Address (nested object)

| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| address.line1 | Street number and name | text | yes | `500 River Rd` |
| address.line2 | Unit/suite (if any) | text | no | `Suite 200` |
| address.city | City | text | yes | `Austin` |
| address.region | State/province/region | text | yes | `TX` |
| address.postalCode | Postal code | text | yes | `78701` |
| address.country | Country code or name | text | yes | `US` |

Address is a nested object, not a single free-text string. `line2` is the only optional address field.

## Financial summary (nested object)

| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| financials.askingPrice | Listed price amount | number | yes | `12500000` |
| financials.currency | Currency code | fixed choice / text code | yes | `USD` |
| financials.projectedIrrPercent | Optional projected IRR | number | no | `12.5` |
| financials.capRatePercent | Optional cap rate | number | no | `5.8` |

`askingPrice` is a numeric amount in the units of `currency` (not a formatted string such as `$12,500,000`). Percent fields are numeric percentages (for example `12.5` means 12.5%), not fractions of 1.

## Investor contacts (list of nested objects)

| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| contacts[].name | Person or firm name | text | yes (each contact) | `Jordan Lee` |
| contacts[].role | Why they appear on the listing | fixed choice | yes | `broker`, `owner_rep` |
| contacts[].email | Email if used | text | one of email/phone required | `jordan@example.com` |
| contacts[].phone | Phone if used | text | one of email/phone required | `+1-512-555-0142` |

Contacts are an array. A valid published listing needs **at least one** contact. Each contact must have a non-empty `name`, a `role` from the closed list above, and **at least one** reachable channel (`email`, `phone`, or both). Empty strings do not count as a reachable channel.

## Ownership (list of nested objects tied to contacts)

| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| ownership[].contactNameOrId | Which contact the row refers to | text | yes | `Jordan Lee` or contact id |
| ownership[].relationship | Relationship to the asset | fixed choice | yes | `primary_owner`, `co_owner`, `broker`, `property_manager` |
| ownership[].sharePercent | Optional ownership share | number | no | `60` |

Each ownership row points at a contact (`contactNameOrId`). `relationship` is a closed list—not free text. `sharePercent` is optional; when present it is a number (for example `60` means 60%).

## Inventory rules (must hold)

1. Do not invent extra top-level groups beyond identity, address, financials, contacts, and ownership without updating the domain brief.
2. Status and propertyType must remain closed lists (union candidates)—never free text.
3. Address and financials are nested objects, not flat optional strings only.
4. Contacts are a list (array); a valid published listing needs at least one contact.
5. Every required field above must appear in later TypeScript interfaces unless the decision record deliberately relaxes it.
