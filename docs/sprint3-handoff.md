# Sprint 3 Handoff — PREIshare Investor Dashboard Shell

## Stakeholder summary

We built a clean, trustworthy investor dashboard **shell** for PREIshare members.
An investor can open the dashboard, scan portfolio value, browse open deals, and
review a profile without hunting through extra pages. The four areas are Home,
Portfolio, Deals, and Profile. Figures and lists are **sample placeholders**,
labeled as such, so the layout can be demoed before live account data is wired
in. There is no sign-in and no live bank or market feed in this sprint.

Alex verified the shell on 2026-10-01 at `http://localhost:3000`. Overall
result: **Ready for stakeholder handoff**.

## What shipped

- TanStack Start + TypeScript app at the repo root (`package.json` name
  `preishare-org-repo`)
- File-based routes (parent layout `src/routes/dashboard.tsx` wraps children in
  `AppShell`):
  - `/dashboard` — Home (`src/routes/dashboard/index.tsx`)
  - `/dashboard/portfolio` (`src/routes/dashboard/portfolio.tsx`)
  - `/dashboard/deals` (`src/routes/dashboard/deals.tsx`)
  - `/dashboard/profile` (`src/routes/dashboard/profile.tsx`)
- Shared layout:
  - `src/components/layout/AppShell.tsx`
  - `src/components/layout/Sidebar.tsx`
  - `src/components/layout/Header.tsx`
  - `src/components/layout/NavItems.tsx`
  - `src/components/layout/navConfig.ts` (labels, paths, and header titles)
- Home widgets:
  - `src/components/dashboard/StatsCard.tsx`
  - `src/components/dashboard/PortfolioSummary.tsx`
  - `src/components/dashboard/RecentActivity.tsx`
- Area shells:
  - `src/components/dashboard/PortfolioTable.tsx`
  - `src/components/dashboard/DealsList.tsx`
  - `src/components/dashboard/ProfileCard.tsx`
- Responsive and basic accessibility polish in `src/styles/dashboard.css`
  (imported from `src/styles.css`)
- Verification checklist: `docs/verification-checklist.md`

**Verification result** (Alex, 2026-10-01): all in-scope checks **Pass**
(R1–R5, N1–N4, L1–L5, M1–M5). O1–O3 **Deferred** (no auth, no live data, local
dev only). O4 **Pass** (no payments, document vault, or admin tools). One
blocker (dashboard CSS import path) was fixed and re-checked **Pass**.

Header titles from `navConfig`: Home → **Dashboard overview**; Portfolio →
**Your portfolio**; Deals → **Open deals**; Profile → **Your profile**.

## How to run locally (cold start)

1. Install dependencies with npm (this repo has `package-lock.json`):

   ```bash
   npm install
   ```

2. Start the Vite dev server. `package.json` script `dev` is
   `vite dev --port 3000`:

   ```bash
   npm run dev
   ```

3. Open http://localhost:3000/dashboard

Other scripts in `package.json`: `npm run build`, `npm run preview`,
`npm run generate-routes`. There is no `test`, `lint`, or `typecheck` script.

## Short demo script

1. Open http://localhost:3000/dashboard. Sidebar **Home** is active. Header
   reads **Dashboard overview**. Point out Total portfolio value ($300,000),
   Open deals (3), Contributions YTD, then Portfolio summary and Recent
   activity. Note the banner: “Demo view — all figures are placeholders.”
2. Click **Portfolio**. Header becomes **Your portfolio**. Walk the holdings
   table (Property, Type, Invested, Current value, Status).
3. Click **Deals**. Header becomes **Open deals**. Point at status badges
   (Open, Closing soon, Waitlist) and Min. $ amounts. No invest button.
4. Click **Profile**. Header becomes **Your profile**. Read-only name, email,
   membership, preferred contact, and notes.
5. Narrow the window below 768px. Use **Open navigation** to reach the same
   four links. Say clearly: these values are sample placeholders for Sprint 3.

## Known limitations

- No real authentication or authorization (`/dashboard` opens with no login;
  checklist O1 Deferred)
- Portfolio, deals, and profile content are mock/static:
  `MOCK_HOLDINGS`, `MOCK_ACTIVITY`, `MOCK_DEALS`, `MOCK_PROFILE`, plus
  `isSampleData` banners. Home stats are inline sample strings in
  `src/routes/dashboard/index.tsx`. `StatsCard` has no `MOCK_*` constant.
- No `src/lib/supabase.ts`, no `supabase/` folder, no PostgreSQL or pgvector
  in this tree (checklist O2 Deferred)
- No `.github/` workflows; no GitHub Actions CI
- `package.json` has no `test`, `lint`, or `typecheck` scripts
- Not production-hardened (no live empty/loading/error API states; Profile
  has no edit or password flow by design)
- Full visual brand system is not in this sprint (brief assumption)

## Recommended next-sprint work

1. Supabase auth and protected dashboard routes
2. Replace mock widgets with live portfolio / deals queries via route loaders
   or server functions
3. pgvector-powered search for deals or documents once data lives in Postgres
4. GitHub Actions CI (install, typecheck, test, lint on pull requests).
   **CI needs `test`, `lint`, and `typecheck` scripts in `package.json` first**
   — they are not defined yet.
5. Empty, loading, and error states for each data widget when live data lands

## References

- Client brief: `docs/investor-dashboard-brief.md`
- IA: `docs/dashboard-ia.md`
- Components: `docs/component-plan.md`
- Verification: `docs/verification-checklist.md`
- Architecture decisions: `docs/architecture-decisions.md` (next handoff doc)
