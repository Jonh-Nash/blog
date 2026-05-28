import type { PostSummary } from "./posts";

type SiteMetadata = {
  title: string;
  description: string;
  language: string;
  baseUrl: string;
};

export function buildRssFeed(posts: PostSummary[], metadata: SiteMetadata): string {
  const items = [...posts]
    .sort((first, second) => second.date.localeCompare(first.date))
    .map((post) => buildRssItem(post, metadata.baseUrl))
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escapeXml(metadata.title)}</title>
<description>${escapeXml(metadata.description)}</description>
<link>${escapeXml(metadata.baseUrl)}</link>
<language>${escapeXml(metadata.language)}</language>
${items}
</channel>
</rss>
`;
}

function buildRssItem(post: PostSummary, baseUrl: string): string {
  const postUrl = `${baseUrl}/posts/${post.slug}`;

  return `<item>
<title>${escapeXml(post.title)}</title>
<description>${escapeXml(post.description)}</description>
<link>${escapeXml(postUrl)}</link>
<guid>${escapeXml(postUrl)}</guid>
<pubDate>${formatRssDate(post.date)}</pubDate>
</item>`;
}

function formatRssDate(date: string): string {
  const rssDate = new Date(date).toUTCString();

  if (rssDate === "Invalid Date") {
    throw new Error(`Invalid post date for RSS feed: ${date}`);
  }

  return rssDate;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
