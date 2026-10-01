# Architecture Decisions — PREIshare Dashboard Shell (Sprint 3)

These decisions describe the Sprint 3 investor dashboard shell as it exists in
this tree. They are not a license to swap the stack. If the working tree and
this file disagree, trust the tree and update this file.

## ADR-001: TanStack Start with file-based routes

- **Context:** The brief and IA need one URL per investor area (`/dashboard`,
  `/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile`) and room to
  attach data loading later without a framework rewrite. Agent rules lock the
  stack to TanStack Start + TypeScript + file-based TanStack Router under
  `src/routes/`.
- **Decision:** Implement those four areas as file-based routes. Parent layout
  `src/routes/dashboard.tsx` wraps an `<Outlet />` in `AppShell`. Child files
  live in `src/routes/dashboard/` (`index.tsx`, `portfolio.tsx`, `deals.tsx`,
  `profile.tsx`). Each file exports `Route` via `createFileRoute`. Do not
  hand-edit `src/routeTree.gen.ts`.
- **Consequences:** Sidebar paths match the IA. Later, loaders or
  `createServerFn` can attach per route. A teammate should not replace this
  with Next.js/Remix or invent an `apps/` workspace.

## ADR-002: Shared AppShell layout

- **Context:** Every investor page needs the same chrome: sidebar, header, and
  main content (`docs/component-plan.md`, `docs/dashboard-ia.md`).
- **Decision:** `src/components/layout/AppShell.tsx` composes `Sidebar` and
  `Header` and renders `<main id="main-content">`. `src/routes/dashboard.tsx`
  is the only dashboard parent that mounts `AppShell`. Page files only render
  area widgets.
- **Consequences:** Layout and mobile nav state live in one place (`navOpen`,
  close-on-route-change). Page components must not re-implement the shell.
  Do not scatter a second sidebar or header inside Portfolio/Deals/Profile.

## ADR-003: Central nav config

- **Context:** Labels, paths, and header titles must stay aligned with the IA
  (Home, Portfolio, Deals, Profile) and must not drift between Sidebar and
  Header.
- **Decision:** `src/components/layout/navConfig.ts` is the only place those
  three fields are defined (`dashboardNavItems`, `getPageTitle`).
  `NavItems.tsx` maps the array to TanStack Router `<Link>`s with
  `activeProps` and `activeOptions={{ exact: true }}` on `/dashboard` so Home
  is not active on child routes. `Header.tsx` calls `getPageTitle(pathname)`
  (exact path, then longest prefix; fallback `"Dashboard"`).
- **Consequences:** A new dashboard area needs a `navConfig` entry **and** a
  route file. Do not hardcode nav labels or header titles in `Sidebar`,
  `Header`, or route files. Do not drop exact-match on Home.

## ADR-004: Mock data boundary for the shell

- **Context:** Sprint 3 is a trustworthy UI shell, not live finance data. The
  brief forbids auth and live Supabase/PostgreSQL.
- **Decision:** Widgets are presentational. They take props and default to
  in-file `MOCK_*` constants (`MOCK_HOLDINGS`, `MOCK_ACTIVITY`, `MOCK_DEALS`,
  `MOCK_PROFILE`). `isSampleData` defaults to `true` and shows a visible
  `role="note"` banner. There is no fetch, no route loader data, and no
  server function on these pages. Home stats strings live in
  `src/routes/dashboard/index.tsx`; `StatsCard` has no `MOCK_*` of its own.
  `src/lib/format.ts` only formats USD. `src/lib/user.ts` `getUser()` still
  returns `null`.
- **Consequences:** Next sprint can replace mocks at component/route
  boundaries. Do not add a fake API module that pretends to be production, a
  Supabase client, or hidden `VITE_*` secrets to “complete” `.cursorrules`.

## ADR-005: Responsive CSS + accessibility baseline

- **Context:** Investors use phone and desktop; the IA says nav must stay
  usable and must not overlap content.
- **Decision:** `src/styles/dashboard.css` (imported from `src/styles.css` as
  `./styles/dashboard.css`) defines `dash-*` layout. Breakpoints: sidebar
  drawer below **768px** (`display: none` until `.dash-shell.nav-open`);
  sidebar beside main at **768px+** (matches Tailwind `md:`). Card grids:
  1 column, 2 at **640px**, 3 at **1024px**. Tables scroll inside
  `.dash-table-wrap`, not the page. Nav links and header buttons have a
  **44px** minimum. `:focus-visible` outline uses existing token
  `--lagoon-deep`. Header menu button:
  `aria-label="Open navigation"`, `aria-expanded`,
  `aria-controls="dashboard-sidebar"`. `prefers-reduced-motion` disables
  transitions.
- **Consequences:** Demo quality is good enough for Sprint 3 (checklist L1–L5
  Pass). Do not remove the toggle, the `nav-open` wiring, or focus outlines.
  A full a11y audit is still due before production.

## ADR-006: Persistent agent constraint file

- **Context:** This repo is a single-package TanStack Start app. Agents and
  newcomers otherwise invent `apps/`, Next.js, or a Supabase client that is
  not in the tree.
- **Decision:** `.cursor/rules/preishare.mdc` (`alwaysApply: true`) is the
  always-on constraint list, aligned with root `AGENTS.md`. Identity: one
  package named `preishare-org-repo`. Stack: TypeScript strict, TanStack
  Start, Vite 8, Tailwind CSS v4, **npm**. Do not create Supabase, auth, or
  CI unless a human tasks it. Trust the working tree over stale maps.
- **Consequences:** Agents keep diffs small and stay on `src/routes/`,
  `src/components/`, and `docs/`. Do not delete or ignore this file to
  “modernize” the repo. Update it when `docs/onboarding/repo-map.md` is
  proven wrong.

## Next-sprint foundations (do not reverse casually)

| Foundation | Why it builds on this shell |
| --- | --- |
| Supabase auth | Protect `/dashboard/*` and personalize header/profile. `getUser()` is a null stub today; there is no login gate. |
| Live portfolio data | Replace `MOCK_*` and home inline stats via route loaders or `createServerFn` without rewriting AppShell. |
| pgvector search | Add search UI on deals/docs once data lives in Postgres. There is no `supabase/` folder or pgvector in this tree yet. |
| GitHub Actions CI | Gate PRs with install / typecheck / test / lint on this single package. `package.json` has **no** `test`, `lint`, or `typecheck` scripts yet — add those before CI. |

## Explicit non-goals for Sprint 3

From `docs/investor-dashboard-brief.md` and the verification checklist:

- Real sign-in / authentication and authorization
- Live Supabase/PostgreSQL portfolio or deals data
- Payments, subscriptions, or document e-sign
- Admin CRUD tools for managing investors or deals
- Production deployment hardening and CI beyond basic project setup
- Final visual brand system
- Real money movement, trading, or compliance workflows
- Inventing `apps/`, `packages/`, or a second framework
