import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import { createHighlighter } from 'shiki';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'course-content');
const outDir = path.join(root, 'course');
const siteOrigin = 'https://productise.ltd';

const mdSource = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: false,
});

mdSource.use(anchor, {
  permalink: false,
  slugify: (s) =>
    String(s)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-'),
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(filePath, contents) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, contents);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readMatter(file) {
  const raw = fs.readFileSync(file, 'utf8');
  return matter(raw);
}

function absoluteUrl(pathname) {
  return `${siteOrigin}${pathname}`;
}

function navHtml(active) {
  const links = [
    { href: '/', label: 'Home', id: 'home' },
    { href: '/course/', label: 'Course', id: 'course' },
    { href: '/course/syllabus/', label: 'Syllabus', id: 'syllabus' },
    { href: '/course/domains/', label: 'Domains', id: 'domains' },
  ];
  return `<nav class="site-nav" aria-label="Primary">
  <div class="site-nav-inner">
    <a class="site-nav-brand plain" href="/">Productise</a>
    <div class="site-nav-links">
      ${links
        .map(
          (l) =>
            `<a class="plain" href="${l.href}"${l.id === active ? ' aria-current="page"' : ''}>${l.label}</a>`
        )
        .join('\n      ')}
    </div>
  </div>
</nav>`;
}

function footerHtml() {
  return `<footer class="footer">
  <div class="footer-inner">
    <div class="footer-legal">© 2026 Productise LTD. All rights reserved.</div>
  </div>
</footer>`;
}

function layout({
  title,
  description,
  canonical,
  activeNav,
  bodyClass = '',
  bodyAttrs = '',
  content,
  assetPrefix = '',
}) {
  const cssHref = `${assetPrefix}assets/course.css`;
  const jsHref = `${assetPrefix}assets/course.js`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${cssHref}">
</head>
<body class="${bodyClass}" ${bodyAttrs}>
${navHtml(activeNav)}
${content}
${footerHtml()}
<script src="${jsHref}"></script>
</body>
</html>
`;
}

function configureMarkdown(highlighter) {
  const defaultFence = mdSource.renderer.rules.fence;
  mdSource.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const lang = (token.info || '').trim().split(/\s+/)[0] || 'text';
    const code = token.content;
    let highlighted;
    try {
      highlighted = highlighter.codeToHtml(code, {
        lang: highlighter.getLoadedLanguages().includes(lang) ? lang : 'text',
        theme: 'github-dark',
      });
    } catch {
      highlighted = `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
    // shiki returns <pre class="shiki">...</pre>; wrap for copy button
    return `<div class="code-block">${highlighted}</div>`;
  };

  // Task list support
  mdSource.core.ruler.after('inline', 'task-lists', (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'inline') continue;
      const token = tokens[i];
      if (!token.content || !/^\[[ xX]\]\s+/.test(token.content)) continue;
      const checked = /^\[[xX]\]/.test(token.content);
      token.content = token.content.replace(/^\[[ xX]\]\s+/, '');
      if (token.children && token.children.length) {
        const first = token.children[0];
        if (first.type === 'text') {
          first.content = first.content.replace(/^\[[ xX]\]\s+/, '');
        }
      }
      const li = tokens[i - 2];
      if (li && li.type === 'list_item_open') {
        li.attrJoin('class', 'task-list-item');
        const checkbox = new state.Token('html_inline', '', 0);
        checkbox.content = `<input type="checkbox"${checked ? ' checked' : ''}>`;
        token.children = token.children || [];
        token.children.unshift(checkbox);
      }
    }
  });

  // Tables: wrap for horizontal scroll
  const defaultTableOpen = mdSource.renderer.rules.table_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  const defaultTableClose = mdSource.renderer.rules.table_close || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  mdSource.renderer.rules.table_open = (...args) => `<div class="table-wrap">${defaultTableOpen(...args)}`;
  mdSource.renderer.rules.table_close = (...args) => `${defaultTableClose(...args)}</div>`;

  // Domain pack callouts + internal link rewrites
  const defaultBlockquoteOpen =
    mdSource.renderer.rules.blockquote_open ||
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  mdSource.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
    let isDomain = false;
    for (let i = idx + 1; i < tokens.length; i++) {
      if (tokens[i].type === 'blockquote_close') break;
      if (tokens[i].type === 'inline' && /\*\*Domain pack:\*\*|Domain pack:/.test(tokens[i].content)) {
        isDomain = true;
        break;
      }
    }
    if (isDomain) tokens[idx].attrJoin('class', 'domain-pack');
    return defaultBlockquoteOpen(tokens, idx, options, env, self);
  };

  // Rewrite markdown links to course routes
  const defaultLinkOpen =
    mdSource.renderer.rules.link_open ||
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  mdSource.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const hrefIndex = tokens[idx].attrIndex('href');
    if (hrefIndex >= 0) {
      let href = tokens[idx].attrs[hrefIndex][1];
      if (href === 'domain-packs.md' || href.endsWith('/domain-packs.md')) {
        href = '/course/domains/';
      } else if (href === 'syllabus.md' || href.endsWith('/syllabus.md')) {
        href = '/course/syllabus/';
      } else if (href === 'overview.md' || href.endsWith('/overview.md')) {
        href = '/course/';
      } else if (/^week-\d{2}\.md$/.test(href)) {
        href = `/course/${href.replace('.md', '')}/`;
      }
      tokens[idx].attrs[hrefIndex][1] = href;
    }
    return defaultLinkOpen(tokens, idx, options, env, self);
  };

  // Also rewrite bare `domain-packs.md` mentions in domain-pack callouts to links
  const defaultText =
    mdSource.renderer.rules.text ||
    ((tokens, idx) => escapeHtml(tokens[idx].content));
  mdSource.renderer.rules.text = (tokens, idx, options, env, self) => {
    let text = tokens[idx].content;
    if (text.includes('domain-packs.md')) {
      text = text.replace(
        /`?domain-packs\.md`?/g,
        'the domain packs'
      );
      // If we're inside a domain pack blockquote context, the HTML post-pass will linkify
    }
    tokens[idx].content = text;
    return defaultText(tokens, idx, options, env, self);
  };

  void defaultFence;
}

