# PREIshare dashboard — CI project inventory

## Purpose
List what this repo can run automatically on a GitHub-hosted runner for pull
requests, what needs secrets or external services, and what stays human.
Downstream pipeline design must use only real package-manager and script names
found here. Do not invent `typecheck`, `lint`, or `test` scripts.

Context: [`docs/ci/pr-pain-and-goals.md`](pr-pain-and-goals.md) (why PRs hurt)
and [`docs/ci/ci-concepts-notes.md`](ci-concepts-notes.md) (what CI means).

## Repo facts (fill from the real project)
- Package manager: **`npm`** (not pnpm, not yarn). `README.md` documents
  `npm install` / `npm run dev` / `npm run build`. `package-lock.json` is
  lockfileVersion 3.
- Lockfile present: **`package-lock.json`**. No `pnpm-lock.yaml`, no
  `yarn.lock`.
- Node/TypeScript app signals: root `package.json` (`preishare-org-repo`),
  `tsconfig.json` (strict, `"noEmit": true`), `src/` (no `app/` folder),
  `vite.config.ts`. README: Node.js LTS. No `engines` field, no `.nvmrc` /
  `.node-version`. This inventory checkout: Node `v22.23.4`, npm `10.9.9`.
- Framework signals: React 19 + TanStack Start + Vite 8 + Tailwind CSS v4.
  Cited: `package.json` (`react`, `@tanstack/react-start`, `vite`,
  `tailwindcss`), `vite.config.ts` (`tanstackStart()`, `nitro()`,
  `viteReact()`, `tailwindcss()`), `src/routes/` (file-based routes),
  `src/router.tsx`, `tsr.config.json`, `README.md`.
- Test runner (if any): **none found**. No Vitest, Jest, or Playwright
  config, no `*.test.*` / `*.spec.*` files, no `test` script.
- Lint tool (if any): **none found**. No ESLint, Prettier, or Biome config
  or scripts.
- CI workflows: **none found** (no `.github/` directory). That matches the
  pain brief: a PR can merge with no cloud proof.
- Leftover `pnpm.onlyBuiltDependencies` block in `package.json`, but there
  is **no** pnpm lockfile. Humans: treat that as leftover config, not a
  second package manager. CI must use **npm**.

## Scripts discovered in package.json
Exact names from the root `"scripts"` object. There is no `install` script
(install is `npm ci` / `npm install` against the lockfile).

| Script name | Exact command (from package.json) | Role |
|-------------|-------------------------------------|------|
| `dev` | `vite dev --port 3000` | start/dev (long-running local server) |
| `generate-routes` | `tsr generate` | TanStack Router codegen for `src/routeTree.gen.ts` |
| `build` | `vite build` | production build |
| `preview` | `vite preview` | serve the production build locally |

Missing common checks (write MISSING if not present):
- typecheck: **MISSING** (no `typecheck` or `tsc` script). `typescript` is a
  `devDependency` and `tsconfig.json` exists with `"noEmit": true`. That is
  not a script name. YAML must not call `npm run typecheck`.
- build: **present** — `build` → `vite build`
- lint: **MISSING**
- test: **MISSING**

Scripts that exist but are **not** first-pipeline PR checks:
- `dev` and `preview` start servers; they do not exit as a pass/fail check.
- `generate-routes` rewrites a **committed** file (`src/routeTree.gen.ts`).
  It is not a quality gate unless a later design adds an explicit drift
  check. Do not treat it as install/build/lint/test.

## Bucket A — Headless-safe on GitHub-hosted runners
Checks that need only a clean checkout, the lockfile install, and public
tooling. Verified in this checkout **without** a `.env` file: `npm ci`
then `npm run build` both exited 0 (Vite client + SSR + Nitro
`node-server` output under `.output/`). Env is read when Supabase clients
are *called* at runtime, not as a hard fail of the compile.

Suggested order for the first PR job (install → the one real check script):

1. **Clean install — `npm ci`** (not an npm *script*; uses
   `package-lock.json`). Why: forgotten local `npm install` is invisible
   today. A shared runner install is the CI idea for that pain. Prefer
   `npm ci` over `npm install` so the lockfile is the source of truth.
2. **`npm run build`** (`vite build`). Why: this is the only named quality
   script that proves the TanStack Start / React dashboard still compiles.
   It is the shared “does it build?” signal reviewers currently re-run on
   laptops.

Do **not** add to Bucket A until a named script exists in `package.json`:
- `npm run typecheck` — MISSING
- `npm run lint` — MISSING
- `npm run test` — MISSING

A later human step may add those scripts; this inventory must not pretend
they already exist.

## Bucket B — Needs secrets, env, or external services
Do **not** put these in the first PR CI job unless the team later adds
protected secrets and a safe plan. Pain/goals and concepts notes already
out-of-scope live embedding APIs and production secret injection.

