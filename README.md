# Productise

Marketing site for **Productise LTD** — Brian Fitzsimons' product management consultancy.

## Overview

Single-page static site built with HTML/CSS (no framework). Visually matched to the [bfitzx.com](https://bfitzx.com) aesthetic:
- Black canvas (#000), white Inter typography
- Uppercase micro-caps, hairline borders
- Ghost-pill CTAs (white outline → invert on hover)
- Subtle starfield hero background
- Mobile-friendly responsive layout

## Contact

- **X/Twitter**: [@bfitzx](https://x.com/bfitzx)

## Deployment

### Vercel (recommended)
```bash
vercel deploy
```

The site is a static HTML page and can be deployed to any static hosting provider:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

### Local preview
Open `index.html` directly in a browser, or use any local server:
```bash
python3 -m http.server 8000
# or
npx serve
```

## Structure

- `index.html` — Complete single-page site with inline CSS
- No build process required
- No dependencies

---

**Productise LTD** — Product management that ships.
