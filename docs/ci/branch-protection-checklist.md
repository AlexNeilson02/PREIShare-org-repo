# Branch protection checklist (PREIshare PR CI)

## Purpose
Connect the automated green/red signal from `.github/workflows/pr-ci.yml` to merge policy on protected branches. This document is for maintainers with admin access. Contributors without admin rights prepare and verify the checklist only. YAML does not turn protection on.

## Protected branches
- [ ] Protect `main` (the only merge target in `docs/ci/pipeline-design.md`; do not invent extra branches)

## Required status checks
After the workflow has run at least once on a PR, GitHub will show the check name.
- [ ] Require status checks to pass before merging
- [ ] Required check name must match the job that runs quality gates: **`quality`** (workflow `name:` is `PR CI`; copy the exact name from a real PR check run if GitHub displays it differently)
- [ ] Prefer “Require branches to be up to date before merging” so the last CI run reflects the merge base

Do not require Vercel preview or any job that is not in `pr-ci.yml`.

## What CI already enforces (automated)
- Dependency install (`npm ci`)
- Typecheck (`npm run typecheck`)
- Production build (`npm run build`)
- Lint (`npm run lint`)
- Tests (`npm run test`)

## What humans still own (not optional)
- [ ] At least one human review/approval before merge
- [ ] AI-assisted review prompts (later step) are helpers only — never auto-merge on AI output alone
- [ ] Secret/config and product intent review outside pure CI green

## What not to require yet
- [ ] Do not require optional or flaky jobs that are not in `pr-ci.yml`
- [ ] Do not require deploy/production jobs on pull requests
- [ ] Do not store secrets in the PR CI workflow just to satisfy a check

## Readiness sign-off
- [ ] Workflow file path: `.github/workflows/pr-ci.yml`
- [ ] Triggers: `pull_request` to `main` (`opened`, `synchronize`, `reopened`)
- [ ] Concurrency: cancel in-progress runs for the same PR when new commits land (`pr-ci-${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}`)
- [ ] Maintainer who can edit branch protection: __________________
- [ ] Date verified against a real PR check run: __________________

Learners without Settings → Branches access leave the UI boxes unchecked. This file is the prepared checklist, not proof that protection is on.

## Notes for Sprint 6 handoff
A red required check should block merge. A green check means automated quality gates passed — not that product review is done.
