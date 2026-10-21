# Sponsor Auth & Property Listings — Requirements Brief (Sprint 4)

## Client story (restated)

A sponsor needs to sign in and work with property listings in PREIshare. This
sprint adds authentication and listing work on top of the existing dashboard
shell. It does not replace the Sprint 3 investor shell with live portfolio
data, and it does not add payments, documents, or other product lines.

**Open question:** the current dashboard is built around an **investor** actor
(`Header` shows a static “Investor” chip; `navConfig.ts` labels are Home,
Portfolio, Deals, Profile). This sprint names **sponsors**. Do not assume these
are the same person or two roles until the team says which it is.

## Actors

| Actor | Goal |
|-------|------|
| Sponsor | Sign in and manage property listings that belong to them. |
| Unauthenticated visitor | Reach public pages only. Must not reach sponsor listing management or see another sponsor’s listings. |
| System (server) | Hold the session and privileged database access. Never put the service-role key or a privileged database URL in the browser bundle. |

## Goals for this sprint

- Sign a sponsor in and keep a server-side session.
- Let a signed-in sponsor view and maintain property listings (create/update
  against the listing shape in `docs/domain/`).
- Keep privileged secrets on the server. Document env **names** only in
  `.env.example`.
- Leave the existing `/dashboard` investor shell in place until the actor
  question above is answered. Do not silently relabel Header, nav, or widgets
  from investor to sponsor.

## Out of scope (defer)

- Live investor portfolio balances, holdings loaders, and recent-activity
  feeds on `/dashboard`
- Payments, subscriptions, e-sign, documents vault, tax exports
- Charts and time-series
- A full design system
- Admin CRUD for other users’ listings
- Treating “investor” and “sponsor” as the same role without an explicit
  decision
- Creating a Supabase project, committing `.env`, or adding login pages in
  **this** documentation step (implementation comes later)

## Current dashboard observations

What is in this repo today:

- Routes: `/dashboard` layout at `src/routes/dashboard/route.tsx` (hardcoded
  `title="Overview"`), home index at `src/routes/dashboard/index.tsx`, plus
  `/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile`. There is
  no login route and no listings route.
- Home mock metrics live in `src/routes/dashboard/index.tsx` as `demoMetrics`
  (`value: '—'`). Home passes `holdings={[]}` and `items={[]}` into the
  widgets; it does not import the MOCK arrays.
- `MOCK_PORTFOLIO_HOLDINGS` is exported from
  `src/components/dashboard/PortfolioSummary.tsx`.
- `MOCK_RECENT_ACTIVITY` is exported from
  `src/components/dashboard/RecentActivity.tsx`.
- Nav labels in `src/components/dashboard/navConfig.ts`: Home, Portfolio,
  Deals, Profile.
- `src/components/dashboard/Header.tsx` renders a static “IN” / “Investor”
  placeholder with a comment that it is not real auth.
- `src/lib/user.ts` `getUser()` always returns `null`. There is no
  `src/lib/supabase.ts`, no `supabase/` folder, no login or session module,
  and no `.env.example`. `.gitignore` already ignores `.env`.

Anyone who can load the app can open `/dashboard`.

## Success criteria (how we know it worked)

Verifiable in a browser or terminal:

- [ ] An unauthenticated visitor cannot open sponsor listing management (they
      are sent to sign-in or see a signed-out state).
- [ ] A sponsor can sign in and reach a listings view.
- [ ] A signed-in sponsor can create or update a property listing and see it
      in the list after save.
- [ ] Listing fields follow `docs/domain/` (no invented listing shape).
- [ ] Existing `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, and
      `/dashboard/profile` still load.
- [ ] No service-role key appears in the client bundle or a committed `.env`.
- [ ] `.env.example` documents the required variable **names** without real
      values.

## Server-only boundary (must not ship to the browser)

**Server-only** (never `VITE_*`, never imported into a React component):

- Supabase service role key (`SUPABASE_SERVICE_ROLE_KEY`)
- Privileged database URLs (`DATABASE_URL` or equivalent direct Postgres URL)

**Client-safe** (may be named as `VITE_*` if the browser client needs them):

- Supabase project URL
- Supabase anon key

The anon key is not a bypass. It still depends on row-level security. Anything
imported into a React component ships to the browser and can be read by the
user.

## Implementation notes for later prompts

- Quote this brief. Scope is **auth and listings** only. Reject payments,
  live investor balances, and a silent investor→sponsor relabel.
- Use TanStack Start file-based routes and `createServerFn` (or a route
  loader) for session and listing writes. Do not `fetch('/api/...')` from
  Header, Sidebar, or the presentational widgets.
- Honor `docs/domain/investor-listing-domain-brief.md` and
  `docs/domain/listing-field-inventory.md` before inventing listing types.
- Keep `MetricCard`, `PortfolioSummary`, and `RecentActivity` presentational.
  Do not put Supabase calls inside them.
- Document env **names** only. Never commit `.env` or paste real keys.
- Small milestones: env example → server client → sign-in → listings list →
  create/update. Stop if the investor vs sponsor role question is still
  blocking UI copy.
