import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { normalizeNews } from "../lib/normalizeNews";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("news")).map(normalizeNews);

  return rss({
    title: "Daily News",
    description: "毎日更新のニュースサマリー",
    site: context.site?.toString() || "https://Jonh-Nash.github.io/blog/",
    items: posts.map((post) => ({
      title: post.data.title,
      link: `/blog/${post.id}/`,
      pubDate: post.data.pubDate,
    })),
  });
}