function extractToc(html) {
  const toc = [];
  const re = /<h2[^>]*id="([^"]+)"[^>]*>(.*?)<\/h2>/gis;
  let m;
  while ((m = re.exec(html))) {
    toc.push({
      id: m[1],
      text: m[2].replace(/<[^>]+>/g, ''),
    });
  }
  return toc;
}

function postProcessHtml(html) {
  // Rewrite leftover domain-packs.md references into a single domains link
  html = html.replace(
    /(?:See\s+)?(?:<code>)?domain-packs\.md(?:<\/code>)?/g,
    'See the <a href="/course/domains/">domain packs</a>'
  );
  // In domain-pack callouts, link the bold label once (skip text already inside <a>)
  html = html.replace(
    /(<blockquote class="domain-pack">)([\s\S]*?)(<\/blockquote>)/g,
    (_full, open, inner, close) => {
      const linked = inner.replace(
        /<strong>Domain pack:<\/strong>/i,
        '<strong><a href="/course/domains/">Domain pack</a>:</strong>'
      );
      return open + linked + close;
    }
  );
  return html;
}

function renderMarkdown(src) {
  let html = mdSource.render(src);
  html = postProcessHtml(html);
  return html;
}

function groupWeeksByPhase(weeks) {
  const phases = [];
  const map = new Map();
  for (const w of weeks) {
    if (!map.has(w.phase)) {
      const entry = { phase: w.phase, weeks: [] };
      map.set(w.phase, entry);
      phases.push(entry);
    }
    map.get(w.phase).weeks.push(w);
  }
  return phases;
}

function weekCard(w) {
  const badges = [];
  if (w.system_design) badges.push(`<span class="badge design">System design</span>`);
  if (w.mock_review) badges.push(`<span class="badge review">Mock review</span>`);
  badges.push(`<span class="badge done" data-done-badge hidden>Done</span>`);
  return `<a class="week-card plain" href="/course/${w.slug}/" data-week-slug="${w.slug}">
  <div class="week-card-top">
    <span class="week-num">Week ${String(w.week).padStart(2, '0')}</span>
    <div class="badge-row">${badges.join('')}</div>
  </div>
  <h3>${escapeHtml(w.title)}</h3>
  <p class="week-deliverable">${escapeHtml(w.deliverable)}</p>
</a>`;
}

