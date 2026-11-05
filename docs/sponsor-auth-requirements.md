# PREIshare Sponsor Auth & Property Listings — Security Requirements

This file is the **security contract** for sponsor sign-in and property listings. [`docs/requirements/sponsor-auth-and-listings-brief.md`](requirements/sponsor-auth-and-listings-brief.md) holds the broader Sprint 4 scope.

## 1. Context

PREIshare lets a **sponsor** (a partner who lists properties) sign in and manage listings that belong to their account. A **listing** is one row in the `property_listings` table: title, address, asking price, status, and an `owner_id` that points at the signed-in user.

Two ideas this contract depends on:

- A **session** is the proof the app keeps that “this browser is this sponsor.” In practice that proof is a **JWT** (JSON Web Token): a signed token from Auth. The database function `auth.uid()` reads that token and returns the sponsor’s user id.
- **Row Level Security (RLS)** is a Postgres rule on the table. Even if someone knows a listing id, Postgres only returns or writes rows where `owner_id` equals `auth.uid()`.

The **anon key** (`VITE_SUPABASE_ANON_KEY`) is the public key the browser may use. It still obeys RLS. The **service-role key** (`SUPABASE_SERVICE_ROLE_KEY`) is an admin key that **skips RLS**. It must never ship in the browser. Names that start with `VITE_` are copied into the client bundle; anyone can read them.

This document states rules later work must meet. It does not record whether the current code meets them.

## 2. Actors

| Actor | Description | Signed in? |
|-------|-------------|------------|
| Anonymous visitor | Anyone who is not logged in. May open public pages and the login form. Must not open the dashboard or change listings. | No |
| Sponsor | Partner who manages **their own** listings after sign-in. | Yes |
| Admin | Internal operator. Out of scope this topic. | N/A this sprint |

## 3. User stories (in scope)

1. **Sponsor signs in.** As a sponsor, I enter my email and password and get a session so the app knows who I am on later requests.
2. **Sponsor sees only their own properties.** As a signed-in sponsor, when I open my listings list (or query `property_listings`), I see only rows whose `owner_id` is my user id. I do not see another sponsor’s rows.
3. **Sponsor creates a property owned by their account.** As a signed-in sponsor, I submit a create form without sending `owner_id`. The server (or a trigger that reads the session) sets `owner_id` to my user id. I cannot create a listing owned by someone else.
4. **Anonymous visitor can reach login but cannot open the dashboard or change listings.** As someone who is not signed in, I can open `/auth/login`. A visit to `/dashboard` (including `/dashboard/listings`) does not show listing management. I cannot create, update, or delete listings.

## 4. Non-goals (out of scope this topic)

- Public anonymous create, update, or delete of listings (no write API for logged-out visitors).
- A full admin console or cross-sponsor moderation UI.
- Putting the service-role key in any browser bundle (`VITE_*` name, React import, or built JS under `.output/public`).
- Password-reset polish, OAuth (sign in with Google or similar), or MFA (multi-factor authentication).

## 5. Success criteria

Someone should be able to check each item in a browser or a terminal. Leave boxes unchecked until a later verification step fills them.

- [ ] An unauthenticated `GET` to `/dashboard` and `/dashboard/listings` does not render listing management. The visitor is sent to `/auth/login` (for example a 307) or sees a signed-out state with no listing writes.
- [ ] `/auth/login` loads for an anonymous visitor and accepts email and password. It uses the browser client and the anon key, not the service-role key.
- [ ] After a successful sign-in, the same sponsor can open `/dashboard/listings` without being sent straight back to `/auth/login`.
- [ ] A signed-in sponsor’s list request returns only rows where `owner_id` is that sponsor. A second signed-in sponsor (User B) does not receive User A’s rows.
- [ ] Create does not take `owner_id` from the request body. The stored row’s `owner_id` equals the signed-in user’s id.
- [ ] An insert that tries to set `owner_id` to another user’s id is rejected when the request is subject to RLS (`WITH CHECK (owner_id = auth.uid())` on the anon key plus that user’s JWT).
- [ ] An update or delete that names another sponsor’s listing `id` does not change that row for the caller (RLS `USING` / `WITH CHECK`, or an equivalent owner check that still runs when the UI is skipped).
- [ ] A logged-out request to `property_listings` (anon key, no JWT, `auth.uid()` null) returns no rows and cannot insert, update, or delete.
- [ ] `rg SUPABASE_SERVICE_ROLE_KEY` (and any real service-role value) in the production client bundle is 0 hits. That name is not a `VITE_*` variable.
- [ ] `.env` is gitignored and not committed. `.env.example` lists variable **names** with placeholders only (no real keys).
- [ ] After sign-out succeeds, a follow-up visit to `/dashboard` is treated as signed out (redirect or signed-out state). The previous session cannot list or write listings.

