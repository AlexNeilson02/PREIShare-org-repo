# PREIshare PR CI — Pipeline Design

## Purpose
Plain-language design for automated checks on every pull request for the
PREIshare dashboard. This document is the source of truth for the GitHub
Actions workflow we will write next. It does **not** deploy anything and
does **not** replace human review.

It consumes:
- [`docs/ci/pr-pain-and-goals.md`](pr-pain-and-goals.md)
- [`docs/ci/ci-concepts-notes.md`](ci-concepts-notes.md)
- [`docs/ci/project-ci-inventory.md`](project-ci-inventory.md)

**Director note (inventory over generic Node):** a generic recipe would run
lint → typecheck → test → build. This repo has **no** `lint`, `typecheck`,
or `test` scripts (inventory: MISSING). The first workflow may only run
checks Bucket A already proved: clean install + `npm run build`. Missing
scripts are gaps, not commands.

## Trigger
- Event: `pull_request` (open **and** update/synchronize, not only the first
  push, and not only `workflow_dispatch`)
- Branches: PRs targeting **`main`** (the integration branch used in this
  fork)
- Goal: every proposed change gets the same install → build loop before
  merge discussion continues
- Not a trigger for this pipeline: push-only-to-`main` after merge, manual
  click-only, or deploy events

## Ordered stages (happy path)

Generic Node order (scaffold) vs what PREIshare can actually run today:

| # | Stage | In first PREIshare PR job? | Reason |
| --- | --- | --- | --- |
| 1 | **Checkout** — fetch the PR commit | **Required** | Runner must have the proposed code |
| 2 | **Setup Node** — Node.js for this app | **Required** | `npm ci` / `vite build` need Node. No `.nvmrc` or `package.json` `engines`; use **Node 22** (current LTS; matches `@types/node` ^22 in inventory) until the team pins a file |
| 3 | **Install dependencies** — `npm ci` from `package-lock.json` | **Required** | Forgotten local install is a named pain; lockfile is the source of truth |
| 4 | **Lint** | **Gap — skip** | No lint script or ESLint/Prettier/Biome config |
| 5 | **Typecheck** | **Gap — skip** | No `typecheck` / `tsc` script. Do not call `npm run typecheck`. Inventory forbids inventing it even though `typescript` is a dependency |
| 6 | **Test** | **Gap — skip** | No `test` script, no test runner, no `*.test.*` / `*.spec.*` |
| 7 | **Build** — `npm run build` (`vite build`) | **Required** | Only named quality script; inventory verified it on a clean machine with no `.env` |

**PREIshare required order (written reason for dropping 4–6):**

1. Checkout
2. Setup Node 22
3. `npm ci`
4. `npm run build`

Install must come before build (`node_modules` required). Lint/typecheck
cannot run “cheaper/faster first” until those scripts exist. Do not run
`dev`, `preview`, or `generate-routes` in this job (`dev`/`preview` are
servers; `generate-routes` rewrites committed `src/routeTree.gen.ts`).

## Commands / scripts (from inventory)

Every cell is from `docs/ci/project-ci-inventory.md`. If a script is
missing, the stage is a **gap** — no fake command.

| Stage | Script or command (from project-ci-inventory) | Required on PR? |
|-------------|-----------------------------------------------|-----------------|
| Checkout | GitHub Actions checkout of the PR SHA (not an npm script) | **Yes** |
| Setup Node | Node **22** (LTS). No `.nvmrc` / `engines` in the repo | **Yes** (version pin is a documented gap) |
| Install | `npm ci` (npm, `package-lock.json`; **not** pnpm/yarn; leftover `pnpm` key in `package.json` is not a lockfile) | **Yes** |
| Lint | **gap** — `lint` script MISSING | **No** |
| Typecheck | **gap** — `typecheck` script MISSING. Do not use `npm run typecheck` or an undeclared `tsc --noEmit` as if it were a team script | **No** |
| Test | **gap** — `test` script MISSING | **No** |
| Build | `npm run build` (`vite build`) | **Yes** |

When a human later adds `lint` / `typecheck` / `test` scripts to
`package.json`, insert them **after install and before build**, then update
this design. Until then, YAML that calls those names is wrong.

## Failure policy
- Any **required** stage failing (checkout, setup Node, `npm ci`,
  `npm run build`) → the CI job fails (red X on the PR).
