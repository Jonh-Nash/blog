import type { CollectionEntry } from 'astro:content';

export function normalizeNews(entry: CollectionEntry<'news'>) {
  const fallbackDate = new Date(
    entry.id.slice(0, 4) + '-' + entry.id.slice(4, 6) + '-' + entry.id.slice(6, 8)
  );
  return {
    ...entry,
    data: {
      title: entry.data.title ?? entry.id,
      pubDate: entry.data.pubDate ?? fallbackDate,
    },
  };
}