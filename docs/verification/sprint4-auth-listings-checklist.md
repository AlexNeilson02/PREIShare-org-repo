# Sprint 4 — Auth & listings verification checklist

| Field | Value |
|-------|-------|
| Project | PREIshare |
| Date | 2026-10-22 |
| Verifier | Alex Neilson |
| Environment | Local Cloud Agent VM, `http://localhost:3000` (`npm run dev`). No committed `.env`. No linked live Supabase project in this environment. |

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
| D1 | Table `public.property_listings` exists with columns `id`, `owner_id`, `title`, `description`, `address_line1`, `address_line2`, `address_city`, `address_region`, `address_postal_code`, `address_country`, `price`, `status`, `created_at`, `updated_at` as in the migration (no extra domain groups). | Pass | Verified in `supabase/migrations/20250321000000_property_listings.sql` lines 7–21. Those 13 columns only; no `propertyType`, contacts, or nested financials. Live `CREATE TABLE` was not executed here (no linked project). |
| D2 | `id` is `uuid` primary key default `gen_random_uuid()`; `owner_id` is `uuid not null` references `auth.users(id)` `on delete cascade`. | Pass | Same file line 8 (`id uuid primary key default gen_random_uuid()`) and line 9 (`owner_id uuid not null references auth.users (id) on delete cascade`). |
| D3 | RLS is enabled on `property_listings`. | Pass | Line 55: `alter table public.property_listings enable row level security`. |
| D4 | Four policies exist: `listings_select_own` (SELECT), `listings_insert_own` (INSERT), `listings_update_own` (UPDATE), `listings_delete_own` (DELETE), all `to authenticated`, all comparing `owner_id = auth.uid()`. | Pass | Lines 57–80. Each policy is `to authenticated` with `owner_id = auth.uid()`. |
| D5 | INSERT policy uses `WITH CHECK` only; UPDATE policy uses both `USING` and `WITH CHECK`. No policy uses `USING (true)` or `WITH CHECK (true)`. No policy for `anon` or `public`. | Pass | INSERT lines 63–67 `with check` only. UPDATE lines 69–74 both `using` and `with check`. `rg -i 'using \(true\)|with check \(true\)'` in the migration: 0 hits. `to anon`: 0. No GRANT. `public` appears only as the schema qualifier (`public.property_listings`), not as a policy role. |
| D6 | Status check constraint lists exactly `draft`, `published`, `under_offer`, `sold`, `archived`. | Pass | Lines 22–31 `property_listings_status_check`. Matches `src/types/listing-status.ts`. |
| D7 | Migration does not mention `SUPABASE_SERVICE_ROLE_KEY` or grant write access to `anon` / `public`. | Pass | `rg SUPABASE_SERVICE_ROLE_KEY\|GRANT` in the migration file: 0 hits. |
| D8 | Logged-out / `auth.uid()`-null request against the table returns no rows when not using the service role. | Fail | Could not query a live `property_listings` table. No `.env` / project in this VM. Handoff: apply the migration, then SELECT as `anon` with no JWT and confirm 0 rows. |

## Authentication & session

