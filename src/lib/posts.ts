import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export type PostSummary = {
  title: string;
  date: string;
  description: string;
  slug: string;
};

export type Post = PostSummary & {
  contentHtml: string;
};

type ParsedPost = PostSummary & {
  markdown: string;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");
const requiredFields = ["title", "date", "description", "slug"] as const;

export function getAllPosts(): PostSummary[] {
  return readPosts()
    .map(({ title, date, description, slug }) => ({
      title,
      date,
      description,
      slug,
    }))
    .sort((first, second) => first.date.localeCompare(second.date));
}

export function getPostBySlug(slug: string): Post {
  const post = readPosts().find((candidate) => candidate.slug === slug);

  if (!post) {
    throw new Error(`Post not found for slug: ${slug}`);
  }

  const renderedHtml = marked.parse(post.markdown, { async: false });

  if (typeof renderedHtml !== "string") {
    throw new Error(`Markdown rendering failed for slug: ${slug}`);
  }

  const contentHtml = sanitizeHtml(renderedHtml);

  return {
    title: post.title,
    date: post.date,
    description: post.description,
    slug: post.slug,
    contentHtml,
  };
}

export function getAllPostSlugs(): string[] {
  return readPosts().map((post) => post.slug);
}

function readPosts(): ParsedPost[] {
  const posts = fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => readPostFile(entry.name));

  assertUniqueSlugs(posts);

  return posts;
}

function readPostFile(fileName: string): ParsedPost {
  const filePath = path.join(postsDirectory, fileName);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const parsed = matter(fileContent);
  const frontmatter = validateFrontmatter(parsed.data, fileName);

  return {
    ...frontmatter,
    markdown: parsed.content,
  };
}

function validateFrontmatter(data: Record<string, unknown>, fileName: string): PostSummary {
  for (const field of requiredFields) {
    if (!hasRequiredField(data[field], field)) {
      throw new Error(`Missing required frontmatter field "${field}" in ${fileName}`);
    }
  }

  return {
    title: data.title as string,
    date: formatDateField(data.date),
    description: data.description as string,
    slug: data.slug as string,
  };
}

function hasRequiredField(value: unknown, field: (typeof requiredFields)[number]): boolean {
  if (field === "date" && value instanceof Date) {
    return true;
  }

  return typeof value === "string" && value.trim() !== "";
}

function formatDateField(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value !== "string") {
    throw new Error("Required frontmatter field \"date\" must be a string");
  }

  return value;
}

function assertUniqueSlugs(posts: ParsedPost[]): void {
  const seenSlugs = new Set<string>();

  for (const post of posts) {
    if (seenSlugs.has(post.slug)) {
      throw new Error(`Duplicate post slug found: ${post.slug}`);
    }

    seenSlugs.add(post.slug);
  }
}
