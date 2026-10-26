# Security verification checklist — PREIshare sponsor auth & properties

**Date:** 2026-10-23  
**Verifier:** Alex Neilson  
**Build / branch:** `cursor/dashboard-properties-new-e471` @ `3963a66` (this note added on `cursor/security-verification-checklist-e471`)  
**Related docs:** `docs/sponsor-auth-requirements.md` is not in this tree (used `docs/requirements/sponsor-auth-and-listings-brief.md`). `docs/env-var-checklist.md` is not in this tree (used `docs/setup/supabase-env-checklist.md` and root `.env.example`). `docs/data-model-and-rls-matrix.md` is not on this branch (reviewed from `cursor/data-model-rls-matrix-e471` plus `supabase/migrations/20250321000000_property_listings.sql`).

Status values: `pass` | `fail` | `not-run`

Environment: Cloud Agent VM, `npm run dev` on `http://localhost:3000`. No committed `.env`. No linked live Supabase project. No test sponsor accounts.

---

## 1. Environment and secret hygiene

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 1.1 | Browser-safe client (`src/lib/supabase/client.ts`, re-exported from `src/lib/supabase.client.ts`) uses only public URL + anon key | Opened file; confirmed no service-role import or env read | pass | Reads only `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`. Throws if either is missing. No `process.env`. No service-role name. Routes import `src/lib/supabase/client.ts` so SSR does not load a `*.client.ts` filename. |
| 1.2 | Service-role / secret key used only in server module (`src/lib/supabase.server.ts`) or never used in this topic | Opened server client; confirmed server-only path | pass | `SUPABASE_SERVICE_ROLE_KEY` is read only inside `createSupabaseServiceRoleClient()`. Alias `createServerSupabaseClient` is the same helper. No React route imports that alias. `src/routes/` has zero hits for `createSupabaseServiceRoleClient`. |
| 1.3 | No raw secrets committed in source or checklist | Project search for secret-like strings; `.env` not committed | pass | `git check-ignore -v .env` → `.gitignore:6:.env`. `git ls-files` has no `.env`. Search for jwt-shaped `eyJ…`, `sk_live`, `sb_secret`: no hits in source. After `vite` client build, `rg SUPABASE_SERVICE_ROLE_KEY` in `.output/public`: **0 hits**. Never pasted real key values here. |
| 1.4 | `.env.example` documents required vars without real values | Compared to `docs/setup/supabase-env-checklist.md` | pass | Placeholders only: `your-anon-key`, `your-service-role-key`, `https://your-project-ref.supabase.co`. Names match `.env.example`. `git check-ignore -v .env.example` reports it is **not** ignored. |

**Section result:** pass

---

## 2. Login and session-aware routing

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 2.1 | Unauthenticated visit to dashboard (or properties) redirects or blocks access | Opened protected URL in logged-out browser | pass | Live `GET --max-redirs 0`: `/dashboard`, `/dashboard/properties`, and `/dashboard/properties/new` each returned **307** `Location: /login`. `/login` returned **200** and HTML contains Log in, Email, Password, `role="alert"`. No Overview / Sign out / Your properties on the login page. Guard is `src/routes/dashboard.tsx` `beforeLoad` → `getUser()` → `redirect({ to: '/login' })`. |
| 2.2 | Valid sponsor credentials reach an authenticated dashboard session | Signed in via `src/routes/login.tsx` | not-run | No `.env` and no Auth users in this VM. Login uses `createBrowserSupabaseClient()` + `signInWithPassword`, then `navigate({ to: '/dashboard' })`. `getUser()` now calls `createSupabaseServerClient` (anon + cookies), not the service-role alias. Live post-login dashboard was not reached. |
| 2.3 | Invalid credentials do not grant dashboard access | Tried wrong password | not-run | Could not submit against a live Auth project. Code path: `signInError` is written to `role="alert"` and the handler returns without navigating. Unauthenticated `/dashboard` still 307s (2.1). |
| 2.4 | Logout clears session; protected routes no longer load data as that user | Logged out, retried dashboard/properties | not-run | Live Sign out not reachable (2.2). Code review: `src/routes/dashboard.tsx` runs server `signOut` then browser `supabase.auth.signOut()`, then `navigate({ to: '/login' })`. If the server `signOut` throws, the handler returns without navigating (session is not treated as cleared). |

**Section result:** partial (2.1 pass; 2.2–2.4 not-run)

---

## 3. Property list isolation (RLS)

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 3.1 | Signed-in sponsor sees property list UI from `src/routes/dashboard/properties.tsx` | Navigated to properties after login | not-run | Logged-out `/dashboard/properties` 307s to `/login` (2.1). Signed-in load not possible here. Loader is `loadSponsorProperties` via `createSupabaseServerClient`. |
| 3.2 | List shows only rows owned by the current sponsor (per docs/data-model-and-rls-matrix.md) | Compared listed rows to known seed/test data | not-run | No linked project and no seed rows. Intended filter is policy `listings_select_own`: `TO authenticated USING (owner_id = auth.uid())`. The properties loader does **not** add `.eq('owner_id', …)`. That is correct only while the session-aware client is used. |
| 3.3 | Empty state is safe (no error that leaks other tenants’ data) | Observed empty or filtered list | pass | Live empty list after login not reached. Code review of `src/routes/dashboard/properties.tsx`: empty copy is “No properties yet”; DB errors become `'Could not load properties. Try again.'` — no row payloads, no constraint names, no keys. |

