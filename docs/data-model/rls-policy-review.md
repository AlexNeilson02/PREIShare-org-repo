# RLS policy review — `property_listings`

Review of
[`supabase/migrations/20250321000000_property_listings.sql`](../../supabase/migrations/20250321000000_property_listings.sql)
against
[`docs/data-model/property-listings-schema.md`](./property-listings-schema.md).
This file is a review, not a second migration.

## Migration file

Path (filename is fixed, including the timestamp):

`supabase/migrations/20250321000000_property_listings.sql`

What that file does, in order:

1. `create extension if not exists "pgcrypto"` so `gen_random_uuid()` is available.
2. `create table if not exists public.property_listings` with the section 2 columns.
3. Index on `owner_id`.
4. `set_updated_at()` trigger function and a `before update` trigger that sets
   `updated_at = now()`.
5. `enable row level security` on the table.
6. Four policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`, all
   `to authenticated`, all comparing `owner_id = auth.uid()`.

The migration does not create other tables, seed rows, grant to `anon` or
`public`, or mention the service role key.

## How to apply

This repo has no `supabase/config.toml` yet. Apply the SQL against a
non-production Supabase project only.

- **CLI (once a project is linked):** keep this file at the path above, then
  `supabase db push` or `supabase migration up`.
- **Dashboard:** paste the file into the project SQL editor and run it.
- Do not apply it from a React component or any other browser-running file.
- Do not use `SUPABASE_SERVICE_ROLE_KEY` in the client to run this SQL. The
  migration itself does not reference that key.

Logged-out requests should return no rows after RLS is on. Confirm that in the
SQL editor with a role that is not `service_role` before treating the table as
safe.

## Policies (plain language table)

| Policy name | Command | Role | Rule |
|-------------|---------|------|------|
| `listings_select_own` | `SELECT` | `authenticated` | `USING (owner_id = auth.uid())` — a signed-in sponsor sees only their rows. |
| `listings_insert_own` | `INSERT` | `authenticated` | `WITH CHECK (owner_id = auth.uid())` — they cannot insert a row owned by someone else. |
| `listings_update_own` | `UPDATE` | `authenticated` | `USING (owner_id = auth.uid())` and `WITH CHECK (owner_id = auth.uid())` — they can change only their rows and cannot reassign `owner_id`. |
| `listings_delete_own` | `DELETE` | `authenticated` | `USING (owner_id = auth.uid())` — they can delete only their rows. |

No policy uses `USING (true)` or `WITH CHECK (true)`. There is no policy for
`anon` or `public`. Logged-out visitors (`auth.uid()` is null) match none of
these and get no rows.

## Alignment with design doc

**Columns:** every column in section 2 of the design doc is in the table, with
the same name, Postgres type, and nullability. `id` is `uuid` primary key
default `gen_random_uuid()`. `owner_id` is `uuid not null` referencing
`auth.users(id)` `on delete cascade` (section 3). Address is six flattened
columns (`address_line1`, `address_line2`, `address_city`, `address_region`,
`address_postal_code`, `address_country`), all nullable `text`. Price is
`price numeric` (nullable), not a formatted string. `status` is `text not null`
with a check constraint listing `draft`, `published`, `under_offer`, `sold`,
`archived`. Those five strings match `src/types/listing-status.ts`; they are
not a shorter set. `created_at` and `updated_at` are `timestamptz not null
default now()`. No out-of-scope groups from the design doc (`propertyType`,
nested financials beyond `price`, contacts, ownership) were added.

**Policies:** none of the four policies from section 4 is missing. Names,
commands, and `owner_id = auth.uid()` rules match. `INSERT` is `WITH CHECK`
only. `UPDATE` has both `USING` and `WITH CHECK`. The design’s “signed-in
sponsor” is the Postgres `authenticated` role. No extra policy was added.

**Grants:** this migration adds **no** `GRANT` statements. Nothing here grants
to `anon`, `public`, or `authenticated`. That is not overly open. Table access
for the Data API still depends on the project’s default privileges; RLS
remains the deny rule for anyone without a matching policy. The service role
is not named in the file (it bypasses RLS at the platform level and must stay
server-only; never a `VITE_*` name).

**Optional index:** section 2 recommends `(owner_id, status)` if list views
filter by status. That composite index is not in this migration. Only the
required `owner_id` index is.

## Risks and open questions

- **Default table grants:** if the linked Supabase project still grants
  `SELECT`/`INSERT`/`UPDATE`/`DELETE` on `public` tables to `anon`, the grant
  is broad but RLS still returns no rows without a session. Do not add an
  `anon` policy to “make the API work.”
- **Service role bypass:** `SUPABASE_SERVICE_ROLE_KEY` skips RLS. It must not
  ship as `VITE_*` or be imported by a React component. This migration does
  not create that client.
- **Hard delete:** `DELETE` is a real row delete. The TypeScript union already
  has `archived`. The design still asks whether “remove” should only set
  `status = 'archived'`.
- **Status storage:** the design left enum vs check open. This migration uses
  `text` plus a check constraint (not a Postgres enum) so it stays aligned
  with the TypeScript string union.
- **Currency:** the field inventory wants `financials.currency` next to
  asking price. This table only has `price`, as in the design. Currency is
  still deferred.
- **Investor vs sponsor:** `owner_id` is an `auth.users` id. The dashboard
  shell is still investor-facing. Do not assume the listing owner is the same
  person as the Header “Investor” chip.
- **`owner_id` on insert:** the client must not send `owner_id`. A later
  server function or trigger should set it from `auth.uid()`. The `INSERT`
  policy will reject a different value; it will not fill the column for you.
- **`set_updated_at()` is generic:** the function lives in `public` and is
  named for reuse. Later tables can attach the same function; do not redefine
  it with a different body without checking callers.

## Sign-off

- Name:
- Date:
