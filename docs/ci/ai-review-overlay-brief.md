# PREIshare review overlay brief

This note is the human layer on top of the green CI check. Topic 1 already built that check. This topic does not rebuild it.

## Words we will use

- **Pull request:** A pull request is a proposal to change the shared PREIshare project on GitHub; it is not part of the main copy until a person accepts it.
- **CI check:** The CI check is GitHub Actions running the saved recipe in `.github/workflows/pr-ci.yml`: install dependencies, typecheck, build, lint, and test. A green check means those commands passed. It is evidence, not permission to merge.
- **Merge:** Merge means a person accepts the proposal so the change becomes part of the default branch, the main shared copy named `main`.
- **Review comment:** A review comment is a note left on the proposal. It is not an approval, and it is not a merge.

## What topic 1 already finished

These are done and working. They are not missing, and they are not future work.

- Existing workflow (do not create another): `.github/workflows/pr-ci.yml`
- What that check already runs: install (`npm ci`), typecheck (`npm run typecheck`), build (`npm run build`), lint (`npm run lint`), and test (`npm run test`) in the job named `quality`
- Branch-protection notes already written: `docs/ci/branch-protection-checklist.md`
- Prompt pack already drafted (refine this file later; do not invent a new name): `docs/ci/ai-pr-review-prompts.md`
- Verification log already written: `docs/ci/e2e-verification-log.md`
- Stakeholder handoff already written: `docs/ci/stakeholder-handoff.md`
- Hosting: keep the existing Production URL. Do not create a new hosting project or a new Vercel project.

## What this topic adds

Name only these. Later steps will write them. This brief only names them.

1. Who may approve a pull request, and who may merge it
2. A constrained system instruction with a required output shape, edited later inside `docs/ci/ai-pr-review-prompts.md`
3. A human-judgment checklist
4. A practice review on a sample pull request
5. An honest record of which branch-protection rules the GitHub plan actually saved

## What this topic will not rebuild

- No second workflow file
- No second CI design and no second dashboard inventory
- No second prompt-pack filename
- No new hosting project
- No claim that a green CI check is permission to merge

## Risks a green check cannot decide

- **Sign-in:** Who is allowed to be logged in, and whether a change breaks sponsor or investor session handling. A passing `quality` run does not log anyone in or prove route protection.
- **Money:** Listing prices, deal records, and any charge or payment path. Four schema unit tests can pass while the wrong person still sees or changes a price.
- **Privacy:** Member information such as an email, or listing rows, reaching people who should not see them. CI does not prove row-level access or that secrets stayed off the client.
- **Product intent:** Whether the change still matches what PREIshare is for (real-estate intelligence for the people the dashboard is built for). A green build can ship the wrong feature.

## Who is allowed to decide

- The AI may suggest findings in a review comment.
- The AI may not approve a pull request.
- The AI may not merge a pull request.
- A person approves. A person merges.

## How we will direct the agent

We plan, draft, then critique. This step writes only `docs/ci/ai-review-overlay-brief.md`. We do not start the roles file, the human checklist, the system instruction, or a new workflow here. If a draft says CI is not built yet, that draft is wrong: topic 1 is done and working.