**Section result:** partial (3.3 pass on code; 3.1–3.2 not-run)

---

## 4. Property create under RLS

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 4.1 | Create form on `src/routes/dashboard/properties.new.tsx` requires an authenticated session | Opened create route logged out vs logged in | pass | Logged-out `GET /dashboard/properties/new` **307** `Location: /login` (parent `beforeLoad`). Logged-in open of the form was not-run. Handler also returns “You must be signed in to add a property.” if `getUser()` is empty. |
| 4.2 | Successful create inserts a row owned by the current sponsor | Created one property; confirmed it appears for that user only | not-run | No live insert. Code: `createListingSchema` has no `owner_id`; insert is `{ ...parsed.data, owner_id: user.id }` via `createSupabaseServerClient`. Navigate to `/dashboard/properties` only when `result.ok`. |
| 4.3 | Create failure (validation or RLS) does not expose secret keys or raw DB internals in the UI | Triggered a bad submit if possible | pass | Live RLS reject not-run. Code: Zod failures return `'Listing is invalid.'` plus field names from the schema. Insert `error` is replaced with `'Could not create the listing. Check your fields and try again.'` — never `error.message`. Client bundle search did not find `SUPABASE_SERVICE_ROLE_KEY`. |

**Section result:** partial (4.1 and 4.3 pass; 4.2 not-run)

---

## 5. Cross-sponsor access attempt

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 5.1 | Sponsor B cannot list Sponsor A’s properties in the UI | Second test user login, compared lists | not-run | No test users in this environment. See residual risks. |
| 5.2 | Direct read/update of another sponsor’s row is denied by RLS (UI and/or Supabase policy behavior) | Attempted via second user or documented policy review against matrix | pass | Policy review only (no second JWT). Migration policies: `listings_select_own` / `listings_insert_own` / `listings_update_own` / `listings_delete_own`, all `TO authenticated`, all `owner_id = auth.uid()`, no `USING (true)`, no `anon` policy. Properties list/create use `createSupabaseServerClient` so those policies can apply. Live deny for User B was not executed. |

**Section result:** not-run (5.1 not-run; 5.2 is policy-review only)

---

## 6. Gaps found and fixes applied

| Gap (checklist #) | What was wrong | Fix applied (files) | Re-test status |
|-------------------|----------------|---------------------|----------------|
| | | | |

None — no required check failed in a way that needed a code change. Live signed-in, create-as-owner, and two-user isolation rows are **not-run**, not fail.

---

## 7. Residual risks (honest leftovers)

- No `.env` and no linked non-production Supabase project in this VM. Login, logout, create, and list-as-owner were not exercised with a real session.
- Only zero test sponsor accounts (not even one). Cross-sponsor UI check (5.1) is not-run.
- `src/server/listings.ts` still calls `createServerSupabaseClient` (service-role alias) for `/dashboard/listings` list/create/update. Those RPCs bypass RLS; ownership is only the TypeScript `owner_id` filter. The new `/dashboard/properties` path does **not** use that client. Treat the old listings helpers as out of this topic’s pass, not as proven isolation.
- `docs/data-model-and-rls-matrix.md` still notes that intended RLS is not the same as every app write path. This review agrees for `src/server/listings.ts`.
- Production `npm run build` now finishes (client, SSR, and Nitro). Login, dashboard, and signup import the browser helper from `src/lib/supabase/client.ts` so the SSR graph does not pull in a `*.client.ts` filename. `src/lib/supabase.client.ts` remains a re-export only.
- `.env.example` does not name `SUPABASE_ANON_KEY`. `createSupabaseServerClient` accepts that name or falls back to `VITE_SUPABASE_ANON_KEY`. Fine for this topic; document the fallback when someone writes a real `.env`.
- `createProperty` / `loadSponsorProperties` live in the same route modules as the React pages. They import `src/lib/supabase.server.ts`. TanStack Start should keep those handlers on the server; the client build search found no service-role **name** in `.output/public`. Re-check the bundle after any client/server split change.

---

## 8. Stakeholder verdict

**Ready to show stakeholders?** no

**Summary (3–5 sentences):**  
I personally verified secret hygiene and the logged-out gate. `src/lib/supabase/client.ts` (re-exported from `src/lib/supabase.client.ts`) reads only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. `SUPABASE_SERVICE_ROLE_KEY` is read only in `src/lib/supabase.server.ts` (`createSupabaseServiceRoleClient`). `.env` is gitignored and not tracked; `.env.example` has placeholders only; the Vite client output under `.output/public` has zero hits for the service-role name. Unauthenticated `GET /dashboard`, `/dashboard/properties`, and `/dashboard/properties/new` each 307 to `/login`. I did **not** sign in a sponsor, create a row, or prove User B cannot see User A’s listings — there is no project and no test user here. Policy text for `listings_*_own` matches the intended matrix; that is design review, not a two-user test.

**Sign-off:** Alex Neilson, 2026-10-23 (America/New_York)