Sources: [`src/routes/auth/login.tsx`](../../src/routes/auth/login.tsx), [`src/routes/auth/signup.tsx`](../../src/routes/auth/signup.tsx), [`src/routes/dashboard/route.tsx`](../../src/routes/dashboard/route.tsx), [`src/lib/auth/session.ts`](../../src/lib/auth/session.ts)

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| A1 | Unauthenticated visit to `/dashboard` (and `/dashboard/listings`) does not render listing management; the layout `beforeLoad` sends the visitor to `/auth/login`. | Pass | Live GET `--max-redirs 0`: `http://localhost:3000/dashboard` **307** `Location: /auth/login`. Same 307 for `/dashboard/listings`, `/dashboard/listings/new`, `/dashboard/portfolio`. Browser follow of `/dashboard` landed on `http://localhost:3000/auth/login` (Log in form; no Overview / Sign out). `src/routes/dashboard/route.tsx` lines 7–12 `getUser()` then `throw redirect({ to: '/auth/login' })`. |
| A2 | `src/routes/auth/login.tsx` signs in with the browser client (`signInWithPassword`). It does not import `src/lib/supabase/server.ts` or `src/lib/auth/session.ts`. | Pass | `src/routes/auth/login.tsx` line 3 imports `createBrowserSupabaseClient`; line 21 `signInWithPassword`. `rg supabase/server\|auth/session` in that file: 0 hits. Live `http://localhost:3000/auth/login` 200, HTML contains Log in, Email, Password, `role="alert"`. |
| A3 | `/auth/signup` uses the browser client `signUp` the same way (anon key, no service role). | Pass | `src/routes/auth/signup.tsx` line 3 browser client, line 21 `signUp`. No server-client import. Live `http://localhost:3000/auth/signup` 200, HTML contains Sign up and `role="alert"`. |
| A4 | After a successful login, the sponsor can reach a protected dashboard route without being immediately bounced back to login **if** the session helper is answering “this sponsor,” not an empty admin client. | Fail | `src/lib/auth/session.ts` `getUser` still calls `createServerSupabaseClient()` (service role, `persistSession: false`, no sponsor JWT). That `auth.getUser()` is an admin client with no user session, so it returns null. Unauthenticated (and post-browser-login) `/dashboard` therefore 307s to `/auth/login`. Could not complete a live signed-in dashboard load (no `.env`). Handoff: wire anon key + sponsor JWT into the session helper. |
| A5 | Sign out from the dashboard calls `signOut` and, after `supabase.auth.signOut()` succeeds, navigates to `/auth/login`. | Pass | `src/routes/dashboard/route.tsx` lines 21–35: `await signOutFn()` then `navigate({ to: '/auth/login' })`. `session.ts` `signOut` throws if `supabase.auth.signOut()` errors. Live click not possible because the gate never renders the dashboard; code path is present. |
| A6 | Login and signup show a visible error (`role="alert"`) on failure instead of failing silently. | Pass | Live HTML on both `/auth/login` and `/auth/signup` includes `role="alert"` (SSR count 1 each). Browser submit of `sponsor-a@example.com` / `not-a-real-password` on both pages showed the alert text `Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. See docs/setup/supabase-env-checklist.md.` `login.tsx` lines 69–74 and `signup.tsx` lines 69–74. |

## Listings happy path (User A)

Sources: [`src/routes/dashboard/listings/index.tsx`](../../src/routes/dashboard/listings/index.tsx), [`src/routes/dashboard/listings/new.tsx`](../../src/routes/dashboard/listings/new.tsx), [`src/server/listings.ts`](../../src/server/listings.ts)

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| L1 | Signed-in User A can open `/dashboard/listings`. The index route loader calls `listMyListings` from `src/server/listings.ts` (no browser Supabase client in that file). | Fail | Loader wiring Pass: `src/routes/dashboard/listings/index.tsx` line 6 `loader: () => listMyListings()`; no `supabase/client` import. Live Fail: GET `http://localhost:3000/dashboard/listings` 307 `/auth/login` (A4). No User A session. Handoff: after JWT session fix, sign in User A and reload this URL. |
| L2 | When `listMyListings` returns `{ ok: false }`, `src/routes/dashboard/listings/index.tsx` shows the error message. | Pass | Lines 13–22: `if (!result.ok)` renders `{result.error}` in `role="alert"`. Discriminated result handled. Live `{ ok: false }` from a signed-in loader was not reached because of the 307. |
| L3 | When the list is empty, the index shows an empty state with a link to `/dashboard/listings/new`. | Pass | Lines 26–42: empty copy plus `Link to="/dashboard/listings/new"` “Create a listing”. Live empty-state HTML not reachable (307). |
| L4 | User A can submit the create form on `/dashboard/listings/new` without an `owner_id` field. `createListing` in `src/server/listings.ts` sets `owner_id` from `getUser()` after spreading validated input. | Fail | Form/server wiring Pass: `ListingFormValues` has no `owner_id`; `rg owner_id` in `ListingForm.tsx` and `schema.ts`: 0 hits. `createListing` line 92 `{ ...parsed.data, owner_id: user.id }`. Live Fail: GET `http://localhost:3000/dashboard/listings/new` 307 `/auth/login`. Could not submit as User A. |
| L5 | On create success, User A is navigated to `/dashboard/listings` and sees the new row (title, `address_city`, `status`) as a card. On create failure, the form `role="alert"` shows the error instead of swallowing it. | Fail | Code: `new.tsx` lines 24–26 set `errorMessage` on `!result.ok`; success `navigate({ to: '/dashboard/listings' })`. `ListingCard` renders `title`, `address_city`, `status`. Live create/list round-trip not run (no session). |
| L6 | Create/update payloads use the migration column names (`title`, flattened `address_*`, `price`, `status`). The form does not send `owner_id`. | Pass | `src/lib/listings/schema.ts` and `ListingFormValues` use `title`, `address_line1`…`address_country`, `price`, `status`. No `owner_id` in form or schema. |

