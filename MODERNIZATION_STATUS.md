# Ermiş Hukuk Bürosu — Website Modernization Status

_Last updated: 2026-03-13_

---

## Overview

Complete redesign of the law firm website: modern, minimal, premium aesthetic with **black + gold** identity. Single-page homepage with separate article/category pages preserved for SEO.

**Stack:** Eleventy 3.1.2 · Nunjucks · Modular SCSS (custom grid, no Bootstrap) · Vanilla JS (~130 lines, no jQuery)

---

## Phase Status

| # | Phase | Status |
|---|-------|--------|
| 1 | Foundation — delete legacy files, clean deps, SCSS structure | ✅ Done |
| 2 | Header, Footer, Base layout, Head, Scripts, site.js | ✅ Done |
| 3 | Rewrite home.njk (all single-page sections) | ✅ Done |
| 4 | Update article.njk, category.njk, sidebar, breadcrumb + page SCSS | ✅ Done |
| 5 | Image optimization — WebP, picture elements | ✅ Done |
| 6 | Sitemap, robots.txt | ✅ Done |
| 7 | Build verification | ✅ Done |

---

## Phase 1 — Foundation ✅

### Deleted
- `theme/` — entire legacy Themefisher template directory
- `gulpfile.js`, `.jshintrc` — legacy build artifacts
- `src/assets/js/script.js`, `src/assets/js/main.js` — dead code
- `src/content/pages/contact.md` — folded into homepage
- `src/_includes/layouts/contact.njk` — no longer needed
- `src/assets/images/team/ridvan.jpeg` (+ 2 duplicates) — no longer on team
- `src/assets/images/team/team1-6.jpg` stock photos

### Modified
- `package.json` — renamed to "ermis-hukuk-burosu", removed 7 Gulp dependencies
- `.eleventy.js` — removed theme/ copy logic, added `truncateWords` filter, added missing category collections, compressed CSS output, silenced SCSS `@import` deprecation warnings
- `src/_data/navigation.json` — 5 anchor-based links (`/#hizmetler`, `/#makaleler`, `/#hakkimizda`, `/#avukatlar`, `/#iletisim`)

### Created SCSS architecture
```
src/assets/scss/
├── main.scss                        ← import manifest
├── _variables.scss                  ← design tokens
├── _reset.scss
├── _typography.scss
├── _layout.scss
├── _utilities.scss
├── components/
│   ├── _header.scss
│   ├── _hero.scss
│   ├── _practice-areas.scss
│   ├── _articles.scss
│   ├── _about.scss
│   ├── _lawyers.scss
│   ├── _contact.scss
│   ├── _footer.scss
│   ├── _buttons.scss
│   ├── _cards.scss
│   ├── _whatsapp-float.scss
│   └── _breadcrumb.scss
└── pages/
    ├── _article-detail.scss
    └── _category-listing.scss
```

---

## Phase 2 — Header / Footer / Base ✅

### Created
- `src/assets/js/site.js` — vanilla JS (~130 lines): sticky header, mobile nav, smooth scroll, back-to-top, active nav, article filter, lazy map, current year
- `src/_includes/components/structured-data.njk` — JSON-LD: LegalService (all pages), Article (article pages), BreadcrumbList
- `src/_data/lawyers.json` — Av. Necat Ermiş + Av. Öykü Ermiş with placeholder bios

### Rewritten
- `src/_includes/layouts/base.njk` — `<main>` wrapper, SVG WhatsApp float, standalone #backToTop
- `src/_includes/components/head.njk` — async Google Fonts (Inter + Playfair Display), single `/css/style.css`, Twitter Card meta, hreflang, structured-data include
- `src/_includes/components/header.njk` — sticky fixed header: transparent → black on scroll, logo with WebP, 5 nav links, phone CTA, hamburger + mobile overlay
- `src/_includes/components/footer.njk` — dark 3-column: about+social / working hours / quick links, footer-logo with WebP, #currentYear
- `src/_includes/components/scripts.njk` — single `<script src="/js/site.js" defer>`

---

## Phase 3 — Homepage ✅

`src/_includes/layouts/home.njk` rewritten as single-page with 7 sections:

| Section | ID | Notes |
|---------|----|-------|
| Hero | — | 100vh, lawyer.jpg bg (WebP), gold label, h1, 2 CTAs |
| Practice Areas | `#hizmetler` | 3×2 grid from `services.json`, service images with WebP |
| Articles | `#makaleler` | Filter tabs + 9-article grid from `collections.articles` |
| About | `#hakkimizda` | Dark bg, 2-col, handshake.jpg (WebP) + text + value badges |
| Lawyers | `#avukatlar` | 2-col from `lawyers.json`, circular photos with WebP |
| Contact | `#iletisim` | 4 contact items + lazy map via `#mapContainer` |
| CTA Bar | — | Gold bg, WhatsApp + phone buttons |

---

## Phase 4 — Article & Category Pages ✅

- `src/_includes/components/breadcrumb.njk` — dark `.breadcrumb-section` header with title + nav trail
- `src/_includes/components/sidebar.njk` — `.sidebar__widget` with gold-accented category list
- `src/_includes/layouts/article.njk` — 2-col grid (`.article-page__layout`): article content + sidebar, inline SVG meta icons
- `src/_includes/layouts/category.njk` — sidebar + article cards (`.category-page__card`) with gold left-border hover

---

## Phase 5 — Image Optimization ✅

All images processed with Sharp (`node scripts/optimize-images.js`):

| Image | Before | After |
|-------|--------|-------|
| footer-logo.png | 641KB | 20KB |
| services/aile.jpg | 429KB | 88KB |
| services/ceza.jpg | 478KB | 72KB |
| services/isci.jpg | 474KB | 49KB |
| about/handshake.jpg | 384KB | 45KB |
| slider-main/lawyer.jpg | 121KB | 23KB |

- WebP siblings generated for all images
- `<picture>` elements added to: header logo, footer logo, hero, service cards, about image, lawyer photos

---

## Phase 6 — SEO ✅

- `src/sitemap.njk` — generates `/sitemap.xml` covering all 36 pages
- `src/static/robots.txt` — `Allow: /` with sitemap reference
- JSON-LD structured data: LegalService, Article, BreadcrumbList (via `structured-data.njk`)
- Twitter Card + hreflang meta in `head.njk`

---

## Phase 7 — Build Verification ✅

```
Copied 78 files  (includes WebP siblings)
Wrote 36 files
Build time: ~0.40s
Zero errors · Zero warnings
```

---

## Pending User Actions

| Item | Notes |
|------|-------|
| Provide new logo files | Replace `logo.png` + `footer-logo.png`, then re-run `node scripts/optimize-images.js` |
| Update lawyer bios | Edit `src/_data/lawyers.json` — currently placeholder text |
| Confirm Google Maps embed URL | Update coordinates in `home.njk` line ~205 |

---

## Design System Quick Reference

| Token | Value |
|-------|-------|
| `$gold` | `#C8A45C` |
| `$black` | `#0A0A0A` |
| `$bg-page` | `#FAF9F6` |
| Heading font | Playfair Display 600/700 |
| Body font | Inter 400/500/600 |
| Container | 1200px max-width |
