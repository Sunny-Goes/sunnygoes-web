# Placeholders — everything you need to swap

This is every spot that contains placeholder content. Search-friendly: remaining
template content is marked with the string `TEMPLATE` or `placeholder: true`.

## 1. Domain & hosting

- `astro.config.mjs` → `site: 'https://sunnygoes.com'` — set the real domain.
  Canonical URLs, OG image URL, and `/rss.xml` links all derive from this.

## 2. Site-wide data — `src/data/site.json`

- `email` — contact email (used in section 04 + the `/vanguard` CTA)
- `github` — GitHub org URL (nav, footer, contact)
- `x` — X/Twitter profile URL (contact)
- `rss` — feed path (only change if you move it)
- `copyright` — legal/footer line

## 3. Product story — `src/data/vanguard.json`

All Vanguard copy lives here: name, tagline, pitch, the six pipeline stage blurbs
(shown on hover/focus in the diagram), and the five deck slides on `/vanguard`.
Written to be shown to investors; edit freely. Two rules: the product's internal
codename never appears on the site, and no internal architecture terms belong in
this file.

## 4. Founders — `src/pages/index.astro`, section 03 Studio

Real founders and bios (Carlo Modica, Luca Nicoli) with avatars from
`src/assets/founders/`. Update bios in place as roles evolve.

## 5. Notes — `src/content/notes/`

The placeholder templates were replaced on 2026-07-27 with 25 real notes: the
"Agentic Automated Discovery & Optimization" paper syntheses from
`agentic_discovery_review/`. The `chapter` frontmatter field is still validated by
`src/content.config.ts` but no longer rendered anywhere. Add new notes the usual
way — one Markdown file per note, frontmatter validated in `src/content.config.ts`.

## 6. Hero & manifesto copy — `src/pages/index.astro`

- The hero statement (`<h1>`) names the product — adjust wording freely; keep
  `<span class="u-accent">` around the highlighted phrase.
- The manifesto paragraph (section 2) is brief-flavored copy.

## 7. Social image — `public/og-image.png`

Generated from the asset pack (sticker + wordmark + Menlo type on cream, 1200×630).
Regenerate or replace if the brand changes; referenced in `src/layouts/Base.astro`.
Note: the current OG image predates the Vanguard restructure.

## Watermark status (resolved on the shipped assets)

The mascot PNGs in the asset pack carried a faint **"AI生成" watermark** in the
bottom-left corner, baked into the pixels. On 2026-07-28 it was erased
programmatically (corner alpha cleared) from every PNG under `src/assets/`.
The originals in `Sunny Asset Pack/` still carry it — if you re-export or add
new mascot images from the pack, clean that corner again before committing.

## Out of scope by design

- Dark mode (brief marked it optional) — not implemented; tokens are centralized in
  `:root` in `src/styles/global.css` if you add it later.
- `poses/sunny-charging.png` / `sunny-rolling-fast.png` and `stickers/*` are not shipped
  in the UI (brief: optional / social use). They remain in the asset pack.
- `turnaround/*` and `previews/*` are intentionally not used on the site.