| Check or step | Why it is not headless-safe | What would be required later |
|---------------|-----------------------------|------------------------------|
| Live sponsor login / signup / dashboard session | `createBrowserSupabaseClient()` and `createSupabaseServerClient()` throw or fail without `VITE_SUPABASE_*` / `SUPABASE_URL` and a real Auth project | Protected env names, a non-prod Supabase project, and a written secret plan — not Sprint 6 PR CI |
| Listing CRUD (`src/server/listings.ts`, properties routes) | Uses the service-role helper `createServerSupabaseClient` (alias of `createSupabaseServiceRoleClient`) against a live database + RLS | Same, plus test users; still human-owned for RLS intent |
| Apply `supabase/migrations/*.sql` | Needs a live Postgres/Supabase project and operator access | Manual or separate migration workflow; not `npm run build` |
| `npx tsx scripts/seed-property-embeddings.ts` | Requires `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY`; calls a paid embedding API; `tsx` is not even a `package.json` dependency | Keep local/operator-only. Do not run on every PR (cost/secrets) |
| Semantic search (`src/lib/property-search.ts`, `generatePropertyEmbedding`) | Needs `EMBEDDING_API_KEY` and service-role Supabase to hit `match_properties` | Out of scope for first PR CI per pain/goals |
| Vercel production / Hobby deploy | External account, project link, and often production env | Out of scope for this sprint’s PR workflow |
| Injecting `.env` values into Actions | Values must never be committed; `.env` is gitignored | Human-controlled secrets store, if ever; first pipeline stays Bucket A |

## Bucket C — Human judgment (not a green checkmark)
Items CI must not pretend to decide. A green `npm run build` is a signal to
*start* review, not a merge decision (`ci-concepts-notes.md`).

- Approve or request changes; decide whether to merge.
- Product and UX: dashboard IA, listing copy, empty states, whether a
  route change is right for investors/sponsors.
- Security-sensitive design: RLS policies, where the service role is used,
  what may be a `VITE_*` name vs server-only.
- Data handling: listing fields, auth session behavior, embeddings stored
  on property rows.
- AI review comments (“LGTM”) — assistance only; they do not replace a
  red X or a human merge click.
- Whether to add `typecheck` / `lint` / `test` scripts later, and whether
  to require the workflow as a GitHub branch-protection check.
- Production access, secret rotation, and applying migrations.

## Supabase / env caveats for CI
- Env var **names** referenced by the app or `.env.example` (values never
  committed):
  - From `.env.example`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
    `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - From code, not in `.env.example`: `SUPABASE_ANON_KEY` (fallback in
    `src/lib/supabase.server.ts`), `EMBEDDING_API_KEY`, optional
    `EMBEDDING_MODEL`
- `.env` is gitignored (`.gitignore` line `.env`). No `.env` is tracked.
  Placeholders only in `.env.example`.
- Local-only or dashboard-only steps: copying `.env.example` → `.env`,
  applying SQL under `supabase/migrations/`, seeding embeddings, signing
  in as a sponsor, Vercel dashboard env.
- Recommendation for Sprint 6 PR CI: **keep the first pipeline on Bucket A
  only** (`npm ci` → `npm run build`). Do not inject the names above. A
  passing build does not prove login or search work.

## Risks and open questions
- Multiple lockfiles? **No.** One `package-lock.json`. Leftover `pnpm`
  key in `package.json` is a human cleanup question, not a CI dual-install.
- Interactive tools? `dev` and `preview` are servers (not PR checks).
  `generate-routes` can rewrite `src/routeTree.gen.ts`.
- Tests that need a browser or network? **No test suite found.** Search
  and seed paths need network + secrets (Bucket B).
- No pinned Node `engines`. Runners should use current Node LTS (22.x
  matches `@types/node` ^22 in this tree); a future design may pin it.
- `npm ci` reported existing npm audit findings. Audit is not a script
  here; do not add `npm audit` as a required PR gate unless the team
  decides that separately.
- `npx tsc --noEmit` succeeded in this checkout, but that command is
  **not** a `package.json` script. Design may add a `typecheck` script
  later; this inventory does not authorize calling a missing name.
- How should lint and test join the recipe once those scripts exist,
  without pretending they run today?

## Link back to earlier docs
- Pain/goals addressed by Bucket A:
  - Forgotten local `npm install` → shared `npm ci` on every PR
  - Skipped `npm run build` / “does it even build?” laptop review →
    `npm run build` on a shared runner before humans deep-dive
  - No cloud run when a PR opens; #60–#62 merged with no checks → a
    real install+build job triggered on pull requests (design step)
  - Missing `typecheck` / `lint` / `test` scripts → confirmed **MISSING**
    here, so the pipeline must not invent them (pain/goals: run those
    only after scripts are confirmed)
- CI idea used: automated checks on every PR before merge (from
  `docs/ci/ci-concepts-notes.md`). Bucket A is that idea with only
  commands this repo actually has. Bucket C is the gap that does not
  map to automation.

## Source files inspected
- `package.json` (scripts, dependencies, leftover `pnpm` block)
- `package-lock.json` (npm lockfileVersion 3; only lockfile)
- `tsconfig.json`, `tsr.config.json`, `vite.config.ts`, `vercel.json`
- `README.md`, `AGENTS.md`
- `src/` layout: `src/routes/`, `src/components/`, `src/lib/`,
  `src/server/`, `src/router.tsx`, `src/routeTree.gen.ts`, `src/styles.css`
- `.env.example`, `.gitignore` (`.env` ignored; `.env` not tracked)
- `src/lib/supabase/client.ts`, `src/lib/supabase.server.ts`,
  `src/lib/embeddings/generate.ts`, `src/lib/property-search.ts`,
  `src/server/listings.ts`, `scripts/seed-property-embeddings.ts`
- `supabase/migrations/` (SQL present; not a headless npm script)
- No `.github/`, no ESLint/Prettier/Biome/Vitest/Jest/Playwright configs,
  no `*.test.*` / `*.spec.*`
