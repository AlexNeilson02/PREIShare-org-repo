# Branch protection checklist — PREIshare dashboard

YAML cannot turn on GitHub branch protection. This file is the human
admin checklist so a red `PR CI` run actually blocks merge to `main`.
Do not paste tokens or enable auto-merge from this document.

Cross-check: `.github/workflows/pr-ci.yml` and
`docs/ci/pipeline-design.md`.

## Status check name to require

GitHub matches the **job `name:`**, not the workflow filename.

| Field | Value in this repo |
| --- | --- |
| Workflow file | `.github/workflows/pr-ci.yml` |
| Workflow `name:` | `PR CI` |
| Job id | `ci` |
| **Required status check** | **`Install, typecheck, build, lint, and test`** |

If the job `name:` changes, this checklist and the GitHub rule must
change in the same change. Do not require Vercel preview as the quality
gate — that is a separate product, not this workflow.

## What the workflow already does (so the rule can work)

These are in YAML today. Protection will not work if they regress.

- [x] Trigger: `pull_request` targeting **`main`** (not push-only, not
      `workflow_dispatch`-only)
- [x] PR types include **`opened`** and **`synchronize`** so the first
      open *and* later commits re-run (also `reopened`,
      `ready_for_review`)
- [x] `concurrency` group per PR with **`cancel-in-progress: true`** so
      the required check is the latest SHA, not a stale in-flight run
- [x] Stable job `name:` (see table above)
- [x] Required steps fail the job (no `continue-on-error`)
- [x] No `paths` / `paths-ignore` filters — a skipped required check
      stays pending and can block every merge
- [x] Least-privilege `permissions: contents: read` (no deploy secrets)

## GitHub UI (admin must click — YAML cannot do this)

Settings → Branches → Add branch protection rule (or a ruleset that
protects `main`). Leave boxes unchecked here until a human confirms
the setting in the UI.

Branch name pattern: `main`

- [ ] Require a pull request before merging
- [ ] Require status checks to pass before merging
- [ ] Require branches to be up to date before merging
- [ ] Add required check: `Install, typecheck, build, lint, and test`
- [ ] Block force pushes
- [ ] Block deletions
- [ ] Do not allow bypassing the above settings (optional; org/admin
      policy)

Approvals are a team choice. CI still does not replace review.

## How to confirm the check name

1. Open a PR into `main` (this workflow does not run for PRs whose base
   is another branch).
2. Wait for **PR CI** / **Install, typecheck, build, lint, and test**.
3. Copy that check name into the branch protection rule. Do not type a
   guess such as `pr-ci.yml` or `ci`.

## What this checklist does not do

- Does not deploy, inject secrets, or call live Supabase / embeddings.
- Does not auto-merge when green. Humans still approve and merge.
- Does not enable the GitHub setting by itself. A fork or student clone
  may lack admin rights; leave the UI boxes unchecked until someone
  with Settings access applies them.
- Does not add a browser end-to-end suite (see
  `docs/ci/ci-scripts-notes.md`).
