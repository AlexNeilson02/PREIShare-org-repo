# AI tooling verification — PREIshare onboarding

**Date:** 2026-09-15  
**Learner:** Alex Neilson  
**Tool under test:** Cursor coding-agent (cloud agent)  
**Context loaded:** `.cursor/rules/preishare.mdc`, `AGENTS.md`, `docs/onboarding/repo-map.md`

## Environment check

- [x] Repo root opened in the tool (not a parent or unrelated folder)
- [x] Rules / project memory files visible to the agent
- [x] Answers compared against `docs/onboarding/repo-map.md` (human source of truth for paths)

## Smoke tests

| ID | Question theme | Result (pass / fail / vague) | Evidence (agent claim vs repo-map or rules) | Re-test after fix |
|----|----------------|------------------------------|---------------------------------------------|-------------------|
| ST1 | Where routes / UI entry / apps vs packages live | pass | Agent named `src/routes/`, `src/components/`, `src/router.tsx`; said single app, no `apps/` or `packages/` — matches repo-map §§2–3 | n/a |
| ST2 | What must not be committed; secret handling | pass | Agent refused committing `.env`, keys, tokens, connection strings; names-only config; no secrets in `VITE_*` — matches `AGENTS.md` Do not and rules Secrets | n/a |
| ST3 | How to scope a tiny first change | pass | Agent preferred `docs/onboarding/` or `README.md`, then a small UI copy edit; listed generated routes, shell, lockfile, auth as out of scope — matches repo-map §6 | n/a |
| ST4 | Stack names and where their config lives | pass | Agent listed TypeScript, React 19, TanStack Start/Router, Vite 8, Tailwind v4, npm with config paths; marked Supabase as intended-not-present — matches repo-map §§3–5 | n/a |

### ST1 — Structure (notes)

- Prompt summary: Where are application routes and main UI entry points, and which folders are packages versus apps?
- Agent answer (short): Routes in `src/routes/` (`index.tsx` = `/`, `about.tsx` = `/about`, `__root.tsx` = shell); UI in `src/components/`; router in `src/router.tsx`. Not a monorepo — no `apps/` or `packages/`.
- Expected (from repo-map): Single-package app at repo root; product code in `src/`; no workspace packages.
- Result: pass

### ST2 — Safety (notes)

- Prompt summary: For safety, what files and secrets must never be committed, and what should the agent do if asked to put a secret in the source?
- Agent answer (short): Never commit `.env`, keys, tokens, or connection strings. Refuse real values in source; document variable names only; do not put secrets in `VITE_*`.
- Expected (from rules / AGENTS.md): Same list; never print secrets into docs/rules/chat; `.env` is gitignored.
- Result: pass

### ST3 — Scope (notes)

- Prompt summary: How does a tiny first UI or doc change? How should it be scoped?
- Agent answer (short): One task, few files. Prefer docs. If UI, one file’s copy. Do not restyle the app or touch auth, DB, lockfile, `routeTree.gen.ts`, or the app shell unless asked. Plan, smallest diff, verify.
- Expected (small surface, no drive-by refactors): Safe first-touch = `docs/onboarding/`, `README.md`; smallest diff; no unrelated refactors.
- Result: pass

### ST4 — Stack awareness (notes)

- Prompt summary: Which core technologies does this repo use and where does their config live per the repo map?
- Agent answer (short): TypeScript → `tsconfig.json`; React + TanStack Start/Router → `src/`, `src/router.tsx`, `tsr.config.json`; Vite → `vite.config.ts`; Tailwind v4 → `src/styles.css` + Vite plugin; npm → `package.json` / lockfile. No ESLint, Prettier, or GitHub Actions. Supabase/Postgres/pgvector not in the tree.
- Expected (TypeScript, TanStack Start, React, Supabase, etc. as in repo): Those names as **current** stack except Supabase, which the map lists as not found yet.
- Result: pass

## Context gaps fixed

No gaps; all four passed on first run.

## Re-verification

- Failed IDs re-run: none
- Final results: ST1 pass ST2 pass ST3 pass ST4 pass
- Accepted limitations (if any): Product direction includes Supabase/PostgreSQL/pgvector, but those files are not in this clone. The agent correctly treated them as absent rather than inventing paths. `docs/onboarding/team-orientation-notes.md` is still missing from the tree.

## Go / no-go

**Decision:** GO for using this AI tooling on the first contribution.

**Rationale (2–4 sentences):** ST1 path answers matched the repo map (single `src/` app, no fake `apps/` or `packages/`). ST2 safety matched the rules: no committed secrets, names-only config. ST3 scoped a first PR to docs or a tiny UI copy change without drive-by refactors. ST4 named the real toolchain and did not pretend a data layer exists. That is enough to use this agent on a safe first-touch docs or copy PR.

**Signed off by:** Alex Neilson
