# PREIshare PR pain points and Sprint 6 CI goals

## Client need (in my own words)

PREIshare is a real-estate intelligence dashboard. When a teammate opens a pull request (a proposed change waiting for review), automation should prove the project still installs, typechecks, builds, lints, and tests. Humans still decide whether the change is good enough to merge.

## Current PR pain points

- Opening or updating a GitHub pull request does not trigger any shared cloud run. There is no `.github/` directory and no GitHub Actions workflows, so a PR can land with zero automated proof that the app still works.
- Local checks are easy to skip. A teammate may forget `npm install`, skip a TypeScript check, or merge without running `npm run build`. Nothing in the cloud catches that.
- There are no lint or test scripts to run yet. `package.json` only has `dev`, `generate-routes`, `build`, and `preview`. There is no `test`, `lint`, `format`, or `typecheck` script, and no ESLint, Prettier, Biome, Vitest, Jest, or Playwright config (and no `*.test.*` / `*.spec.*` files).
- Reviewers re-do “does it even build?” on their own machines instead of spending time on product, UX, and risk. Recent PRs (for example #60, #61, #62) did merge — they just had no cloud checks.
- There is no written line between what a machine should prove on every PR and what a human still owns. `AGENTS.md` and `docs/onboarding/repo-map.md` already note missing CI and missing lint/test scripts; this brief is that line.

## Automated CI goals (machines should do these on every PR)

- **Install** the single-package app (`preishare-org-repo`) in a clean environment from `package-lock.json`, so a missed local `npm install` cannot hide a broken install.
- **Typecheck** with TypeScript. The repo already has `tsconfig.json` (strict mode, `noEmit`). A named `typecheck` script is not in `package.json` yet, but a typecheck is possible later via `tsc`.
- **Build** the TanStack Start / React dashboard with the existing `npm run build` script, so broken production output cannot sneak onto `main`.
- **Lint** once lint scripts are confirmed. There is no `lint` script or linter config today; CI should run lint only after the team confirms those scripts exist.
- **Test** once test scripts are confirmed. There is no `test` script or test files today; CI should run tests only after the team confirms those scripts exist.
- **Fail the PR check clearly** when any of the steps above fail, so the author can see what broke without guessing.

Lint and test scripts are not in `package.json` yet, so CI will run them only after the team confirms those scripts. That is a current fact, not a promise that they already run.

## Human review stays in charge

- Approve or request changes. A green check is not a merge decision.
- Judge product fit, UX risk, security-sensitive logic, and data handling. Machines do not decide whether a listing change or dashboard copy is right.
- Decide to merge even if CI is green — and hold the merge if the change is wrong for the product even if checks pass.
- AI review prompts may assist later; a human remains accountable. AI does not merge the PR.
- Secrets and production access stay outside this sprint’s PR automation. `.env.example` lists env var **names** only (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). This sprint’s checks do not inject those values or use them.

## Out of scope for this sprint (do not solve in the goals brief)

- Full production deploy from the PR workflow (including Vercel production deploys).
- Replacing humans with auto-merge.
- Deep performance or load testing (there is no standard script for this).
- Inventing new app features unrelated to CI.
- Calling live embedding APIs on every PR, or injecting production secrets into the PR checks.

## Success signals

- Opening or updating a PR triggers a single clear CI workflow.
- Required checks run in a sensible order: install → typecheck → build → lint → test (lint and test only once those scripts are confirmed).
- Failures are visible on the PR.
- An AI-assisted review prompt pack exists that speeds humans without skipping judgment.
- Stakeholders can read a short handoff of what automation owns vs what humans own.
