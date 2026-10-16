# Course content pack — build brief for Cursor

This folder has everything needed to add a **course section** to the productise.ltd website.

## Contents

```
README.md            ← this brief
overview.md          ← course landing-page content (frontmatter + markdown)
syllabus.md          ← full syllabus: phases, threads, design exercises, mock reviews
domain-packs.md      ← swap-in industries (pharma, healthcare, fintech, e-commerce)
course.json          ← manifest: one entry per week, generated from lesson frontmatter
lessons/week-01.md … week-26.md   ← full lessons (YAML frontmatter + markdown)
```

Every lesson has frontmatter with `week`, `title`, `phase`, `hours`, `topics[]` and `deliverable`, and optionally `threads[]`, `system_design`, `mock_review` and `ways_of_working`. The bodies are GitHub-flavoured markdown with fenced code blocks (`bash`, `python`, `ts`, `sql`, `dockerfile`), tables and task lists (`- [ ]`).

## What to build

1. **`/course`, the landing page.** Render `overview.md`. Under the phases table, show a week grid built from `course.json`, grouped by phase. Each card shows the week number, title, deliverable, and badges for system design or mock review weeks.
2. **`/course/week-NN`, the lesson pages.** Render each lesson file. Add:
   - a sticky table of contents generated from the `##` headings
   - previous/next links
   - a phase and topics header taken from the frontmatter
   - copy buttons on code blocks, with syntax highlighting
   - task-list checkboxes that persist ticked state in `localStorage` (per viewer, wrapped in try/catch)
3. **`/course/syllabus` and `/course/domains`.** Render `syllabus.md` and `domain-packs.md`, and link both from the landing page. Lessons contain "Domain pack" callouts (markdown blockquotes starting `**Domain pack:**`). Style them as a distinct callout that links to `/course/domains`, and turn `domain-packs.md` mentions into links.
4. **Navigation.** Add a "Course" link to the site's main nav, alongside the existing sections.
5. **Match the existing site.** Reuse the site's fonts, colour tokens, spacing and header and footer. Keep the copy tone as it is.
6. **Responsive** from 320 px up: tables scroll horizontally inside their own container, and code blocks wrap or scroll without breaking the page width.
7. **SEO.** Add a title and description per page from the frontmatter, Open Graph tags, and a sitemap entry.
8. **Light-touch progress (optional).** A "Weeks completed: n/26" indicator on `/course`, driven by the same `localStorage` keys.

## Implementation notes

- If the site is static HTML, add a build step (a small Node script using `gray-matter` + `markdown-it` + `shiki`) that generates static pages from these files. Don't hand-convert the lessons.
- If the site uses a framework (Next.js or Astro), use its content-collection or MDX support and read the frontmatter directly.
- Keep the markdown files as the single source of truth, so lessons can be updated by replacing files.
- External links in lessons should open in a new tab with `rel="noopener"`.
