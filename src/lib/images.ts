import type { ImageMetadata } from 'astro';

// Eager map of every image under src/assets — reference them by path relative
// to src/assets, e.g. img('poses/sunny-waving.png').
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{png,webp}', {
  eager: true,
});

export function img(key: string): ImageMetadata {
  const found = files[`/src/assets/${key}`];
  if (!found) throw new Error(`Unknown image asset: ${key}`);
  return found.default;
}
