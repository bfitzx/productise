---
week: 4
title: Git and GitHub
phase: "2. Git & GitHub"
hours: "8–10"
topics: [commits, branches, merge, rebase, pull requests, gh CLI, code review, GitHub Actions, secrets]
threads: ["D. Secrets basics"]
mock_review: "PR review — defend your CI setup (Staff SWE)"
ways_of_working: "Continuous discovery"
deliverable: "CI pipeline that lints and tests every PR"
---

# Week 4 — Git and GitHub

**Phase 2 · Thread D: secrets · Mock review #1 · Ways of working: continuous discovery**

## 1. Concept brief

Git is a database of snapshots; GitHub is where teams collaborate on top of it. Almost every engineering conversation you'll be in touches branches, PRs or CI.

**Vocabulary**

- **Commit:** a snapshot plus a message, identified by a hash.
- **HEAD:** where you are right now.
- **Branch:** a movable pointer to a commit. `main` is the shared trunk.
- **Merge vs rebase:** merge joins histories with a merge commit; rebase replays your commits on top of the target for a linear history. Never rebase shared branches.
- **Pull request (PR):** a proposal to merge a branch, plus the review conversation around it.
- **CI (continuous integration):** automated checks that run on every push or PR.
- **Merge conflict:** two changes to the same lines; a human decides the result.
- **`.gitignore`:** files git must never track (`.env`, `node_modules`).

## 2. Guided lab (~3 hrs)

```bash
cd ~/dev/product-engineer-lab
git status; git log --oneline --graph --all | head -20

# Branch, commit, push, PR
git switch -c feat/weather-readme
echo "## Week 3 tool" >> README.md
git add -p            # stage interactively; learn this
git commit -m "docs: describe weather2csv"
git push -u origin feat/weather-readme
gh pr create --fill
gh pr view --web

# Create a conflict on purpose
git switch main
echo "main change" >> README.md && git commit -am "main edit"
git switch feat/weather-readme
echo "branch change" >> README.md && git commit -am "branch edit"
git rebase main       # conflict! Edit README.md, then:
git add README.md && git rebase --continue
git push --force-with-lease   # why not plain --force?

# Undo toolkit
git restore file.txt          # discard working changes
git reset --soft HEAD~1       # undo the commit, keep the changes
git revert <hash>             # safe undo on shared history
git reflog                    # your safety net

# Merge the PR
gh pr merge --squash --delete-branch
```

## 3. Unguided challenge (~3 hrs)

Add CI to `product-engineer-lab` in `.github/workflows/ci.yml`, triggered on `pull_request` and on pushes to `main`. It should:

- run `shellcheck` on every `*.sh` file and on `weather2csv`
- run a tiny test script that executes `weather2csv --help` and checks the exit code
- use a matrix of `ubuntu-latest` and `macos-latest`

Then protect `main` (Settings → Branches): require PRs and passing checks.

**Acceptance criteria**

- A PR with a deliberate shellcheck error fails CI.
- The fix PR goes green.
- You can't push directly to `main`.

## 4. Thread D — secrets basics (~1 hr)

1. Add `.env` to `.gitignore`.
2. Check whether you've ever committed a secret: `git log -p | rg -i "api_key|token|secret"`.
3. Add a fake secret with `gh secret set DEMO_TOKEN` and use it in a workflow step without printing it.
4. Install gitleaks: `brew install gitleaks`, then run `gitleaks detect`.
5. Write down what you'd do in the first 10 minutes after a real key leaked.

## 5. Mock review #1 — defend your CI (~1 hr)

Paste your workflow file and PR link to Claude and say: *"Staff engineer mode: review my CI."* Expect questions about:

- caching
- flaky tests
- why use a matrix at all
- how long CI should take
- what happens when a check is skipped

Pass bar: you justify every choice or say how you'd find out.

## 6. Ways of working (~1 hr)

**Continuous discovery** (Teresa Torres): weekly customer touchpoints, opportunity solution trees, assumption testing. Write up: what changes in discovery when building a prototype costs less than scheduling an interview?

## 7. Check

1. When would you rebase, and when would you merge?
2. Why is `--force-with-lease` safer than `--force`?
3. How do you undo a commit that's already on `main`?
4. What triggers a GitHub Actions workflow?
5. A secret appears in a commit from 3 months ago. Is deleting the file enough? Why or why not?

Recycled:

- What does `SIGTERM` do?
- What is stdin?

## 8. Teach-back

Write "Git for PMs: the five commands that explain every engineering standup."

## Done when

- [ ] At least 3 PRs merged via `gh`
- [ ] A conflict resolved with a rebase
- [ ] CI green on both OSes, with branch protection on
- [ ] gitleaks clean
- [ ] Mock review done
- [ ] Check and teach-back done
