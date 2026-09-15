# PREIshare repository map

> Onboarding map for first contribution planning. Built with AI-assisted
> inventory + human path verification. Do not treat this as architecture law
> if the real tree disagrees—update this file when you learn more.

## Meta

- Clone path (from setup-log): `~/projects/PREIShare-org-repo`
- Date mapped: `2026-09-15`
- Agent tool used: `coding-agent`
- Mapper: `Alex Neilson` (`@AlexNeilson02`)

Verification basis:

- Clone path, fork, remotes, and default branch `main` come from `docs/onboarding/setup-log.md` (dated 2026-09-14).
- Top-level names, `package.json` scripts, `src/` layout, and missing CI/data/lint files were spot-checked in this workspace on 2026-09-15 (directory listing, file reads, and content search). This cloud checkout is the same GitHub fork (`AlexNeilson02/PREIShare-org-repo`), not the laptop clone path above.

## 1. Overview (5–8 sentences)

PREIshare appears to be organized as: **single package**. There is one root `package.json` (`preishare-org-repo`), no `apps/` or `packages/` workspaces, and no `pnpm-workspace.yaml` / Turbo / Nx config. In plain language, the product code seems to live mainly in `src/` — a blank TanStack Start (React 19 + Vite 8 + Tailwind CSS v4) app with file-based routes. Shared libraries or packages appear in **none found** (only a small `src/lib/user.ts` stub inside the same app). Docs and onboarding notes live in `docs/` (including this file). Current onboarding files: `docs/onboarding/setup-log.md`, this map, and `docs/onboarding/ai-tooling-verification.md`. I am intentionally not editing application code while building this map. `AGENTS.md` and `.cursorrules` describe the intended stack and future Supabase usage, but the running app is still the scaffold starter (Home and About), not a wired backend. There is no test script or test files in the current tree, even though `.cursorrules` says to write tests for new features.

## 2. Top-level inventory

| Path | Kind (app / package / config / docs / other) | One-sentence purpose | Verified by me? (yes/no) |
|------|-----------------------------------------------|----------------------|---------------------------|
| `src/` | app | TanStack Start application: routes, components, styles, and a user stub | yes |
| `docs/` | docs | Onboarding and project documentation | yes |
| `package.json` | config | Root package manifest (`preishare-org-repo`) and npm scripts | yes |
| `package-lock.json` | config | npm lockfile for reproducible installs | yes |
| `README.md` | docs | Scaffold “getting started” notes for TanStack Start | yes |
| `AGENTS.md` | docs / agent | Two-minute human-and-agent onboarding; TanStack Intent skill-loading block at top | yes |
| `.cursorrules` | config | Cursor/agent rules (layout, TypeScript, future Supabase client path) | yes |
| `.cta.json` | config | TanStack create-app metadata (file-router, Tailwind, npm, no add-ons) | yes |
| `tsconfig.json` | config | TypeScript compiler options (strict mode, `#/*` and `@/*` → `src/*`) | yes |
| `tsr.config.json` | config | TanStack Router codegen (`"target": "react"`) | yes |
| `vite.config.ts` | config | Vite plugins: Devtools, Tailwind, TanStack Start, React | yes |
| `.gitignore` | config | Ignores `node_modules`, `dist`, `.env`, TanStack/Nitro output dirs | yes |
| `.vscode/` | config | Editor settings that hide/lock generated `routeTree.gen.ts` | yes |
| `.cursor/` | config | Cursor agent rules (`.cursor/rules/preishare.mdc`); added after the first map draft | yes |
| `.git/` | other | Local Git metadata (not application code) | yes |

Not present at top level (searched, do not invent): `apps/`, `packages/`, `.github/`, `CONTRIBUTING.md`, `.env.example`.

## 3. Frontend concerns (TypeScript, React, TanStack Start)

- Likely app root(s): `src/` (app lives at the **repository root**, not under `apps/web` or a nested `my-tanstack-app/`).
- Clues I used (file names, frameworks mentioned in package.json): `package.json` dependencies `@tanstack/react-start`, `@tanstack/react-router`, `react` `^19.2.0`, `tailwindcss` `^4`; scripts `dev` / `build` / `preview`; files `src/routes/__root.tsx`, `src/router.tsx`, `src/routeTree.gen.ts`, `vite.config.ts`.
- Entry / routes / UI areas worth knowing:
  - `src/router.tsx` — router factory
  - `src/routes/__root.tsx` — HTML shell, header/footer, theme init script
  - `src/routes/index.tsx` — `/` home page
  - `src/routes/about.tsx` — `/about`
  - `src/components/` — `Header.tsx`, `Footer.tsx`, `ThemeToggle.tsx`
  - `src/styles.css` — Tailwind entry and visual tokens (e.g. `--sea-ink`)
  - `src/routeTree.gen.ts` — **generated** route tree (do not edit by hand)
- How this area relates to user-facing screens: visitors currently see a starter landing page and an About page, with a sticky header (Home / About / external Docs) and footer. Theme preference is stored in browser `localStorage`, not a server. This is the whole UI surface today.

