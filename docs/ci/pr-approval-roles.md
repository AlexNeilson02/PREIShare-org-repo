# PREIshare pull request approval roles

This file says who may do each job on a PREIshare pull request. It follows docs/ci/ai-review-overlay-brief.md. It does not start a new project. It does not edit .github/workflows/pr-ci.yml. It does not rewrite the review prompt pack.

## Two words, defined before the rules

**Approve** means a human has read the proposal and accepts it. Approve is a GitHub review button a person presses. It is a decision. It does not put the change into the shared project by itself.

**Merge** means a human combines the accepted proposal into the shared branch, usually `main`, so the change becomes part of PREIshare for everyone who uses the site.

Approve is not merge. A green pr-ci check (`quality` in `.github/workflows/pr-ci.yml`) is not approve, and it is not merge.

## The four roles

| Role | Who (name or job you can point to) | May do | Must not do |
| --- | --- | --- | --- |
| Author | The person who opened the pull request | Open the pull request and update it after feedback | Be the only human who approves, or merge alone, when the change touches privacy, sign-in, or money |
| Human reviewer | The repository owner, Alex Neilson | Read the change, comment, approve, or request changes | Hand the approve button to the AI assistant |
| Maintainer | The repository owner, Alex Neilson | Merge only after the human approval and the existing pr-ci check | Merge because an AI comment said the change looks fine |
| AI assistant | Chat assistant used as an advisor | Comment with suggested notes for the human reviewer | Approve, request changes as if it were a GitHub reviewer, or merge |

On this class fork the human reviewer and the maintainer are the same person: the repository owner, Alex Neilson. That name is written in both rows on purpose. It is not "the team" and it is not "someone."

The author must not be the only human who approves a change that touches privacy, sign-in, or money, and must not merge that change alone. If the repository owner, Alex Neilson, is also the author of that kind of change, a second person named on the pull request as reviewer must approve before the repository owner, Alex Neilson, merges.

## What the AI assistant may and must not do

The AI assistant may comment. A comment is a note. A note is not a decision.

The AI assistant must not approve.

The AI assistant must not request changes as if it were a GitHub reviewer.

The AI assistant must not merge.

Request changes is an official GitHub review outcome that sends the proposal back to the author. Only the human reviewer may do that.

A draft that lets the assistant approve "small" or "low-risk" changes is wrong. A one-line change that prints a member's email can still pass pr-ci. That leak is small, and it is still unacceptable.

## Merge paths

Every allowed path ends with a named human. The AI assistant is never the last actor. The last step of every allowed path is the repository owner, Alex Neilson, merging.

1. The person who opened the pull request opens the pull request. The existing pr-ci check runs. The repository owner, Alex Neilson, approves. The repository owner, Alex Neilson, merges.
2. The pr-ci check fails. The person who opened the pull request fixes the proposal. The check passes. The repository owner, Alex Neilson, approves. The repository owner, Alex Neilson, merges.
3. The repository owner, Alex Neilson, requests changes. The person who opened the pull request updates the proposal. The repository owner, Alex Neilson, approves. The repository owner, Alex Neilson, merges.

Forbidden path, not allowed: the AI assistant comments that the change looks fine, and the proposal is merged with no named human approval.

## Aligned with branch protection, not applied yet

This map agrees with docs/ci/branch-protection-checklist.md.

Intended gates, already described in that checklist, and restated here in plain language:

- The pr-ci check should be required before merge. In that checklist the check to require is named **`quality`**.
- A human approval should be required before merge. In that checklist: "At least one human review/approval before merge."

This document does not change GitHub settings. It does not turn branch protection on or off. It does not edit `.github/workflows/pr-ci.yml`. A later step records what the repository plan actually enforced. Do not open GitHub's branch settings to click Save as part of this step.

## Accountability

If a bad change is merged, the person who answers is the repository owner, Alex Neilson, after the repository owner, Alex Neilson, approved. The AI assistant does not answer for the merge.
