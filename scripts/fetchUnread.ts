const fs = require("fs");
const path = require("path");
const nodeCrypto = require("crypto");
const dayjs = require("dayjs");

// --------------------------------------------------
// メイン処理
// --------------------------------------------------
async function main() {
  try {
    // 1. unread.md からURLを取得
    const unreadFilePath = path.join("content", "unread.md");
    const unreadContent = fs.readFileSync(unreadFilePath, "utf-8");
    const urls: string[] = unreadContent
      .split("\n")
      .filter((line: string) => line.startsWith("- "))
      .map((line: string) => line.replace("- ", "").trim());

    for (const url of urls) {
      // URLのハッシュ値をファイル名に使用
      const hash = nodeCrypto.createHash("md5").update(url).digest("hex");
      const filePath = path.join("content", "essay", "unread", `${hash}.md`);

      if (fs.existsSync(filePath)) {
        console.log(`既に存在する記事です: ${filePath}`);
        continue;
      }

      // 3. Markdownファイルのメタ情報とコンテンツを作成
      const nowStr = dayjs().format("YYYY-MM-DD HH:mm:ss");
      const meta = {
        title: "仮タイトル",
        created_date: nowStr,
        updated_date: nowStr,
        tags: [],
        link: url,
      };

      const content = `
## 元記事リンク
[こちらをクリック](${url})

## 感想やメモ (手動で追記してください)
(ここに自分のコメントを書いていく)
`.trim();

      // 4. Markdownテキストを作成してファイル出力
      const markdown = createMarkdown(meta, content);
      fs.writeFileSync(filePath, markdown, { encoding: "utf-8" });
      console.log(`新しい記事を書き込みました: ${filePath}`);
    }

    // 5. unread.md から処理済みのURLを削除
    fs.writeFileSync(unreadFilePath, "", { encoding: "utf-8" });
  } catch (err) {
    console.error("エラーが発生しました:", err);
    process.exit(1);
  }
}

// --------------------------------------------------
// メタ情報と本文から Markdown を生成するヘルパー関数
// --------------------------------------------------
function createMarkdown(
  meta: {
    [key: string]: string | string[];
  },
  content: string
): string {
  const { title, created_date, updated_date, tags, link } = meta;
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
// スクリプト実行
// --------------------------------------------------
main();
