# First contribution plan — PREIshare onboarding

## Author
- Name / GitHub handle: Alex Neilson / `AlexNeilson02`
- Feature branch: `docs/first-contribution-alexneilson02`
- Date: 2026-09-15

## One-sentence goal
Add myself as a new contributor in a contributors doc and make one minimal, reviewable docs (or agreed low-risk UI) touch so the team can practice review on a small first PR.

## Why this surface (link to prior artifacts)
- From `docs/onboarding/repo-map.md`: Safe first-touch table lists `docs/onboarding/` as “Docs-only; helps the team” and `README.md` as “Human-facing getting started; no runtime import.” The same section records “There is no `CONTRIBUTING.md` or similar contributor guide in this clone,” so a root `CONTRIBUTORS.md` is a new docs file with no runtime import — same risk class as other top-level docs, not app core.
- From `docs/onboarding/team-orientation-notes.md`: **File is not in this clone** (setup-log cites it; repo-map open questions and AI tooling verification both record it missing). Do not invent its text. This plan instead uses the assignment’s first-PR definition of done: a named contributor entry plus one tiny, reviewable docs change a teammate can review in under 10 minutes, with no product-context deep dive.
- From `docs/onboarding/ai-tooling-verification.md`: All four smoke tests passed on first run; **Decision: GO**. ST3 confirmed the agent scopes a first change to docs (or a single-file UI copy edit) without drive-by refactors. ST2 confirmed it will not put secrets in source. Agent rules are verified enough to assist implementation next — still refuse any diff outside the files table below.

## In scope (only these)
1. Create or update `CONTRIBUTORS.md` with my name, GitHub handle, and a one-line role (e.g. "Onboarding engineer").
2. Optional second touch (pick at most one, or none):
   - Tiny docs fix already identified as safe in the repo-map: add a one-line Contributors pointer in `README.md` (repo-map: low runtime impact; risk is only a wrong link).
   - No UI copy/comment change in this first PR.
3. Capture implementation notes later in `docs/onboarding/first-contribution-notes.md` (next step—not done here).

This planning step adds **only** `docs/onboarding/first-contribution-plan.md`. `CONTRIBUTORS.md` and the README pointer wait for the implementation step.

## Out of scope (explicitly not this PR)
- Auth, sessions, or environment secrets
- Database schema, migrations, Supabase policies, or pgvector changes
- Dependency upgrades or lockfile churn unrelated to the contribution
- Multi-package refactors, renames, or formatting the whole repo
- CI/CD workflow edits unless a mentor explicitly assigns them
- `src/` (including `src/lib/user.ts`, `src/routeTree.gen.ts`, `src/router.tsx`, `vite.config.ts`, `src/routes/__root.tsx`)
- Inventing `apps/`, `packages/`, or a Supabase client to “finish” the stack

## Likely files to change
| File | Action | Why |
|------|--------|-----|
| CONTRIBUTORS.md | create | Add my contributor entry (name, `AlexNeilson02`, one-line role). File does not exist today. |
| README.md | edit | One-line pointer to `CONTRIBUTORS.md` — optional second touch; repo-map safe first-touch |
| docs/onboarding/first-contribution-notes.md | create (next step) | Record what the agent did and what I verified |
| docs/onboarding/first-contribution-plan.md | create (this step) | This plan; no further scope decisions at implement time |

## Acceptance criteria
- [ ] I am on feature branch `docs/first-contribution-alexneilson02` (not the default branch).
- [ ] `CONTRIBUTORS.md` lists my name and GitHub handle in a consistent format.
- [ ] Any second touch is limited to the single file named above (`README.md`) and does not change behavior beyond copy/docs.
- [ ] No secrets, `.env` files, or generated build artifacts are included.
- [ ] A teammate can review the diff in under 10 minutes without product-context deep dives.

## Verification plan (how I will know it worked)
1. `git status` / `git branch` show I am on `docs/first-contribution-alexneilson02` with only expected files modified.
2. Open `CONTRIBUTORS.md` and confirm my row/section renders as plain Markdown.
3. If a UI touch was included: run `npm run dev` (Vite on port 3000, from repo-map / `package.json`) and visually confirm the copy change; **skip for this PR** — second touch is docs-only (`README.md`).
4. Skim `git diff` and confirm nothing outside the likely-files table appears.

## Risks and mitigations
- Risk: Agent expands scope into app core. Mitigation: refuse diffs that touch files not listed above; re-prompt with the out-of-scope list.
- Risk: Editing default branch by mistake. Mitigation: check `git branch` before every edit session.
- Risk: Treating missing `team-orientation-notes.md` as a reason to invent onboarding policy. Mitigation: only cite files that exist; keep the PR to `CONTRIBUTORS.md` + one README line.
- Risk: Agent adds Supabase/auth because `.cursorrules` mentions `lib/supabase.ts`. Mitigation: ST2/ST4 already GO; still reject any `.env` or `src/lib/` changes in this PR.

## Definition of done for this planning step
- [x] Feature branch created from updated default branch (`docs/first-contribution-alexneilson02` from `main` at merge of onboarding PR #1).
- [x] This plan file saved at `docs/onboarding/first-contribution-plan.md` with all sections filled (no angle-bracket placeholders left).
- [x] Ready to implement in the next step without re-deciding scope.
