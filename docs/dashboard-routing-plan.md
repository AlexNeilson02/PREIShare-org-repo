# PREIshare Dashboard Routing Plan

## Purpose

This plan records the **current** TanStack file-based dashboard routes and the
**next** route files to add, so later implementation steps can nest investor
pages under one `/dashboard` layout. It honors
[`docs/investor-dashboard-brief.md`](investor-dashboard-brief.md) (Sprint 3
shell: mock placeholders, no auth) and
[`docs/dashboard-ia.md`](dashboard-ia.md) (four must-have areas plus a later
Activity child). This file is documentation only; it does not change `src/`.

## Current app inventory (as found)

Every file under `src/routes/` as of this plan. Likely URLs follow TanStack
file-based routing (`createFileRoute` ids in each file).

| File / folder | Likely URL | Notes |
|---------------|------------|-------|
| `src/routes/__root.tsx` | (root layout; no path) | `createRootRoute` HTML shell. Renders global `Header` and `Footer` around `{children}`. Injects theme init script and TanStack Devtools. Must not be duplicated by the dashboard layout. |
| `src/routes/index.tsx` | `/` | Starter home. Includes a `Link` to `/dashboard` (“Open investor dashboard”). |
| `src/routes/about.tsx` | `/about` | Starter About page. Outside the dashboard tree. |
| `src/routes/dashboard.tsx` | `/dashboard` (parent layout) | `createFileRoute('/dashboard')`. Renders a placeholder paragraph and `<Outlet />`. No sidebar yet. Wraps all `dashboard/*` children. |
| `src/routes/dashboard/` | (folder) | Child route files for the investor dashboard. |
| `src/routes/dashboard/index.tsx` | `/dashboard` | Home index. Title “Dashboard overview”; mock placeholder for stats, portfolio summary, and recent activity. |
| `src/routes/dashboard/portfolio.tsx` | `/dashboard/portfolio` | Placeholder page: “holdings table will go here.” |
| `src/routes/dashboard/deals.tsx` | `/dashboard/deals` | Placeholder page: “open deals list will go here.” |
| `src/routes/dashboard/profile.tsx` | `/dashboard/profile` | Placeholder page: “member name and contact details will go here.” |

`src/routes/dashboard/activity.tsx` is **not** in the tree yet.

## Planned dashboard route tree

All investor pages stay nested under the `/dashboard` layout so child paths
swap only the outlet, not the shell.

```text
/dashboard                    layout  (src/routes/dashboard.tsx)
├── /dashboard                index   (src/routes/dashboard/index.tsx)
├── /dashboard/portfolio      page    (src/routes/dashboard/portfolio.tsx)
├── /dashboard/deals          page    (src/routes/dashboard/deals.tsx)
├── /dashboard/profile        page    (src/routes/dashboard/profile.tsx)
└── /dashboard/activity       page    (src/routes/dashboard/activity.tsx)  ← to build
```

## File map (exact files to create in a later step)

| URL | Role | File to create | Wraps / renders | Status |
|-----|------|----------------|-----------------|--------|
| `/dashboard` | Layout | `src/routes/dashboard.tsx` | Sidebar (later) + `<Outlet />` for child pages. Must not add a second header. | exists |
| `/dashboard` | Index (home) | `src/routes/dashboard/index.tsx` | Home overview: stats, portfolio summary, recent activity placeholders. | exists |
| `/dashboard/portfolio` | Page | `src/routes/dashboard/portfolio.tsx` | Holdings table/list placeholder. | exists |
| `/dashboard/deals` | Page | `src/routes/dashboard/deals.tsx` | Open/available deals list placeholder. | exists |
| `/dashboard/profile` | Page | `src/routes/dashboard/profile.tsx` | Profile card placeholder (name, contact). | exists |
| `/dashboard/activity` | Page | `src/routes/dashboard/activity.tsx` | Dedicated recent-activity placeholder (home currently only mentions activity inline). | to build |

