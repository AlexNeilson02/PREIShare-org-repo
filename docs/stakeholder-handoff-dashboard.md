# PREIshare Investor Dashboard — Stakeholder Handoff

**Sprint focus:** Investor dashboard shell (layout, four file-based areas, placeholder widgets).
**Audience:** Stakeholders reviewing the Sprint 3 shell before the next data/auth topic.
**Date:** 2026-10-20
**Prepared by:** Alex Neilson

## 1. Demo today (what investors can click)

Open `http://localhost:3000/dashboard` with `npm run dev`.

- The home index shows three placeholder metric cards (Portfolio value, Active investments, Distributions (YTD)), a portfolio summary empty state, and a recent-activity empty state.
- Sidebar (desktop / tablet from 768px) and MobileNav (below 768px) link to Home, Portfolio, Deals, and Profile. Those four paths stay inside the same `/dashboard` layout outlet.
- Portfolio, Deals, and Profile are still one-heading placeholder pages (`<h1>` plus a mock sentence). There is no login screen and no fifth Activity route.

## 2. Requirements traceability

Success criteria copied verbatim from section 6 of
[`docs/preishare-dashboard-requirements.md`](preishare-dashboard-requirements.md).

| Success criterion | Status | Evidence |
|-------------------|--------|----------|
| Opening `/dashboard` shows the PREIshare investor shell (header, nav, main). | Met | `src/routes/dashboard/route.tsx` wraps `<Outlet />` in `AppShell`. `src/components/dashboard/AppShell.tsx` renders `Header`, `Sidebar` / `MobileNav`, and `<main id="main-content">`. QA checklist M2, M4, D1. |
| Home shows placeholder metric cards that can be scanned at a glance. | Met | `src/routes/dashboard/index.tsx` maps `demoMetrics` into `MetricCard` (`label`, `value: '—'`, `hint`). QA checklist M7, T4, D4. |
| Home shows a recent-activity region or investor-facing empty copy. | Met | `src/routes/dashboard/index.tsx` renders `RecentActivity` with `items={[]}` and an investor `emptyMessage`. QA checklist M9, M10. |
| Persistent nav reaches Home, Portfolio, Deals, and Profile without leaving the shell. | Met | `src/components/dashboard/navConfig.ts` lists those four `{ label, to }` pairs. `Sidebar.tsx` and `MobileNav.tsx` both import `navItems`. Child routes live under `src/routes/dashboard/` and render through the layout `Outlet`. QA checklist M5, T2, D1. |
| Each of those four areas has its own page title or heading. | Partial | Portfolio, Deals, and Profile each have an `<h1>` in `src/routes/dashboard/portfolio.tsx`, `deals.tsx`, and `profile.tsx`. Home has no page heading. `src/routes/dashboard/route.tsx` always passes `title="Overview"` into `AppShell`, so the `Header` title does not change per area. |
| On a narrow screen, nav collapses or stacks and does not overlap content. | Met | `AppShell` hides the aside below `md`. `MobileNav` is `md:hidden`. QA checklist M3, M4, M5 (375px) and T2 (768px). |
| Empty holdings and empty activity states show a clear message, not a blank hole. | Met | `PortfolioSummary` and `RecentActivity` accept `emptyMessage` and render it when `holdings` / `items` are empty. Home passes empty arrays. QA checklist M8, M10. |
| No login, live balances, payments, or extra screens appear beyond the four areas. | Met | `navConfig.ts` has four entries only. There is no `src/routes/dashboard/activity.tsx`, no `src/lib/supabase.ts`, and `src/lib/user.ts` `getUser()` returns `null`. Home metric values are `'—'`. |

## 3. Decisions made (so the next topic does not re-litigate them)

