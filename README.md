# Sunny Goes — website

The website for **Sunny Goes**, an independent research and engineering studio.
Home of **Vanguard**, an autonomous whitehat system for vulnerability discovery,
and of Sunny, the little robot explorer. Research notes are published in public;
the product is built quietly.

Design direction: a lab notebook that happens to have a charming robot in it. Warm paper
background, near-black text, one yellow accent, numbered sections, monospaced details.

## Tech

- [Astro](https://astro.build) (static output, zero JS shipped except one small vanilla
  script for the menu / scroll-reveal / pipeline / deck)
- Content Collections for notes (Markdown with frontmatter)
- LaTeX math in notes via `remark-math` + `rehype-katex` (`$…$` inline, fenced `$$` blocks); KaTeX CSS/fonts are bundled
- JSON data files for site config and the Vanguard product story
- `astro:assets` image optimization (all mascot PNGs are served as responsive WebP)
- Fonts: Space Grotesk Variable + IBM Plex Mono (self-hosted via Fontsource)
- No Tailwind, no UI framework — one hand-written stylesheet (`src/styles/global.css`)

## Run

```sh
npm install
npm run dev       # dev server at http://localhost:4321
```

## Build

```sh
npm run build     # static site into dist/
npm run preview   # serve the production build locally
```

The output in `dist/` is fully static — deploy it to any static host
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3, …). Set the production
domain in `astro.config.mjs` (`site`) before deploying; canonical URLs, OG tags
and the RSS feed derive from it.

## Project structure

```
src/
├── data/
│   ├── site.json          # name, domain, email, social links, footer lines
│   └── vanguard.json      # the product: tagline, pipeline stage blurbs, deck slides
├── content/
│   └── notes/             # research notes — one Markdown file per note
├── assets/                # mascot PNGs (optimized at build time)
│   ├── brand/  poses/  themes/  expressions/
├── components/            # Header, Footer, SectionHead, Pipeline, NoteRow
├── layouts/Base.astro     # <head>, fonts, meta/OG, header/footer, the one <script>
├── pages/
│   ├── index.astro        # the single-page site (hero, Vanguard, notes, studio, contact)
│   ├── vanguard.astro     # the product page: interactive pipeline + story deck
│   ├── notes/index.astro  # full notes index
│   ├── notes/[id].astro   # one page per note (skipped for notes with external `url`)
│   ├── 404.astro          # "This page is still being explored."
│   └── rss.xml.ts         # RSS feed generated from the notes collection
└── styles/global.css      # design tokens + all styles
public/                    # favicons, apple-touch-icon, og-image (generated, see below)
```

## Authoring content

**Add a note** — copy one of the templates in `src/content/notes/`, name it
`YYYY-MM-DD-slug.md`, fill the frontmatter (`title`, `date`, `abstract`, `tags`,
optional `chapter`, optional external `url`, `draft: true` to hide). Write the body in
Markdown; it becomes the note's page. Notes with `url` set link out instead of rendering
a local page. Nothing else to touch — home, `/notes`, and `/rss.xml` update automatically.

**Edit the product story** — `src/data/vanguard.json` (name, tagline, pitch, the six
pipeline stage blurbs shown on hover in the diagram, and the five deck slides on
`/vanguard`). The home page, `/vanguard`, and the pipeline panel all read from it.

**Edit global links & lines** — `src/data/site.json`.

## Generated files in `public/`

Favicons (16/32/64 PNG + ICO), the apple-touch-icon, and `og-image.png` were generated
from the asset pack (macOS `sips` / Python Pillow). Regenerate them if the brand assets
change; the source of truth is the asset pack folder, not `public/`.

## Accessibility & motion

Semantic HTML, visible focus styles, alt text on every mascot image. All animations
(hero float, scroll reveal, pipeline packets) are disabled under
`prefers-reduced-motion: reduce`; content is fully visible without JavaScript.

## Placeholders

Everything you need to replace with real data is listed in **PLACEHOLDERS.md**.
