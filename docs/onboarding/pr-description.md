# Pull request description — first PREIshare contribution

**PR URL:** https://github.com/EdTechForLearning/PREIShare-org-repo/pull/15
**Base repository:** EdTechForLearning/PREIShare-org-repo
**Base branch:** main
**Head repository (my fork):** AlexNeilson02/PREIShare-org-repo
**Compare branch:** docs/first-contribution-alexneilson02
**Author:** Alex Neilson / @AlexNeilson02
**Date opened:** 2026-09-16

## Problem

I have completed PREIshare engineering onboarding but have not yet landed a
reviewed change in the team repository. The team needs a small, low-risk
contribution that exercises the full branch -> push -> review path without
touching product runtime code, so the workflow and my understanding of it can
be checked before I work on anything that affects the product.

## Approach

Docs and agent-config only. No application code, dependencies, config, or
generated files. Seven files, 464 additions and 71 deletions.

**New files:**

- `CONTRIBUTORS.md` (+9) — my roster entry. The file did not exist in this repo.
- `docs/onboarding/setup-log.md` (+93) — verified toolchain, Git identity,
  clone path, remotes, and the issues I hit and fixed during setup.
- `docs/onboarding/repo-map.md` (+117) — inventory of what is actually in this
  tree, including paths the product direction implies but that are not present.
- `.cursor/rules/preishare.mdc` (+95) — always-apply agent rules: stack,
  safe surfaces, secrets handling, and out-of-scope defaults.
- `docs/onboarding/first-contribution-plan.md` (+64) — the scope contract this
  PR was implemented against.
- `docs/onboarding/first-contribution-notes.md` (+47) — record of the agent
  cycles used and what I accepted or corrected.

**Modified file — please review this one most closely:**

- `AGENTS.md` (+39, −71) — rewritten as a short onboarding overview that points
  to `.cursor/rules/preishare.mdc` and `docs/onboarding/repo-map.md` rather than
  restating constraints in two places. The rewrite corrects claims that did not
  match the working tree: this repo is a single-package TanStack Start app at
  the root, not an `apps/` + `packages/` monorepo, and Supabase, PostgreSQL and
  pgvector are product direction but are not implemented in this tree. It also
  removes references to `test`, `lint`, and `format` scripts, which do not exist
  in `package.json`. This is the only pre-existing file in the diff, and I am
  happy to split it into its own PR if a reviewer prefers.

**Scope note:** my plan named `CONTRIBUTORS.md` and the notes file as in scope.
The diff is larger, because the branch carries every onboarding artifact
produced during the tutorial. I am flagging this rather than leaving a reviewer
to notice it. If the team would rather take the roster change alone, say so and
I will open a narrower PR.

## What reviewers should look at

- [ ] `AGENTS.md` — the 71 deleted lines. Is the removed content genuinely
      redundant with `.cursor/rules/preishare.mdc`, and are the corrected
      stack claims accurate?
- [ ] `CONTRIBUTORS.md` — entry is accurate and renders as valid Markdown
- [ ] `.cursor/rules/preishare.mdc` — do the constraints match team practice?
- [ ] Diff is docs-only: no `.env`, `src/` changes, build output, or editor junk

## Test plan

1. Open the Files changed tab. Confirm seven paths, 464 additions and
   71 deletions, and that `AGENTS.md` is the only file with deletions.
2. Read the `AGENTS.md` diff in Split view. Confirm nothing removed is needed
   and still absent from `.cursor/rules/preishare.mdc`.
3. Read `CONTRIBUTORS.md`. Confirm the table renders with name, GitHub handle,
   role, and date.
4. Search the diff for tokens, passwords, connection strings, or email
   addresses. Expect none.
5. Spot-check `docs/onboarding/repo-map.md` against the tree — for example
   confirm there is no `src/lib/supabase.ts` and no `supabase/` folder.

## Notes

No screenshots — docs-only change, no UI touched.

Implementation was assisted by Cursor cloud agents, which is why commits show
`cursoragent` as co-author. I reviewed every diff before it was pushed. During
the work an agent created its own branch name instead of the one in my plan; I
renamed the branch to `docs/first-contribution-alexneilson02` so it matches.
That and other corrections are recorded in
`docs/onboarding/first-contribution-notes.md`.

## Checklist before requesting review

- [ ] Feature branch is pushed and matches this description
- [ ] PR title is specific
- [ ] Description states problem, approach, and test plan
- [ ] I can explain every line in this diff if a reviewer asks
