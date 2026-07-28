# Placeholders — everything you need to swap

Per Part 3 of the handoff brief: this is every spot that contains placeholder content.
Search-friendly: most template content is also marked with the string `TEMPLATE` or
`placeholder: true`.

## 1. Domain & hosting

- `astro.config.mjs` → `site: 'https://sunnygoes.com'` — set the real domain.
  Canonical URLs, OG image URL, and `/rss.xml` links all derive from this.

## 2. Site-wide data — `src/data/site.json`

- `email` — contact email (used in section 05 + mailto)
- `github` — GitHub org URL (nav, footer, contact)
- `x` — X/Twitter profile URL (contact)
- `rss` — feed path (only change if you move it)
- `subline` — hero sub-line under the big statement
- `copyright`, `footerNote` — legal/footer lines (footerNote is from the brief)

## 3. Founders — `src/pages/index.astro`, section 04 Studio

- Two `div.founder` blocks: names and one-paragraph bios are placeholders.
- If you want photos/avatars: drop them in `src/assets/` and add an `<Image>` next to
  each `.founder__name`. (Or keep it text-only — the layout works as is.)

## 4. Notes — `src/content/notes/`

The placeholder templates were replaced on 2026-07-27 with 25 real notes: the
"Agentic Automated Discovery & Optimization" paper syntheses from
`agentic_discovery_review/` (all tagged `chapter: ai`). Add new notes the same
way — one Markdown file per note, frontmatter validated in `src/content.config.ts`.

## 5. Projects — `src/data/projects.json`

Three `TEMPLATE` entries (`project-name-one/two/three`). Replace with real projects:
name, year range, tech tags, 2-line description, GitHub/demo links (`null` hides a link).

## 6. Chapters — `src/data/chapters.json`

Copy is from the brief (safe to ship) but editable: descriptions, tag lists, and the
`status` pill per chapter (`active` / `exploring` / `queued`).

## 7. Hero & manifesto copy — `src/pages/index.astro`

- The hero statement (`<h1>`) is from the brief — adjust wording freely; keep
  `<span class="u-accent">` around the one highlighted phrase.
- The manifesto paragraph (section 2) is brief-flavored placeholder copy.

## 8. Social image — `public/og-image.png`

Generated from the asset pack (sticker + wordmark + Menlo type on cream, 1200×630).
Regenerate or replace if the brand changes; referenced in `src/layouts/Base.astro`.

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