- Do **not** add `continue-on-error: true` (or equivalent) for those gates.
  A job that always exits 0 is CI washing (`ci-concepts-notes.md`).
- There are **no optional/experimental checks** in this first pipeline.
  Do not add a second job that “looks busy” (Vercel is not this workflow;
  embedding seed is not this workflow).
- Humans still decide merge; CI only reports whether automated gates
  passed. Green is not auto-merge. Branch protection (required status
  checks) is a later human/admin setting, not this design’s YAML.

## Caching intent
- Cache **npm dependency downloads** keyed on `package-lock.json` so
  repeated PR pushes install faster. Exact cache action names land in YAML
  later; intent only here.
- Do **not** cache `.output/`, `dist/`, or other build artifacts across
  unrelated PRs — that can hide a broken `vite build`.
- Do not restore `node_modules` from a different lockfile or package
  manager.

## Environment and secrets
- First PR job runs with committed config only. Inventory: `npm ci` and
  `npm run build` succeeded **without** a `.env`.
- Do **not** inject `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
  `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `EMBEDDING_API_KEY`, or `EMBEDDING_MODEL` into this workflow.
- No production secrets in PR CI logs. Names may appear in this design
  doc; values never do.
- Do not connect PR CI to production (or shared) Supabase projects.
- A green build does **not** prove login, listing CRUD, or search work.

## Explicitly out of scope for this PR pipeline
- Production or staging **deploy** (including Vercel production from this
  workflow). A Vercel Git integration preview is a separate product; it is
  not a substitute for this install+build job.
- Live **Supabase** schema migrations or data mutations against
  shared/prod projects (`supabase/migrations/*.sql` stays operator-owned).
- `npx tsx scripts/seed-property-embeddings.ts`, live embedding API calls,
  or `match_properties` search in CI (cost, secrets, Bucket B).
- `npm run dev`, `npm run preview`, `npm run generate-routes` as quality
  gates.
- `npm audit` as a required gate (inventory: findings exist; not a script
  or a team decision yet).
- Manual QA, product acceptance, UX, RLS/security intent, and final merge
  approval (human review — Bucket C).
- AI auto-merge or unattended approval of PRs. An AI “LGTM” does not
  replace a red X.

## Mapping back to PREIshare goals
- Pain addressed:
  - Forgotten local `npm install` → required `npm ci` on every PR
  - “Does it build?” repeated on laptops → required `npm run build` on a
    shared runner
  - No cloud run when a PR opens (#60–#62 merged with no checks) →
    `pull_request` trigger on `main`
  - Inconsistent machines → one Node 22 runner + lockfile install
- Inventory sources:
  - Bucket A rows: `npm ci`, `npm run build`
  - Missing-script rows: lint / typecheck / test stay gaps
  - Bucket B: secrets, embeddings, migrations, Vercel stay out
  - Bucket C: merge, product, security stay human
- Human boundary: CI is a consistent green/red signal; reviewers still own
  judgment. Later AI review prompts support—not replace—that judgment
  (`pr-pain-and-goals.md`, `ci-concepts-notes.md`).

## Open questions / gaps
- [x] Any CI-ready script missing from package.json? **Yes:** `typecheck`,
  `lint`, `test` are MISSING. First YAML must not call them.
- [x] Node version source of truth unclear? **Yes:** no `.nvmrc` / `engines`.
  This design picks **Node 22** until the team pins one.
- [x] Tests that need a database: **blocked** — no test suite. Live
  Supabase tests stay out until a safe (non-prod) setup exists; they are
  not mocked in this pipeline.
- [ ] Should GitHub later require this job to pass before merge
  (branch protection), or is a visible red X enough for v1?
- [ ] After someone adds `typecheck` / `lint` / `test` scripts, who updates
  this design and the workflow in the same PR as those scripts?

## Sign-off for next step
When this design is stable, Step 6 may scaffold
`.github/workflows/pr-ci.yml` from these stages **only**:

1. Checkout the PR
2. Setup Node 22
3. `npm ci` (npm cache keyed on `package-lock.json`)
4. `npm run build`

No extra scope: no deploy, no secrets, no live Supabase, no invented
`lint` / `typecheck` / `test` commands, no `continue-on-error` on required
steps.
