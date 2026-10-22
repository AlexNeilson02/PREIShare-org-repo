# Sprint 4 Handoff — Sponsor Auth & Postgres Property Listings

| Field | Value |
|-------|-------|
| Project | PREIshare |
| Sprint | 4 Topic 1 |
| Audience | Sponsors and next-sprint implementer |
| Status date | 2026-10-22 |
| Prepared by | Alex Neilson |

## 1. Client story recap

A sponsor needs to sign in and manage property listings that belong to them. This sprint was meant to add authentication and listing work on top of the existing investor dashboard shell. It was not meant to replace that shell with live portfolio data, and it was not meant to add payments, documents, or other product lines.

Unauthenticated visitors must not reach listing management or see another sponsor’s listings. Privileged secrets stay on the server.

The dashboard Header and nav are still built around an **investor** actor. This sprint names **sponsors**. Those are not assumed to be the same person.

## 2. Delivered vs original request

Yes / Partial / No follows the verification checklist **Result** column, not intended code paths. A Yes requires at least one Pass row.

| Client need | Delivered? | Where / evidence |
|-------------|------------|------------------|
| Unauthenticated visitor cannot open sponsor listing management (sent to sign-in). | Yes | A1 Pass: unauthenticated `GET /dashboard`, `/dashboard/listings`, `/dashboard/listings/new`, and `/dashboard/portfolio` returned 307 `Location: /auth/login`. Browser follow of `/dashboard` landed on the login form. |
| Sponsor can sign in and reach a listings view. | No | A4 Fail, L1 Fail, G1 Fail. After browser `signInWithPassword`, `getUser()` still returns null, so `/dashboard` and `/dashboard/listings` 307 back to `/auth/login`. |
| Signed-in sponsor can create or update a listing and see it in the list after save. | No | L4 Fail, L5 Fail. Create URL 307s to login. No User A create-and-list round-trip. |
| Listing fields follow the agreed shape (identity, flattened address, price, status; no extra domain groups; no client-supplied `owner_id`). | Yes | D1 Pass, D6 Pass, L6 Pass, G3 Pass. Migration columns and form/schema names match. Status set is `draft`, `published`, `under_offer`, `sold`, `archived`. |
| Existing `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile` still load. | Partial | A1 Pass shows `/dashboard` and `/dashboard/portfolio` still exist but 307 to login for every visitor, including after a browser login (A4 Fail). `/dashboard/deals` and `/dashboard/profile` have no checklist Result. |
| Server-side session identifies the signed-in sponsor. | No | A4 Fail, G1 Fail. `getUser()` uses the service-role client with no sponsor JWT. |
| Another sponsor cannot see or change User A’s listings (RLS in force). | No | R1–R4 Fail, D8 Fail. R5 Pass records that listing RPCs use the service-role client, so RLS is not applied on those queries. |
| Login and signup pages use the browser client and show a visible error on failure. | Yes | A2 Pass, A3 Pass, A6 Pass. |
| Sign-out, after a successful `signOut`, navigates to `/auth/login`. | Yes | A5 Pass, G2 Pass. Live click was not reached because the dashboard never rendered (A4). |
| SQL migration defines `property_listings`, enables RLS, and adds four `owner_id = auth.uid()` policies for `authenticated` only. | Yes | D1–D7 Pass. D8 Fail is the live logged-out SELECT, not the file. |
| No service-role key in the client bundle or a committed `.env`; `.env.example` has names and placeholders only. | Yes | S1–S6 Pass. |

## 3. Architecture decisions (keep short)

- Two Supabase helpers: browser reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; server reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` inside the factory. Service role is never a `VITE_*` name.
- Login and signup run in the browser (`signInWithPassword` / `signUp`). They do not import the server client.
- Dashboard layout `beforeLoad` calls `getUser()` and redirects to `/auth/login` when it is null.
- Listings list/create are `createServerFn` handlers in `src/server/listings.ts`. The form does not send `owner_id`; `createListing` sets `owner_id` from `getUser()`.
- Table `public.property_listings`: `owner_id` FK to `auth.users(id)` ON DELETE CASCADE; flattened `address_*`; `price numeric`; status check constraint. RLS policies `listings_select_own`, `listings_insert_own`, `listings_update_own`, `listings_delete_own` to `authenticated`, `owner_id = auth.uid()`.
- Investor Header/nav copy is not relabeled to sponsor until stakeholders answer the actor question.
- Intended session and listing queries (schema §5): anon key + sponsor JWT so `auth.uid()` policies apply. Current code still uses the service-role client for `getUser()` and listing RPCs (see §5).

## 4. How to run locally

Nothing here is a deployed URL. The verification run was local only.

1. Copy `.env.example` to `.env`. Put real values only in `.env`. Do not commit `.env`. Names: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
2. Apply `supabase/migrations/20250321000000_property_listings.sql` to a **non-production** Supabase project. This environment did not have a linked project.
3. From the repo root: `npm run dev` (port 3000). Verification used `http://localhost:3000`.
4. Until the session helper is fixed, every `/dashboard*` visit 307s to `/auth/login`, including after a successful browser login form submit.

