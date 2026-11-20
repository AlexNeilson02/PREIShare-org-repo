# PREIshare Sprint 6 — Stakeholder Handoff

**Audience:** PREIshare product owners, tech leads, and reviewers  
**Sprint goal:** Continuous integration on every pull request + AI-assisted review that does not replace human judgment  
**Date:** 2026-11-20  
**Author:** Alex Neilson

---

## 1. Client story recap (why we did this)

Before this work, every pull request required teammates to remember to install dependencies, typecheck, build, lint, and test on their own machines. That was slow, easy to skip, and let broken code reach `main` (recent merges such as #60–#62 had no GitHub Actions checks).

**What changed:** Every pull request into **`main`** now runs one GitHub Actions job named **`quality`**. Humans still decide whether the change is correct for the product and whether it is safe to merge.

**Source notes:** `docs/ci/pr-pain-and-goals.md` (humans stay in charge of merge, product, auth, and secrets), `docs/ci/pipeline-design.md` (trigger is `pull_request` to `main`, not a production deploy).

---

## 2. What is automated on every pull request

| Stage | What runs | Where defined |
| --- | --- | --- |
| Trigger | `pull_request` to **`main`** only (`opened`, `synchronize`, `reopened`). Not `push`. Newer commits on the same PR cancel the stale run. | `.github/workflows/pr-ci.yml` (`on:` and `concurrency`) |
| Setup | Checkout; Node **22**; `npm ci` from `package-lock.json`; npm cache | same |
| Quality gates | Job **`quality`**: `npm run typecheck` → `npm run build` → `npm run lint` → `npm run test` | same + `docs/ci/ci-scripts-notes.md` |
| Failure behavior | A failed step fails the job (no `continue-on-error`). The PR shows a red **`quality`** check. Merge is **not** blocked until an admin turns on branch protection. | `docs/ci/branch-protection-checklist.md`, `docs/ci/e2e-verification-log.md` |

**Plain-language summary for stakeholders:**  
If install, types, build, lint, or tests break, the PR shows a failed **`quality`** check. Teammates should fix the PR before merge—not skip the check. Reproduce locally with `npm ci` then `npm run typecheck && npm run build && npm run lint && npm run test`.

**What CI does *not* do (by design):**  
- Does not deploy production (and does not treat Vercel preview as this quality gate)
- Does not approve product/UX decisions
- Does not replace reading the diff
- Does not store or print secret values in logs (`permissions: contents: read`; no GitHub Secrets injected)
- Does not run live login, listing CRUD, Supabase migrations, or embedding APIs
- Does not run a browser end-to-end suite (no Playwright in this workflow)

---

## 3. What humans still decide

| Decision | Owner | Why it stays human |
| --- | --- | --- |
| Merge approval | Reviewer / maintainer | CI proves **`quality`** passed, not that the feature is right for investors or sponsors |
| Using AI review prompts | Reviewer | AI can miss RLS intent, service-role use, or product copy. It must not approve, LGTM, or merge |
| Secret and env configuration | Maintainer | Names such as `SUPABASE_SERVICE_ROLE_KEY` may be documented; values must not live in the workflow, PR body, or chat |
| Enabling required status checks | Repo admin | Branch protection is a GitHub Settings click. YAML cannot turn it on |
| Auth, Supabase row access, migrations | Reviewer / operator | Inventory Bucket B/C: live DB and RLS are not in PR CI |
| Accepting known gaps (schema-only tests, `npm audit` findings) | Tech lead | Do not disable **`quality`** to paper over missing coverage |

**AI-assisted review boundary:**  
Use the prompt pack in `docs/ci/ai-pr-review-prompts.md` (diff summary, risk flags, review questions) to speed reading. Pack-level **Boundaries** and **Human merge authority** apply even if a prompt is later edited. A human must still approve or request changes. AI output is advice, not a merge vote.

---

## 4. How to enable branch protection (operator checklist)

Point admins at `docs/ci/branch-protection-checklist.md` and require at least:

1. Protect **`main`** (the only merge target in the pipeline design).
2. Require the CI check named **`quality`** (from `jobs.quality.name` in `pr-ci.yml`; confirmed on [PR #71](https://github.com/AlexNeilson02/PREIShare-org-repo/pull/71)). Do **not** require “Vercel Preview Comments”.
3. Prefer “Require branches to be up to date before merging”.
4. Require at least one human review.
5. Do not allow bypassing checks for routine contributor work.

**Status after verification:** [x] Not enabled yet  /  [ ] Enabled on main  
**Evidence:** `docs/ci/e2e-verification-log.md` section 3 — UI boxes on the checklist remain unchecked; a red **`quality`** check does not yet block merge by itself.

---

## 5. Known limits and risks (honest scope)

Only limits we actually saw or designed around:

| Limit | Impact | Recommended next action |
| --- | --- | --- |
| Branch protection not on | Contributors can still merge a red PR | Admin enables required check **`quality`** using the checklist |
| Schema-only unit tests | `npm run test` covers listing Zod rules (`src/lib/listings/schema.test.ts`, 4 tests). Login, listing CRUD, and RLS are not automated | Keep those reviews human; do not add Playwright on PRs without a team decision |
| Secrets / private env | PR CI does not inject `VITE_SUPABASE_*`, `SUPABASE_*`, or `EMBEDDING_API_KEY` | Keep it that way unless a written non-prod secret plan exists; never commit `.env` |
| Service-role listing access | `createServerSupabaseClient` aliases the service-role client. Green **`quality`** does not prove row-level safety | Human review (Prompt 2 dry-run asked this; it did not approve) |
| `npm audit` (9 findings on dry-run) | Not a required PR gate | Decide separately; do not add `npm audit` as a surprise red X |
| No flake observed in this dry-run | n/a this sprint | If flakes appear later, fix or quarantine; do not disable the workflow |

---

## 6. Verification snapshot

Summarize the end-to-end dry run from `docs/ci/e2e-verification-log.md` (2026-11-20):

- **PR opened / workflow triggered:** yes — [PR #71](https://github.com/AlexNeilson02/PREIShare-org-repo/pull/71), job **`quality`** success on `4462fdd`: https://github.com/AlexNeilson02/PREIShare-org-repo/actions/runs/44771581296/job/136410343392
- **Expected steps ran in order:** yes — local and GitHub: `npm ci` → `typecheck` → `build` → `lint` → `test` (all exit 0)
- **Intentional failure experiment (optional):** no dedicated “break CI on purpose” in the verification session. Earlier in the sprint, a bad test import and a missing ESLint package failed locally; both were fixed before this log. We did **not** fake a red GitHub check.
- **AI review prompt trial:** yes — Prompt 2 (risk flags) on the service-role listing alias. Assistant asked questions; did not LGTM or merge. Human still owns the call.
- **Blockers found:** branch protection not enabled; tests do not cover auth/Supabase; `npm audit` findings (not gated)

**Gate status from the log:** Credible with known gaps. Safe for this handoff with caveats.

---

## 7. Artifact index (where everything lives)

| Artifact | Purpose |
| --- | --- |
| `docs/ci/pr-pain-and-goals.md` | Original PR pain and success goals |
| `docs/ci/project-ci-inventory.md` | What the repo can run without secrets vs what stays human |
| `docs/ci/pipeline-design.md` | Planned stages before YAML |
| `.github/workflows/pr-ci.yml` | Live PR CI workflow (`PR CI` / job **`quality`**) |
| `docs/ci/ci-scripts-notes.md` | Scripts CI relies on (`npm ci` and the four `npm run` names) |
| `docs/ci/branch-protection-checklist.md` | Admin steps to require **`quality`** |
| `docs/ci/ai-pr-review-prompts.md` | Human-in-the-loop review prompts |
| `docs/ci/e2e-verification-log.md` | Proof the loop was exercised |
| `docs/ci/stakeholder-handoff.md` | This handoff |

---

## 8. What should roll into the next Sprint 6 topic

Prioritize follow-ups that improve trust without expanding scope blindly:

1. Turn on branch protection: require **`quality`** on `main` and confirm contributors cannot merge on red.
2. Keep tests honest: schema tests are enough for this gate; do not pretend Playwright or live Supabase ran.
3. Decide policy for secrets and optional Supabase-backed checks on PRs (default: stay out of PR CI).
4. Follow up on service-role vs session/RLS for listing CRUD — a product/security review, not a new CI job.
5. Refine AI review prompts after one or two real PR trials (keep humans accountable; no auto-merge).
6. Treat `npm audit` as a separate policy, not a silent add to **`quality`**.

---

## 9. One-paragraph executive summary

PREIshare pull requests into `main` now run one automated **`quality`** job: install → typecheck → build → lint → test, so broken changes fail in public instead of on a teammate’s laptop. That job passed locally and on GitHub during verification. It does not deploy, does not log secrets, and does not prove login or database safety. AI-assisted prompts can speed review, but they must not approve or merge. Admins still need to require **`quality`** in branch protection; until then a red check is a signal, not a lock. The next sprint should enable that lock and keep product, auth, and Supabase judgment with humans.

## Topic 2: AI review overlay on the finished CI gate

The topic 1 record above stays in force. Continuous integration is already done. The GitHub Actions workflow at `.github/workflows/pr-ci.yml` already installs, typechecks, builds, lints, and tests on pull requests. This section does not rebuild that workflow, the prompt pack, or the live site. It tells stakeholders how human review sits on top of that finished gate.

### What the AI review can and cannot do

The AI review can:

- Suggest findings on a pull request, in the required output shape from the system instruction.
- Help a human reviewer look faster. It is an advisor only.

The AI review cannot:

- Approve a pull request.
- Merge a pull request.
- Replace a human decision about sign-in, money, privacy, or product intent.
- Count as a required GitHub status check or a required reviewer.

A green CI check is evidence the commands passed. It is not permission to merge.

### Where to read the overlay

Do not look for a second handoff file. Start with the overview, then open the piece you need.

| Piece | Path | What a stakeholder uses it for |
| --- | --- | --- |
| Overlay overview | `docs/ci/ai-review-overlay-brief.md` | Why this review layer exists |
| Who may approve and who may merge | `docs/ci/pr-approval-roles.md` | Humans only; the AI is an advisor |
| System instruction and output shape | `docs/ci/ai-pr-review-prompts.md` | How the AI must answer |
| Human-judgment checklist | `docs/ci/human-judgment-checklist.md` | Sign-in, money, privacy, and product intent |
| Review runbook | `docs/ci/ai-review-orchestration.md` | The same sequence every time |
| Sample critique and prompt revision | `docs/ci/sample-pr-review/critique-and-prompt-revision.md` | What the practice review taught us |
| Branch-protection record | `docs/ci/branch-protection-checklist.md` | What GitHub actually saved |
| Practice sample | `docs/ci/samples/README.md` | The planted privacy sample; not app code |

### Branch protection: enforced now versus only documented

Copied from `docs/ci/branch-protection-checklist.md`. This handoff does not change GitHub settings.

#### Enforced on this repository now

- None. The enforcement record says no rule was saved. Settings could not be opened. Result for every intended rule was blocked by missing admin. GitHub still shows `main` unprotected.

#### Documented but not enforced on this plan

- Require a pull request before merging. Wanted, not saved.
- Human approvals before merge: 1 approval by the Human reviewer, the repository owner, Alex Neilson. Wanted, not saved. The AI assistant is not an approver.
- Required status check `quality` from `.github/workflows/pr-ci.yml`. Wanted, not saved. No new workflow was added.
- Restrict who may merge to the Maintainer, the repository owner, Alex Neilson. Could not set. Not enforced by GitHub.

The AI assistant is not a required approver and is not a required status check.

### Sample privacy pull request

The practice pull request with one planted privacy mistake was not merged. The practice files stay under `docs/ci/samples/` for learning. They are not live member-facing code. Sprint 7 must not merge that sample.

### Decision log: why humans remain the approvers

Approval and merge stay with the humans named in the roles file. A passing CI run cannot judge these four risks. The AI may comment. A person must decide.

| Risk | Why a human must decide | Artifact that supports the person |
| --- | --- | --- |
| Sign-in | A change can pass `quality` and still let the wrong person into a sponsor or investor dashboard, or lock the right member out. | Roles file and human-judgment checklist |
| Money | Dues, listing prices, refunds, or balances are not something an AI comment may accept. | Human-judgment checklist |
| Privacy | The practice review planted a privacy mistake on purpose. The human judged the AI notes with the checklist and the critique. This handoff does not paste member emails. | Checklist and critique file |
| Product intent | A change can typecheck and still be wrong for PREIshare as real-estate intelligence for the people the dashboard is built for. | Overlay brief and checklist |

### Sprint 7 next actions

These items are already done and working. Do not list them as missing, unbuilt, or work to create.

- The pull-request CI workflow is done and running. Do not rebuild `.github/workflows/pr-ci.yml`.
- The AI review prompt pack, which is the system instruction, is done. Do not treat `docs/ci/ai-pr-review-prompts.md` as unwritten.
- The existing Production site is already live on the current Vercel Hobby project. Do not create a new hosting project. Later confirmation uses that same public URL.
- Keep merge decisions with the humans named in the roles file. The AI remains an advisor.
- On future pull requests, follow the runbook and the human checklist.
- If the GitHub plan later allows a rule that is only documented today, apply it from the branch-protection checklist. Until then, leave that honest gap recorded. The gap does not mean CI was never built.

### What stakeholders should remember

The automatic checks stay required evidence. The person who approves is still a person. The sample privacy change was not merged.
