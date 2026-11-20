# PREIshare PR pain points and Sprint 6 CI goals

This note is the shared source of truth for Sprint 6 CI planning. It does not
define GitHub Actions YAML, secrets, or a production deploy. Later steps should
read this file before writing any workflow.

## Client need (in my own words)

When a teammate opens a PREIshare pull request today, GitHub does not run a
shared check that the TypeScript / TanStack Start / React dashboard still
installs and builds. The team needs the same automatic build-and-check run on
every proposed change so broken code is caught before it lands on `main`.
Humans still decide whether the change is good enough to merge; automation only
proves the project still installs, typechecks, builds, lints, and tests.

## Current PR pain points

Verified against this tree (no `.github/` folder, no Actions workflows, and
`package.json` scripts are only `dev`, `generate-routes`, `build`, and
`preview`):

- Teammates must remember to install dependencies on their own machines. A
  missed `npm install` is invisible to everyone else.
- Build, typecheck, lint, and test are easy to skip under time pressure. There
  is no named `typecheck`, `lint`, or `test` script today, so even a careful
  teammate has no single local command for the full check list.
- There is no consistent cloud run tied to opening or updating a pull request.
  GitHub Actions has zero workflows in this repo, so a PR can sit in review
  with no shared proof that the app still works.
- Broken code can reach the `main` branch because nothing blocks on shared
  checks. Pull requests do get opened and merged (recent examples include
  #60, #61, and #62); they just have no cloud checks.
- Reviewers spend energy re-running basic “does it build?” work on their own
  laptops instead of judging design, product fit, and risk.
- There is no shared written line between machine checks and human judgment
  (including any AI-assisted review help). `AGENTS.md` and
  `docs/onboarding/repo-map.md` already flag missing CI; this brief is that
  line.

## Automated CI goals (machines should do these on every PR)

These are goals, not a workflow file. Lint and test should run only after the
team confirms those scripts exist.

- Install project dependencies in a clean environment (npm, from
  `package-lock.json`).
- Run TypeScript typecheck.
- Build the TanStack Start / React dashboard (`npm run build` already exists).
- Run lint (once scripts are confirmed).
- Run tests (once scripts are confirmed).
- Fail the PR check clearly when any required step fails, so the author can
  see what broke without asking a teammate to try it locally.

## Human review stays in charge

- Approve or request changes on the pull request.
- Judge product and UX risk, security-sensitive logic, and data handling
  (including listing, auth, and Supabase-related changes).
- Decide whether to merge — even if CI is green. A passing check is not a
  merge decision.
- Use AI review prompts only as assistance; a human remains accountable for
  the merge decision. AI does not merge the PR.
- Manage secrets and production access outside the PR automation designed in
  this sprint. Do not put real keys in workflows, docs, or chat. Env var
  **names** already live in `.env.example`; this sprint’s PR checks should
  not inject those values.

## Out of scope for this sprint (do not solve in the goals brief)

- Full production deploy from the PR workflow (including Vercel production
  deploys).
- Replacing human reviewers with fully automated merge.
- Deep performance or load testing suites (there is no standard script for
  this).
- Inventing new app features unrelated to CI quality.
- Calling live embedding or other paid APIs on every PR, or injecting
  production secrets into PR checks.

## Success signals

- Opening or updating a PR triggers a single clear CI workflow.
- Required checks (install → typecheck → build → lint → test) run in a
  sensible order. Lint and test join that sequence only once their scripts
  are confirmed.
- Failures are visible on the PR without asking a teammate to “try it locally.”
- An AI-assisted review prompt pack exists that speeds humans up without
  skipping human judgment.
- Stakeholders can read a short handoff that explains what is automated vs
  human-owned.
