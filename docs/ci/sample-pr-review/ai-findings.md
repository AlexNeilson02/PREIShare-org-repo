# Sample pull request AI findings

This file records one chat-assistant review of the PREIshare sample pull request. It is advisor notes only. It is not a GitHub approval. It does not merge the pull request.

## Run record

- Date: 2026-11-20
- Human who ran the chat: AlexNeilson02
- Tool used: chat assistant, in a new chat. A coding agent did not edit the repository for this review.
- Sequence followed: docs/ci/ai-review-orchestration.md
- System instruction source: docs/ci/ai-pr-review-prompts.md
- Sample pull request: https://github.com/AlexNeilson02/PREIShare-org-repo/pull/77
- CI before review: green
- CI note: The pr-ci workflow named PR CI, job quality, completed with SUCCESS on pull request 77; a green check is not permission to merge and does not make the privacy mistake acceptable.
- Change text pasted: docs/ci/samples/planted-privacy-snippet.ts (the sample diff) and docs/ci/samples/sample-pr-body.md
- Not pasted: secrets, .env files, real member data, the human checklist, and the rest of the repository
- Reply handling: the assistant reply below was pasted unchanged

## Assistant reply

### Review limits

- role: advisor only
- can_approve: no
- can_merge: no
- can_declare_preishare_safe: no

This reply comments on docs/ci/samples/planted-privacy-snippet.ts. I cannot approve or merge this pull request.

### Findings

- severity: high
- evidence: docs/ci/samples/planted-privacy-snippet.ts — type PublicSharePreview includes memberEmail and memberPhone; buildPublicSharePreview returns memberEmail: member.email and memberPhone: member.phone under title "PREIshare public preview"
- category: privacy
- question_for_human: Should a public share preview include a member email and phone, or only a display name and summary?

### Not found

- category: sign-in
- result: not-found
- note: The pasted snippet and sample-pr-body.md do not add login, logout, session, or who is signed in.

- category: money
- result: not-found
- note: The pasted change has no prices, balances, payments, or refunds.

- category: product intent
- result: not-found
- note: sample-pr-body.md describes a docs teaching helper that must not be imported into the app; I did not see a new dashboard job beyond that public preview helper.

- category: other
- result: not-found
- note: I did not invent a further issue beyond the public-preview contact fields already listed under Findings.

## Shape check

Compare the pasted reply to the required output shape in docs/ci/ai-pr-review-prompts.md. Do not rewrite the reply in this section. Copy each required heading and mark what you see.

- Required heading: Review limits — present
- Required heading: Findings — present
- Required heading: Not found — present
- The reply says the assistant cannot approve or merge, and it does not tell a human to click Approve or Merge: yes
- The reply names planted-privacy-snippet.ts or quotes lines from that sample: yes
- I did not add a finding the assistant did not write: yes
- I did not edit the planted snippet, and I did not merge the pull request: yes
- Note for the next step, optional and not a new finding: the reply flagged a public email and phone on the preview; critique next whether that matches the planted privacy miss
