# PREIshare onboarding handoff

**Author:** Alex Neilson / @AlexNeilson02  
**Date:** 2026-09-16  
**Branch / PR:** `docs/first-contribution-alexneilson02` — https://github.com/EdTechForLearning/PREIShare-org-repo/pull/15 (open)  
**Audience:** mentor, future self, sprint lead

All onboarding files this handoff is supposed to point at are **on this branch**, except `docs/onboarding/team-orientation-notes.md`, which was never in this clone and must not be invented.

## 1. Stakeholder summary (plain language)

I completed PREIshare engineering onboarding for Sprint 1 (dev environment and AI tooling). I forked the team repository, cloned my fork, wired up origin and upstream, verified my local toolchain, configured Cursor-style project rules and agent memory, mapped the repo well enough to choose a safe first contribution, and opened a small pull request that follows the team’s Git and review habits. PREIshare remains a real-estate intelligence product; this work does not ship a product feature—it proves I can join the team workflow safely.

**Definition of done met:**
- [x] Fork created, local clone of my fork, both remotes and toolchain verified (see setup log)
- [x] AI rules / project memory in place and smoke-tested
- [x] First contribution implemented and committed on a feature branch
- [x] PR opened (or description ready) and review feedback addressed

Notes on the last two boxes: the first contribution is on this branch, `docs/first-contribution-alexneilson02` (an agent first used `cursor/contributors-roster-299a`; it was renamed to match the plan). Team PR #15 is **open**, not merged. Simulated mentor review is recorded in `docs/onboarding/review-response-notes.md`, which is on this branch. See §5 and §6.

## 2. Deliverables index (what exists and where)

**This branch:** `docs/first-contribution-alexneilson02`  
Checked in this working tree on 2026-09-16. Every path below with a checked box is present here.

| On this branch? | Artifact | Path | Why it matters |
| --- | --- | --- | --- |
| [x] | Setup log | `docs/onboarding/setup-log.md` | Auditable proof of accounts, fork, Git identity, clone, remotes |
| [x] | Repo map | `docs/onboarding/repo-map.md` | Safe contribution surfaces (single-package app at root, not `apps/` + `packages/`) |
| [x] | AI tooling verification | `docs/onboarding/ai-tooling-verification.md` | Smoke tests ST1–ST4; Decision: GO. Copied here from fork PR #2 rather than merging that older branch whole |
| [x] | Project rules | `.cursor/rules/preishare.mdc` | Persistent IDE-agent constraints |
| [x] | Agent memory entrypoint | `AGENTS.md` | Cross-tool project context (rewritten; only pre-existing file with deletions) |
| [x] | First contribution plan | `docs/onboarding/first-contribution-plan.md` | Scoped plan before code |
| [x] | Contribution notes | `docs/onboarding/first-contribution-notes.md` | What changed and why |
| [x] | Contributors credit | `CONTRIBUTORS.md` | Roster row: Alex Neilson / AlexNeilson02 / Onboarding engineer / 2026-09-16 |
| [x] | PR description | `docs/onboarding/pr-description.md` | Reviewer-facing summary for PR #15 |
| [x] | Review response notes | `docs/onboarding/review-response-notes.md` | How simulated review feedback was handled. Copied here from fork PR #6 rather than merging that older branch whole |
| [x] | This handoff | `docs/onboarding/onboarding-handoff.md` | Single entry point for mentors |
| [ ] | Team orientation notes | `docs/onboarding/team-orientation-notes.md` | **Not in this clone.** Do not invent it. Setup log originally cited it; that reference is treated as stale (review comment 5). |

`docs/onboarding/` on this branch contains: `setup-log.md`, `repo-map.md`, `ai-tooling-verification.md`, `first-contribution-plan.md`, `first-contribution-notes.md`, `pr-description.md`, `review-response-notes.md`, `onboarding-handoff.md`.

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

- Rules file purpose (one sentence): `.cursor/rules/preishare.mdc` (on this branch) is the always-apply constraint list — identity, verified stack, safe first-touch surfaces, secrets handling, and out-of-scope defaults — aligned with the repo map and working tree.
- AGENTS.md purpose (one sentence): two-minute human-and-agent onboarding memory that points at the rules file, repo map, and onboarding docs on this branch; highest-risk constraints are also stated here so a session that loads only one of the two files still holds the line (deliberate duplication, documented in review-response notes comment 2).
- Smoke-test prompt used and whether the agent correctly named stack pieces (TypeScript, TanStack Start, React, Supabase, PostgreSQL, pgvector): recorded in `docs/onboarding/ai-tooling-verification.md` **on this branch**. ST4 prompt: which core technologies this repo uses and where config lives. Result: **pass** — TypeScript, React 19, TanStack Start/Router, Vite 8, Tailwind v4, npm; Supabase / PostgreSQL / pgvector named as product direction **not present** in the tree. All four smoke tests (ST1 structure, ST2 secrets, ST3 first-change scope, ST4 stack) passed on first run; **Decision: GO**.
- Context gaps found and fixes applied: verification log says none; accepted limitation is that Supabase/Postgres/pgvector files are absent and must not be invented, and `team-orientation-notes.md` is still not in this clone. Do not invent it.

