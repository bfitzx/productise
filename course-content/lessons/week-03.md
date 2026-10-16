---
week: 3
title: CLI Fluency II — Processes, Environment and Scripting
phase: "1. CLI fluency"
hours: "8–10"
topics: [processes, signals, environment variables, SSH, shell scripting, tmux, fzf, curl]
threads: ["A. Problem framing"]
ways_of_working: "Swarms"
deliverable: "A CLI tool: API → JSON transform → CSV"
---

# Week 3 — CLI Fluency II: Processes, Environment and Scripting

**Phase 1 · Thread A: problem framing · Ways of working: swarms**

> **Domain pack:** This week, also answer the five "bring your own domain" questions in `domain-packs.md`. They decide which dataset you'll use from week 12 on.

## 1. Concept brief

Last week was about text. This week covers what's *running* on your machine, how programs get their configuration, and how to turn one-liners into real scripts.

**Vocabulary**

- **Process / PID:** a running program and its ID. `ps`, `top`, `htop`.
- **Signal:** a message to a process. `SIGINT` (Ctrl-C), `SIGTERM` (polite stop), `SIGKILL` (`kill -9`, forced).
- **Foreground / background:** `&`, `jobs`, `fg`, `bg`.
- **Environment variable:** key–value config inherited by child processes. `export API_KEY=...`. A `.env` file is a convention for storing these, not a shell feature.
- **Port:** a numbered door a server listens on. `lsof -i :3000` shows who is using port 3000.
- **SSH:** encrypted remote shell, using key pairs (`~/.ssh/id_ed25519` is private, `.pub` is public).
- **Shebang:** `#!/usr/bin/env bash` on the first line tells the system which interpreter runs the script.

## 2. Guided lab (~3 hrs)

```bash
cd ~/dev/product-engineer-lab && mkdir week-03 && cd week-03

# Processes
sleep 300 &           # background job
jobs; ps aux | rg sleep
kill %1               # or: kill <PID>
python3 -m http.server 8000 &   # a tiny web server
curl -I localhost:8000; lsof -i :8000
kill %1

# Environment
echo $HOME $SHELL
export GREETING="hi"; bash -c 'echo $GREETING'   # inherited
env | sort | head
printf 'API_BASE=https://api.open-meteo.com\n' > .env
set -a; source .env; set +a; echo $API_BASE

# curl in depth
curl -s "$API_BASE/v1/forecast?latitude=53.27&longitude=-9.05&hourly=temperature_2m" | jq '.hourly.temperature_2m[:5]'
curl -s -o /dev/null -w "%{http_code} %{time_total}s\n" https://example.com

# SSH keys (no server needed yet)
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub
gh ssh-key add ~/.ssh/id_ed25519.pub --title "workstation"
ssh -T git@github.com

# tmux basics
tmux new -s lab      # Ctrl-b %  splits vertically, Ctrl-b "  splits horizontally, Ctrl-b d  detaches
tmux attach -t lab

# fzf
history | fzf        # also try Ctrl-R once fzf's shell integration is installed
```

## 3. Unguided challenge (~3 hrs)

Build `weather2csv`, a bash script that:

- takes `--lat`, `--lon` and `--days` arguments, with defaults
- calls the Open-Meteo API with `curl`, reading the base URL from `.env`
- uses `jq` to turn hourly temperature and precipitation into CSV with a header
- writes the CSV to stdout, or to a file when `-o` is given
- exits non-zero with a clear error on a bad HTTP status or a missing dependency (`command -v jq`)
- has a `--help` flag

**Acceptance criteria:**

- `shellcheck weather2csv` passes (`brew install shellcheck`).
- Running `./weather2csv --days 2 | head` works.
- A README with usage examples is committed.

## 4. Thread A — problem framing (~1 hr)

Take this vague request: *"Can we use AI to make support better?"* (or swap in an equally vague request from your own domain) Rewrite it as:

- the problem statement (who, what pain, evidence)
- primary users and stakeholders
- constraints (regulatory, technical, cost)
- non-goals
- three questions you'd need answered before building anything

Keep it to one page. You'll reuse this format all course.

## 5. Ways of working (~1 hr)

**Swarms.** The term has two meanings:

- **Agent swarms for discovery:** several AI agents working in parallel. One researches competitors, one synthesises support tickets, one drafts a prototype, one critiques the others. Humans judge the results.
- **Team swarming:** the whole team works one item until it's done, rather than everyone carrying separate tickets.

**Exercise:** run a mini agent swarm on the problem from Thread A. Open three separate Claude sessions:

1. Market scan
2. User pain hypotheses
3. Devil's advocate on why this shouldn't be built

Merge the findings yourself. Note what the agents got wrong and what only you could judge.

## 6. Check

1. What's the difference between `SIGTERM` and `SIGKILL`?
2. Why doesn't a variable set without `export` reach a child process?
3. Which command shows what's listening on port 5432?
4. Which SSH key file do you never share?
5. What does `command -v jq || exit 1` do?

Recycled:

- What does `2>&1` do?
- What does `chmod +x` change?

## 7. Teach-back

Write "Environment variables and why secrets don't belong in code" (200–300 words).

## Done when

- [ ] `weather2csv` passes shellcheck and the acceptance criteria
- [ ] SSH auth to GitHub works
- [ ] Problem-framing page committed
- [ ] Swarm notes written
- [ ] Check and teach-back done