function buildLanding(course, overview) {
  const { data, content } = overview;
  let bodyHtml = renderMarkdown(content);
  bodyHtml = bodyHtml.replace(/^<h1[\s\S]*?<\/h1>\s*/i, '');
  const phases = groupWeeksByPhase(course.weeks);
  const phaseHtml = phases
    .map(
      (p) => `<div class="phase-block">
  <h2 class="phase-title">${escapeHtml(p.phase)}</h2>
  <div class="week-grid">
    ${p.weeks.map(weekCard).join('\n    ')}
  </div>
</div>`
    )
    .join('\n');

  const title = `${data.title || course.title} — Productise`;
  const description =
    data.subtitle ||
    'A 26-week, hands-on path from senior product manager to product engineer.';

  const contentHtml = `
<section class="hero-course">
  <div class="hero-course-inner">
    <div class="hero-meta">
      <span class="micro-cap">Product Engineer with AI</span>
      <span class="micro-cap">·</span>
      <span class="micro-cap">${escapeHtml(String(data.weeks || 26))} weeks</span>
      <span class="micro-cap">·</span>
      <span class="micro-cap">${escapeHtml(data.hours_per_week || '8–10')} hrs / week</span>
    </div>
    <h1 class="display display-xxl">${escapeHtml(data.title || course.title)}</h1>
    <p class="body-lg" style="max-width:760px;margin:0;">${escapeHtml(data.subtitle || '')}</p>
    <p class="progress-line" data-progress data-total="26">Weeks completed: 0/26</p>
    <div class="hero-cta-row">
      <a class="ghost-pill" href="/course/week-01/">Start week 1</a>
      <a class="ghost-pill sm" href="/course/syllabus/">Syllabus</a>
      <a class="ghost-pill sm" href="/course/domains/">Domain packs</a>
    </div>
  </div>
</section>
<section class="band">
  <div class="band-inner">
    <div class="prose" style="max-width:820px;">
      ${bodyHtml}
    </div>
  </div>
</section>
<section class="band">
  <div class="band-inner">
    <span class="micro-cap">26-week path</span>
    <h2 class="display display-xl" style="margin-top:12px;">Week by week</h2>
    ${phaseHtml}
  </div>
</section>`;

  return layout({
    title,
    description,
    canonical: absoluteUrl('/course/'),
    activeNav: 'course',
    content: contentHtml,
    assetPrefix: '',
  });
}

function buildDocPage({ file, activeNav, pathSegment, pageTitleFallback }) {
  const { data, content } = readMatter(file);
  let html = renderMarkdown(content);
  // Strip the first H1 from body if present — page header covers it
  html = html.replace(/^<h1[\s\S]*?<\/h1>\s*/i, '');
  const toc = extractToc(html);
  const title = `${data.title || pageTitleFallback} — Productise`;
  const description = data.subtitle || `${data.title || pageTitleFallback} for the PM to Product Engineer course.`;

  const tocHtml = toc.length
    ? `<aside class="toc">
  <div class="toc-label">On this page</div>
  <nav>${toc.map((t) => `<a href="#${t.id}">${escapeHtml(t.text)}</a>`).join('')}</nav>
</aside>`
    : `<aside class="toc"></aside>`;

  const contentHtml = `<div class="page-shell">
  ${tocHtml}
  <article>
    <header class="lesson-header">
      <span class="micro-cap">Course</span>
      <h1>${escapeHtml(data.title || pageTitleFallback)}</h1>
      ${data.subtitle ? `<p class="body-lg" style="margin:0;">${escapeHtml(data.subtitle)}</p>` : ''}
      <div class="subnav">
        <a class="plain" href="/course/"${activeNav === 'course' ? ' aria-current="page"' : ''}>Overview</a>
        <a class="plain" href="/course/syllabus/"${activeNav === 'syllabus' ? ' aria-current="page"' : ''}>Syllabus</a>
        <a class="plain" href="/course/domains/"${activeNav === 'domains' ? ' aria-current="page"' : ''}>Domain packs</a>
      </div>
    </header>
    <div class="prose">${html}</div>
  </article>
</div>`;

  return layout({
    title,
    description,
    canonical: absoluteUrl(`/course/${pathSegment}/`),
    activeNav,
    content: contentHtml,
    assetPrefix: '../',
  });
}

