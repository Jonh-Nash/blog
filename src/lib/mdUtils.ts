import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMeta {
  title: string;
  date: string;
}

export interface PostContent {
  meta: PostMeta;
  content: string;
  slug: string;
}

/**
 * 単一のMarkdownを読み込む
 */
export function getSingleMarkdown(fileName: string): PostContent {
  const filePath = path.join(process.cwd(), "content", fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    meta: data as PostMeta,
    content,
    slug: fileName.replace(".md", ""),
  };
}

/**
 * ディレクトリ配下のMarkdownをすべて読み込む
 */
export function getAllMarkdownInDir(dirName: string): PostContent[] {
  const dirPath = path.join(process.cwd(), "content", dirName);
  const fileNames = fs.readdirSync(dirPath);

  return fileNames
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const fullPath = path.join(dirPath, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        meta: data as PostMeta,
        content,
        slug: file.replace(".md", ""),
      };
    })
    .sort(
      (a, b) =>
        new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
    );
}

/**
 * 本文のサマリーを取得する
 */
export function getSummary(content: string, length = 100): string {
  const text = content.replace(/\n|\r/g, " ").trim();
  return text.length > length ? text.substring(0, length) + "..." : text;
}
