# Sprint 4 Topic 2 Handoff — PREIshare Sponsor Auth & Protected Listings

## Client story outcomes

A sponsor is supposed to sign in, see only their own `property_listings` rows, and create rows they own. Here is what the files and the verification checklist actually support.

- Logged-out visitors do not get the dashboard or the properties screens. `src/routes/dashboard.tsx` calls `getUser()` in `beforeLoad` and redirects to `/login`. The security checklist recorded live **307** responses from `/dashboard`, `/dashboard/properties`, and `/dashboard/properties/new` to `/login`.
- `src/lib/auth/session.ts` `getSession`, `getUser`, and `signOut` use `createSupabaseServerClient` (anon key plus cookies). That is the session-aware helper, not the service-role alias. The code is written so a signed-in sponsor *can* be recognized. Live sign-in was **not-run** (checklist 2.2): no `.env` and no Auth users in the verification environment. Do not treat “a sponsor signed in and reached the dashboard” as proven.
- `/login` (`src/routes/login.tsx`) signs in with `createBrowserSupabaseClient()` and `signInWithPassword`. It does not import the server module or the service-role helper.
- The properties list and create screens query `public.property_listings` with `createSupabaseServerClient`. Those two paths are written so `listings_select_own` and `listings_insert_own` can apply. Isolation with two sponsors was **not-run**.
- Secret hygiene on the browser client **passed**: only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The service-role name is not in the Vite client output.

## Architecture decisions (why we built it this way)

- Two clients: the browser file (`src/lib/supabase.client.ts`) may only see public `VITE_*` values. The server file (`src/lib/supabase.server.ts`) has `createSupabaseServerClient` for sponsor session + RLS, and `createSupabaseServiceRoleClient` (also exported as `createServerSupabaseClient`) for admin work that bypasses RLS.
- Listings live in `public.property_listings`. There is no `public.properties` table in this tree. Ownership is `owner_id`, meant to equal `auth.uid()`.
- The dashboard layout is the gate. Child routes under `/dashboard` inherit that `beforeLoad`. Login lives at `/login`.
- Properties list does not add `.eq('owner_id', …)` in the loader. Create sets `owner_id` from `user.id` after Zod parse. Both rely on the session-aware client so database policies can run.

## Source documents (read these first)

| Doc | Path | Purpose |
|-----|------|---------|
| Sponsor auth requirements | `docs/sponsor-auth-requirements.md` | **Not in this tree.** Closest file: `docs/requirements/sponsor-auth-and-listings-brief.md`. |
| Data model and RLS matrix | `docs/data-model-and-rls-matrix.md` | **Not in this tree.** Closest files: `docs/data-model/property-listings-schema.md` and `docs/data-model/rls-policy-review.md`. |
| Env var checklist | `docs/env-var-checklist.md` | **Not in this tree.** Closest files: `docs/setup/supabase-env-checklist.md` and root `.env.example`. |
| Security verification checklist | `docs/security-verification-checklist.md` | **Present.** Pass / fail / not-run for secret hygiene, login routing, list, create, and cross-sponsor checks (2026-10-23). |

## Key implementation files

These paths exist in this tree:

- `src/lib/supabase.client.ts` — browser client; public URL + anon key only
- `src/lib/supabase.server.ts` — `createSupabaseServerClient` (session / RLS) and `createSupabaseServiceRoleClient` / `createServerSupabaseClient` (bypasses RLS)
- `src/routes/login.tsx` — `/login`; `createBrowserSupabaseClient` + `signInWithPassword`
- `src/routes/dashboard.tsx` — `/dashboard` layout; `getUser()` gate; two-stage sign-out
- `src/routes/dashboard/properties.tsx` — list `property_listings` with `createSupabaseServerClient`
- `src/routes/dashboard/properties.new.tsx` — insert into `property_listings` with `createSupabaseServerClient`; `owner_id` from `user.id`
- `supabase/migrations/20250321000000_property_listings.sql` — creates `public.property_listings` and the four `listings_*_own` policies

`supabase/migrations/20250321000000_sponsors_properties_rls.sql` is **not** in this tree.

## Known limitations

Copied from `docs/security-verification-checklist.md` (not-run rows and residual risks). There were no **fail** rows.

- Live sign-in was not-run (2.2). No `.env`, no Auth users. A sponsor reaching a dashboard session was not shown.
- Wrong-password login was not-run (2.3).
- Live logout was not-run (2.4). If server `signOut` throws, the dashboard handler returns without navigating.
- A signed-in sponsor loading the properties list was not-run (3.1).
- “List shows only this sponsor’s rows” was not-run (3.2). No linked project and no seed data.
- Creating a row and seeing it as that owner only was not-run (4.2).
- Sponsor B listing Sponsor A’s rows was not-run (5.1). There were no test accounts. RLS was never tested with a second sponsor.
- Checklist 5.2 is policy text only, not a second-user JWT test.
- `src/server/listings.ts` still uses `createServerSupabaseClient` (the service-role alias) for `/dashboard/listings` list, create, and update. Those calls bypass RLS. Ownership there is only the TypeScript `owner_id` filter. That is not the `/dashboard/properties` path.
- Production `npm run build` got client assets out; the SSR step then failed because `src/routes/dashboard.tsx` imports the browser helper through `src/lib/supabase.client.ts`. `npm run dev` still served the logged-out checks.
- `.env.example` does not list `SUPABASE_ANON_KEY`. The session-aware server client accepts that name or falls back to `VITE_SUPABASE_ANON_KEY`.
- Stakeholder verdict in the checklist: **not ready** to show.

## Recommended next work (next topic / sprint)

- Richer listing fields and validation (deferred domain groups such as `propertyType`, currency, contacts — only if product asks).
- Sponsor invites or a role model (investor vs sponsor is still unanswered).
- CI secret injection so production never uses committed secrets. Keep `.env` untracked.
- Automated tests proving sponsor A cannot read sponsor B’s `property_listings` rows, using the anon key plus each sponsor’s JWT — not the service role.
- Attach a non-production Supabase project, apply `supabase/migrations/20250321000000_property_listings.sql`, create two sponsors, and re-run the not-run rows in `docs/security-verification-checklist.md`.
- Point `src/server/listings.ts` at `createSupabaseServerClient` if `/dashboard/listings` remains in use, so it does not bypass RLS.
- Fix the production SSR import of `*.client.ts` from the dashboard layout if you need `npm run build` to finish.

## Handoff checklist for the next learner

- [ ] Read the four source-doc paths in the table above before touching auth or RLS (including the “not in this tree” notes and the closest files).
- [ ] Confirm local `.env` matches `.env.example` names and never commit real values.
- [ ] Re-run `docs/security-verification-checklist.md` after any policy or client change.
- [ ] Keep service-role usage server-only. Do not import `createSupabaseServiceRoleClient` or `createServerSupabaseClient` from a React page. Use `createSupabaseServerClient` for sponsor list and create so RLS can run.