## 4. Backend / data concerns (Supabase, PostgreSQL, pgvector, APIs)

- Supabase or data config paths: **not found yet**. `.cursorrules` tells agents to use a client from `lib/supabase.ts` (meant as `src/lib/supabase.ts`), but that file is **not in the tree**. `package.json` has no `@supabase/*`, `pg`, Prisma, or Drizzle.
- Migrations / SQL / schema-related paths: **not found yet** (no `.sql` files, no `supabase/` folder).
- Env examples (NOT secret values): **not found**. `.gitignore` ignores `.env`; `AGENTS.md` says no env vars are required for the blank scaffold. Do not commit secrets. If client-exposed config is added later, only `VITE_*` belongs in the browser bundle.
- Notes on what a beginner should not touch in production data: there is **no production data layer to touch**. The only “user” code is `src/lib/user.ts`, a type plus `getUser()` that **always returns `null`**. Treat that as a placeholder, not auth. If Supabase or migrations appear later, do not run them against shared/production projects without a mentor.

## 5. Tooling and CI

- TypeScript / lint / format config: `tsconfig.json` only (strict TypeScript flags). **No** ESLint, Prettier, Biome, or EditorConfig project files. **No** `lint` / `format` / `typecheck` scripts in `package.json`.
- CI workflows (e.g. GitHub Actions): **not found** (no `.github/workflows/`).
- Editor or agent config already present: `.vscode/settings.json`; `.cursorrules`; `AGENTS.md`; `.cta.json`; `.cursor/rules/preishare.mdc` (always-apply agent rules). No in-repo Cursor **skills** folder; TanStack Intent skills are loaded via `npx @tanstack/intent@latest` per `AGENTS.md`.
- Scripts from package manifests that look like dev/build/test:
  - `dev` — Vite on port 3000
  - `build` — production build
  - `preview` — serve the production build
  - `generate-routes` — `tsr generate`
  - **no `test` script**

## 6. Safe first-touch vs do-not-edit-yet

### Safe first-touch (good candidates for a tiny onboarding PR)

| Path or area | Why it is relatively safe | Risk if handled carelessly |
|--------------|---------------------------|----------------------------|
| `docs/onboarding/` | Docs-only; helps the team; this map belongs here | Misleading docs if paths go stale |
| `README.md` | Human-facing getting started; no runtime import | Wrong commands or outdated scaffold advice |
| `docs/` (new onboarding notes) | Same as above; no app compile path | Duplicate or conflicting guidance |

There is no `CONTRIBUTING.md` or similar contributor guide in this clone.

### Do not edit yet (wait until you have tests, review, and a real task)

| Path or area | Why wait | What could break |
|--------------|----------|------------------|
| CI under `.github/` (if added later) | Shared pipeline; **folder does not exist today** | Everyone’s builds |
| `package-lock.json` and root `package.json` dependency ranges | Whole-app install graph | Install/build failures for all contributors |
| Supabase / migrations / `.env` (if added later) | Data and secrets; **not present today** | Data loss or leaked secrets |
| Shared packages used by multiple apps | Wide blast radius; **no workspace packages found** | N/A until a monorepo appears |
| Auth, payments, or vector/search core | High complexity; **not present** beyond the `getUser()` stub | Security or relevance bugs if invented without a task |
| `src/routeTree.gen.ts` | Generated by TanStack Router | Hand edits get overwritten; `.vscode` marks it readonly |
| `src/router.tsx`, `vite.config.ts`, `src/routes/__root.tsx` | App shell and toolchain | Routing, SSR, or styling regressions across every page |
| `src/lib/user.ts` | Looks like auth; it is a stub | Fake “login” that hides the missing data layer |

## 7. Open questions for the team

- When will the Supabase client at `src/lib/supabase.ts` (named in `.cursorrules`) actually land, and is PostgreSQL / pgvector in scope for the first data work?
- `docs/onboarding/setup-log.md` lists orientation notes at `docs/onboarding/team-orientation-notes.md`, but that file is **not in this clone**. Is it missing, renamed, or not committed yet?
- `.cursorrules` says “Write tests for new features,” and git history mentions tests, but there is **no test runner, no `test` script, and no `*.test.*` / `*.spec.*` files** now. Which test setup should newcomers use?
- Is the official user-facing app this root TanStack Start scaffold, or will product screens land in another package later?
- There is no shared UI/types package. Confirm `src/components/` and `src/lib/` are the source of truth until a workspace is introduced.
- `package.json` includes a `pnpm.onlyBuiltDependencies` block while `.cta.json` and scripts assume **npm**. Is npm still the required package manager?
- Should GitHub Actions (lint/typecheck/build) be added before feature PRs, or is local `npm run build` enough for now?

## 8. How I will use this map next

- Configure AI project rules/memory using the paths above (next tooling steps).
- Pick a first contribution only from **Safe first-touch** unless a mentor expands scope.
- Revisit and edit this file when a path claim is proven wrong.
