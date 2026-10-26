# PREIshare — Data model and RLS policy matrix

## Purpose

This is the review matrix for sponsor identity and listing ownership. It
records the **implemented** `public.property_listings` table (already created
and migrated) and a **proposed** `public.profiles` table that does not exist
yet.

The listings table is `public.property_listings`. This document does not
rename it to `properties`, does not add a second listings table, and does not
invent columns or status values beyond
[`supabase/migrations/20250321000000_property_listings.sql`](../supabase/migrations/20250321000000_property_listings.sql).

The policy matrix describes **intended enforcement** for the Data API when
requests run as `anon` or `authenticated`. It is not a claim about current
app runtime behavior. See the honest note under [RLS posture](#rls-posture).

## Source requirements

There is no `docs/sponsor-auth-requirements.md` in this tree. Sponsor-facing
actions below are taken from
[`docs/requirements/sponsor-auth-and-listings-brief.md`](requirements/sponsor-auth-and-listings-brief.md).

Also read, and not restated as a second design:

- [`supabase/migrations/20250321000000_property_listings.sql`](../supabase/migrations/20250321000000_property_listings.sql) — source of truth for columns, types, nullability, index, trigger, CHECK, and the four implemented listing policies
- [`docs/data-model/property-listings-schema.md`](data-model/property-listings-schema.md) — earlier design note that the migration followed
- [`docs/data-model/rls-policy-review.md`](data-model/rls-policy-review.md) — review that the four `listings_*_own` policies match that design
- [`docs/verification/sprint4-auth-listings-checklist.md`](verification/sprint4-auth-listings-checklist.md) — verification evidence, including R5 and G4 (service-role bypass on app queries)

## Actors and identities

| Actor | How identity is established | Notes |
|-------|-----------------------------|-------|
| Anonymous visitor | No Supabase session. `auth.uid()` is null. | Must not read or write sponsor listings. There is no policy for `anon` or `public` on `property_listings`. Do not add one. |
| Sponsor | Supabase Auth user. `auth.uid()` is their `auth.users.id`. | May manage only rows they own (`property_listings.owner_id = auth.uid()`; proposed `profiles.id = auth.uid()`). |
| Service role | Secret key on the server only (`SUPABASE_SERVICE_ROLE_KEY`). Never a `VITE_*` name, never in the browser. | Bypasses every policy in this matrix. Use only for privileged server work (schema, backfill), not for sponsor listing CRUD that should be subject to RLS. |

## Tables

### profiles (sponsor linkage)

**Proposed — not implemented.** There is no `public.profiles` table, no
migration, and no RLS policy for it in this repository.

Purpose: a 1:1 sponsor row keyed to the Auth user so the app can store a
display name without treating `auth.users` as an application table.

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | `uuid` | yes | Primary key. Equal to `auth.users.id` (FK to that id). |
| `display_name` | `text` | yes | Sponsor-facing name. |
| `created_at` | `timestamptz` | yes | Default `now()`. |

How this row is created (database trigger on signup versus an app path on
first login) is still open. See [Open questions for review](#open-questions-for-review).

### property_listings (listings owned by a sponsor)

**Implemented.** Table `public.property_listings` already exists in
[`supabase/migrations/20250321000000_property_listings.sql`](../supabase/migrations/20250321000000_property_listings.sql).
Do not rename it. Do not design a second listings table.

The migration also creates the `pgcrypto` extension so `gen_random_uuid()` is
available. RLS is enabled on this table. The migration adds no `GRANT`
statements and does not mention the service role key.

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | `uuid` | yes | Primary key. Default `gen_random_uuid()`. |
| `owner_id` | `uuid` | yes | **RLS hinge.** `not null`, references `auth.users (id)` `on delete cascade`. Must equal the signed-in sponsor’s `auth.uid()`. The client must not supply this value; the session (or a server function that reads the session) sets it. |
| `title` | `text` | yes | Short name shown on the listing. |
| `description` | `text` | no | Longer summary. Nullable in the migration. |
| `address_line1` | `text` | no | Street number and name. Flattened from domain `address.line1`. |
| `address_line2` | `text` | no | Unit/suite. Flattened from domain `address.line2`. |
| `address_city` | `text` | no | City. Flattened from domain `address.city`. |
| `address_region` | `text` | no | State / province / region. Flattened from domain `address.region`. |
| `address_postal_code` | `text` | no | Postal code. Flattened from domain `address.postalCode`. |
| `address_country` | `text` | no | Country code or name. Flattened from domain `address.country`. |
| `price` | `numeric` | no | Asking price amount (domain `financials.askingPrice`). Numeric, not a formatted string. Currency is not a column on this table. |
| `status` | `text` | yes | Lifecycle state. Closed set enforced by `property_listings_status_check`: `draft`, `published`, `under_offer`, `sold`, `archived`. Same five strings as `src/types/listing-status.ts`. Not a Postgres enum. |
| `created_at` | `timestamptz` | yes | Default `now()`. |
| `updated_at` | `timestamptz` | yes | Default `now()`. Set to `now()` on every row update by the trigger below. |

**Index (implemented):** `property_listings_owner_id_idx` on
`public.property_listings (owner_id)`.

**Trigger (implemented):** function `public.set_updated_at()` returns the row
with `new.updated_at = now()`. Trigger `set_property_listings_updated_at`
runs `before update` on `public.property_listings` `for each row` and
executes that function.

**CHECK constraint (implemented):** `property_listings_status_check` requires
`status in ('draft', 'published', 'under_offer', 'sold', 'archived')`.

## RLS posture

- RLS must be enabled on every table before relying on the API.
- No broad `USING (true)` policies. No `WITH CHECK (true)` either.
- Browser clients use the anon key only (`VITE_SUPABASE_ANON_KEY`), never the
  service role.
- Logged-out visitors match no policy and get no rows. Do not add an `anon`
  policy on listings to “make the API work.”
- The service role bypasses RLS at the platform level. It stays server-only
  (`SUPABASE_SERVICE_ROLE_KEY`, never `VITE_*`).

**Honest note:** `src/server/listings.ts` currently queries with the
service-role client, which bypasses every policy in this matrix. The policies
are correct but are not in force on the app’s reads and writes today — see
checklist rows R5 and G4. This matrix describes the intended enforcement, not
the current runtime behavior.

## RLS policy matrix

| Table | Operation | Who | Rule (plain English) | Intended SQL shape |
|-------|-----------|-----|----------------------|--------------------|
| `profiles` | Anonymous access | Anonymous visitor | No session. Must not read or write any profile row. | **Proposed.** No policy for `anon` or `public`. Not `USING (true)`. |
| `profiles` | SELECT | Sponsor (`authenticated`) | A signed-in sponsor may read only their own linkage row. | **Proposed.** `TO authenticated` `USING (id = auth.uid())`. |
| `profiles` | INSERT | Sponsor (`authenticated`) | A signed-in sponsor may create only a row whose `id` is their own Auth id. | **Proposed.** `TO authenticated` `WITH CHECK (id = auth.uid())`. |
| `profiles` | UPDATE | Sponsor (`authenticated`) | A signed-in sponsor may change only their own row and cannot reassign `id`. | **Proposed.** `TO authenticated` `USING (id = auth.uid())` `WITH CHECK (id = auth.uid())`. |
| `profiles` | DELETE | Sponsor (`authenticated`) | A signed-in sponsor may delete only their own linkage row, if delete is offered at all. | **Proposed.** `TO authenticated` `USING (id = auth.uid())`. Whether the app should delete this row is still open (see signup/first-login question). |
| `property_listings` | Anonymous access | Anonymous visitor | No session. Must not read or write sponsor listings. Public investor browse of `published` rows is not in this sprint. | **Implemented** by omission: no policy for `anon` or `public`. Not `USING (true)`. |
| `property_listings` | SELECT | Sponsor (`authenticated`) | A signed-in sponsor sees only listings they own. | **Implemented** as `listings_select_own`: `TO authenticated` `USING (owner_id = auth.uid())`. |
| `property_listings` | INSERT | Sponsor (`authenticated`) | A signed-in sponsor may insert only a row they own. They cannot create a listing for another user. | **Implemented** as `listings_insert_own`: `TO authenticated` `WITH CHECK (owner_id = auth.uid())`. |
| `property_listings` | UPDATE | Sponsor (`authenticated`) | A signed-in sponsor may change only their own rows and cannot reassign `owner_id`. | **Implemented** as `listings_update_own`: `TO authenticated` `USING (owner_id = auth.uid())` `WITH CHECK (owner_id = auth.uid())`. |
| `property_listings` | DELETE | Sponsor (`authenticated`) | A signed-in sponsor may hard-delete only their own rows. Soft-delete via `status = 'archived'` is a separate, unresolved product choice. | **Implemented** as `listings_delete_own`: `TO authenticated` `USING (owner_id = auth.uid())`. |

Service role is not a matrix row. It is not granted by these policies; it
bypasses them.

## Requirement → design mapping

Requirements are quoted or paraphrased from
[`docs/requirements/sponsor-auth-and-listings-brief.md`](requirements/sponsor-auth-and-listings-brief.md)
(the sponsor-auth brief in this tree). “Satisfied by” points at a column or a
matrix row. Where a requirement depends on RLS, satisfaction is **intended**;
app listing RPCs still use the service-role client today (checklist R5, G4).

| Requirement | Satisfied by |
|-------------|--------------|
| Sponsor: “Sign in and manage property listings that belong to them.” | Actor **Sponsor** (`auth.uid()`). Ownership hinge `property_listings.owner_id`. Matrix rows `listings_select_own`, `listings_insert_own`, `listings_update_own`, `listings_delete_own`. |
| Unauthenticated visitor: “Reach public pages only. Must not reach sponsor listing management or see another sponsor’s listings.” | Actor **Anonymous visitor**. Matrix row **Anonymous access** on `property_listings` (no `anon` policy). Route gating is an app concern; this matrix only denies listing rows. |
| System (server): “Hold the session and privileged database access. Never put the service-role key or a privileged database URL in the browser bundle.” | Actor **Service role**. [RLS posture](#rls-posture): browser uses the anon key only. |
| Goal: “Sign a sponsor in and keep a server-side session.” | Actor **Sponsor**: identity is `auth.uid()`. Session storage is an app concern; RLS reads that uid. Proposed `profiles.id` equals that same id. |
| Goal: “Let a signed-in sponsor view … property listings.” | `listings_select_own` (`USING (owner_id = auth.uid())`). List columns: `title`, flattened `address_*`, `price`, `status`, timestamps. |
| Goal: “… maintain property listings (create …).” | `listings_insert_own` (`WITH CHECK (owner_id = auth.uid())`). `owner_id` is set from the session, not from the client. |
| Goal: “… maintain property listings (… update).” | `listings_update_own` (`USING` and `WITH CHECK` both `owner_id = auth.uid()`). Same listing columns as create. |
| Success: “An unauthenticated visitor cannot open sponsor listing management (they are sent to sign-in or see a signed-out state).” | Matrix **Anonymous access** on `property_listings` (no read, no write). Sign-in redirect is app routing; this matrix does not grant listing rows without a session. |
| Success: “A sponsor can sign in and reach a listings view.” | Actor **Sponsor** plus `listings_select_own`. |
| Success: “A signed-in sponsor can create … a property listing and see it in the list after save.” | `listings_insert_own` then `listings_select_own`. After save, the new row is visible only because `owner_id = auth.uid()`. |
| Success: “A signed-in sponsor can … update a property listing and see it in the list after save.” | `listings_update_own` then `listings_select_own`. |
| Success: “Listing fields follow `docs/domain/` (no invented listing shape).” | Implemented columns on `property_listings`: identity (`id`, `title`, `description`, `status`, timestamps), six flattened address columns, `price`. Extra inventory groups stay out of this table (see [Out of scope](#out-of-scope-this-sprint)). |
| Success: “Existing `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile` still load.” | No schema change to those routes. Investor shell is unchanged. Proposed `profiles` is not a rewrite of `/dashboard/profile`. |
| Success: “No service-role key appears in the client bundle or a committed `.env`.” | Actor **Service role** and [RLS posture](#rls-posture): never `VITE_*`, never in the browser. |
| Success: “`.env.example` documents the required variable **names** without real values.” | Env names only: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Not a table column. |
| Server-only boundary: Supabase service role key and privileged database URLs stay off `VITE_*` and out of React components. | Actor **Service role**. [RLS posture](#rls-posture). |
| Client-safe: project URL and anon key may be `VITE_*`. “The anon key is not a bypass. It still depends on row-level security.” | [RLS posture](#rls-posture): RLS on before relying on the API; no `USING (true)`; browser uses the anon key plus the user session so `auth.uid()` policies apply. |
| Another sponsor must not see or change listings they do not own (implied by “listings that belong to them” and “must not … see another sponsor’s listings”). | `listings_select_own`, `listings_update_own`, `listings_delete_own` (and insert `WITH CHECK`) all hinge on `owner_id = auth.uid()`. |

## Out of scope this sprint

- Renaming `property_listings`, adding a second listings table, or inventing
  columns / status values that are not in the migration
- Creating `profiles` (this file only proposes it)
- Writing new migration SQL or changing anything under `supabase/`
- Public / anonymous read of `published` listings
- Admin CRUD for other users’ listings
- Live investor portfolio balances, holdings loaders, and recent-activity
  feeds
- Payments, subscriptions, e-sign, documents vault, tax exports, charts
- Domain groups not on the migrated table: `propertyType`, nested
  `financials.currency` / IRR / cap rate, contacts, ownership
- Treating investor and sponsor as the same role, or relabeling the investor
  Header / nav / widgets
- Granting `USING (true)` (or any `anon` listing policy) so the Data API
  “just works”

## Open questions for review

- **How is `profiles` created?** Database trigger on Auth signup, or an app
  path on first login? The table is proposed only; this choice is not made.
- **DELETE versus soft-delete via `status = 'archived'`.** The migration
  already has both: policy `listings_delete_own` (hard delete of the row) and
  CHECK-allowed status `archived`. Which one is “remove” for a sponsor? Both
  exist today.
- **Investor vs sponsor (still open in the brief).** `owner_id` is an
  `auth.users` id described as a sponsor. The dashboard Header and nav are
  still investor-facing. Do not assume they are the same person.
- **Price currency.** The field inventory wants `financials.currency` next to
  asking price. This table only has `price`. Currency stays deferred.

## Ready for Step 6 when

- Reviewers accept that `public.property_listings` is the only listings table,
  already migrated, and will not be renamed or duplicated.
- Reviewers accept `profiles` as **proposed only** (three columns above; no
  SQL in this step).
- The two required open questions (`profiles` creation path; DELETE vs
  `archived`) are answered or explicitly deferred.
- Implementers agree that listing reads and writes must use the anon key plus
  the sponsor JWT before this matrix can be treated as runtime enforcement
  (checklist R5, G4). Until then, the four `listings_*_own` policies are
  correct in the database and unused by `src/server/listings.ts`.
- No one plans an anonymous listing SELECT or a `USING (true)` policy.
