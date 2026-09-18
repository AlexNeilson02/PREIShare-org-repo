<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# PREIshare

Human-and-agent onboarding memory. Skim this, then follow `.cursor/rules/preishare.mdc`. If this file and the working tree disagree, **trust the tree** and update `docs/onboarding/repo-map.md`.

## What it is

PREIshare is a real-estate intelligence product. **This repo** is a single-package TanStack Start app at the root (`package.json` name `preishare-org-repo`) — not an `apps/` + `packages/` monorepo.

Current UI is the blank starter: Home (`/`) and About (`/about`) under `src/`. There is no wired database, auth, or CI in the tree. `src/lib/user.ts` `getUser()` always returns `null` (a stub, not login).

## Stack (verified)

- TypeScript (strict), React 19, TanStack Start + file-based Router, Vite 8, Tailwind CSS v4
- Package manager: **npm** (`package-lock.json`)
- Product direction includes Supabase, PostgreSQL, and pgvector — **not present** (no `src/lib/supabase.ts`, no migrations, no `.env.example`)

Do not substitute Next.js, another CSS stack, or pnpm unless a human explicitly tasks that.

## Scripts (from `package.json` / repo-map)

There is no `test`, `lint`, or `format` script. Do not invent them.

| Script | What it is |
|--------|------------|
| `npm run dev` | Vite dev server on port 3000 |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build |
| `npm run generate-routes` | TanStack Router codegen (`tsr generate`) |

## Where to look

| Path | Why |
|------|-----|
| `docs/onboarding/` | Onboarding notes. Start with `docs/onboarding/repo-map.md`. Also `docs/onboarding/setup-log.md`. |
| `docs/domain/` | Investor listing business language: domain brief and field inventory. Honor these before inventing listing types. |
| `.cursor/rules/preishare.mdc` | Always-apply agent rules: identity, stack, safe surfaces, do-nots |
| `src/routes/`, `src/components/`, `src/styles.css` | App UI |
| `README.md` | Scaffold getting-started |

`docs/onboarding/team-orientation-notes.md` is named in the setup log but **is not in this clone** — do not invent it.

## How agents should work

1. **Plan** — Restate the goal and list files you will touch. Read the repo map and `.cursor/rules/preishare.mdc` before creating paths.
2. **Small diff** — Smallest change that finishes the task. Match neighbors. No drive-by refactors or new libraries unless asked.
3. **Verify** — Stop after each logical unit. For Start/Router/Devtools work, load a matching Intent skill from the block above (this repo is single-package; the monorepo bullet there rarely applies).

New contributors: prefer `docs/` (especially `docs/onboarding/`) and `README.md` unless a mentor expands scope.

## Do not

- Commit `.env`, keys, tokens, or connection strings. Document variable **names** only.
- Hand-edit `src/routeTree.gen.ts`. Avoid `src/router.tsx`, `vite.config.ts`, and `src/routes/__root.tsx` unless tasked.
- Invent `apps/`, `packages/`, GitHub Actions, a Supabase client, or auth/billing/migrations.
- Rewrite the app for “best practices” or change product requirements silently.
- Upgrade `package.json` / `package-lock.json` unless that is the task.

## More detail

Full constraints: [`.cursor/rules/preishare.mdc`](.cursor/rules/preishare.mdc). Path inventory: [`docs/onboarding/repo-map.md`](docs/onboarding/repo-map.md).
