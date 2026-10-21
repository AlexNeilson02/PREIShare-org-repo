# Property Listings Data Model & Auth Boundaries

## 1. Purpose

This document describes the first `property_listings` table and who may touch
which rows. It is a design note for the migration step that follows. There is
no `CREATE TABLE` here. Fields stay inside what
[`docs/requirements/sponsor-auth-and-listings-brief.md`](../requirements/sponsor-auth-and-listings-brief.md)
and [`docs/domain/listing-field-inventory.md`](../domain/listing-field-inventory.md)
already name: identity, address, asking price, status, timestamps, plus
`owner_id` so a signed-in sponsor only sees their own rows.

## 2. Entity: property_listings

| Column | Type (Postgres) | Nullable | Notes |
|--------|-----------------|----------|-------|
| `id` | `uuid` | no | Primary key. Default `gen_random_uuid()`. |
| `owner_id` | `uuid` | no | FK to `auth.users(id)`. The signed-in sponsor. Not supplied by the client on insert. |
| `title` | `text` | no | Short name shown on the listing. |
| `description` | `text` | yes | Longer summary. Domain inventory allows this to be incomplete on `draft`. |
| `address_line1` | `text` | yes | Street number and name (`address.line1`). |
| `address_line2` | `text` | yes | Unit/suite (`address.line2`). Optional in the inventory. |
| `address_city` | `text` | yes | City. |
| `address_region` | `text` | yes | State / province / region. |
| `address_postal_code` | `text` | yes | Postal code. |
| `address_country` | `text` | yes | Country code or name. |
| `price` | `numeric` | yes | Asking price amount (`financials.askingPrice`). Numeric, not a formatted string. |
| `status` | `text` | no | Lifecycle state. Closed set — see section 7 before the migration locks this. |
| `created_at` | `timestamptz` | no | Default `now()`. |
| `updated_at` | `timestamptz` | no | Default `now()`. Updated on each write. |

Address columns are flattened for this first table so a sponsor form can map
1:1. They are the same fields as the nested `address` object in the field
inventory, not a single free-text blob.

### Recommended indexes

- Primary key on `id`.
- Index on `owner_id` (every sponsor list filters by owner).
- Index on `(owner_id, status)` if list views filter by status.

### Out of scope this sprint

Do not add these until the domain inventory is explicitly in scope for the
table: `propertyType`, nested `financials.currency` / IRR / cap rate, contacts
array, ownership array, or extra top-level groups. Admin CRUD for other
users’ listings stays out (requirements brief). Investor dashboard mock data
(`demoMetrics`, `MOCK_PORTFOLIO_HOLDINGS`, `MOCK_RECENT_ACTIVITY`) is unrelated
to this table.

## 3. Ownership model

Every row must have `owner_id` set to the signed-in sponsor’s
`auth.users.id`. The foreign key should `ON DELETE CASCADE` so deleting the
auth user removes their listings (no orphan `owner_id`).

The client never sends `owner_id` on insert. The session (or a server
function that reads the session) sets it. A WITH CHECK policy (section 4)
rejects a row whose `owner_id` is not `auth.uid()`.

## 4. Proposed Row Level Security (RLS) — plain language

Enable RLS on `property_listings`. Logged-out users (`auth.uid()` is null)
match no policy and get no rows. The service-role key bypasses RLS entirely;
it must stay server-only (`SUPABASE_SERVICE_ROLE_KEY` in `.env.example`).

| Policy name | Command | Who | Rule |
|-------------|---------|-----|------|
| `listings_select_own` | `SELECT` | Signed-in sponsor | `USING (owner_id = auth.uid())` |
| `listings_insert_own` | `INSERT` | Signed-in sponsor | `WITH CHECK (owner_id = auth.uid())` so a sponsor cannot create a listing owned by someone else |
| `listings_update_own` | `UPDATE` | Signed-in sponsor | `USING (owner_id = auth.uid())` and `WITH CHECK (owner_id = auth.uid())` so they cannot reassign ownership |
| `listings_delete_own` | `DELETE` | Signed-in sponsor | `USING (owner_id = auth.uid())` |

No policy for the anon role without a session. Public investor browse of
`published` listings is not in this sprint.

## 5. Server vs browser operation map

Every browser row uses the anon key (`VITE_SUPABASE_ANON_KEY`) plus the
user’s session. Nothing in the browser uses the service role key.

| Operation | Runs where | Client type | Notes |
|-----------|------------|-------------|-------|
| Sign in / sign out | Browser talks to Supabase Auth; session cookie or tokens handled per Start patterns | Anon key + user session | No service role. Header/nav stay presentational. |
| Session check on protected listing routes | Server loader or `createServerFn`, or a browser client that sends the user JWT | Anon key + user session | Unauthenticated visitors do not see listing management (brief success criteria). |
| List my listings | Browser or server function using the user session | Anon key + user session | RLS `SELECT` returns only `owner_id = auth.uid()`. |
| Create listing | Same | Anon key + user session | Server (or trigger) sets `owner_id` from `auth.uid()`. INSERT WITH CHECK blocks another owner. |
| Update listing | Same | Anon key + user session | RLS limits to own rows. Cannot change `owner_id`. |
| Admin / privileged tasks (schema, backfill, bypass RLS) | Server only | Service role (`SUPABASE_SERVICE_ROLE_KEY`) | Never imported by a React component. Never a `VITE_*` name. |

## 6. Acceptance checks for the next (migration) step

Unchecked on purpose. Fill these when the SQL migration is written.

- [ ] Table `property_listings` exists with the columns in section 2 (no extra groups from the out-of-scope list).
- [ ] `id` is uuid PK; `owner_id` is uuid NOT NULL FK to `auth.users(id)` with the agreed ON DELETE behavior.
- [ ] RLS is enabled; the four policies in section 4 exist.
- [ ] A signed-in sponsor can SELECT/INSERT/UPDATE/DELETE only their rows.
- [ ] An insert that sets `owner_id` to another user’s id is rejected.
- [ ] Logged-out requests return no listing rows.
- [ ] Status values agreed in section 7 match `src/types/listing-status.ts` or that file is updated in the same change.
- [ ] Migration does not embed the service role key. `.env.example` names stay placeholders.
- [ ] `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile` still load.

## 7. Open questions (resolve before or during migration)

- **Status set vs TypeScript:** `src/types/listing-status.ts` is a closed union of `draft`, `published`, `under_offer`, `sold`, `archived`. This table’s `status` column should match those five values, or use a shorter set — and if shorter, the TypeScript union must change in the same step. Otherwise the existing type and the database will disagree.
- **Enum vs check:** should `status` be a Postgres enum or `text` with a check constraint listing the allowed strings?
- **Soft delete vs hard delete:** `archived` already exists in the TypeScript union as a lifecycle state. Is DELETE a hard delete of the row, or should “remove” only set `status = 'archived'`?
- **Investor vs sponsor:** the dashboard Header and nav are still investor-facing. Is `owner_id` a sponsor auth user, an investor, or both? Do not assume they are the same person.
- **Price currency:** the inventory requires `financials.currency` with `askingPrice`. This first table only has `price`. Is currency deferred, or required before the first insert?
