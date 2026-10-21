# Sprint 4 — Auth & listings verification checklist

| Field | Value |
|-------|-------|
| Project | PREIshare |
| Date | |
| Verifier | |
| Environment | |

## How to use this doc

1. Use two sponsor accounts (**User A** and **User B**) against a non-production Supabase project that has applied `supabase/migrations/20250321000000_property_listings.sql`.
2. Run the app the way you will test it (local `npm run dev` or a preview URL) and record that URL under Environment.
3. Work the tables in order. For each row, perform the check, then fill **Result** (`Pass` or `Fail`) and **Evidence** (what you saw: URL, screenshot note, SQL output, response body, or file + line).
4. Do not pre-mark rows. Leave Result and Evidence empty until you have actually tested that row.
5. Secret-hygiene rows are file and bundle inspections, not UI clicks. RLS rows need User B’s session (anon key + User B JWT), not the service role.
6. Gaps-fixed rows re-test issues found during this sprint. Mark them only after you reproduce the old failure mode or confirm it no longer happens.
7. Sign off only when every row in the six tables has a Result.

## Database & migration

Source: [`supabase/migrations/20250321000000_property_listings.sql`](../../supabase/migrations/20250321000000_property_listings.sql)

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| D1 | Table `public.property_listings` exists with columns `id`, `owner_id`, `title`, `description`, `address_line1`, `address_line2`, `address_city`, `address_region`, `address_postal_code`, `address_country`, `price`, `status`, `created_at`, `updated_at` as in the migration (no extra domain groups). | | |
| D2 | `id` is `uuid` primary key default `gen_random_uuid()`; `owner_id` is `uuid not null` references `auth.users(id)` `on delete cascade`. | | |
| D3 | RLS is enabled on `property_listings`. | | |
| D4 | Four policies exist: `listings_select_own` (SELECT), `listings_insert_own` (INSERT), `listings_update_own` (UPDATE), `listings_delete_own` (DELETE), all `to authenticated`, all comparing `owner_id = auth.uid()`. | | |
| D5 | INSERT policy uses `WITH CHECK` only; UPDATE policy uses both `USING` and `WITH CHECK`. No policy uses `USING (true)` or `WITH CHECK (true)`. No policy for `anon` or `public`. | | |
| D6 | Status check constraint lists exactly `draft`, `published`, `under_offer`, `sold`, `archived`. | | |
| D7 | Migration does not mention `SUPABASE_SERVICE_ROLE_KEY` or grant write access to `anon` / `public`. | | |
| D8 | Logged-out / `auth.uid()`-null request against the table returns no rows when not using the service role. | | |

## Authentication & session

Sources: [`src/routes/auth/login.tsx`](../../src/routes/auth/login.tsx), [`src/routes/auth/signup.tsx`](../../src/routes/auth/signup.tsx), [`src/routes/dashboard/route.tsx`](../../src/routes/dashboard/route.tsx), [`src/lib/auth/session.ts`](../../src/lib/auth/session.ts)

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| A1 | Unauthenticated visit to `/dashboard` (and `/dashboard/listings`) does not render listing management; the layout `beforeLoad` sends the visitor to `/auth/login`. | | |
| A2 | `src/routes/auth/login.tsx` signs in with the browser client (`signInWithPassword`). It does not import `src/lib/supabase/server.ts` or `src/lib/auth/session.ts`. | | |
| A3 | `/auth/signup` uses the browser client `signUp` the same way (anon key, no service role). | | |
| A4 | After a successful login, the sponsor can reach a protected dashboard route without being immediately bounced back to login **if** the session helper is answering “this sponsor,” not an empty admin client. | | |
| A5 | Sign out from the dashboard calls `signOut` and, after `supabase.auth.signOut()` succeeds, navigates to `/auth/login`. | | |
| A6 | Login and signup show a visible error (`role="alert"`) on failure instead of failing silently. | | |

## Listings happy path (User A)

