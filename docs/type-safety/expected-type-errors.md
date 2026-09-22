# Expected type errors (invalid listing fixtures)

`src/fixtures/invalid-listings.errors.ts` is **meant to fail** typechecking. The five exports below are teaching examples, not broken product data. **Do not "fix" that file** to make `npx tsc --noEmit` pass. If those errors disappear, the safety net is weaker, not stronger.

Each row is one export. Everything else on that listing is valid on purpose, so the compiler points at a single problem.

| Fixture name | What's wrong in business terms | Which type rule catches it | Expected error kind |
| --- | --- | --- | --- |
| `invalidStatusSpelling` | The listing status is spelled `publised` instead of `published`. Ops and the website would not know which lifecycle state this is. | Status may only be `draft`, `published`, `under_offer`, `sold`, or `archived` — no free-text or typos. | Wrong allowed value (unknown status string) |
| `missingAddressCity` | The address has a street, region, postal code, and country, but no city. Investors could not locate the property. | Every address must include `city`. | Missing required field |
| `priceAsString` | The asking price is written as the text `'610000'` instead of the number `610000`. Screens and math cannot treat that as money reliably. | `financials.askingPrice` must be a number, not formatted text. | Wrong kind of value (text where a number is required) |
| `soldWithoutClosedAt` | The listing is marked sold (a closed deal) but has no close date. History and reporting would not know when it sold. | A `sold` listing must include `closedAt`. Other statuses must not. | Missing required field on the sold status |
| `contactsNotArray` | Contacts are stored as one person object instead of a list. A listing can have more than one contact, and the primary contact id has to point into that list. | `contacts` must be a list of contacts, not a single contact. | Wrong shape (one object where a list is required) |
