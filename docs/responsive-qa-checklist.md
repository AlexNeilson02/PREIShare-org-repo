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

---

## Mobile (~375px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| M1 | No horizontal page scroll |  |  |  |
| M2 | Header remains visible and usable |  |  |  |
| M3 | Desktop sidebar is hidden or off-canvas (not permanently covering content) |  |  |  |
| M4 | MobileNav or menu control is visible |  |  |  |
| M5 | Menu opens and closes navigation links |  |  |  |
| M6 | Main content readable without pinched text |  |  |  |
| M7 | Metric cards stack in a single column (or intentional narrow grid) |  |  |  |
| M8 | PortfolioSummary does not overflow or clip |  |  |  |
| M9 | RecentActivity list wraps; no cut-off timestamps/labels |  |  |  |
| M10 | Empty-state messaging (if shown) is fully visible |  |  |  |

## Tablet (~768px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| T1 | No horizontal page scroll |  |  |  |
| T2 | Navigation pattern matches plan (sidebar, rail, or menu—not both fighting) |  |  |  |
| T3 | Header + content spacing not cramped |  |  |  |
| T4 | Metric cards use a sensible 2-column (or planned) layout |  |  |  |
| T5 | PortfolioSummary and RecentActivity share space without overlap |  |  |  |
| T6 | Touch targets / click targets large enough to use |  |  |  |

## Desktop (~1280px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| D1 | Sidebar visible and usable per architecture |  |  |  |
| D2 | MobileNav hidden or not duplicating full sidebar awkwardly |  |  |  |
| D3 | Main region has comfortable padding/margins |  |  |  |
| D4 | Metric cards align in a multi-column row as planned |  |  |  |
| D5 | PortfolioSummary + RecentActivity sit in intended regions |  |  |  |
| D6 | Long labels/numbers do not break the header or sidebar width |  |  |  |

## Cross-cutting issues

| ID | Check | Status | Notes |
|----|--------|--------|-------|
| X1 | Focus order / keyboard: menu and links reachable |  |  |
| X2 | No layout jump when opening/closing mobile menu |  |  |
| X3 | Stacking order: important metrics appear before low-priority lists on small screens |  |  |

## Targeted fix log (one row per prompt cycle)

| Cycle | Breakpoint | File(s) touched | Prompt summary (one sentence) | Result after re-test |
|-------|------------|-----------------|-------------------------------|----------------------|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## Known limitations (optional)

List anything still imperfect that you are **not** fixing in this sprint, with a reason (e.g. “Chart library deferred to next topic”).

- 

## Sign-off

- [ ] Critical mobile checks M1–M7 pass
- [ ] Critical tablet checks T1–T5 pass
- [ ] Critical desktop checks D1–D5 pass
- [ ] Fix log filled for every change made during QA
- [ ] Touched components still match the architecture (no accidental full rewrite)

**Ready for stakeholder handoff draft:** Yes / No
