import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Production domain: canonical URLs, OG tags and RSS derive from this
export default defineConfig({
  site: 'https://www.sunnygoes.xyz',
  redirects: {
    '/vanguard': '/illumina',
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
