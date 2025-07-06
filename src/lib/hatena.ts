import Parser from 'rss-parser';

type HatenaItem = { title: string; link: string; pubDate: Date };

export async function getHatenaLinks(limit = 10): Promise<HatenaItem[]> {
  const feedUrl = import.meta.env.PUBLIC_HATENA_FEED;
  if (!feedUrl) return [];

  try {
    const parser = new Parser();
    const feed = await parser.parseURL(feedUrl);

    return feed.items.slice(0, limit).map((it) => ({
      title: it.title ?? '(no title)',
      link: it.link ?? '#',
      pubDate: new Date(it.pubDate ?? ''),
    }));
  } catch (error) {
    console.error('Failed to fetch Hatena feed:', error);
    return [];
  }
}