## Row Level Security (User B)

Use User B’s **anon key + User B session JWT**, not the service role. Source of policies: [`supabase/migrations/20250321000000_property_listings.sql`](../../supabase/migrations/20250321000000_property_listings.sql). List/update entry point: [`src/server/listings.ts`](../../src/server/listings.ts).

Second user: **not provisioned**. No live Auth users. Could not record a User B email from a real signup. User A’s listings were **not** proven hidden from User B.

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| R1 | Signed-in User B’s `/dashboard/listings` (or `listMyListings` as User B) does not include User A’s rows. | Fail | User A’s listings were **not** proven hidden from User B. No second distinct user. No `.env`. Handoff: create two sponsors (distinct emails), apply the migration, sign in as User B with anon+JWT, confirm User A rows absent. |
| R2 | User B cannot update User A’s listing by id through `updateListing` (filter is `id` and `owner_id` = User B). | Fail | Not executed live. Code filter exists: `src/server/listings.ts` lines 131–132 `.eq('id', id).eq('owner_id', user.id)`. That is function SQL on the service-role client (see R5), not a live User B JWT test. |
| R3 | An insert as User B that sets `owner_id` to User A’s id is rejected when the request is subject to RLS (`WITH CHECK (owner_id = auth.uid())` on the anon + JWT client). | Fail | Policy is in the migration (lines 63–67) but was not exercised with a User B JWT. `createListing` strips body `owner_id` and sets `user.id`; it does not use the anon+JWT client. Handoff: replay INSERT as User B via PostgREST with anon key. |
| R4 | Direct SELECT as User B with the anon key + User B JWT cannot read User A’s `property_listings` rows. | Fail | No User B JWT. Could not run a direct SELECT. Handoff: `GET /rest/v1/property_listings` as User B and confirm 0 of User A’s rows. |
| R5 | Confirm whether `src/server/listings.ts` uses `createServerSupabaseClient` (service role). If it does, RLS is **not** in force on those queries; record whether `.eq('owner_id', user.id)` in the function is the only remaining owner filter. | Pass | Confirmed: `src/server/listings.ts` imports `createServerSupabaseClient` (line 7) and uses it on list/create/update (lines 55, 89, 127). That client is the service role (`src/lib/supabase/server.ts` lines 8, 16). RLS is not applied on those calls. Remaining owner filter is `.eq('owner_id', user.id)` / insert `owner_id: user.id` only. |

