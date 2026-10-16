---
week: 1
title: Workstation
phase: "0. Workstation"
hours: "8–10"
topics: [Homebrew, terminal, zsh, PATH, mise, uv, Docker, dotfiles, Claude Code]
threads: []
ways_of_working: "What a product engineer is"
deliverable: "A dotfiles repo with an idempotent bootstrap script"
---

# Week 1 — Workstation

**Phase 0 · Ways of working: what a product engineer is**

## 1. Concept brief

You're building the machine you'll use for the next 25 weeks. The goal is a setup that is **reproducible**: if your laptop died tonight, one script would rebuild it.

**Vocabulary**

- **Shell vs terminal:** the terminal (Ghostty, iTerm2) is the window; the shell (zsh) is the program inside it that interprets your commands.
- **PATH:** the ordered list of folders the shell searches for programs. Most "command not found" errors are PATH problems.
- **Package manager:** installs and updates software. Homebrew for Mac apps and CLIs, `uv` for Python, `npm`/`pnpm` for JavaScript.
- **Version manager:** `mise` lets each project pin its own Node/Python version, which avoids "works on my machine" problems.
- **Dotfiles:** config files whose names start with `.` (`.zshrc`, `.gitconfig`). Engineers keep these in a git repo.
- **Container:** a packaged, isolated environment (Docker). OrbStack is a fast Docker runtime for Mac.
- **Idempotent:** running it twice has the same effect as running it once.

## 2. Guided lab (~3 hrs)

Type every command yourself. Before running each one, say out loud what you expect it to do.

```bash
# 1. Xcode command-line tools (compilers, git)
xcode-select --install

# 2. Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew --version

# 3. Core CLI tools
brew install git gh mise uv jq ripgrep fzf tmux tree bat eza
brew install --cask ghostty orbstack visual-studio-code

# 4. Git identity
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
gh auth login

# 5. Language runtimes via mise
mise use --global node@lts python@3.12
mise ls

# 6. Check Docker works
docker run --rm hello-world

# 7. Claude Code
npm install -g @anthropic-ai/claude-code
claude --version
```

Then:

1. Add `eval "$(mise activate zsh)"` to `~/.zshrc`, then run `source ~/.zshrc`. Why is that line needed?
2. Run `echo $PATH | tr ':' '\n'` and identify where each tool lives.
3. Run `which python node git`. Are they the versions you expect?

## 3. Unguided challenge (~3 hrs)

Create a GitHub repo called `dotfiles` containing:

- `Brewfile`, generated with `brew bundle dump`
- your `.zshrc` and `.gitconfig`
- `bootstrap.sh`, which on a fresh Mac installs Homebrew if it's missing, runs `brew bundle`, symlinks the dotfiles into `~` and sets up mise runtimes

**Acceptance criteria**

- Running `./bootstrap.sh` twice causes no errors and no duplicate entries.
- The script starts with `set -euo pipefail`.
- The README explains what it does and how to run it.

Then create a second repo, `product-engineer-lab`. This is your course spine for the next 25 weeks.

## 4. Ways of working (~1 hr)

**What a product engineer is.** Write half a page:

- How does a product engineer differ from a PM, a full-stack engineer and a forward-deployed engineer?
- Which of your past roles came closest, and why?
- Name one product decision you'd have made differently if you could have prototyped it yourself in a day.

## 5. Check

1. What's the difference between a terminal and a shell?
2. You get `command not found` right after installing a tool. What's the likely cause, and how do you check?
3. Why use `mise` rather than installing Node with Homebrew?
4. What does "idempotent" mean, and why does it matter for a setup script?
5. What does `set -euo pipefail` do?

## 6. Teach-back

Write `teach-back/week-01.md` (200–300 words): "What I set up and why, for a PM who's never opened a terminal."

## Done when

- [ ] All lab commands run cleanly
- [ ] `dotfiles` repo is pushed and the bootstrap script is idempotent
- [ ] `product-engineer-lab` repo exists
- [ ] Ways-of-working reflection written
- [ ] Check answered
- [ ] Teach-back committed
