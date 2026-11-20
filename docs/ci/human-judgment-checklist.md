# PREIshare human-judgment checklist

This checklist is the human gate for a pull request. A pull request is a proposal to change the shared PREIshare project. The **Human reviewer** (the repository owner, Alex Neilson) marks this list. The **AI assistant** may suggest notes. It may not mark these outcomes, approve the pull request, or merge it.

**Approve** means the Human reviewer has read the proposal and accepts it. **Merge** means the **Maintainer** (the repository owner, Alex Neilson) combines the accepted proposal into the shared branch, usually `main`. Those titles match `docs/ci/pr-approval-roles.md`. The AI assistant stays an advisor only: a comment is a note, and a note is not a decision.

This file does not replace `.github/workflows/pr-ci.yml`. That workflow already installs dependencies, typechecks, builds, lints, and tests in the job named `quality`. Do not re-run those commands as items on this checklist. A green pr-ci check is required evidence that those commands passed. It is not permission to merge.

AI notes, if you read them, must follow the output shape in `docs/ci/ai-pr-review-prompts.md`. This checklist is how a human accepts or rejects those notes. It is not a second copy of that prompt pack. It does not rewrite the overlay brief, the roles file, or the standing system instruction.

## How a human uses this file

1. Wait until the existing pr-ci check (`quality`) has a result. If it is red, stop. Do not use this checklist to override a failed automatic check.
2. Read AI assistant notes only as suggestions. Discard any line that says approve, LGTM, or safe to merge.
3. For each of the four sections below, look at the evidence, then mark exactly one outcome: pass, fail, or needs-info.
4. If any section is fail or needs-info, the Maintainer must not merge, even when pr-ci is green.
5. Only the Human reviewer named in `docs/ci/pr-approval-roles.md` may approve. This checklist does not click Approve or Merge.

## Sign-in

### Risk in PREIshare terms

Sign-in is how a member proves who they are so the dashboard shows that member's own information. `docs/ci/ai-review-overlay-brief.md` names this risk as who is allowed to be logged in, and whether a change breaks sponsor or investor session handling. The risk is that a change lets the wrong person in, keeps someone signed in who should be signed out, or shows one member another member's dashboard after login. A passing `quality` run does not log anyone in or prove route protection.

### Evidence a human needs

- The diff (the lines added or removed) for login, logout, session, or who is signed in.
- A short note of whose data a signed-in member should see, taken from `docs/ci/ai-review-overlay-brief.md` or `docs/ci/pr-approval-roles.md`.
- If no sign-in file changed, the Human reviewer still looks once for new screens that read member data and writes what they opened.

The AI assistant's confidence is not evidence. An AI sentence that says "looks fine" is not evidence.

### What the AI is not allowed to decide

The AI assistant must not decide that sign-in is safe, must not mark pass, fail, or needs-info, and must not approve or merge.

### Outcomes

- **pass**: The Human reviewer saw the diff and the member-data rule, and this change does not let the wrong person in or show another member's dashboard.
- **fail**: The Human reviewer saw a sign-in or session problem, or another member's data shown after login. Fail blocks merge even if pr-ci is green.
- **needs-info**: The Human reviewer cannot tell who the change signs in or whose data it shows. This is not a pass. Do not merge until the missing fact is written down and the section is marked again.

## Money

### Risk in PREIshare terms

Money means any amount a member pays, owes, or sees, including a balance, a price, or a refund. `docs/ci/ai-review-overlay-brief.md` names listing prices, deal records, and any charge or payment path. The risk is a wrong amount, the wrong person changing an amount, or money moving without a human knowing who is affected. Four schema unit tests can pass while the wrong person still sees or changes a price.

### Evidence a human needs

- The diff, searched for amounts, prices, balances, payments, or refunds.
- The screen or file where a member would see that amount.
- If the change has no money words, the Human reviewer writes which files they opened and that they found none.

The AI assistant's confidence is not evidence.

### What the AI is not allowed to decide

The AI assistant must not decide that an amount is correct, must not mark pass, fail, or needs-info, and must not approve or merge.

### Outcomes

