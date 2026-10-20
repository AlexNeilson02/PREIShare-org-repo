# PREIshare dashboard — responsive QA checklist

**Tester:** Alex Neilson
**Date:** 2026-10-20
**App URL tested:** http://localhost:3000/dashboard
**Build / branch:** cursor/dashboard-layout-route-1cd8

## Breakpoints used

| Name    | Width  | How to set                          |
|---------|--------|-------------------------------------|
| Mobile  | 375px  | Devtools device toolbar             |
| Tablet  | 768px  | Devtools device toolbar             |
| Desktop | 1280px | Devtools device toolbar             |

## How to use this sheet

1. Load the dashboard route with the dev server running.
2. For each row, set the width, perform the check, mark **Pass** or **Fail**.
3. On Fail, write a short **Symptom** and which **file** you will ask the agent to touch.
4. After a targeted fix, re-test and update **Status** and **Fix notes**.
5. Critical rows must Pass (or be listed under Known limitations with stakeholder-safe wording).

This pass used Chrome headless at 375×812, 768×1024, and 1280×800 against `http://localhost:3000/dashboard` (measured `scrollWidth`/`clientWidth`, computed display, bounding boxes, and a live Open/Close menu click).

---

## Mobile (~375px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| M1 | No horizontal page scroll | Pass | `scrollWidth` 375 = `clientWidth` 375. No overflow-x. | No code change. |
| M2 | Header remains visible and usable | Pass | Dashboard header (`PREIshare` / Overview) is on-screen at y=129, 375×74. A second sticky starter header sits above it (see Known limitations). | No code change. Dual header left as a known limitation. |
| M3 | Desktop sidebar is hidden or off-canvas (not permanently covering content) | Pass | `aside[aria-label="Dashboard sidebar"]` computed `display: none`. Main content starts at x=16. | No code change. |
| M4 | MobileNav or menu control is visible | Pass | “Open menu” button visible at 102×38, y=91, between the two headers. | No code change. |
| M5 | Menu opens and closes navigation links | Pass | Click opened `#mobile-dashboard-menu` with `/dashboard`, `/portfolio`, `/deals`, `/profile`. Button became “Close menu” (`aria-expanded=true`). Second click removed the nav. | No code change. |
| M6 | Main content readable without pinched text | Pass | Metric card text is 16px; cards are 343px wide inside the 375px view. | No code change. |
| M7 | Metric cards stack in a single column (or intentional narrow grid) | Pass | Key-metrics grid is one column (`343px`). Three cards stacked at y=227, 397, 568. | No code change. |
| M8 | PortfolioSummary does not overflow or clip | Pass | Section is 343×126 at x=16. Empty copy fully inside the card. | No code change. |
| M9 | RecentActivity list wraps; no cut-off timestamps/labels | Pass | Empty-state list region is 343×126; heading and copy wrap inside the card. | No code change. |
| M10 | Empty-state messaging (if shown) is fully visible | Pass | Both investor empty strings are present and fully in view. | No code change. |

## Tablet (~768px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| T1 | No horizontal page scroll | Pass | `scrollWidth` 768 = `clientWidth` 768. | No code change. |
| T2 | Navigation pattern matches plan (sidebar, rail, or menu—not both fighting) | Pass | Sidebar `display: block` at 256px. MobileNav parent `display: none`. Only the sidebar is active. | No code change. |
| T3 | Header + content spacing not cramped | Pass | Dashboard header 74px under the 73px starter bar. Main padding `24px 16px`. Cards start at y=171 with a gap under the chrome. | No code change. Dual header noted under Known limitations. |
| T4 | Metric cards use a sensible 2-column (or planned) layout | Pass | Grid is `232px 232px`. Two cards on the first row, Distributions wraps to a second row. | No code change. |
| T5 | PortfolioSummary and RecentActivity share space without overlap | Pass | Stacked in one column (480px) at y=540 and y=670. Bounding boxes do not overlap. | No code change. |
| T6 | Touch targets / click targets large enough to use | Pass | Sidebar links are block rows with `py-2`; sidebar is 256px wide and fully visible. | No code change. |

## Desktop (~1280px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| D1 | Sidebar visible and usable per architecture | Pass | Sidebar `display: block`, 256px, with Home / Portfolio / Deals / Profile. | No code change. |
| D2 | MobileNav hidden or not duplicating full sidebar awkwardly | Pass | MobileNav parent `display: none`. Open-menu control has a 0×0 box. | No code change. |
| D3 | Main region has comfortable padding/margins | Pass | `main#main-content` padding `24px 16px`. Cards sit at x=272 beside the 256px rail. | No code change. |
| D4 | Metric cards align in a multi-column row as planned | Pass | Grid is `320px 320px 320px`. All three cards share y=171. | No code change. |
| D5 | PortfolioSummary + RecentActivity sit in intended regions | Pass | Side-by-side at x=272 and x=776, both y=349, 488px each, no overlap. | No code change. |
| D6 | Long labels/numbers do not break the header or sidebar width | Pass | Header stays 1280px wide. Sidebar stays 256px. Placeholder “—” values do not expand the rail. | No code change. |

## Cross-cutting issues

| ID | Check | Status | Notes |
|----|--------|--------|-------|
| X1 | Focus order / keyboard: menu and links reachable | Pass | Mobile menu button exposes `aria-expanded` / `aria-controls`. Sidebar and menu links are real `Link` hrefs to the four dashboard paths. |
| X2 | No layout jump when opening/closing mobile menu | Pass | Opening the menu grew the document by 164px (expected insert of the link list) and did not overlay the metric cards. Close restored the closed state. |
| X3 | Stacking order: important metrics appear before low-priority lists on small screens | Pass | At 375px, metric cards (y=227–723) sit above PortfolioSummary (y=746) and RecentActivity (y=888). |

## Targeted fix log (one row per prompt cycle)

| Cycle | Breakpoint | File(s) touched | Prompt summary (one sentence) | Result after re-test |
|-------|------------|-----------------|-------------------------------|----------------------|
| 1 | 375 / 768 / 1280 | none | Measure `/dashboard` at the three checklist widths and only change layout files if a critical row fails. | All critical rows Pass. No code change was needed. |
| 2 |  |  |  | unused |
| 3 |  |  |  | unused |

## Known limitations (optional)

List anything still imperfect that you are **not** fixing in this sprint, with a reason (e.g. “Chart library deferred to next topic”).

- Two `<header>` elements render on every dashboard width: the TanStack starter header in `src/routes/__root.tsx` plus the investor `Header` inside `AppShell`. Both stay usable. Fixing it would mean editing the global root shell, which is out of this QA pass.
- Live balances, charts, and time-series widgets are not in this shell (placeholder “—” metrics and empty lists only).

## Sign-off

- [x] Critical mobile checks M1–M7 pass
- [x] Critical tablet checks T1–T5 pass
- [x] Critical desktop checks D1–D5 pass
- [x] Fix log filled for every change made during QA
- [x] Touched components still match the architecture (no accidental full rewrite)

**Ready for stakeholder handoff draft:** Yes
