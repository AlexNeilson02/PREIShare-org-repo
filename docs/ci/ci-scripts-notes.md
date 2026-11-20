# CI scripts notes — PREIshare dashboard

Teammates can reproduce PR CI on a laptop from this file. Commands must
match `.github/workflows/pr-ci.yml` and `package.json`.

## Package manager
- CI uses: **npm** (not pnpm, not yarn)
- Lockfile present: `package-lock.json`
- Node on the runner: **22** (inventory: no `.nvmrc` / `engines`; matches
  `@types/node` ^22)

## Scripts CI calls (must match package.json and pr-ci.yml)

| CI step | package.json script | Exact local command | Purpose |
| --- | --- | --- | --- |
| Install | (not a script) | `npm ci` | Clean install from `package-lock.json` |
| Typecheck | `typecheck` | `npm run typecheck` | `tsc --noEmit` |
| Build | `build` | `npm run build` | TanStack Start / Vite production build (`vite build`) |
| Lint | `lint` | `npm run lint` | `eslint . --max-warnings 0` |
| Test | `test` | `npm run test` | `node --test src/**/*.test.ts` (non-watch; job exits) |

Workflow order: checkout → setup Node 22 → `npm ci` → typecheck → build →
lint → test. Required steps have no `continue-on-error`.

## package.json script entries

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "vite build",
    "lint": "eslint . --max-warnings 0",
    "test": "node --test src/**/*.test.ts"
  }
}
```

Inventory originally had **no** `lint` or `test` script, and no ESLint /
Vitest / Playwright in the tree. This step added:

- **`lint`:** ESLint + `typescript-eslint` (TypeScript is already a
  `devDependency`). Config: `eslint.config.js`. Ignores `.output/`,
  `dist/`, `node_modules/`, and generated `src/routeTree.gen.ts`.
- **`test`:** Node 22’s built-in test runner (already on the CI image and
  local Node LTS). No Vitest and no Playwright. Current unit tests:
  `src/lib/listings/schema.test.ts` (Zod listing status/title rules).

## Intentional gaps
- No full browser end-to-end suite in PR CI (Playwright was not in the
  inventory; keep UI/manual QA human for now).
- No Vitest. Tests are Node’s `node --test`, which exits when finished
  (CI-safe; not a watch mode).
- Secrets, live Supabase, embedding APIs, migrations, and production
  deploys are out of scope for this workflow.
- `dev`, `preview`, and `generate-routes` are not CI checks.

## How to reproduce a CI failure locally

1. `git checkout` the PR branch
2. `npm ci`
3. `npm run typecheck && npm run build && npm run lint && npm run test`
4. Fix until all four pass, then push again
