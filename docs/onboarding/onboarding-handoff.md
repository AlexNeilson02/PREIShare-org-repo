# PREIshare onboarding handoff

**Author:** Alex Neilson / @AlexNeilson02  
**Date:** 2026-09-16  
**Branch / PR:** `docs/first-contribution-alexneilson02` — https://github.com/EdTechForLearning/PREIShare-org-repo/pull/15 (open). This handoff file is added on `cursor/onboarding-handoff-299a` targeting that first-contribution branch.  
**Audience:** mentor, future self, sprint lead

## 1. Stakeholder summary (plain language)

I completed PREIshare engineering onboarding for Sprint 1 (dev environment and AI tooling). I forked the team repository, cloned my fork, wired up origin and upstream, verified my local toolchain, configured Cursor-style project rules and agent memory, mapped the repo well enough to choose a safe first contribution, and opened a small pull request that follows the team’s Git and review habits. PREIshare remains a real-estate intelligence product; this work does not ship a product feature—it proves I can join the team workflow safely.

**Definition of done met:**
- [x] Fork created, local clone of my fork, both remotes and toolchain verified (see setup log)
- [x] AI rules / project memory in place and smoke-tested
- [x] First contribution implemented and committed on a feature branch
- [x] PR opened (or description ready) and review feedback addressed

Notes on the last two boxes: the first contribution is on `docs/first-contribution-alexneilson02` (agent implementation originally landed on `cursor/contributors-roster-299a`, then the branch was renamed to match the plan). Team PR #15 is **open**, not merged. Simulated mentor review is recorded; some follow-up commits listed in the review-response notes are not yet on the PR head. See §5 and §6.

## 2. Deliverables index (what exists and where)

Status is as of 2026-09-16 on `cursor/onboarding-handoff-299a` (this branch, based on `docs/first-contribution-alexneilson02`). Files copied here from other fork branches will reach team PR #15 only after this branch is merged into that one.