## 6. Simple threat list

| Threat | What goes wrong | Requirement to mitigate |
|--------|-----------------|-------------------------|
| Stolen or reused session | Someone copies a logged-in browser’s cookies or JWT and keeps acting as that sponsor after the real user thinks they left. | Sign-out must invalidate the session. After `signOut` succeeds, `GET /dashboard` and listing list/create/update using that old session fail the same way as an anonymous visitor. Protected routes and listing server functions check the current session on each request, not only at the login form. |
| Guessing another sponsor’s property id | User B (or an anonymous caller) puts User A’s listing UUID in an update, delete, or direct `SELECT` and reads or changes User A’s row. | With the anon key plus User B’s JWT, `SELECT` / `UPDATE` / `DELETE` on User A’s `id` returns no row (or an error) and does not write. RLS on `property_listings` compares `owner_id` to `auth.uid()`. Listing writes that run on the service-role key (which skips RLS) are not reachable from the browser. |
| Leaked service-role key | The admin key is in client source, a `VITE_*` env var, the built JS bundle, or a committed `.env`. Anyone who has it skips RLS and can read or write every listing. | Browser code reads only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. `SUPABASE_SERVICE_ROLE_KEY` is server-only, never imported by a React component. `git ls-files` has no `.env`. After `npm run build`, the client assets contain neither the name nor a real service-role value. |
| “Security by hiding buttons” | The UI hides Edit/Delete for another owner, but a crafted request to the same list/create/update function still writes. | The same listing server functions (or PostgREST with anon key + JWT) reject unauthenticated writes and reject User B updating User A’s `id` even when the request does not go through the form. Hiding a button is not the access check. |

## 7. Environment & secret hygiene notes (requirements only)

This file documents **variable names and where they may be used**. It never contains real key values, connection strings, or JWTs.

Public / browser-safe names (they may use the `VITE_` prefix because Vite copies `VITE_*` into the client bundle):

- `VITE_SUPABASE_URL` — project URL the browser is allowed to know
- `VITE_SUPABASE_ANON_KEY` — anon key; still depends on RLS; not a bypass

Server-only names (no `VITE_` prefix, never imported into a React component):

- `SUPABASE_URL` — same project URL on the server
- `SUPABASE_SERVICE_ROLE_KEY` — service-role key; skips RLS

The public-vs-server-only split, gitignore rules, and placeholder-only `.env.example` checks live in [`docs/setup/supabase-env-checklist.md`](setup/supabase-env-checklist.md). Real values belong only in a local, untracked `.env`.

## 8. Open questions for the team

- **Investor vs sponsor.** The dashboard Header shows a static “Investor” chip (`src/components/dashboard/Header.tsx`). `navConfig.ts` uses investor-area labels (Home, Portfolio, Deals, Profile). This topic names **sponsors**. Do not assume investor and sponsor are the same person or two roles until the team says which it is. Do not silently relabel Header, nav, or widgets.
- **Login method.** Email/password vs magic link (a sign-in link sent to email, no password). This repo already implements **email and password** (`signInWithPassword` on `/auth/login` and `signUp` on `/auth/signup`). Magic link is not in the repo. Confirm whether email/password stays the only method for this topic.
- **Sponsors profile table.** `owner_id` is specified as a foreign key to `auth.users(id)`. Is that enough, or do we need a separate `sponsors` (or profiles) table beside `auth.users` for display name, org, or role? Do not add that table until the team says it is required.

## 9. How later steps use this brief

Quote this file when changing session checks, listing list/create/update, RLS policies, or env wiring. The broader product scope stays in [`docs/requirements/sponsor-auth-and-listings-brief.md`](requirements/sponsor-auth-and-listings-brief.md).

Later steps should:

- Keep login and signup on the anon key. Keep the service-role key off the browser.
- Set `owner_id` from the session, not from the client body. Test with a second user and with requests that skip the UI (section 6).
- Treat [`docs/verification/sprint4-auth-listings-checklist.md`](verification/sprint4-auth-listings-checklist.md) as the place to record Pass/Fail against section 5. This file is the contract, not the score.
- Stop and ask if a change would add admin cross-sponsor UI, public writes, OAuth/MFA, or a silent investor→sponsor relabel (sections 4 and 8).