## 5. First contribution and review outcome

- Plan goal (from `docs/onboarding/first-contribution-plan.md` on this branch): add myself as a new contributor in a contributors doc and make one minimal, reviewable docs (or agreed low-risk UI) touch so the team can practice review on a small first PR.
- Files touched (from `docs/onboarding/first-contribution-notes.md` on this branch): `CONTRIBUTORS.md` (Cycle 1); optional `README.md` pointer **skipped** (Cycle 2); contribution notes (Cycle 3). This branch also carries the rest of the onboarding bundle listed in §2 — a wider diff than the plan’s original in-scope table, flagged in `docs/onboarding/pr-description.md`.
- PR title and link: GitHub currently shows **“Docs/first contribution alexneilson02”** at https://github.com/EdTechForLearning/PREIShare-org-repo/pull/15 (open, targeting team `main` from this fork branch). Review-response notes on this branch record an intended title: `docs: add onboarding artifacts and CONTRIBUTORS entry for first contribution`.
- Review-style feedback received (summary, from `docs/onboarding/review-response-notes.md` on this branch): simulated chat-assistant mentor review on 2026-09-16 (five comments). Blocking: (1) test plan vs an email in a setup-log **draft** — declined, premise did not match the pushed file; (2) PR description claimed `AGENTS.md` stopped restating constraints, but Stack / Scripts / Do not still overlap the rules file — accepted the design (failsafe duplication), fix the description. Non-blocking: (3) `.cursorrules` overlap parked as out of scope; (4) generated Intent skills monorepo bullet vs “not a monorepo”; (5) setup log citing missing orientation notes.
- Changes made in response: the review-response notes on this branch list follow-up commits (duplication comments in `AGENTS.md` and `preishare.mdc`; `.cursorrules` path note; skills-block caveat; remove stale orientation-notes reference from setup log) plus PR description edits. Some of those follow-up *code* edits may still need a human to confirm on the GitHub files tab; the notes file itself is on this branch.
- Merge readiness: **ready with follow-ups** — docs and agent-config only, no runtime code, simulated blocking comments have written resolutions on this branch. Still waiting on a human mentor on PR #15. Follow-ups: whether the team wants the full onboarding bundle or the roster row alone; whether the `AGENTS.md` deletions removed anything the team still needed.

## 6. Open risks and environment gaps

1. **No local data layer.** Supabase, PostgreSQL, and pgvector are product direction only. There is no `src/lib/supabase.ts`, no `supabase/` folder, no `.env.example`. `.cursorrules` still tells agents to use a Supabase client; `preishare.mdc` (on this branch) says not to create one unless a human asks. Parked overlap (review comment 3) — do not assign auth/data work until a mentor reconciles those files.
2. **No test / lint / CI scripts in this tree.** First contribution was not build-verified (`npm run dev` skipped). There is no `test` script and no GitHub Actions. Next sprint should not assume a green CI gate.
3. **PR #15 is still awaiting human review** (open). Simulated review is not a substitute. GitHub title and some description claims may still be the pre-review versions.
4. **Wrong-baseline git diffs.** Fork `main` already contains earlier onboarding merges; team `main` does not. `git diff main` undercounts vs `git diff upstream/main`. Same class of mistake as Cycle 1. Always diff the branch the PR actually lands on.
5. **Missing orientation notes.** `docs/onboarding/team-orientation-notes.md` is the only listed onboarding path **not** on this branch. It was never committed. Do not invent it.

If asking “what I would re-verify on day one of the next sprint”: (a) `git remote -v` still has origin = fork and upstream = team repo; (b) `git diff upstream/main --stat` for any open PR; (c) rules file and `.cursorrules` still disagree on Supabase; (d) whether PR #15 merged or needs a narrower roster-only follow-up.

## 7. Decisions log (for stakeholders)

