import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { normalizeNews } from "../lib/normalizeNews";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("news"))
    .map(normalizeNews)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()) // 最新順にソート
    .slice(0, 5); // 最新5件に制限

  return rss({
    title: "Daily News",
    description: "毎日更新のニュースサマリー",
    site: context.site?.toString() || "https://Jonh-Nash.github.io/blog/",
    items: posts.map((post) => ({
      title: post.data.title,
      link: `/blog/${post.id}/`,
      pubDate: post.data.pubDate,
      description: extractDescription(post.body || ""), // 記事の冒頭テキストを追加
    })),
  });
}

// 記事の冒頭部分を抽出する関数
function extractDescription(content: string): string {
  // マークダウンからテキストを抽出
  const lines = content.split("\n");
  let description = "";

  for (const line of lines) {
    // ヘッダーやリンクを除外し、本文のみを抽出
    if (
      line.startsWith("#") ||
      line.startsWith("###") ||
      line.startsWith("- ")
    ) {
      continue;
    }

    // 空行を除外
    if (line.trim() === "") {
      continue;
    }

    // 最初の段落を取得
    if (line.trim().length > 0) {
      description = line.trim();
      break;
    }
  }

  // 長すぎる場合は切り詰める
  if (description.length > 200) {
    description = description.substring(0, 200) + "...";
  }

  return description || "記事の内容をご確認ください。";
}