## Secret-hygiene audit

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| S1 | `SUPABASE_SERVICE_ROLE_KEY` is not a `VITE_*` name and does not appear in the client bundle or a committed `.env`. | Pass | No `VITE_…SERVICE_ROLE` in `src/` (0 hits). Name appears in `src/lib/supabase/server.ts` only (2 hits) plus docs and `.env.example` placeholder. `git ls-files` has no `.env`. After `npm run build`, `rg SUPABASE_SERVICE_ROLE_KEY` in `.output/public/**/*.js` (including `login-DMAUcBco.js`, `signup-CRvQ7q8K.js`, `index-DpH77ngw.js`): **0 hits**. |
| S2 | Browser helper (`src/lib/supabase/client.ts`) reads only `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`. | Pass | `src/lib/supabase/client.ts` lines 5–6. `rg process.env` in that file: 0 hits. No service-role name. |
| S3 | `src/lib/supabase/server.ts` reads `process.env.SUPABASE_URL` and `process.env.SUPABASE_SERVICE_ROLE_KEY` inside the factory, with a file-level “never import from the browser” comment. | Pass | Line 1 comment. Lines 6–8 read env **inside** `createServerSupabaseClient()`, not at module top. Lines 17–20 `persistSession: false`, `autoRefreshToken: false`. `rg VITE_` in that file: 0 hits. |
| S4 | `src/routes/auth/login.tsx` and the listings UI routes do not import `src/lib/supabase/server.ts`. Listings pages talk to `src/server/listings.ts` only. | Pass | `rg supabase/server` under `src/routes/auth` and `src/routes/dashboard/listings`: 0 hits. `listings/index.tsx` imports `listMyListings` from `../../../server/listings`. `listings/new.tsx` imports `createListing` from the same module. |
| S5 | `.env` is gitignored; `.env.example` (if present) has placeholder names only, no real keys. | Pass | `git check-ignore -v .env` → `.gitignore:6:.env`. `.env.example` is **not** ignored and is tracked. Placeholders: `your-anon-key`, `your-service-role-key`, `https://your-project-ref.supabase.co`. No jwt-shaped secrets. |
| S6 | `src/components/listings/ListingCard.tsx` and `ListingForm.tsx` have no data-access imports (no Supabase clients, no env). | Pass | `rg supabase\|process.env\|import.meta.env` under `src/components/listings`: 0 hits. Card imports only `ListingRow` type. Form is local React state. |

## Gaps fixed this session

Re-test these only after the original failure is understood. Leave Result/Evidence blank until you run the check.

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| G1 | After login, `/dashboard` is not immediately redirected back to `/auth/login` solely because `getUser()` used a service-role client with no sponsor JWT. The gate answers “this sponsor’s session” (anon key + sponsor JWT), not “is there an admin?” | Fail | Gap **not** fixed. `getUser()` still uses the service-role client (`session.ts` lines 21–31). Live unauthenticated and would-be post-login `/dashboard` 307 `/auth/login`. Handoff: session helper must use anon key + sponsor JWT. |
| G2 | Sign-out both clears the session and navigates to `/auth/login` (not clear-only with the sponsor left on the dashboard). | Pass | `src/routes/dashboard/route.tsx` lines 21–35 call `signOut` then `navigate({ to: '/auth/login' })`. Live Sign out click blocked by A4/G1, but the missing navigation from the prior PAUL finding is in the source. |
| G3 | Create does not accept `owner_id` from the request body; `src/server/listings.ts` sets `owner_id: user.id` after spreading input. | Pass | `createListingSchema` has no `owner_id`. Insert `{ ...parsed.data, owner_id: user.id }` at `src/server/listings.ts` line 92. |
| G4 | If listing queries still use the service-role client, that gap is documented (RLS not applied on those calls). A follow-up must send the sponsor JWT on the anon client for `auth.uid()` policies to be in force. | Pass | Documented in R5 and this row. `listMyListings` / `createListing` / `updateListing` all use `createServerSupabaseClient`. Database `auth.uid()` rules are not in force on those RPCs. Follow-up: query with anon key + sponsor JWT. |

## Sign-off

| Field | Value |
|-------|-------|
| Name | Alex Neilson |
| Date | 2026-10-22 |
| Notes | Secret-hygiene (S1–S6) Pass. Auth gate redirects unauthenticated traffic (A1). Live User A create/list and User B RLS (R1–R4, L1, L4, L5, A4, G1, D8) Fail: no `.env`, no linked Supabase, no second user email. Handoff: attach a non-prod project, fix session `getUser()` to anon+JWT, then re-run User A create and User B hide tests. |
