# PREIshare Investor Dashboard — Information Architecture

## Purpose
Investor dashboard shell where members scan portfolio value, browse open deals, and review their profile.
This sprint is the shell only: mock data placeholders, not live backend data or authentication.

## URL map and page purposes
| URL path | Route name | Nav label | Page purpose | Primary content |
|----------|------------|-----------|--------------|-----------------|
| `/dashboard` | Dashboard home | Home | Open the dashboard and immediately see a home overview (portfolio snapshot + recent activity placeholders). | Stats cards, portfolio summary placeholder, recent activity list placeholder |
| `/dashboard/portfolio` | Portfolio | Portfolio | Navigate to Portfolio without leaving the app shell. | Table or list shell for holdings (mock data OK) |
| `/dashboard/deals` | Deals | Deals | Navigate to Deals without leaving the app shell. | List shell of open/available deals (mock data OK) |
| `/dashboard/profile` | Profile | Profile | Navigate to Profile without leaving the app shell. | Profile card shell (name, contact placeholders) |

## Navigation rules
- Shared chrome: Sidebar + Header, main content region.
- Active nav item matches the current URL path.
- Nav labels are 1–3 words: Home, Portfolio, Deals, Profile.
- On narrow screens the Sidebar nav collapses or stacks above content. It never overlaps content.
- All four pages are nested under `/dashboard` so one parent layout wraps them.

## Mock data rule
Every placeholder area shows a visible "Mock data" label so stakeholders know the data is not live.

## Out of scope
- Real sign-in / authentication and authorization
- Live Supabase/PostgreSQL portfolio or deals data
- Payments, subscriptions, or document e-sign
- Admin CRUD tools for managing investors or deals
- Production deployment hardening and CI beyond basic project setup

## Notes for later route files
- Parent layout route: dashboard
- Child routes: index (home), portfolio, deals, profile
