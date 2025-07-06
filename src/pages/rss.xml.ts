import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { normalizeNews } from '../lib/normalizeNews';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('news')).map(normalizeNews);

  return rss({
    title: 'Daily News',
    description: '毎日更新のニュースサマリー',
    site: context.site?.toString() || 'https://example.com', // astro.config.mjs の site と同じ
    items: posts.map((post) => ({
      title: post.data.title,
      link: `/${post.slug}/`,
      pubDate: post.data.pubDate,
    })),
  });
}