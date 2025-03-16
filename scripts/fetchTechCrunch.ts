const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const dotenv = require("dotenv");
const RSSParser = require("rss-parser");
const { OpenAI } = require("openai");

dotenv.config();

// --------------------------------------------------
// OpenAI API の初期化
// --------------------------------------------------
console.log(process.env.OPENAI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --------------------------------------------------
// RSSParser のインスタンス生成
// --------------------------------------------------
const rssParser = new RSSParser();

// --------------------------------------------------
// メイン処理
// --------------------------------------------------
async function main() {
  try {
    // 1. TechCrunch のAI関連フィードを取得
    const feedUrl = "https://techcrunch.com/tag/artificial-intelligence/feed/";
    const feed = await rssParser.parseURL(feedUrl);

    // 2. 取得した記事をループ処理
    for (const item of feed.items) {
      // item.guid または link, title 等で一意のファイル判定用スラグを生成
      const articleSlug = createSlug(item.title || "no-title");

      // すでに内容が存在するかチェック(./content/essay/ 配下)
      const filePath = path.join("content", "essay", `${articleSlug}.md`);
      if (fs.existsSync(filePath)) {
        console.log(`既に存在する記事です: ${filePath}`);
        continue;
      }

      // 翻訳元の本文を取得 (RSS の構造上、contentSnippet や content がある場合が多い)
      const originalText = item.contentSnippet || item.content || "";

      // 3. OpenAI API (ChatCompletion) で翻訳
      console.log(`翻訳中...: ${item.title}`);
      const translatedText = await translateText(originalText);

      // 4. Markdownファイルのメタ情報とコンテンツを作成
      const nowStr = dayjs().format("YYYY-MM-DD HH:mm:ss");
      const meta = {
        title: item.title || "No title",
        created_date: nowStr,
        updated_date: nowStr,
        tags: ["TechCrunch", "AI"],
        link: item.link || "",
      };

      // コンテンツ部分（翻訳と元記事、追記用スペース）
      const content = `
## 翻訳した内容
${translatedText}

## 元記事(一部抜粋)
${originalText}

## 感想やメモ (手動で追記してください)
(ここに自分のコメントを書いていく)
`.trim();

      // 5. Markdownテキストを作成してファイル出力
      const markdown = createMarkdown(meta, content);
      fs.writeFileSync(filePath, markdown, { encoding: "utf-8" });
      console.log(`新しい記事を書き込みました: ${filePath}`);
    }
  } catch (err) {
    console.error("エラーが発生しました:", err);
    process.exit(1);
  }
}

// --------------------------------------------------
// タイトルをスラグ化するヘルパー関数
// --------------------------------------------------
function createSlug(title: string): string {
  // 例: 大文字・小文字やスペース、特殊文字を整形
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50); // 長すぎる場合は適宜切り捨て
}

// --------------------------------------------------
// メタ情報と本文から Markdown を生成するヘルパー関数
// (YAML フロントマターを作る例)
// --------------------------------------------------
function createMarkdown(
  meta: {
    [key: string]: string | string[];
  },
  content: string
): string {
  const { title, created_date, updated_date, tags, link } = meta;

  // tags が配列の場合は YAML 配列形式、あるいは一括文字列でもOK
  // ここでは ["TechCrunch", "AI"] のような場合を処理
  const tagList = Array.isArray(tags)
    ? tags.map((t) => `"${t}"`).join(", ")
    : `"${tags}"`;

  return `---
title: "${title}"
created_date: "${created_date}"
updated_date: "${updated_date}"
tags: [${tagList}]
link: "${link}"
---
${content}
`;
}

// --------------------------------------------------
// OpenAI の ChatCompletion で翻訳を行う関数
// --------------------------------------------------
async function translateText(text: string): Promise<string> {
  // 空文字などの場合はそのまま返す
  if (!text.trim()) return "";

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator that translates English to Japanese.",
        },
        {
          role: "user",
          content: `Please translate the following text into Japanese:\n${text}`,
        },
      ],
    });

    // ChatCompletionの返信を取り出し
    const translated = response.choices[0].message?.content || "";
    return translated.trim();
  } catch (error) {
    console.error("翻訳中にエラーが発生しました:", error);
    return "";
  }
}

// --------------------------------------------------
// スクリプト実行
// --------------------------------------------------
main();