- **pass**: The Human reviewer checked the diff and either found no money change, or found a money change and confirmed the amount and who can see or edit it.
- **fail**: The Human reviewer found a wrong amount, a hidden money change, or the wrong person able to change money. Fail blocks merge even if pr-ci is green.
- **needs-info**: The Human reviewer sees money words but cannot tell who is charged or who can see the amount. This is not a pass. Do not merge until that fact is known and the section is marked again.

## Privacy

### Risk in PREIshare terms

Privacy means keeping a member's private details from people who should not see them. In PREIshare that includes a member's email and other private fields. `docs/ci/ai-review-overlay-brief.md` names member information such as an email, or listing rows, reaching people who should not see them. The risk is a leak: private details on a public page, in an error message, in a log, in a shared screen, or in a file the wrong person can open. CI does not prove row-level access or that secrets stayed off the client.

### Evidence a human needs

- The diff, read for email, phone, address, or other private member fields.
- Where that text would appear: a public page, an error, a log, a download, or a screen only one member should see.
- A Human reviewer statement of who is allowed to see that field, not an AI rewrite of that rule.

An AI sentence that says "looks fine" is not evidence. A suggested finding from `docs/ci/ai-pr-review-prompts.md` is only a hint to check.

### What the AI is not allowed to decide

The AI assistant must not decide that a privacy leak is acceptable, must not mark pass, fail, or needs-info, and must not approve or merge.

### Outcomes

- **pass**: The Human reviewer read the diff and confirmed private member fields are not shown to the wrong audience.
- **fail**: The Human reviewer found a private field, such as a member email, exposed to the wrong audience. Fail blocks merge even if every automatic command passed.
- **needs-info**: The Human reviewer cannot tell who can see a private field. This is not a pass. Do not merge until the audience is known and the section is marked again.

## Product intent

### Risk in PREIshare terms

Product intent is what PREIshare is for and who it serves. The overlay brief already states the purpose. Copied from `docs/ci/ai-review-overlay-brief.md`: the change must still match "what PREIshare is for (real-estate intelligence for the people the dashboard is built for)." The risk is drift: the change still builds and tests, but it serves a different goal, a different audience, or a job that sentence does not ask for. A green build can ship the wrong feature.

### Evidence a human needs

- The sentence above, copied from the overlay brief. Do not invent a new purpose. Do not let the AI assistant rewrite it.
- The pull request description, compared with that sentence.
- The diff, checked for a new audience or a new job the product was not meant to do.

If the overlay brief does not clearly cover the change, the outcome is needs-info. A human stakeholder answers. The AI assistant does not invent the purpose to make the change look acceptable.

### What the AI is not allowed to decide

The AI assistant must not decide that a change matches product intent, must not rewrite the product purpose, must not mark pass, fail, or needs-info, and must not approve or merge.

### Outcomes

- **pass**: The Human reviewer compared the change to the overlay brief sentence and it still serves that purpose.
- **fail**: The Human reviewer found drift from the brief. Fail blocks merge even if pr-ci is green.
- **needs-info**: The brief does not clearly cover this change, or the description does not say what member problem it solves. Ask a human stakeholder. Do not let the AI assistant invent the purpose. This is not a pass. Do not merge until that fact is written down and the section is marked again.

## Merge rule

- Any **fail** blocks merge, even when the pr-ci check is green.
- Any **needs-info** blocks merge until a human records the missing evidence and marks that section again.
- All four sections must be **pass**, and pr-ci must be green, before the Human reviewer may approve.
- After that approve, only the Maintainer may merge, and only after the human approval and the existing pr-ci check.
- This checklist never authorizes the AI assistant to approve or merge.

## What this checklist does not do

Do not add checklist tasks that repeat the commands already in `.github/workflows/pr-ci.yml`:

- install dependencies
- typecheck
- build
- lint
- test

If those fail, the automatic check is red and this checklist does not waive them. If those pass, this checklist still runs.

## Practice box (not the sample pull request)

This box is practice for this file. It is not the sample pull request review a later step will open. No pull request was opened for it.

- Imaginary change: a public PREIshare page prints member@example.com. The pr-ci check is green.
- Section marked: Privacy
- Outcome: fail
- Why a green check does not allow merge: the automatic commands can pass while a private email is still visible to the wrong people. A privacy fail blocks merge.