| Artifact | Path | Why it matters | Status |
| --- | --- | --- | --- |
| Team orientation notes | docs/onboarding/team-orientation-notes.md | Mission, workflow, first-PR definition of done | **Not in this clone.** Setup log originally cited it; that reference was later treated as stale (review comment 5). Do not invent its text. |
| Setup log | docs/onboarding/setup-log.md | Auditable proof of accounts, fork, Git identity, clone, remotes | Present on PR #15 |
| Repo map | docs/onboarding/repo-map.md | Safe contribution surfaces (this repo is a single-package app at root, not `apps/` + `packages/`) | Present on PR #15 |
| AI tooling verification | docs/onboarding/ai-tooling-verification.md | Evidence agents respect PREIshare stack/conventions | **On this branch.** Copied from `cursor/onboarding-repo-map-96e5` (draft fork PR #2). ST1–ST4 pass; Decision: GO. Not yet on the published PR #15 head until this branch is merged. |
| Project rules | .cursor/rules/preishare.mdc | Persistent IDE-agent constraints | Present on PR #15 |
| Agent memory entrypoint | AGENTS.md | Cross-tool project context for coding-agents | Present on PR #15 (rewritten; only pre-existing file with deletions) |
| First contribution plan | docs/onboarding/first-contribution-plan.md | Scoped plan before code | Present on PR #15 |
| Contribution notes | docs/onboarding/first-contribution-notes.md | What changed and why | Present on PR #15 |
| Contributors credit | CONTRIBUTORS.md | Visible first contribution surface | Present on PR #15 — Alex Neilson / AlexNeilson02 / Onboarding engineer / 2026-09-16 |
| PR description | docs/onboarding/pr-description.md | Reviewer-facing summary | Present on PR #15 (merged to the feature branch via fork PR #5) |
| Review response notes | docs/onboarding/review-response-notes.md | How feedback was handled | **On this branch.** Copied from `cursor/review-response-notes-299a` (fork PR #6). Not yet on the published PR #15 head until this branch is merged. |
| This handoff | docs/onboarding/onboarding-handoff.md | Single entry point for mentors | This file |

## 3. Environment and toolchain snapshot

Copied only from `docs/onboarding/setup-log.md` (2026-09-14) and the repo map. No versions invented for tools the setup log did not record.

- OS: macOS 26.6.2 (build 25G83)
- Git user.name / user.email configured: yes (setup log section 2 PASS; identity values are not repeated here)
- Git version recorded: 2.50.1 (Apple Git-155)
- Node / package manager versions: **not recorded in setup-log.md**. Repo map and `package.json` confirm the intended package manager is **npm** (`package-lock.json` present; leftover `pnpm.onlyBuiltDependencies` block in `package.json` is ignored unless policy changes)
- origin (my fork) URL: https://github.com/AlexNeilson02/PREIShare-org-repo
- upstream (team repo) URL: https://github.com/EdTechForLearning/PREIShare-org-repo
- Clone path on the laptop (from setup log): `~/projects/PREIShare-org-repo`
- Default branch: `main`
- Install/build/test commands run and result: setup log does **not** record `npm install`, `npm run dev`, `npm run build`, or tests. First contribution was docs/agent-config only; the plan explicitly skipped `npm run dev`. `package.json` has no `test` / `lint` / `format` scripts (repo map §5).
- Blockers hit and how resolved (from setup log §7): first clone landed in home instead of `~/projects` (re-cloned); `git remote add upstream` failed until `cd` into the repo; second add reported remote already exists (no action); `..` is a path not a command.

## 4. AI tooling posture

- Rules file purpose (one sentence): `.cursor/rules/preishare.mdc` is the always-apply constraint list — identity, verified stack, safe first-touch surfaces, secrets handling, and out-of-scope defaults — aligned with the repo map and working tree.
- AGENTS.md purpose (one sentence): two-minute human-and-agent onboarding memory that points at the rules file and repo map; highest-risk constraints are also stated here so a session that loads only one of the two files still holds the line (deliberate duplication, documented in review-response notes comment 2).
- Smoke-test prompt used and whether the agent correctly named stack pieces (TypeScript, TanStack Start, React, Supabase, PostgreSQL, pgvector): recorded in `docs/onboarding/ai-tooling-verification.md` (now on this branch). ST4 prompt: which core technologies this repo uses and where config lives. Result: **pass** — TypeScript, React 19, TanStack Start/Router, Vite 8, Tailwind v4, npm; Supabase / PostgreSQL / pgvector named as product direction **not present** in the tree. All four smoke tests (ST1 structure, ST2 secrets, ST3 first-change scope, ST4 stack) passed on first run; **Decision: GO**.
- Context gaps found and fixes applied: verification log says none; accepted limitation is that Supabase/Postgres/pgvector files are absent and must not be invented, and `team-orientation-notes.md` is still missing. That file was never added to this clone (do not invent it).

## 5. First contribution and review outcome

- Plan goal (from first-contribution-plan.md): add myself as a new contributor in a contributors doc and make one minimal, reviewable docs (or agreed low-risk UI) touch so the team can practice review on a small first PR.
- Files touched (implementation cycles, from first-contribution-notes.md): `CONTRIBUTORS.md` (Cycle 1); optional `README.md` pointer **skipped** (Cycle 2); `docs/onboarding/first-contribution-notes.md` (Cycle 3). Later onboarding artifacts on the same team PR include the plan, setup log, repo map, rules file, `AGENTS.md` rewrite, and PR description — a wider diff than the plan’s in-scope table, flagged in the PR description.
- PR title and link: GitHub currently shows **“Docs/first contribution alexneilson02”** at https://github.com/EdTechForLearning/PREIShare-org-repo/pull/15 (open, targeting `EdTechForLearning/PREIShare-org-repo` `main` from fork branch `docs/first-contribution-alexneilson02`). Review-response notes record an intended title after edits: `docs: add onboarding artifacts and CONTRIBUTORS entry for first contribution`.
- Review-style feedback received (summary): simulated chat-assistant mentor review on 2026-09-16 (five comments). Blocking: (1) test plan vs an email in a setup-log **draft** — declined, premise did not match the pushed file the reviewer was asked to use; (2) PR description claimed `AGENTS.md` stopped restating constraints, but Stack / Scripts / Do not still overlap the rules file — accepted the design (failsafe duplication), fix the description. Non-blocking: (3) `.cursorrules` overlap parked as out of scope; (4) generated Intent skills monorepo bullet vs “not a monorepo”; (5) setup log citing missing orientation notes.
- Changes made in response: review-response notes (now on this branch) list follow-up commits (duplication comments in `AGENTS.md` and `preishare.mdc`; `.cursorrules` path note; skills-block caveat; remove stale orientation-notes reference from setup log) plus PR description edits. The notes file itself is on this branch; the listed follow-up commits to `AGENTS.md` / rules / setup-log are still not all on the published PR #15 head. Treat the notes as the decision record; confirm those commits landed before calling the PR fully updated.
- Merge readiness: **ready with follow-ups** — docs and agent-config only, no runtime code, simulated blocking comments have written resolutions, and the three non-blocking items are fixed or parked **on paper**. Still waiting on a human mentor on PR #15. Follow-ups to confirm: land or drop the listed review commits; whether the team wants the seven-plus-file onboarding bundle or the roster row alone; whether the `AGENTS.md` deletions removed anything the team still needed.

## 6. Open risks and environment gaps

1. **No local data layer.** Supabase, PostgreSQL, and pgvector are product direction only. There is no `src/lib/supabase.ts`, no `supabase/` folder, no `.env.example`. `.cursorrules` still tells agents to use a Supabase client; `preishare.mdc` says not to create one unless a human asks. Parked overlap (review comment 3) — do not assign auth/data work until a mentor reconciles those files.
2. **No test / lint / CI scripts in this tree.** First contribution was not build-verified (`npm run dev` skipped). There is no `test` script and no GitHub Actions. Next sprint should not assume a green CI gate.
3. **PR #15 is still awaiting human review** (open). Simulated review is not a substitute. GitHub title and some description claims may still be the pre-review versions.
4. **Wrong-baseline git diffs.** Fork `main` already contains earlier onboarding merges; team `main` does not. `git diff main` undercounts vs `git diff upstream/main`. Same class of mistake as Cycle 1 (`git diff main` vs parent branch). Always diff the branch the PR actually lands on.
5. **Missing orientation notes.** `docs/onboarding/team-orientation-notes.md` is not in the clone. Do not invent mission/workflow text from that filename.
6. **This branch is not yet the published PR #15 head.** `ai-tooling-verification.md` and `review-response-notes.md` live here now. They reach the team PR only after `cursor/onboarding-handoff-299a` is merged into `docs/first-contribution-alexneilson02`.

If asking “what I would re-verify on day one of the next sprint”: (a) `git remote -v` still has origin = fork and upstream = team repo; (b) `git diff upstream/main --stat` for any open PR; (c) rules file and `.cursorrules` still disagree on Supabase; (d) whether PR #15 merged or needs a narrower roster-only follow-up.

## 7. Decisions log (for stakeholders)

| Decision | Choice | Rationale |
| --- | --- | --- |
| First contribution surface | Root `CONTRIBUTORS.md` roster row (name, GitHub, role, onboarded date) | Repo map: no contributor guide existed; new docs file has no runtime import. Plan allowed an optional README pointer; Cycle 1 instructions forbade other files, so README was skipped. |
| Branch naming | Plan: `docs/first-contribution-alexneilson02`. Agents also created `cursor/<task>-299a` branches. Human renamed the implementation line to the plan name for the team PR. | Matches the plan’s Git habit. Cloud-agent default names are an extra hop; the plan name is what PR #15 uses. |
| AI tool category used most | coding-agent (Cursor cloud) for implementation; chat-assistant for simulated mentor review | Coding-agent kept diffs to named files when prompted tightly. Chat-assistant was the assigned reviewer persona. Human reviewed every pushed diff. |
| Scope honesty on a wide PR | Keep the onboarding bundle on one PR, and say so in the description | The plan named two files; the branch carries every tutorial artifact. Flagging the expansion is cheaper than hoping a reviewer misses it. Open offer to split to roster-only if asked. |
| `AGENTS.md` vs rules overlap | Keep overlapping highest-risk constraints; document as a failsafe | Agents do not always load both files. Undocumented duplication looks like sloppiness; documented duplication is a constraint. |
| `.cursorrules` vs `preishare.mdc` | Do not edit `.cursorrules` in the first PR | Predates this onboarding; editing it would widen an already-wide PR. Park visibly rather than silently. |
| Missing `team-orientation-notes.md` | Do not create or invent it | Setup log named it; tree does not contain it. Rules and AGENTS.md already warn against inventing it. |
| This handoff | Fill from files that exist; mark gaps; do not copy identity emails into a new doc | Matches “trust the tree” and the PR test plan’s “expect no email addresses” bar for new onboarding files. |
| Bring PR #2 and PR #6 files here | Copy the two files onto this branch; do **not** merge those whole branches | Those branches started from older commits. A full merge would try to delete later files (`CONTRIBUTORS.md`, the plan, notes, handoff). Copying keeps the files without rolling the branch backward. |

## 8. Next-sprint preview (what this unlocks)

The next sprint topic can assume:

1. **Trusted local environment** — clone + toolchain documented in setup-log.md; re-run only if OS or versions change. Node/npm versions still need a first recording if the next sprint depends on them.
2. **AI alignment** — .cursor/rules/preishare.mdc and AGENTS.md exist; extend rules when new packages appear, do not start from zero. Still refuse inventing `apps/`, `packages/`, or a Supabase client.
3. **Git habit** — feature branch → small commits → PR → respond to review is practiced once end-to-end (including a false-failure on `git diff main` and a simulated five-comment review).
4. **First PR path** — merge-ready **with follow-ups** onboarding contribution; feature work should use the same PR quality bar (problem / approach / test plan, disclose scope, diff against `upstream/main`).

**Explicitly out of scope until later:** large product features, production deployments, and database migrations you have not been trained on yet. Also out of scope until assigned: auth, billing, `src/routeTree.gen.ts`, app shell (`src/router.tsx`, `vite.config.ts`, `src/routes/__root.tsx`), lockfile upgrades, and GitHub Actions.

## 9. Ask for mentor

- Questions still open:
  - Does the team want PR #15 as the full onboarding bundle, or a narrower `CONTRIBUTORS.md`-only PR?
  - Did the `AGENTS.md` rewrite drop anything the team still relies on (only pre-existing file with deletions)?
  - Do `.cursor/rules/preishare.mdc` constraints match how the team actually works, including the parked `.cursorrules` Supabase overlap?
  - Please merge `cursor/onboarding-handoff-299a` into `docs/first-contribution-alexneilson02` so PR #15 includes the verification log, review notes, and this handoff.
  - Is `docs/onboarding/team-orientation-notes.md` missing, renamed, or intentionally uncommitted?
- Review of this handoff requested: yes
- Preferred follow-up time or channel: GitHub comments on https://github.com/EdTechForLearning/PREIShare-org-repo/pull/15 (no other channel or time recorded in the onboarding files)

---

## Fill notes (how this file was completed)

This section is the decision trail for filling the scaffold. It is not extra product scope.

- **Handoff-first commit added only this file.** A later commit on this branch copied `ai-tooling-verification.md` and `review-response-notes.md` onto it. Uncommitted local edits to `setup-log.md` (orientation-notes line) and `first-contribution-notes.md` (Cycle 3 SUCCESS) were still left unstaged.
- **No email addresses** were copied out of the setup log. Section 3 answers “configured: yes” only. That follows the CONTRIBUTORS.md constraint and the PR test plan’s secrets search.
- **Node / npm versions were not guessed.** Setup log never recorded them; this cloud checkout’s versions would be the wrong machine.
- **Install/build/test were not claimed.** Setup log and the first-contribution plan do not show those commands succeeding. Claiming a green `npm run build` would be unverifiable.
- **A Status column was added to §2** because the scaffold title is “what exists and where,” and `team-orientation-notes.md` is still not in this clone. The verification log and review notes were later copied onto this branch so they are no longer listed as missing.
- **AI smoke-test details come from `docs/onboarding/ai-tooling-verification.md` on this branch** (copied from `origin/cursor/onboarding-repo-map-96e5`). The whole PR #2 branch was not merged, because it would have dropped later onboarding files.
- **PR #15 live state** (open, current GitHub title, 8 files / 558 / 71) was taken from `gh pr view`, not from the older “7 files / 464 / 71” line in `pr-description.md`. The description file is still the authored snapshot from 2026-09-16.
- **Merge readiness is “ready with follow-ups”** rather than “ready” because the review-response notes describe commits that are not all on the GitHub PR head yet, and a human has not reviewed.
- **Placeholder remaining in the original scaffold** (`<your name>`, `<YYYY-MM-DD>`, `<e.g. …>`) were all replaced. Section 9 does not invent a Slack channel.

---

*End of handoff. Keep this file updated if merge status or env gaps change before the next sprint starts.*