| Decision | Choice | Rationale |
| --- | --- | --- |
| First contribution surface | Root `CONTRIBUTORS.md` roster row (name, GitHub, role, onboarded date) | Repo map: no contributor guide existed; new docs file has no runtime import. Plan allowed an optional README pointer; Cycle 1 instructions forbade other files, so README was skipped. |
| Branch naming | This PR uses `docs/first-contribution-alexneilson02`. Agents also created `cursor/<task>-299a` side branches. | Matches the plan’s Git habit. Side branches were used to add files; those files are now on this branch. |
| AI tool category used most | coding-agent (Cursor cloud) for implementation; chat-assistant for simulated mentor review | Coding-agent kept diffs to named files when prompted tightly. Chat-assistant was the assigned reviewer persona. Human reviewed every pushed diff. |
| Scope honesty on a wide PR | Keep the onboarding bundle on this one branch / PR, and say so in the description | The plan named two files; this branch now carries every tutorial artifact listed in §2. Flagging the expansion is cheaper than hoping a reviewer misses it. |
| `AGENTS.md` vs rules overlap | Keep overlapping highest-risk constraints; document as a failsafe | Agents do not always load both files. Undocumented duplication looks like sloppiness; documented duplication is a constraint. |
| `.cursorrules` vs `preishare.mdc` | Do not edit `.cursorrules` in the first PR | Predates this onboarding; editing it would widen an already-wide PR. Park visibly rather than silently. |
| Missing `team-orientation-notes.md` | Do not create or invent it | It is the one index path still absent from this branch. Rules and AGENTS.md already warn against inventing it. |
| Bring PR #2 and PR #6 files here | Copy `ai-tooling-verification.md` and `review-response-notes.md` onto this branch; do **not** merge those whole branches | Those branches started from older commits. A full merge would try to delete later files. Copying put both files on this branch without rolling it backward. |

## 8. Next-sprint preview (what this unlocks)

The next sprint topic can assume:

1. **Trusted local environment** — clone + toolchain documented in `docs/onboarding/setup-log.md` on this branch; re-run only if OS or versions change. Node/npm versions still need a first recording if the next sprint depends on them.
2. **AI alignment** — `.cursor/rules/preishare.mdc`, `AGENTS.md`, and `docs/onboarding/ai-tooling-verification.md` are on this branch; extend rules when new packages appear, do not start from zero. Still refuse inventing `apps/`, `packages/`, or a Supabase client.
3. **Git habit** — feature branch → small commits → PR → respond to review is practiced once end-to-end (including a false-failure on `git diff main` and a simulated five-comment review recorded on this branch).
4. **First PR path** — merge-ready **with follow-ups** onboarding contribution on this branch; feature work should use the same PR quality bar (problem / approach / test plan, disclose scope, diff against `upstream/main`).

**Explicitly out of scope until later:** large product features, production deployments, and database migrations you have not been trained on yet. Also out of scope until assigned: auth, billing, `src/routeTree.gen.ts`, app shell (`src/router.tsx`, `vite.config.ts`, `src/routes/__root.tsx`), lockfile upgrades, and GitHub Actions.

## 9. Ask for mentor

- Questions still open:
  - Does the team want PR #15 as the full onboarding bundle now on this branch, or a narrower `CONTRIBUTORS.md`-only PR?
  - Did the `AGENTS.md` rewrite drop anything the team still relies on (only pre-existing file with deletions)?
  - Do `.cursor/rules/preishare.mdc` constraints match how the team actually works, including the parked `.cursorrules` Supabase overlap?
  - Is `docs/onboarding/team-orientation-notes.md` missing, renamed, or intentionally uncommitted? It is the only listed onboarding file not on this branch.
- Review of this handoff requested: yes
- Preferred follow-up time or channel: GitHub comments on https://github.com/EdTechForLearning/PREIShare-org-repo/pull/15 (no other channel or time recorded in the onboarding files)

---

## Fill notes (how this file was completed)

This section is the decision trail for filling the scaffold. It is not extra product scope.

- **This revision’s job:** make the handoff match the branch. `ai-tooling-verification.md`, `review-response-notes.md`, `pr-description.md`, and this handoff are on `docs/first-contribution-alexneilson02`. Stale “not on this branch / merge PR #2 later” language was removed.
- **Checkboxes in §2** are the proof list. Checked = file exists on this branch. Unchecked = `team-orientation-notes.md` only.
- **No email addresses** were copied out of the setup log. Section 3 answers “configured: yes” only.
- **Node / npm versions were not guessed.** Setup log never recorded them.
- **Install/build/test were not claimed.** Setup log and the first-contribution plan do not show those commands succeeding.
- **Whole PR #2 / PR #6 branches were not merged.** Their two files were copied onto this branch so later files were not deleted.
- **Uncommitted local edits** to `setup-log.md` and `first-contribution-notes.md` were left unstaged and are not part of this handoff revision.
- **Merge readiness stays “ready with follow-ups”** because a human has not reviewed PR #15, not because the onboarding files are still split across branches.

---

*End of handoff. Keep this file updated if merge status or env gaps change before the next sprint starts.*