Sources: [`src/routes/dashboard/listings/index.tsx`](../../src/routes/dashboard/listings/index.tsx), [`src/routes/dashboard/listings/new.tsx`](../../src/routes/dashboard/listings/new.tsx), [`src/server/listings.ts`](../../src/server/listings.ts)

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| L1 | Signed-in User A can open `/dashboard/listings`. The index route loader calls `listMyListings` from `src/server/listings.ts` (no browser Supabase client in that file). | | |
| L2 | When `listMyListings` returns `{ ok: false }`, `src/routes/dashboard/listings/index.tsx` shows the error message. | | |
| L3 | When the list is empty, the index shows an empty state with a link to `/dashboard/listings/new`. | | |
| L4 | User A can submit the create form on `/dashboard/listings/new` without an `owner_id` field. `createListing` in `src/server/listings.ts` sets `owner_id` from `getUser()` after spreading validated input. | | |
| L5 | On create success, User A is navigated to `/dashboard/listings` and sees the new row (title, `address_city`, `status`) as a card. On create failure, the form `role="alert"` shows the error instead of swallowing it. | | |
| L6 | Create/update payloads use the migration column names (`title`, flattened `address_*`, `price`, `status`). The form does not send `owner_id`. | | |

## Row Level Security (User B)

Use User B’s **anon key + User B session JWT**, not the service role. Source of policies: [`supabase/migrations/20250321000000_property_listings.sql`](../../supabase/migrations/20250321000000_property_listings.sql). List/update entry point: [`src/server/listings.ts`](../../src/server/listings.ts).

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| R1 | Signed-in User B’s `/dashboard/listings` (or `listMyListings` as User B) does not include User A’s rows. | | |
| R2 | User B cannot update User A’s listing by id through `updateListing` (filter is `id` and `owner_id` = User B). | | |
| R3 | An insert as User B that sets `owner_id` to User A’s id is rejected when the request is subject to RLS (`WITH CHECK (owner_id = auth.uid())` on the anon + JWT client). | | |
| R4 | Direct SELECT as User B with the anon key + User B JWT cannot read User A’s `property_listings` rows. | | |
| R5 | Confirm whether `src/server/listings.ts` uses `createServerSupabaseClient` (service role). If it does, RLS is **not** in force on those queries; record whether `.eq('owner_id', user.id)` in the function is the only remaining owner filter. | | |

## Secret-hygiene audit

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| S1 | `SUPABASE_SERVICE_ROLE_KEY` is not a `VITE_*` name and does not appear in the client bundle or a committed `.env`. | | |
| S2 | Browser helper (`src/lib/supabase/client.ts`) reads only `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`. | | |
| S3 | `src/lib/supabase/server.ts` reads `process.env.SUPABASE_URL` and `process.env.SUPABASE_SERVICE_ROLE_KEY` inside the factory, with a file-level “never import from the browser” comment. | | |
| S4 | `src/routes/auth/login.tsx` and the listings UI routes do not import `src/lib/supabase/server.ts`. Listings pages talk to `src/server/listings.ts` only. | | |
| S5 | `.env` is gitignored; `.env.example` (if present) has placeholder names only, no real keys. | | |
| S6 | `src/components/listings/ListingCard.tsx` and `ListingForm.tsx` have no data-access imports (no Supabase clients, no env). | | |

## Gaps fixed this session

Re-test these only after the original failure is understood. Leave Result/Evidence blank until you run the check.

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| G1 | After login, `/dashboard` is not immediately redirected back to `/auth/login` solely because `getUser()` used a service-role client with no sponsor JWT. The gate answers “this sponsor’s session” (anon key + sponsor JWT), not “is there an admin?” | | |
| G2 | Sign-out both clears the session and navigates to `/auth/login` (not clear-only with the sponsor left on the dashboard). | | |
| G3 | Create does not accept `owner_id` from the request body; `src/server/listings.ts` sets `owner_id: user.id` after spreading input. | | |
| G4 | If listing queries still use the service-role client, that gap is documented (RLS not applied on those calls). A follow-up must send the sponsor JWT on the anon client for `auth.uid()` policies to be in force. | | |

## Sign-off

| Field | Value |
|-------|-------|
| Name | |
| Date | |
| Notes | |
