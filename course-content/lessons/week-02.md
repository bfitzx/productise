---
week: 2
title: CLI Fluency I — Files, Pipes and Text
phase: "1. CLI fluency"
hours: "8–10"
topics: [filesystem, permissions, redirection, pipes, grep, ripgrep, jq, find, xargs]
threads: []
ways_of_working: "The AI-native team"
deliverable: "A log-analysis one-liner toolkit and a cheat sheet"
---

# Week 2 — CLI Fluency I: Files, Pipes and Text

**Phase 1 · Ways of working: the AI-native team**

> **Domain pack:** Using a domain pack? Do the challenge on a public API from your domain as well, for example openFDA for pharma. See `domain-packs.md`.

## 1. Concept brief

Unix tools each do one thing and pass text to each other. Fluency means chaining small tools instead of opening a GUI. This week you learn to move around, inspect files, and transform text.

**Vocabulary**

- **stdin / stdout / stderr:** the three default streams. `>` redirects stdout to a file, `2>` redirects stderr, `|` pipes stdout into the next command's stdin.
- **Absolute vs relative path:** `/Users/you/x` vs `./x`. `~` means your home folder; `..` means the parent folder.
- **Permissions:** `rwx` for user, group and others. `chmod +x` makes a file executable.
- **Glob:** a shell wildcard (`*.csv`) that the shell expands *before* the command runs.
- **Exit code:** `0` means success; anything else is failure. `$?` holds the last exit code.
- **JSON:** the default data format of APIs. `jq` is how you query it.

## 2. Guided lab (~3 hrs)

```bash
mkdir -p ~/dev/product-engineer-lab/week-02 && cd $_

# Navigation and inspection
pwd; ls -la; tree -L 2 ~/dev
cat /etc/hosts; less /etc/services   # press q to quit
head -n 5 /etc/services; tail -n 5 /etc/services
wc -l /etc/services

# Redirection and pipes
echo "hello" > a.txt; echo "world" >> a.txt; cat a.txt
ls /nope 2> errors.txt; cat errors.txt
cat /etc/services | grep -i http | wc -l

# Search
rg "tcp" /etc/services | head
find ~/dev -name "*.md" -type f
find . -name "*.txt" | xargs wc -l

curl -sL https://raw.githubusercontent.com/datasets/airport-codes/main/data/airport-codes.csv -o airports.csv
head -3 airports.csv
cut -d, -f2,3 airports.csv | sort | uniq -c | sort -rn | head

# JSON with jq
curl -s https://api.github.com/repos/astral-sh/uv/releases?per_page=5 > releases.json
jq '.[0] | keys' releases.json
jq -r '.[] | "\(.tag_name)\t\(.published_at)"' releases.json
jq '[.[] | {tag: .tag_name, assets: (.assets | length)}]' releases.json

# Permissions
echo 'echo "I ran"' > run.sh; ./run.sh   # fails — why?
chmod +x run.sh; ./run.sh; ls -l run.sh
```

## 3. Unguided challenge (~3 hrs)

Generate a fake support-ticket log with this script (save it as `gen.sh` and run `bash gen.sh > tickets.log`):

```bash
for i in $(seq 1 2000); do
  s=$(shuf -n1 -e open pending resolved escalated closed)
  echo "$(date -v-${RANDOM:0:2}M +%FT%T) ticket_id=$i account=A$((RANDOM%50)) status=$s response_s=$((RANDOM%600))"
done
```

(On macOS, run `brew install coreutils` first and use `gshuf` if `shuf` isn't found.)

Using only CLI tools, answer the questions below. Save each command in `answers.sh` with a comment:

1. How many tickets per status?
2. The top 5 accounts by `escalated` count.
3. The average `response_s` of `resolved` tickets (hint: `awk`).
4. Every ticket with `response_s` over 500, written to `slow_tickets.log`.
5. A JSON array of `{account, escalations}` objects, built with `jq -R` / `jq -s`.

**Acceptance criteria:** each answer is a single pipeline, and `bash answers.sh` reproduces all the results.

## 4. Ways of working (~1 hr)

**The AI-native team.** Small pods (2–4 people), builder-PMs who prototype, and agents doing first drafts of code, research and tests. Read two current write-ups on how AI-native teams are organised; search for recent posts from Linear, Vercel or Anthropic on how they build. Then write: what does a PRD become when a prototype takes an afternoon? What gets more important, and what disappears?

## 5. Check

1. What's the difference between `>` and `>>`?
2. Why does `ls *.csv` behave differently in an empty folder?
3. What does `2>&1` do?
4. Write a `jq` filter that returns the `name` of every object in an array.
5. What does exit code `127` usually mean?

Recycled from week 1:

- What is PATH?
- What does idempotent mean?

## 6. Teach-back

Write "Pipes explained with a factory line metaphor" (200 words), with three real one-liners from this week.

## Done when

- [ ] Guided lab completed
- [ ] `answers.sh` reproduces all five answers
- [ ] Personal CLI cheat sheet (`cheatsheet.md`) committed
- [ ] Ways-of-working note written
- [ ] Check and teach-back done