The only new route file for a later step is
`src/routes/dashboard/activity.tsx`. Do not hand-edit `src/routeTree.gen.ts`;
TanStack Router codegen will pick up the new file.

## Layout vs page responsibilities

- **Layout (`dashboard.tsx`):** Owns the dashboard chrome that is **not** already
  global: sidebar (and later mobile nav equivalent) plus the `<Outlet />` that
  renders the active child. `src/routes/__root.tsx` already renders `Header` and
  `Footer` on every page, so this layout **must not add a second header**.
  Today it only renders a placeholder paragraph and the outlet.
- **Index (`index.tsx`):** The `/dashboard` home page. Renders the overview
  content (stats cards, portfolio summary placeholder, recent activity list
  placeholder) inside the parent layout outlet. Does not own sidebar or site
  header.
- **Placeholders (`portfolio.tsx`, `deals.tsx`, `profile.tsx`, and later
  `activity.tsx`):** Each child is a page-only shell with a clear title and
  mock-labeled content. They render inside the same dashboard layout; they do
  not replace it or introduce their own site header/footer.

## Navigation labels (for sidebar / mobile nav later)

Labels follow [`docs/investor-dashboard-brief.md`](investor-dashboard-brief.md).
The brief’s four must-have areas are Home, Portfolio, Deals, and Profile.
Activity is planned as a child path because the same brief puts “recent
activity” on the home overview.

| Label | Path | Requirement link |
|-------|------|------------------|
| Home | `/dashboard` | `docs/investor-dashboard-brief.md`: “Open the dashboard and immediately see a home overview (portfolio snapshot + recent activity placeholders).” Area table: “Home overview \| `/dashboard`”. |
| Portfolio | `/dashboard/portfolio` | `docs/investor-dashboard-brief.md`: “Navigate to Portfolio, Deals, and Profile without leaving the app shell.” Area table: “Portfolio \| `/dashboard/portfolio`”. |
| Deals | `/dashboard/deals` | `docs/investor-dashboard-brief.md`: “Navigate to Portfolio, Deals, and Profile without leaving the app shell.” Area table: “Deals \| `/dashboard/deals`”. |
| Profile | `/dashboard/profile` | `docs/investor-dashboard-brief.md`: “Navigate to Portfolio, Deals, and Profile without leaving the app shell.” Area table: “Profile \| `/dashboard/profile`”. |
| Activity | `/dashboard/activity` | `docs/investor-dashboard-brief.md` home area: investor should see a “recent activity list placeholder” on `/dashboard`. A dedicated `/dashboard/activity` route is the later file for that list; it is not one of the four must-have areas in the brief table. |

## Out of scope for this plan

- Component prop design and styling tokens
- Auth guards and loader data shape
- API routes and Supabase queries

Those stay out of this routing plan. They also match the sprint non-goals in
`docs/investor-dashboard-brief.md` (no real sign-in, no live
Supabase/PostgreSQL data).

## Success criteria for implementation steps

A later implementation step that follows this plan is successful when:

- `/dashboard` shows the layout shell and home index content.
- Child paths (`/dashboard/portfolio`, `/dashboard/deals`,
  `/dashboard/profile`, and later `/dashboard/activity`) render **inside** the
  same layout rather than replacing it.
- No existing routes were deleted (`/`, `/about`, and the current dashboard
  files stay in the tree).

## Open questions

- The dashboard layout currently renders a placeholder paragraph with no
  sidebar, so navigation is not built yet. When should sidebar / mobile nav
  land relative to adding `activity.tsx`?
- `docs/investor-dashboard-brief.md` and `docs/dashboard-ia.md` list **four**
  must-have areas and say not to add surprise pages outside those four. Is
  `/dashboard/activity` approved as a fifth nav item, or should recent activity
  stay only on the home index until the brief is updated?
- Should Activity appear in persistent nav, or only as a link from the home
  “recent activity” placeholder?
- Confirm that the global `Header` in `__root.tsx` satisfies the brief’s
  “header” requirement, and that the dashboard layout should add sidebar +
  main only (no second header).
