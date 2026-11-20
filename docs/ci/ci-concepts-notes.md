# CI concepts notes — PREIshare dashboard

Plain-language vocabulary for Sprint 6. This file does not contain YAML.
Every idea below maps back to a pain or goal in
[`docs/ci/pr-pain-and-goals.md`](pr-pain-and-goals.md). Later inventory and
pipeline-design steps should use these words the same way.

## In my own words

**Continuous integration (CI)**
CI is the team habit of automatically running the *same* install and quality
checks whenever someone proposes a change—usually on a pull request—so we
find out quickly if the TypeScript / TanStack Start / React dashboard still
installs and builds. It is not a person clicking “merge,” and it is not a
laptop-only `npm run build`. Humans still decide whether the change is good
enough; CI only proves the shared mechanical checks passed or failed.

**Pipeline / workflow**
A pipeline (GitHub calls this a “workflow”) is the ordered recipe a cloud
machine follows: check out this PR’s code → install from `package-lock.json`
→ typecheck → build → lint → test (lint and test only after those scripts
exist). People write the recipe once. A shared runner executes it the same
way for every teammate. That is the opposite of “I ran some of the steps on
my Mac.”

**Green check vs red X**
- **Green:** every *required* automated step passed. That is a safe signal to
  *start* human review (product, UX, security, listing/auth/Supabase risk).
  It is not permission to merge without thinking.
- **Red:** at least one required step failed. Do not merge. A human reads
  the log, understands the failure, and the fix is re-checked until the run
  is green—or the PR is closed.

**Why every pull request (for PREIshare)**
The pains in `pr-pain-and-goals.md` are forgotten local installs, skipped
build/typecheck/lint/test, no cloud run when a PR opens, reviewers repeating
“does it build?” on laptops, and broken code reaching `main` (see #60, #61,
#62—merged with zero cloud checks). Running one shared pipeline on *every*
open and update of a pull request gives the same signal to every teammate
and catches breakages before merge. Running it only on some machines, or
only after `main` already changed, leaves those pains in place.

Would an automatic run on every PR reduce each of those risks? For the
mechanical ones (install, build, missing shared proof, late feedback):
**yes.** For “what should a human still judge?”: **no**—that gap stays with
reviewers, which later steps cover.

## Pain → CI idea map

Each row is a major pain from `pr-pain-and-goals.md`. “Would an automatic
run on every PR reduce this risk?” is the heart of why CI belongs on PRs.

| Pain (from pr-pain-and-goals) | Would an automatic PR run reduce this? | CI idea |
| --- | --- | --- |
| Teammates forget `npm install`; a missed install is invisible to everyone else | Yes | Workflow installs from `package-lock.json` on a clean runner on every PR—not on whoever remembered locally |
| Build, typecheck, lint, and test are easy to skip; there is no named `typecheck` / `lint` / `test` script | Yes for checks that exist; only partly for missing scripts | Run `npm run build` now; add typecheck/lint/test to the same recipe *after* inventory confirms those scripts. Automation cannot invent scripts that are not there |
| No cloud run when a PR opens or updates; zero GitHub Actions workflows; a PR can sit in review with no shared proof | Yes — this is the core “why every PR” link | Trigger the workflow on `pull_request` (open and update), not on a manual click and not only after merge |
| Broken code can reach `main` because nothing blocks on shared checks (#60, #61, #62 merged with no cloud run) | Yes, as a visible fail signal. Actually *blocking* merge is a later human/admin setting (required checks), not the YAML file by itself | Checks run *before* merge. A red X is the shared proof that something broke. Do not treat “the workflow file exists” as a merge gate until the team turns that signal on |
| Reviewers re-run “does it build?” on their own laptops instead of judging design, product fit, and risk (slow / uneven review) | Yes | Green/red lands first. Humans skip deep review of an obviously broken PR; they spend time on UX, listings, auth, and data handling once basics pass |
| “Works on my machine” / different laptops, Node versions, or half-installed `node_modules` (implied by “own machines” + no shared runner) | Yes | One shared runner OS, one npm version path, one lockfile. Personal laptops stop being the source of truth |
| No shared written line between machine checks and human (including AI-assisted) judgment | **No — this does not map cleanly to automation** | Docs and review process, not a job step. These two `docs/ci/` files start that line. A later AI prompt pack may speed humans; it must not merge, and it must not stand in for a red X. Secrets and production access stay human-owned |

## Non-examples (“CI washing”) — not real CI

Use these as a reject list when a later agent drafts YAML. If a draft matches
one of these, it is theater, not continuous integration.

1. **Only running `npm run build` on my laptop** — Results stay personal. Other
   machines and `main` never get the same proof, so a missed local install
   stays invisible (pain: forgotten local checks).
2. **Merging because an AI comment said “LGTM” while no automated check ran** —
   AI review prompts support humans; they do not replace a green/red pipeline
   signal. `pr-pain-and-goals.md` already says AI does not merge.
3. **A workflow file in `.github/workflows/` that never triggers on pull
   requests** (manual `workflow_dispatch` only, or `push` to a branch nobody
   uses) — The recipe exists but never runs when changes are proposed. That
   is documentation theater, not a shared PR signal.
4. **Running checks only on `main` after merge** — Feedback is too late.
   Broken dashboard code may already be on the default branch, which is
   exactly the #60/#61/#62 pain.
5. **A job that always exits 0** (`continue-on-error: true` on install/build,
   or swallowing a failed `npm run build`) — The PR shows a green check while
   the app is broken. That hides the red X the goals brief asked for.
6. **Calling a live embedding API or injecting `SUPABASE_SERVICE_ROLE_KEY`
   on every PR and calling that “CI”** — Out of scope in the goals brief
   (cost, secrets). It is busywork, not the install → typecheck → build
   proof the team asked for.

## What I will demand from later agent-written YAML (preview)

- Triggers on pull requests (open and update), not only manual clicks, and
  not only after merge to `main`.
- Clear ordered steps matching the goals brief: install → typecheck → build
  → lint → test, with lint/test added only after inventory confirms scripts.
- Failures must fail the job (red X). Do not hide errors or mark failed
  builds as success.
- Use npm and `package-lock.json` (this repo is not a pnpm workspace).
- Do not call live embedding APIs or inject production secrets. Env var
  **names** may be documented; values stay out.
- Secrets and merge decisions stay human-controlled. Green is not auto-merge.

## Open questions for inventory/design steps

- Which exact npm scripts does this repo already expose? (Today: `dev`,
  `generate-routes`, `build`, `preview`. No `typecheck` / `lint` / `test`.)
- Which of those can a shared runner run without secrets? (`build` yes;
  anything that needs `SUPABASE_*` or `EMBEDDING_API_KEY` is out of this
  sprint’s PR checks.)
- Which checks are automatable vs must stay human (product UX, listing copy,
  auth/RLS judgment, security review)?
- Should branch protection later require the workflow to pass before merge,
  or is a visible red X enough for the first design?
- How should lint and test join the recipe once those scripts exist, without
  pretending they already run?
