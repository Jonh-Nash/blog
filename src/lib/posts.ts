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
  tags: string[];
};

export type PostSource = {
  title: string;
  url: string;
  author?: string;
  publishedDate?: string;
  accessedDate?: string;
};

export type Post = PostSummary & {
  source?: PostSource;
  contentHtml: string;
};

type ParsedPost = PostSummary & {
  source?: PostSource;
  markdown: string;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");
const requiredFields = ["title", "date", "description", "slug"] as const;

export function getAllPosts(): PostSummary[] {
  return readPosts()
    .map(({ title, date, description, slug, tags }) => ({
      title,
      date,
      description,
      slug,
      tags,
    }))
    .sort((first, second) => second.date.localeCompare(first.date));
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
    tags: post.tags,
    source: post.source,
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

function validateFrontmatter(
  data: Record<string, unknown>,
  fileName: string,
): PostSummary & { source?: PostSource } {
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
    tags: validateTagsField(data.tags, fileName),
    ...validateSourceField(data.source, fileName),
  };
}

function validateSourceField(
  value: unknown,
  fileName: string,
): { source?: PostSource } {
  if (value === undefined) {
    return {};
  }

  if (!isRecord(value)) {
    throw new Error(`Optional frontmatter field "source" must be an object in ${fileName}`);
  }

  const title = validateRequiredSourceText(value.title, "title", fileName);
  const url = validateRequiredSourceText(value.url, "url", fileName);

  if (!isHttpUrl(url)) {
    throw new Error(`Source URL must use http or https in ${fileName}`);
  }

  return {
    source: {
      title,
      url,
      ...optionalSourceText(value.author, "author", fileName),
      ...optionalSourceDate(value.publishedDate, "publishedDate", fileName),
      ...optionalSourceDate(value.accessedDate, "accessedDate", fileName),
    },
  };
}

function validateRequiredSourceText(
  value: unknown,
  field: "title" | "url",
  fileName: string,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Source field "${field}" must be a non-empty string in ${fileName}`);
  }

  return value;
}

function optionalSourceText(
  value: unknown,
  field: "author",
  fileName: string,
): Partial<PostSource> {
  if (value === undefined) {
    return {};
  }

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Source field "${field}" must be a non-empty string in ${fileName}`);
  }

  return { [field]: value };
}

function optionalSourceDate(
  value: unknown,
  field: "publishedDate" | "accessedDate",
  fileName: string,
): Partial<PostSource> {
  if (value === undefined) {
    return {};
  }

  if (value instanceof Date) {
    return { [field]: value.toISOString().slice(0, 10) };
  }

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Source field "${field}" must be a date string in ${fileName}`);
  }

  return { [field]: value };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
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

function validateTagsField(value: unknown, fileName: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Missing required frontmatter field "tags" in ${fileName}`);
  }

  if (!value.every((tag) => typeof tag === "string" && tag.trim() !== "")) {
    throw new Error(
      `Required frontmatter field "tags" must be a non-empty string array in ${fileName}`,
    );
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