- Layout route is `src/routes/dashboard/route.tsx` (`createFileRoute('/dashboard')`). Home is the index child at `src/routes/dashboard/index.tsx` (`createFileRoute('/dashboard/')`). The generated route tree nests the index under the layout. There is no hand-written children table.
- `AppShell` composes `Header`, `Sidebar`, `MobileNav`, and `<main id="main-content">`. Child pages render only inside that main via `<Outlet />`.
- `src/components/dashboard/navConfig.ts` is the single list of nav labels and paths. `Sidebar` and `MobileNav` both import `navItems` so the lists cannot drift.
- `MetricCard`, `PortfolioSummary`, and `RecentActivity` are separate presentational components. They take typed props. Sample arrays (`MOCK_PORTFOLIO_HOLDINGS`, `MOCK_RECENT_ACTIVITY`) are exported next to the components and are not baked into the JSX. Home currently passes empty arrays and demo metric objects, not a server loader.

## 4. Known limitations (honest baseline)

- All dashboard figures and lists are mock or empty. There is no Supabase client and no loader wired to a database.
- There is no authentication. Anyone who can load the app can open `/dashboard`.
- The shell is read-only. There are no forms that write holdings, deals, or profile data.
- The `Header` title is hardcoded to `"Overview"` in `src/routes/dashboard/route.tsx`, so every dashboard page shows the same title.
- Two `<header>` elements render: the TanStack starter header in `src/routes/__root.tsx` and the investor `Header` in `AppShell`. QA checklist M2 and T3 recorded this; it was not fixed in the QA pass.
- Portfolio, Deals, and Profile still wrap their placeholder copy in a nested `<main>` inside AppShell’s `<main id="main-content">`.
- `docs/dashboard-component-architecture.md` is not in this branch. `docs/component-plan.md` still names StatsCard and a dashboard Header that this tree did not follow.
- QA checklist rows M1–M10, T1–T6, D1–D6, and X1–X3 are filled (Pass). Cycles 2 and 3 in the fix log are unused, not open fails.

## 5. Recommended next sprint work

1. Pass a per-route title into `AppShell` so Header matches the active area, and add a Home page heading.
2. Remove the extra `<main>` wrappers on Portfolio, Deals, and Profile so each page has one main landmark.
3. Decide whether the starter header in `__root.tsx` stays on dashboard routes.
4. When real holdings are needed, add a loader or `createServerFn` on `src/routes/dashboard/index.tsx` (or the portfolio route) and pass `holdings` into `PortfolioSummary`. Do not fetch from the widget or from nav.
5. Keep auth, Supabase schema, payments, documents, tax exports, and charts as later topics. Do not add a fifth Activity nav item unless the requirements brief is updated.

## 6. Artifact index (for handoff package)

| Artifact | Path |
|----------|------|
| This handoff | `docs/stakeholder-handoff-dashboard.md` |
| Requirements brief (current) | `docs/preishare-dashboard-requirements.md` |
| Earlier client brief (superseded) | `docs/investor-dashboard-brief.md` |
| Information architecture | `docs/dashboard-ia.md` |
| Routing plan | `docs/dashboard-routing-plan.md` |
| Earlier component inventory | `docs/component-plan.md` |
| Responsive QA checklist (filled) | `docs/responsive-qa-checklist.md` |
| Layout route | `src/routes/dashboard/route.tsx` |
| Home index | `src/routes/dashboard/index.tsx` |
| Placeholder pages | `src/routes/dashboard/portfolio.tsx`, `deals.tsx`, `profile.tsx` |
| Shell | `src/components/dashboard/AppShell.tsx` |
| Header | `src/components/dashboard/Header.tsx` |
| Sidebar | `src/components/dashboard/Sidebar.tsx` |
| MobileNav | `src/components/dashboard/MobileNav.tsx` |
| Nav labels | `src/components/dashboard/navConfig.ts` |
| Widgets | `src/components/dashboard/MetricCard.tsx`, `PortfolioSummary.tsx`, `RecentActivity.tsx` |

Not in this branch: `docs/dashboard-component-architecture.md`.
