# PREIshare Investor Dashboard — Component Inventory

## Scope
Reusable UI pieces for a responsive investor dashboard shell.
Mock data only; no real API calls.

**Layout components**

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| AppShell | Page frame combining Sidebar, Header, and main content. | Home, Portfolio, Deals, Profile | Own page widgets or load data. |
| Sidebar | Renders nav links from navConfig on ALL screen widths; collapses or stacks on narrow screens. | Home, Portfolio, Deals, Profile | Define its own nav list or show page titles. |
| Header | Shows the current page title (read from navConfig) and a placeholder user area. | Home, Portfolio, Deals, Profile | Define the nav list. |
| navConfig | The single source of nav labels, paths, and page titles. | Home, Portfolio, Deals, Profile | Render anything. |

**Dashboard home widgets**

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| StatsCard | One metric label + value (+ optional hint). | Home | Load data or own page layout. |
| PortfolioSummary | Short snapshot of portfolio value. | Home | Replace the full portfolio table. |
| RecentActivity | Simple list of recent mock events. | Home | Own navigation. |

**Page-level shells**

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| PortfolioTable | Table of mock holdings. | Portfolio | Use live market data. |
| DealsList | List or cards of mock open deals. | Deals | Include checkout, subscribe, or invest actions. |
| ProfileCard | Mock member name and contact only. | Profile | Include preferences, password change, or auth. |

- Every widget that shows placeholder content displays a visible "Mock data" label.

## Composition rules
1. One job per component. If two rows describe the same job, merge or delete one.
2. Layout components wrap pages. Page widgets never re-implement the shell.
3. Mock data may be inline constants for this sprint.
4. Names are locked. Do not rename without updating both docs.

## Mapping check (IA ↔ components)
- Home → StatsCard, PortfolioSummary, RecentActivity inside AppShell
- Portfolio → PortfolioTable inside AppShell
- Deals → DealsList inside AppShell
- Profile → ProfileCard inside AppShell
