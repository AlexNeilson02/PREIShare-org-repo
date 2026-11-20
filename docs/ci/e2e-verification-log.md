# PREIshare PR CI — End-to-End Verification Log

**Date:** 2026-11-20
**Verifier:** Alex Neilson (Sprint 6 CI dry-run; cloud agent on this branch)
**Repo / branch used:** `AlexNeilson02/PREIShare-org-repo` branch `cursor/pr-ci-scaffold-80ba` (PR #71 targeting `main`)
**Inputs checked:**
- `.github/workflows/pr-ci.yml`
- `docs/ci/ci-scripts-notes.md`
- `docs/ci/branch-protection-checklist.md`
- `docs/ci/ai-pr-review-prompts.md`

---

## 1. Static workflow review

Read `.github/workflows/pr-ci.yml` before running any commands. Did not edit the workflow during this verification.

| Check | Result (pass/fail) | Evidence / notes |
| --- | --- | --- |
| Triggers on `pull_request` (branches as designed) | pass | `on.pull_request.branches: [main]`; types `opened`, `synchronize`, `reopened`. Matches `docs/ci/pipeline-design.md` (main only; not `push`). |
| Job name(s) clear for GitHub status checks | pass | Job id and `name:` are both `quality`. Real PR check run uses that name. |
| Step order: checkout → runtime setup → install → typecheck → build → lint → test | pass | Steps: checkout@v4 → setup-node@v4 (Node 22, `cache: npm`) → `npm ci` → `npm run typecheck` → `npm run build` → `npm run lint` → `npm run test`. |
| Each `run:` matches scripts in `docs/ci/ci-scripts-notes.md` | pass | Notes table: `npm ci`, `npm run typecheck`, `npm run build`, `npm run lint`, `npm run test`. Same strings in YAML and `package.json`. |
| Caching / dependency install strategy present and sensible | pass | `actions/setup-node` `cache: npm` keyed off the lockfile; install is `npm ci` not `npm install`. |
| Fail-fast behavior acceptable (failed step fails the job) | pass | No `continue-on-error`. Default Actions fail-fast. |
| No plaintext secrets or unsafe `${{ }}` expansions in logs | pass | `permissions: contents: read`. Concurrency expression uses workflow name + PR number/ref only. No `secrets.` / env injection. |

**Static review summary:** The workflow is a single `quality` job on PRs to `main`. Commands match the script notes. Node is 22 (inventory), not the generic tutorial’s 20. Caching is npm-only. Nothing in YAML prints or injects Supabase/embedding secrets.

---

## 2. Local CI command dry-run

Run the same sequence CI will run. Copy commands from `docs/ci/ci-scripts-notes.md`.

Working directory: repo root (contains `package.json`). Commands run one at a time on 2026-11-20.

| Step | Exact command | Exit (pass/fail) | Notes |
| --- | --- | --- | --- |
| Install | `npm ci` | pass (exit 0) | 288 packages. `npm audit` reported 9 vulnerabilities (2 moderate, 4 high, 3 critical). Audit is **not** a required CI gate (`docs/ci/project-ci-inventory.md`). |
| Typecheck | `npm run typecheck` | pass (exit 0) | Ran `tsc --noEmit`. |
| Build | `npm run build` | pass (exit 0) | `vite build` client + SSR + Nitro `node-server` → `.output/`. |
| Lint | `npm run lint` | pass (exit 0) | `eslint . --max-warnings 0`. |
| Test | `npm run test` | pass (exit 0) | `node --test src/**/*.test.ts`: 4 tests, 0 fail (`src/lib/listings/schema.test.ts`). |

**Environment notes:** Node `v22.23.4`, npm `10.9.9`, OS Linux (cloud agent VM). Package manager npm + `package-lock.json`.

**Local dry-run summary:** The full sequence succeeded in this session. Nothing broke. Residual: `npm audit` findings (not gated) and tests covering only Zod listing schema, not auth/Supabase.

---

## 3. PR → CI loop checklist

Use `docs/ci/branch-protection-checklist.md` as the source of checklist items.

Real GitHub evidence from PR https://github.com/AlexNeilson02/PREIShare-org-repo/pull/71 (not a fake green). Head at verification: `4462fdd`.

| Checklist item | Status (Ready / Needs work / Blocked) | Evidence |
| --- | --- | --- |
| Workflow runs on pull requests | Ready | Check run **quality** succeeded on `4462fdd`: https://github.com/AlexNeilson02/PREIShare-org-repo/actions/runs/44771581296/job/136410343392 |
| Check names suitable as required status checks | Ready | Exact name on the PR: **`quality`**. Workflow `name:` is `PR CI`. Do **not** require “Vercel Preview Comments” (separate app; checklist says so). |
| Concurrency / duplicate-run behavior acceptable | Ready | YAML: `group: pr-ci-${{ github.workflow }}-${{ github.event.pull_request.number \|\| github.ref }}`, `cancel-in-progress: true`. Did not observe two overlapping runs cancel in this session; behavior is encoded, not live-raced. |
| Human still required for merge (CI ≠ auto-merge) | Ready | PR #71 is mergeable/clean with no auto-merge. Checklist still requires a human approval. AI pack forbids LGTM/merge. |
| Branch protection readiness gaps listed | Needs work | `docs/ci/branch-protection-checklist.md` UI boxes are **unchecked**. YAML cannot enable Settings → Branches. Maintainer/date sign-off blanks are empty. Learners without admin rights only prepared the list. |

**PR loop summary:** A teammate opening a PR into `main` tomorrow will get a trustworthy **`quality`** red/green signal (install through test). That signal is **not** yet a merge blocker until a human with admin access turns on required status checks. Green CI is still not product/auth/RLS approval.

---

## 4. AI-assisted review dry-run (human remains accountable)

**Sample change used:** Written description of a risky data-access change already present in the tree (not a new commit): `src/lib/supabase.server.ts` exports `createServerSupabaseClient` as an alias of `createSupabaseServiceRoleClient` (service role, bypasses RLS). `src/server/listings.ts` then uses `createServerSupabaseClient()` for listing CRUD after `getUser()`. CI `quality` would still pass because this is not a type/build/lint/unit-schema failure.

**Prompt chosen:** Prompt 2 — Risk flags (auth, Supabase, migrations)
**Tool category used:** chat-assistant

**AI output — what helped:**
- Flagged **high**: service-role alias means listing reads/writes are not proved by RLS; `owner_id` filter in application code is the remaining control. Question: is every `listings.ts` path supposed to bypass RLS, and what happens if `getUser()` is wrong or stubbed?
- Flagged **high**: `SUPABASE_SERVICE_ROLE_KEY` is required for that client. Question: confirm it is server-only (never `VITE_*`) and not logged.
- Flagged **medium**: CI does not exercise login or listing CRUD (`project-ci-inventory.md` Bucket B). Question: who manually verifies a signed-in sponsor can only see their rows?
- Skipped migrations/embeddings buckets (nothing in the sample).
- Ended with questions, not a pass. Did not say approve, LGTM, or merge. Did not ask for secret values.

**AI output — problems (if any):**
- None on this run. Did not claim the code is safe. Did not invent CI status.

**Human judgment call:** Ask for more info (why service role instead of the session/RLS client for listing CRUD) before any merge. Would **not** treat green `quality` as enough. Would not “approve with comments” until a human names the RLS intent.

**Prompt fix applied?** No — first run stayed advisory. No re-run required.

Reminder: only a human may approve or merge this PR.

---

## 5. Assess → fix → re-verify cycles

| Cycle | What failed | Fix applied (file + change) | Re-verify result |
| --- | --- | --- | --- |
| 1 (earlier in this sprint, before this log) | `node --test` on `src/lib/embeddings/generate.test.ts` failed (`ERR_MODULE_NOT_FOUND` for extensionless `./types` import) | Deleted that experiment; added `src/lib/listings/schema.test.ts` importing `./schema.ts` with extensions. `package.json` `test` = `node --test src/**/*.test.ts` | `npm run test` now 4 pass / 0 fail (local + GitHub `quality`) |
| 2 (earlier in this sprint) | First `eslint.config.js` imported `@eslint/js`, which was not installed | Config uses `typescript-eslint` recommended only; ignores `.output/`, `dist/`, `node_modules/`, `src/routeTree.gen.ts` | `npm run lint` exit 0 locally and on Actions |
| 3 (this session) | No failures; full sequence passed on first dry-run | n/a | `npm ci` → typecheck → build → lint → test all exit 0; Actions `quality` success on `4462fdd` |

Residual risk even with a green first dry-run: tests do not cover auth or Supabase; `npm audit` findings exist; branch protection is not turned on.

---

## 6. Gate credibility decision

**Overall gate status:** Credible with known gaps

**Known gaps still open:**
1. GitHub branch protection on `main` is **not** enabled (checklist prepared; admin UI not clicked). A red `quality` check does not yet block merge by itself.
2. Automated tests are schema-only. Login, listing CRUD, RLS, migrations, and embeddings stay human (Bucket B/C). No Playwright e2e in CI.
3. `npm audit` reported 9 issues; not a required PR gate.

**Safe for Sprint 6 stakeholder handoff?** Yes with caveats

**Notes for Step 12 handoff:**
- PR CI job **`quality`** runs on `pull_request` to `main` (`opened` / `synchronize` / `reopened`): `npm ci` → typecheck → build → lint → test. Node 22, npm, lockfile install.
- Reproduce locally from `docs/ci/ci-scripts-notes.md`. Local and GitHub both passed this dry-run.
- Required check name to protect later: **`quality`**. Do not require Vercel. YAML cannot flip branch protection.
- AI review pack (`docs/ci/ai-pr-review-prompts.md`) is advisory; Prompt 2 dry-run asked questions about service-role listing access and did not merge.
- Green CI does not prove product fit, auth, Supabase RLS, or migrations. A named human still owns approve/merge.
