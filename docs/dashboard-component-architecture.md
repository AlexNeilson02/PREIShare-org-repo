# PREIshare Dashboard — Component Architecture & Responsive Layout Map

## Purpose

This blueprint maps layout regions and reusable components for the Sprint 3
investor dashboard **shell**. Later implementation steps should compose
placeholders under the existing `/dashboard` layout without adding a second
header, without live data, and without expanding routes beyond
[`docs/dashboard-routing-plan.md`](dashboard-routing-plan.md). This file is
documentation only; it does not create or change files under `src/`.

## Sources

- [`docs/investor-dashboard-brief.md`](investor-dashboard-brief.md) — client
  brief (four must-have areas, shell only, mock placeholders, no auth).
- [`docs/dashboard-routing-plan.md`](dashboard-routing-plan.md) — route tree,
  layout-vs-page split, and Navigation labels table.
- [`docs/dashboard-ia.md`](dashboard-ia.md) — URL map, shared chrome, mock-data
  label rule, narrow-screen nav must not overlap content.
- [`docs/component-plan.md`](component-plan.md) — earlier component inventory.
  **Conflicts with this blueprint are listed below; they are not silently
  resolved.**
- `src/routes/__root.tsx` — global `Header` and `Footer` around every page.
- `src/routes/dashboard.tsx` — dashboard parent layout: placeholder paragraph
  plus `<Outlet />`; no sidebar yet.

**Conflicts with `docs/component-plan.md` (do not treat as already decided):**

| Topic | `docs/component-plan.md` | This blueprint |
|-------|--------------------------|----------------|
| Header | New dashboard Header that shows the current page title from `navConfig` and a placeholder user area, used on Home, Portfolio, Deals, and Profile. | Reuse the **existing** global `src/components/Header.tsx` already rendered by `__root.tsx`. Do **not** add `src/components/dashboard/Header.tsx`. Matches `docs/dashboard-routing-plan.md`. |
| AppShell | “Page frame combining Sidebar, Header, and main content.” | AppShell frames **Sidebar + MobileNav + main/outlet only**. Header stays in `__root.tsx`. |
| Sidebar vs MobileNav | Sidebar renders nav on **all** screen widths (collapses, moves to footer, or stacks). No MobileNav. | Sidebar is the persistent/wide nav. **MobileNav** is a separate component for `<768px`. |
| Metric name | Home metric widget is named **StatsCard**. Names are locked (“do not rename without updating both docs”). | This inventory uses **MetricCard**, as required for this blueprint. The rename is an open conflict until the team updates `docs/component-plan.md` or this file. |
| Nav source | `navConfig` is the single source of labels, paths, and page titles; Sidebar must not define its own list. | Sidebar and MobileNav take an **`items` prop** of `{ label, to }` pairs from the Navigation labels table in `docs/dashboard-routing-plan.md`. No `navConfig` module is specified here. |
| Activity | Mapping check lists only Home, Portfolio, Deals, Profile. | Routing plan includes a later `/dashboard/activity` child. Activity may appear in `items`; it is not a fifth must-have area in the brief until the team confirms. |

## Layout regions

These regions satisfy the brief’s “sidebar (or equivalent nav), header, and
main content region” (`docs/investor-dashboard-brief.md` success criteria)
without duplicating chrome.

| Region | Owned by | What it is |
|--------|----------|------------|
| Header | `src/routes/__root.tsx` via existing `src/components/Header.tsx` | Site-wide sticky header (starter Home / About / Docs links and theme toggle). Satisfies the dashboard **header** region. The dashboard layout must not render another header. |
| Sidebar | Dashboard `AppShell` (later, from `src/routes/dashboard.tsx`) | Persistent investor nav for tablet/desktop. Items match the routing-plan Navigation labels table. Hidden on mobile in favor of MobileNav. |
| MobileNav | Dashboard `AppShell` | Equivalent nav on narrow screens: collapses or stacks **above** main content and never overlaps it (`docs/dashboard-ia.md`). |
| Main | Child route via `<Outlet />` | Page title plus page widgets (home: metrics, portfolio snapshot, recent activity). Child paths swap this region only. |

`src/routes/dashboard.tsx` today renders only a placeholder paragraph and
`<Outlet />`. A later step should replace that paragraph with `AppShell`
around the outlet—not with a new header.

## Component inventory

Exactly seven components. Props accept **placeholder values from the caller**.
Do not hard-code investor names, balances, holdings, or other member data
inside the component.

### AppShell

- **Responsibility:** Dashboard page frame that places Sidebar, MobileNav, and
  the main content region (the layout outlet). Does not own page widgets, does
  not load data, and does not render a header (header is already global).
