import { getAllPosts } from "../../lib/posts";
import { buildRssFeed } from "../../lib/rss";
import { siteMetadata } from "../../lib/site";

export const dynamic = "force-static";

export function GET(): Response {
  const rssFeed = buildRssFeed(getAllPosts(), siteMetadata);

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
  });
}
