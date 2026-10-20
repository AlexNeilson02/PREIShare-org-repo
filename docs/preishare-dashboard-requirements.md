# PREIshare Investor Dashboard — Requirements Brief

## 1. Product context

PREIshare needs an investor-facing dashboard shell as a home base for
portfolio metrics, recent activity, and navigation. This sprint delivers the
shell only: layout plus placeholder content, not live data or account
management. This brief supersedes
[`docs/investor-dashboard-brief.md`](investor-dashboard-brief.md), which stays
in the repo as the earlier draft.

## 2. Primary actor and goals

The primary actor is the **Investor**. On a first visit they should:

- Recognize they are in the PREIshare investor area.
- Navigate between Home, Portfolio, Deals, and Profile without getting lost.
- See high-level metrics at a glance.
- Scan recent activity on the home overview.

## 3. Primary screens (this sprint)

The four investor areas match `src/components/dashboard/navConfig.ts` and the
Navigation labels in [`docs/dashboard-routing-plan.md`](dashboard-routing-plan.md):
Home, Portfolio, Deals, and Profile. There is no fifth Activity screen.

| Screen | Purpose | In this sprint? |
|--------|---------|-----------------|
| Dashboard home (`/dashboard`) | Home overview: metrics, portfolio summary placeholder, recent activity placeholder | Yes |
| Portfolio (`/dashboard/portfolio`) | Minimal placeholder page for holdings | Yes, minimal |
| Deals (`/dashboard/deals`) | Minimal placeholder page for open deals | Yes, minimal |
| Profile (`/dashboard/profile`) | Minimal placeholder page for member name and contact | Yes, minimal |
| Login / signup | Sign-in and account creation | No, later |
| Live portfolio detail and trades | Live holdings, balances, and trade flows | No, later |

## 4. Dashboard layout regions (must describe in UI work)

- **Header.** Brand the PREIshare investor area and show the current page title.
- **Navigation.** Persistent labels from `navConfig.ts`: Home, Portfolio, Deals,
  Profile. Sidebar on desktop; mobile nav on small screens. Must not overlap
  content.
- **Metrics region.** Home-only placeholder metric cards (portfolio value,
  investments, distributions) so the investor can scan figures at a glance.
- **Activity region.** Home-only recent-activity list or empty-state copy. This
  is a region on Home, not its own nav area.
- **Main content area.** The layout outlet. Child pages (Home, Portfolio,
  Deals, Profile) render here without replacing the shell.

## 5. Must-have vs later

**Must-have (this sprint)**

- File-based `/dashboard` routes for the four areas (layout + Home index +
  Portfolio, Deals, Profile).
- `AppShell` composing header, navigation, and main.
- Responsive behavior: sidebar on desktop, mobile nav on small screens, no
  broken overlap.
- Placeholder metric cards and activity list on Home.
- Empty-state messaging when holdings or activity lists are empty.
- Clear nav labels matching Home, Portfolio, Deals, and Profile.

**Later (out of scope now)**

- Real Supabase queries and balances
- Authentication and roles
- Payments
- Documents vault
- Tax exports
- A full design system
- Charts that need live time-series data

## 6. Success criteria (how we know the shell is done)

Observable in a browser:

- [ ] Opening `/dashboard` shows the PREIshare investor shell (header, nav, main).
- [ ] Home shows placeholder metric cards that can be scanned at a glance.
- [ ] Home shows a recent-activity region or investor-facing empty copy.
- [ ] Persistent nav reaches Home, Portfolio, Deals, and Profile without leaving
      the shell.
- [ ] Each of those four areas has its own page title or heading.
- [ ] On a narrow screen, nav collapses or stacks and does not overlap content.
- [ ] Empty holdings and empty activity states show a clear message, not a blank
      hole.
- [ ] No login, live balances, payments, or extra screens appear beyond the four
      areas.

## 7. Notes for AI-assisted build

Implementation prompts should attach or quote this file for scope control.
Work goes in small milestones (one layout, one widget, or one page at a time).
Reject agent output that adds screens, data, or features listed under Later —
including a fifth Activity route, auth, Supabase, payments, or a design system.
Use TypeScript, TanStack Start file-based routes, reusable presentational
components, and placeholder or empty props only.