- **Parent:** `src/routes/dashboard.tsx` (dashboard layout), in a later step.
- **Children:** `Sidebar`, `MobileNav`, and the main slot (`children` /
  `<Outlet />` content).
- **Props:** `children` (the active dashboard page). May pass the same `items`
  list through to Sidebar and MobileNav, or accept `items` itself and forward
  them. `items` are `{ label, to }` pairs, not investor records.

### Header

- **Responsibility:** Existing site header. Satisfies the dashboard **header
  region** so the shell looks complete without a second bar. Today it is the
  TanStack starter header (Home / About / Docs, theme toggle). A later
  polish step may restyle this same file; it must not be replaced by a
  dashboard-only header.
- **Parent:** `src/routes/__root.tsx` (`RootDocument` renders `<Header />`
  above `{children}`).
- **Children:** Existing site `Link`s and `ThemeToggle` (already in
  `src/components/Header.tsx`). No dashboard page widgets.
- **Props:** None required for this shell. Do not add investor profile props
  or hard-coded member data. Do not invent a dashboard-specific Header API.

**Do not create `src/components/dashboard/Header.tsx`.**
`docs/dashboard-routing-plan.md` states the dashboard layout owns only the
sidebar and the outlet and must not add a second header. A later
implementation step that adds a second Header would conflict with both the
routing plan and this blueprint.

### Sidebar

- **Responsibility:** Persistent investor navigation for tablet and desktop.
  Highlights the item whose `to` matches the current path
  (`docs/dashboard-ia.md`). Does not show page titles or page widgets.
- **Parent:** `AppShell`.
- **Children:** Nav links built from `items` (prefer `Link` for in-app paths).
- **Props:** `items` — an array of `{ label, to }` pairs matching the
  Navigation labels table in `docs/dashboard-routing-plan.md`:

  | label | to |
  |-------|----|
  | Home | `/dashboard` |
  | Portfolio | `/dashboard/portfolio` |
  | Deals | `/dashboard/deals` |
  | Profile | `/dashboard/profile` |
  | Activity | `/dashboard/activity` |

  The caller supplies this list. Activity remains an open question in the
  routing plan (fifth item vs home-only). Until that is decided, the caller
  may omit Activity.

### MobileNav

- **Responsibility:** Investor navigation on narrow screens. Same destinations
  as Sidebar. Collapses or stacks above main content; never overlays or
  obscures the page (`docs/investor-dashboard-brief.md`,
  `docs/dashboard-ia.md`).
- **Parent:** `AppShell`.
- **Children:** Nav links built from the same `items` shape as Sidebar.
- **Props:** `items` — `{ label, to }[]`, same pairs as Sidebar / the
  Navigation labels table in `docs/dashboard-routing-plan.md`. The caller
  passes placeholders; MobileNav does not own the list or investor data.

### MetricCard

- **Responsibility:** One labeled metric for the home overview “stats cards”
  (`docs/investor-dashboard-brief.md`). Shows a visible “Mock data” label when
  the value is a placeholder (`docs/dashboard-ia.md`).
- **Parent:** Dashboard home page (`src/routes/dashboard/index.tsx`), inside
  the AppShell main region.
- **Children:** None required (label, value, optional hint, mock label).
- **Props:** Placeholder strings/numbers from the caller, for example `label`,
  `value`, and optional `hint`. The card does not fetch or hard-code
  portfolio totals.

*Name conflict:* `docs/component-plan.md` calls this widget **StatsCard**.
This blueprint keeps **MetricCard**. Do not rename in code until the docs
agree.

### PortfolioSummary

- **Responsibility:** Short home snapshot of portfolio value. Must not replace
  the full holdings table on `/dashboard/portfolio`
  (`docs/component-plan.md` “Must NOT do”). Mock-labeled.
- **Parent:** Dashboard home page (`src/routes/dashboard/index.tsx`).
- **Children:** None required beyond the snapshot text/layout.
- **Props:** Placeholder snapshot fields from the caller (for example a title
  and a display value). Do not hard-code holdings or member-specific totals
  inside the component.

### RecentActivity

- **Responsibility:** Simple list of recent mock events on the home overview
  (`docs/investor-dashboard-brief.md`: “recent activity list placeholder”).
  Does not own app navigation (a later `/dashboard/activity` page may link
  out from the home list; that route is to-build in the routing plan).
- **Parent:** Dashboard home page (`src/routes/dashboard/index.tsx`).
- **Children:** List rows rendered from the `items` (or equivalent) prop.
- **Props:** A caller-supplied list of placeholder events (for example
  `{ id, title, detail }` or similar). Do not hard-code investor transactions
  inside the component. Event `items` here are **not** the Sidebar
  `{ label, to }` nav pairs.