function buildWeekPage(weekMeta, allWeeks) {
  const file = path.join(contentDir, 'lessons', weekMeta.file.replace(/^lessons\//, ''));
  const { data, content } = readMatter(file);
  let html = renderMarkdown(content);
  html = html.replace(/^<h1[\s\S]*?<\/h1>\s*/i, '');
  const toc = extractToc(html);
  const weekNum = String(weekMeta.week).padStart(2, '0');
  const title = `Week ${weekNum}: ${data.title || weekMeta.title} — Productise`;
  const description = data.deliverable || weekMeta.deliverable || `Week ${weekNum} of PM to Product Engineer.`;

  const idx = allWeeks.findIndex((w) => w.week === weekMeta.week);
  const prev = idx > 0 ? allWeeks[idx - 1] : null;
  const next = idx < allWeeks.length - 1 ? allWeeks[idx + 1] : null;

  const topics = (data.topics || weekMeta.topics || [])
    .map((t) => `<span class="topic-chip">${escapeHtml(t)}</span>`)
    .join('');

  const metaBits = [
    data.phase || weekMeta.phase,
    `${data.hours || weekMeta.hours || '8–10'} hrs`,
  ];
  if (data.ways_of_working || weekMeta.ways_of_working) {
    metaBits.push(`Ways of working: ${data.ways_of_working || weekMeta.ways_of_working}`);
  }

  const badges = [];
  if (data.system_design || weekMeta.system_design) {
    badges.push(`<span class="badge design">System design</span>`);
  }
  if (data.mock_review || weekMeta.mock_review) {
    badges.push(`<span class="badge review">Mock review</span>`);
  }

  const tocHtml = toc.length
    ? `<aside class="toc">
  <div class="toc-label">On this page</div>
  <nav>${toc.map((t) => `<a href="#${t.id}">${escapeHtml(t.text)}</a>`).join('')}</nav>
</aside>`
    : `<aside class="toc"></aside>`;

  const pager = `<nav class="pager" aria-label="Lesson pagination">
  ${
    prev
      ? `<a class="plain prev" href="/course/${prev.slug}/"><span class="label">Previous</span><span class="title">Week ${String(prev.week).padStart(2, '0')}: ${escapeHtml(prev.title)}</span></a>`
      : '<span></span>'
  }
  ${
    next
      ? `<a class="plain next" href="/course/${next.slug}/"><span class="label">Next</span><span class="title">Week ${String(next.week).padStart(2, '0')}: ${escapeHtml(next.title)}</span></a>`
      : '<span></span>'
  }
</nav>`;

  const contentHtml = `<div class="page-shell">
  ${tocHtml}
  <article>
    <header class="lesson-header">
      <div class="hero-meta">
        <span class="micro-cap">${escapeHtml(metaBits[0])}</span>
        <span class="micro-cap">·</span>
        <span class="micro-cap">${escapeHtml(metaBits[1])}</span>
      </div>
      <h1>Week ${weekNum} — ${escapeHtml(data.title || weekMeta.title)}</h1>
      <p class="body-lg" style="margin:0;max-width:640px;">${escapeHtml(data.deliverable || weekMeta.deliverable)}</p>
      ${badges.length ? `<div class="badge-row" style="margin-top:14px;">${badges.join('')}</div>` : ''}
      ${topics ? `<div class="topic-chips">${topics}</div>` : ''}
      ${
        metaBits[2]
          ? `<p class="micro-cap" style="margin-top:16px;">${escapeHtml(metaBits[2])}</p>`
          : ''
      }
      <label class="micro-cap" style="display:flex;gap:10px;align-items:center;margin-top:18px;cursor:pointer;">
        <input type="checkbox" data-mark-complete>
        Mark week complete
      </label>
    </header>
    <div class="prose">${html}</div>
    ${pager}
  </article>
</div>`;

  return layout({
    title,
    description,
    canonical: absoluteUrl(`/course/${weekMeta.slug}/`),
    activeNav: 'course',
    bodyAttrs: `data-week-slug="${weekMeta.slug}"`,
    content: contentHtml,
    assetPrefix: '../',
  });
}

function buildSitemap(paths) {
  const urls = paths
    .map(
      (p) => `  <url>
    <loc>${absoluteUrl(p)}</loc>
    <changefreq>weekly</changefreq>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

async function main() {
  const highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: [
      'bash',
      'shell',
      'zsh',
      'python',
      'typescript',
      'javascript',
      'ts',
      'js',
      'sql',
      'json',
      'yaml',
      'dockerfile',
      'markdown',
      'html',
      'css',
      'toml',
      'text',
    ],
  });
  configureMarkdown(highlighter);

  const course = readJson(path.join(contentDir, 'course.json'));
  const overview = readMatter(path.join(contentDir, 'overview.md'));

  ensureDir(outDir);
  // Keep assets (already written); rebuild HTML pages

  writeFile(path.join(outDir, 'index.html'), buildLanding(course, overview));
  writeFile(
    path.join(outDir, 'syllabus', 'index.html'),
    buildDocPage({
      file: path.join(contentDir, 'syllabus.md'),
      activeNav: 'syllabus',
      pathSegment: 'syllabus',
      pageTitleFallback: 'Syllabus',
    })
  );
  writeFile(
    path.join(outDir, 'domains', 'index.html'),
    buildDocPage({
      file: path.join(contentDir, 'domain-packs.md'),
      activeNav: 'domains',
      pathSegment: 'domains',
      pageTitleFallback: 'Domain packs',
    })
  );

  for (const week of course.weeks) {
    writeFile(
      path.join(outDir, week.slug, 'index.html'),
      buildWeekPage(week, course.weeks)
    );
  }

  const paths = [
    '/',
    '/course/',
    '/course/syllabus/',
    '/course/domains/',
    ...course.weeks.map((w) => `/course/${w.slug}/`),
  ];
  writeFile(path.join(root, 'sitemap.xml'), buildSitemap(paths));

  console.log(`Built course pages: landing + syllabus + domains + ${course.weeks.length} weeks`);
  highlighter.dispose();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
