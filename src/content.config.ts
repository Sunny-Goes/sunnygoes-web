import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const chapters = ['robotics', 'ai', 'quantum', 'space', 'rogue'] as const;

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    abstract: z.string(),
    tags: z.array(z.string()).default([]),
    chapter: z.enum(chapters).optional(),
    // If set, the note title links out instead of to a local page.
    url: z.string().url().optional(),
    // Paper first-page render shown under the abstract (asset key, e.g. 'papers/x.webp').
    cover: z.string().optional(),
    // Canonical paper URL; the cover image links to it.
    paper: z.string().url().optional(),
    // Drafts are excluded from lists, detail pages and the RSS feed.
    draft: z.boolean().default(false),
    // Editorial flag only (never rendered): marks filler content to be replaced.
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { notes };
