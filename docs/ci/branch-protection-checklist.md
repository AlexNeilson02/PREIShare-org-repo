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

## Enforcement record

This section was added after the existing checklist. The sections above stay in this file. They describe the rules we intended. This section records what GitHub actually saved. Branch protection is a GitHub website setting, not code. Writing this file does not turn a rule on. A rule that did not save is not enforced. Do not describe it as on.

- Date: 2026-11-20
- GitHub user who tried: AlexNeilson02
- Repository visibility seen on the repo page: public
- Could open Settings and change rules: no, Settings was missing or save was refused
- Screen used: could not open either
- Branch name pattern: main
- Paid upgrade: No paid GitHub upgrade was purchased.

### Intended rules versus what saved

Copied from docs/ci/pr-approval-roles.md. Do not invent roles. The Human reviewer, the repository owner, Alex Neilson, may approve. The Maintainer, the repository owner, Alex Neilson, may merge. On this class fork they are the same person. The AI assistant is an advisor only and is not an approver. Approval count from the existing checklist, at least 1: 1.

- Require a pull request before merging. Wanted: yes. Result: blocked by missing admin. What I saw after refresh: Settings and Branches or Rulesets were not opened in a browser from this session, so no rule was saved. GitHub still shows main unprotected.
- Human approvals before merge. Count and approver roles from docs/ci/pr-approval-roles.md: 1 approval by the Human reviewer, the repository owner, Alex Neilson. Count is at least 1. The AI assistant is not an approver. Result: blocked by missing admin. What I saw after refresh: no human-approval rule listed, because the Settings screen was not opened.
- Required status check from the existing workflow .github/workflows/pr-ci.yml. Exact check name selected, or exact name searched if it was not listed: quality. No new workflow was added. Result: blocked by missing admin. What I saw after refresh: the check quality was not required; main has no required status checks.
- Who may merge, from docs/ci/pr-approval-roles.md: the Maintainer, the repository owner, Alex Neilson. Did GitHub limit merge to those people? could not set. If no, this limit is not enforced by GitHub.

### Gaps

- Require a pull request before merging: not enforced. Result was blocked by missing admin. The Settings page was not opened, so nothing saved.
- Human approvals before merge (count 1, Human reviewer Alex Neilson): not enforced. Result was blocked by missing admin.
- Required status check quality from .github/workflows/pr-ci.yml: not enforced. Result was blocked by missing admin.
- Restrict who may merge to the Maintainer, the repository owner, Alex Neilson: not enforced. GitHub could not set this limit from this session.
- No paid GitHub upgrade was purchased.

### What humans still do

People still follow docs/ci/human-judgment-checklist.md and docs/ci/ai-review-orchestration.md before merge, including when GitHub did not save the rule. The sample review in docs/ci/sample-pr-review/critique-and-prompt-revision.md is advice only and is not a required status check. The AI assistant does not approve or merge. The existing pr-ci workflow remains the only automated check this record tried to require.
