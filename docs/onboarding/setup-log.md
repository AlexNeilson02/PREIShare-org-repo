# PREIshare setup log

**Learner:** Alex Neilson
**Date:** 2026-09-14
**OS:** macOS 26.6.2 (build 25G83)
**Team repo (upstream):** https://github.com/EdTechForLearning/PREIShare-org-repo
**Orientation notes used:** `docs/onboarding/team-orientation-notes.md`

## 1. Accounts and fork

| Check | Result | Notes |
| --- | --- | --- |
| GitHub sign-in works | PASS | Account username: @AlexNeilson02 |
| Can view team repo https://github.com/EdTechForLearning/PREIShare-org-repo | PASS | |
| Fork created in my account | PASS | My fork URL: https://github.com/AlexNeilson02/PREIShare-org-repo |

## 2. Git install and identity

```text
# git --version
git version 2.50.1 (Apple Git-155)

# git config --global user.name
Alex Neilson

# git config --global user.email
alexneilson02@gmail.com
```

Identity configured: PASS

## 3. Clone (of MY fork)

- Parent directory used: `~/projects`
- Clone command used: `git clone https://github.com/AlexNeilson02/PREIShare-org-repo.git`
- Cloned my fork (not the team repo): PASS
- Clone completed without error: PASS — 41 objects received, 49.77 KiB
- Local project path: `~/projects/PREIShare-org-repo`

## 4. Remotes (run inside the repo)

- `git remote add upstream https://github.com/EdTechForLearning/PREIShare-org-repo.git` run: PASS

### git remote -v

```text
origin    https://github.com/AlexNeilson02/PREIShare-org-repo.git (fetch)
origin    https://github.com/AlexNeilson02/PREIShare-org-repo.git (push)
upstream  https://github.com/EdTechForLearning/PREIShare-org-repo.git (fetch)
upstream  https://github.com/EdTechForLearning/PREIShare-org-repo.git (push)
```

origin points at MY fork: PASS
upstream points at the team repo: PASS

## 5. Post-clone verification

### git status

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### Default branch

```text
main
```

Default branch name: `main`
Working tree clean after clone: PASS

## 6. Auth notes (no secrets)

- Clone method: HTTPS
- Auth method used (if prompted): GitHub CLI (`gh`) session — no prompt on the HTTPS clone
- Auth succeeded: PASS

## 7. Issues and fixes

| Issue | What I tried | Outcome |
| --- | --- | --- |
| First clone landed in my home directory instead of a projects folder, because I ran `gh repo clone` before creating `~/projects` | Created `~/projects`, re-cloned my fork there, and removed the stray copy at `~/PREIShare-org-repo` | Resolved — one clone at `~/projects/PREIShare-org-repo` |
| `git remote add upstream ...` returned `fatal: not a git repository` | Realized I was still in my home directory, not inside the cloned repo | Resolved — `cd PREIShare-org-repo` first, then the command worked |
| Ran `git remote add upstream ...` a second time and got `error: remote upstream already exists` | Checked with `git remote -v` instead of re-running | No action needed — the remote was already set correctly |
| Typed `..` on its own expecting to move up a directory, got `zsh: permission denied: ..` | Learned that `..` is a path, not a command | Resolved — the command is `cd ..` |

## 8. Ready for next step

I have a fork I own, a local clone of it with origin and upstream set, and a setup log another teammate could audit: YES
