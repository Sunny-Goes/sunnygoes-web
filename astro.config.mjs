import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// PLACEHOLDER: replace `site` with the real domain (see PLACEHOLDERS.md)
export default defineConfig({
  site: 'https://sunnygoes.com',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