## Composition (dashboard home)

`__root.tsx` already wraps every route:

```text
Header          ← existing src/components/Header.tsx (do not duplicate)
{children}      ← dashboard layout + page
Footer
```

Inside `/dashboard`, a later step composes:

```text
AppShell
├── Sidebar      items: [{ label, to }, …] from routing-plan nav table
├── MobileNav    same items
└── main / Outlet
    └── dashboard/index.tsx (home)
        ├── MetricCard   ← placeholder label/value from the page
        ├── MetricCard
        ├── MetricCard   (count is a page concern; cards stay presentational)
        ├── PortfolioSummary   ← placeholder snapshot from the page
        └── RecentActivity     ← placeholder events from the page
```

Portfolio, Deals, Profile, and later Activity pages render **in the same
AppShell main slot**. They do not remount Header or invent a second shell.
Those page widgets (`PortfolioTable`, `DealsList`, `ProfileCard` in
`docs/component-plan.md`) are outside this seven-component inventory.

## Responsive behavior

Breakpoints are CSS viewport widths. Nav must remain usable and must not
overlap main content (`docs/investor-dashboard-brief.md`,
`docs/dashboard-ia.md`).

| Viewport | Nav behavior | Main content layout |
|----------|--------------|---------------------|
| Mobile (`<768px`) | `Sidebar` is hidden. `MobileNav` is visible: collapsed control or a stack **above** main; it never overlays the page. Same `{ label, to }` items as desktop. | Single column. MetricCard stack, then PortfolioSummary, then RecentActivity. Page title stays in the main region. |
| Tablet (`768–1024px`) | Compact `Sidebar` visible (collapsed width or short labels). `MobileNav` hidden. Active item still matches the path. | Single column or a modest two-column wrap for MetricCards; PortfolioSummary and RecentActivity stack below. No overlapping nav. |
| Desktop (`>1024px`) | Persistent `Sidebar` beside main. `MobileNav` hidden. | Main sits to the right of the sidebar. Home can place MetricCards in a row, with PortfolioSummary and RecentActivity in columns or stacked sections beneath. |

The global Header stays at the top of the document at every width. AppShell
does not hide or replace it.

## File targets (for later steps—do not create all here)

Later implementation may add or wire these paths. **This step creates none of
them** except this markdown file.

| Component | Planned file | Status in this tree |
|-----------|--------------|---------------------|
| Header | `src/components/Header.tsx` | **Exists.** Keep using it. Do **not** create `src/components/dashboard/Header.tsx`. |
| AppShell | `src/components/dashboard/AppShell.tsx` | To build later. |
| Sidebar | `src/components/dashboard/Sidebar.tsx` | To build later. |
| MobileNav | `src/components/dashboard/MobileNav.tsx` | To build later. |
| MetricCard | `src/components/dashboard/MetricCard.tsx` | To build later. Conflicts with the **StatsCard** name in `docs/component-plan.md`. |
| PortfolioSummary | `src/components/dashboard/PortfolioSummary.tsx` | To build later. |
| RecentActivity | `src/components/dashboard/RecentActivity.tsx` | To build later. |

Route files that will **compose** these components later (already exist,
except Activity): `src/routes/dashboard.tsx` (AppShell + outlet),
`src/routes/dashboard/index.tsx` (home widgets). Do not hand-edit
`src/routeTree.gen.ts`.

## Out of scope (prevent scope creep)

- Real Supabase/PostgreSQL data and auth
- Charts libraries
- Map views
- PDF export
- Routes beyond [`docs/dashboard-routing-plan.md`](dashboard-routing-plan.md)
- Design-system extraction
- Editing holdings

Also out of this blueprint: payments, admin CRUD, and a second Header. Mock
data stays caller-supplied placeholders, labeled “Mock data” in the UI when
implemented.

## Success criteria for this blueprint

This document is complete when:

- The seven named components (AppShell, Header, Sidebar, MobileNav,
  MetricCard, PortfolioSummary, RecentActivity) each have Responsibility,
  Parent, Children, and Props in plain language.
- Header is documented as the **existing global** `src/components/Header.tsx`
  from `__root.tsx`, and a later step is explicitly told **not** to add
  `src/components/dashboard/Header.tsx`.
- Sidebar and MobileNav `items` match the Navigation labels table in
  `docs/dashboard-routing-plan.md`.
- Responsive behavior is specified for mobile (`<768px`), tablet
  (`768–1024px`), and desktop (`>1024px`).
- Conflicts with `docs/component-plan.md` are written down rather than
  papered over.
- No files under `src/` were created or modified to produce this blueprint.