## 5. Known limitations

`src/lib/auth/session.ts` `getUser()` uses the service-role client with no sponsor JWT, so it returns null and the dashboard gate redirects every visitor to `/auth/login` even after a successful browser login (checklist A4, G1). Sponsor login is not functional end to end.

`src/server/listings.ts` runs list/create/update on the service-role client, which bypasses row-level security. The policies in the migration are correct but are not in force on those queries; the only owner scoping is `.eq('owner_id', user.id)` in application code (checklist R5, G4).

RLS was never proven with a second sponsor. No `.env`, no linked Supabase project, no User B (checklist R1–R4, D8).

User A create-and-list was never completed live (checklist L1, L4, L5).

Secret hygiene passed, including a build-output search finding zero hits for the service-role key in `.output/public` (checklist S1–S6).

This work is not deployed.

## 6. Recommended next-sprint work

Keep the current split: browser anon key for login/signup, `createServerFn` for session and listings, migration RLS as written. Do not replace it with a homegrown session store or drop the `owner_id = auth.uid()` policies. Do not collapse anon-key vs service-role into one helper.

**Prerequisites (do these first; they block product work):**

1. **Session helper.** Change `getUser()` / `getSession()` to the anon key plus the sponsor JWT so `beforeLoad` can recognize a signed-in sponsor. Re-test A4 and G1. Until this lands, listings UI and RLS tests cannot run.
2. Point `listMyListings`, `createListing`, and `updateListing` at the same anon-key + sponsor-JWT client so the migration policies are in force. Keep setting `owner_id` from the session, not from the request body. Re-check R5/G4.
3. Attach a non-production project, apply the migration, create User A, and complete create-then-list (L1, L4, L5).
4. Create a second distinct sponsor (email only in notes). Prove User B cannot list, update, insert-as-A, or SELECT User A’s rows with anon key + User B JWT (R1–R4). Run logged-out SELECT and confirm 0 rows (D8).
5. Leave investor Header/nav labels as they are until §7 is answered.

The product options below wait until that session and RLS-client foundation is stable. Each one extends `property_listings`, the existing `owner_id = auth.uid()` policies, and the anon-key + sponsor-JWT session. None of them is a reason to put the service-role key in the browser or to bypass RLS.

**Stakeholder choices (pick after the foundation is stable):**

- **Richer listing fields.** Add columns the first table deferred (`propertyType`, `financials.currency` / IRR / cap rate, contacts, ownership) onto `public.property_listings` (or child tables keyed by listing `id`). Keep `owner_id` as the RLS key. Same session, same `listings_*_own` rules; widen the Zod schema and form, do not invent a second write path.
- **Approvals workflow.** Add an approval state on the same rows (new column or a constrained use of `status`) so a listing can sit pending before `published`. Reads and writes still go through the signed-in session and `owner_id = auth.uid()`. Admin review of another owner’s row would need an explicit new policy; do not use the service role in the client to “just approve.”
- **pgvector search.** Add an embedding column (or a related table) on `property_listings` and search with the anon key plus the sponsor JWT so RLS still hides User A’s rows from User B. Indexing jobs that need the service role stay server-only. Search is not a reason to `USING (true)` or to share one helper for browser and admin.

## 7. Open questions for stakeholders

- **Investor vs sponsor:** The dashboard Header and nav are still investor-facing. This sprint’s `owner_id` is described as a sponsor auth user. Are investor and sponsor the same person, two roles, or something else? Do not treat them as the same actor until the team says which it is. Do not relabel Header, nav, or widgets from investor to sponsor in the meantime.
- Price currency: the field inventory wants `financials.currency` with asking price. This table only has `price`. Is currency deferred?
- Soft delete vs hard delete: `archived` is already a status. Is DELETE a hard delete, or should “remove” only set `status = 'archived'`?

## 8. Source artifacts

- [`docs/requirements/sponsor-auth-and-listings-brief.md`](../requirements/sponsor-auth-and-listings-brief.md)
- [`docs/verification/sprint4-auth-listings-checklist.md`](../verification/sprint4-auth-listings-checklist.md)
- [`docs/data-model/property-listings-schema.md`](../data-model/property-listings-schema.md)
- [`docs/setup/supabase-env-checklist.md`](../setup/supabase-env-checklist.md)
- [`supabase/migrations/20250321000000_property_listings.sql`](../../supabase/migrations/20250321000000_property_listings.sql)
- [`.env.example`](../../.env.example)
- `src/lib/auth/session.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`
- `src/server/listings.ts`, `src/lib/listings/schema.ts`
- `src/routes/auth/login.tsx`, `src/routes/auth/signup.tsx`, `src/routes/dashboard/route.tsx`
- `src/routes/dashboard/listings/index.tsx`, `src/routes/dashboard/listings/new.tsx`
