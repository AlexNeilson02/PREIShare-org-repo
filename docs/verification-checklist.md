# PREIshare Investor Dashboard Shell — Verification Checklist

**Sprint:** 3 (TanStack Start UI shell)  
**Verifier:** Alex  
**Date:** 2026-10-01  
**App URL tested:** http://localhost:3000  
**Sources of truth:** `docs/investor-dashboard-brief.md`, `docs/dashboard-ia.md`, `docs/component-plan.md`

## How to use this checklist

- **Pass** — requirement met; evidence describes what you saw.
- **Fail** — in-scope shell issue; fix before handoff or note the fix commit.
- **Deferred** — intentionally out of scope for this sprint; reason required.

---

## 1. Routing and information architecture

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| R1 | `/dashboard` (or agreed home) loads dashboard home inside AppShell | Pass | Opened `/dashboard` — header title **Dashboard overview**; demo note, three stats cards, Portfolio summary, and Recent activity inside AppShell |
| R2 | `/dashboard/portfolio` loads portfolio page shell | Pass | Opened `/dashboard/portfolio` — header **Your portfolio**; **Your holdings** table with Property, Type, Invested, Current value, Status |
| R3 | `/dashboard/deals` loads deals page shell | Pass | Opened `/dashboard/deals` — header **Open deals**; Harbor View Residences, Summit Logistics Hub, and Pinecrest Medical Office cards |
| R4 | `/dashboard/profile` loads profile page shell | Pass | Opened `/dashboard/profile` — header **Your profile**; read-only Name, Email, Membership, Preferred contact, Notes |
| R5 | Unknown paths do not break the whole app (sensible fallback or framework 404) | Pass | `GET /this-path-does-not-exist` returned HTTP 404 with TanStack Start **Not Found**; app shell did not crash |

**IA notes:** URL map and nav labels match `docs/dashboard-ia.md` (Home, Portfolio, Deals, Profile under `/dashboard`). Header titles come from `navConfig` (`Dashboard overview`, `Your portfolio`, `Open deals`, `Your profile`) and stay investor-facing.

---

## 2. Navigation labels and active states

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| N1 | Sidebar/nav labels match brief/IA (Home/Dashboard, Portfolio, Deals, Profile) | Pass | Sidebar labels are Home, Portfolio, Deals, Profile — same four words as the IA |
| N2 | Active nav item highlights the current route | Pass | Active link uses `is-active` and `aria-current="page"`; Home is exact-only so it does not stay active on child routes |
| N3 | Header page title updates when changing routes | Pass | Home → Dashboard overview; Portfolio → Your portfolio; Deals → Open deals; Profile → Your profile |
| N4 | Nav links use client routing (no full page reload flash if applicable) | Pass | Sidebar uses TanStack Router `<Link>`; clicking Home → Portfolio → Deals → Profile updated the URL and content without a full document reload |

---

## 3. Layout shell and responsiveness

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| L1 | AppShell shows sidebar + header + main content on desktop | Pass | At 1280px, sidebar sits beside main; header title and `#main-content` widgets are visible; hamburger is hidden |
| L2 | Narrow viewport: nav remains usable (collapse, drawer, or stacked pattern) | Pass | At 390×844, sidebar is hidden until **Open navigation**; `aria-expanded` / `aria-controls="dashboard-sidebar"`; nav closes on route change |
| L3 | No permanent horizontal scroll on home/portfolio/deals/profile at ~375px width | Pass | At 390px the page shell did not require horizontal scroll; Portfolio table scrolls inside `dash-table-wrap` only |
| L4 | Main content remains readable; cards/tables stack or scroll intentionally | Pass | Stats: 1 col mobile, 2 at 640px, 3 at 1024px; deals cards stack; holdings table scrolls inside the card |
| L5 | Basic accessibility: buttons/links are keyboard-focusable; interactive controls have accessible names | Pass | Tab to hamburger (`aria-label="Open navigation"`), Enter opens nav, Tab to links with `:focus-visible` using `--lagoon-deep`; decorative menu icon is `aria-hidden="true"` |

---

## 4. Mock content clarity (demo readiness)

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| M1 | Dashboard home: stats cards show labeled mock investor metrics | Pass | Total portfolio value **$300,000** (Sample total), Open deals **3** (Sample count), Contributions YTD **$24,000** (Sample YTD); page note “Demo view — all figures are placeholders” |
| M2 | Portfolio summary / table shows clear placeholder holdings | Pass | Home summary: Sample Multifamily Fund A / Industrial Note B / Cash Reserve; Portfolio table: Riverfront Lofts, Cedar Business Park, Maple Street Retail with sample-data note |
| M3 | Deals list shows open-deal style placeholders | Pass | Cards show name, location, Min. $ amount, and Open / Closing soon / Waitlist badges; note “Sample deals — placeholders only, not live offerings”; no invest actions |
| M4 | Profile card shows member-style placeholder fields | Pass | Alex Morgan, `alex.morgan@example.com`, Preferred investor, Email, Southeast notes; note “Sample profile — placeholder details, not a live account”; no inputs or password UI |
| M5 | No raw "TODO" / empty broken panels on primary views | Pass | Walked Home, Portfolio, Deals, Profile — no TODO text, no leftover “will go here” placeholders |

---

## 5. Out-of-scope boundaries (must stay deferred)

| ID | Check | Status | Evidence / reason |
|----|--------|--------|-------------------|
| O1 | No real authentication / login gate required for shell demo | Deferred | Shell only; auth next sprint. `/dashboard` opens with no login |
| O2 | No live Supabase/PostgreSQL data — mock data only | Deferred | Widgets use `MOCK_*` constants and `formatCurrency`; sample-data notes on every primary view |
| O3 | No production deploy required for this verification | Deferred | Local dev server is enough (`http://localhost:3000`) |
| O4 | No payment, document vault, or admin tools added beyond brief | Pass | Four IA areas only; DealsList has no checkout/invest; ProfileCard is read-only |

---

## 6. Defects found and resolution

| Defect | Severity (blocker / polish) | Resolution | Re-check |
|--------|----------------------------|------------|----------|
| `src/styles.css` imported `./dashboard.css` instead of `./styles/dashboard.css`, so mobile collapse CSS did not load | blocker | Corrected import to `./styles/dashboard.css`; sidebar hides under 768px behind the menu toggle | Pass |

---

## 7. Sign-off for handoff

- [x] All **blocker** fails fixed or explicitly accepted with reason
- [x] Deferred items only cover agreed out-of-scope work
- [x] Shell is demoable against the PREIshare client story for Sprint 3

**Overall result:** Ready for stakeholder handoff

**Verifier signature:** Alex
