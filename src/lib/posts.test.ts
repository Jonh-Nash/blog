import { beforeEach, describe, expect, it, vi } from "vitest";

const fsMock = vi.hoisted(() => {
  type ReadDirOptions = { withFileTypes?: boolean };
  type DirentLike = { name: string; isFile: () => boolean };

  let markdownFiles = new Map<string, string>();

  const fileNameFromPath = (filePath: string) => {
    const parts = filePath.split(/[\\/]/);
    return parts[parts.length - 1];
  };

  const readDirectory = (options?: ReadDirOptions): string[] | DirentLike[] => {
    const fileNames = Array.from(markdownFiles.keys());

    if (options?.withFileTypes) {
      return fileNames.map((name) => ({
        name,
        isFile: () => true,
      }));
    }

    return fileNames;
  };

  return {
    readdirSync: (_directoryPath: string, options?: ReadDirOptions) =>
      readDirectory(options),
    readFileSync: (filePath: string) => {
      const fileName = fileNameFromPath(filePath);
      const content = markdownFiles.get(fileName);

      if (content === undefined) {
        throw new Error(`Test fixture not found: ${fileName}`);
      }

      return content;
    },
    setMarkdownFiles: (files: Record<string, string>) => {
      markdownFiles = new Map(Object.entries(files));
    },
  };
});

vi.mock("node:fs", () => ({
  ...fsMock,
  default: fsMock,
}));

const completePost = ({
  title,
  date,
  description,
  slug,
  body,
}: {
  title: string;
  date: string;
  description: string;
  slug: string;
  body: string;
}) => `---
title: ${title}
date: ${date}
description: ${description}
slug: ${slug}
---

${body}
`;

const importPostsModule = async () => {
  vi.resetModules();
  return import("./posts");
};

describe("posts data module", () => {
  beforeEach(() => {
    fsMock.setMarkdownFiles({});
  });

  it("given Markdown frontmatter when listing posts then returns summary data without article body", async () => {
    fsMock.setMarkdownFiles({
      "first.md": completePost({
        title: "First post",
        date: "2026-05-01",
        description: "First description",
        slug: "first-post",
        body: "# First body",
      }),
      "second.md": completePost({
        title: "Second post",
        date: "2026-05-02",
        description: "Second description",
        slug: "second-post",
        body: "# Second body",
      }),
    });
    const { getAllPosts } = await importPostsModule();

    const posts = getAllPosts();

    expect(posts).toEqual([
      {
        title: "First post",
        date: "2026-05-01",
        description: "First description",
        slug: "first-post",
      },
      {
        title: "Second post",
        date: "2026-05-02",
        description: "Second description",
        slug: "second-post",
      },
    ]);
    expect(posts).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ contentHtml: expect.any(String) })]),
    );
  });

  it("given a slug from frontmatter when fetching one post then returns matching detail content", async () => {
    fsMock.setMarkdownFiles({
      "filename-does-not-match.md": completePost({
        title: "Slug sourced post",
        date: "2026-05-03",
        description: "Loaded by slug",
        slug: "frontmatter-slug",
        body: "# Rendered article\n\nThis body is rendered from Markdown.",
      }),
    });
    const { getPostBySlug } = await importPostsModule();

    const post = getPostBySlug("frontmatter-slug");

    expect(post).toMatchObject({
      title: "Slug sourced post",
      date: "2026-05-03",
      description: "Loaded by slug",
      slug: "frontmatter-slug",
    });
    expect(post.contentHtml).toContain("<h1");
    expect(post.contentHtml).toContain("Rendered article");
  });

  it("given raw HTML in Markdown when fetching one post then returns sanitized detail content", async () => {
    fsMock.setMarkdownFiles({
      "unsafe.md": completePost({
        title: "Unsafe HTML",
        date: "2026-05-04",
        description: "Contains raw HTML",
        slug: "unsafe-html",
        body: "# Safe heading\n\n<img src=\"x\" onerror=\"alert('xss')\"><script>alert('xss')</script>",
      }),
    });
    const { getPostBySlug } = await importPostsModule();

    const post = getPostBySlug("unsafe-html");

    expect(post.contentHtml).toContain("Safe heading");
    expect(post.contentHtml).not.toContain("onerror");
    expect(post.contentHtml).not.toContain("<script");
  });

  it("given raw javascript URL in Markdown when fetching one post then returns sanitized link", async () => {
    fsMock.setMarkdownFiles({
      "unsafe-link.md": completePost({
        title: "Unsafe link",
        date: "2026-05-05",
        description: "Contains javascript URL",
        slug: "unsafe-link",
        body: "[unsafe](javascript:alert('xss'))",
      }),
    });
    const { getPostBySlug } = await importPostsModule();

    const post = getPostBySlug("unsafe-link");

    expect(post.contentHtml).toContain("unsafe");
    expect(post.contentHtml).not.toContain("javascript:");
  });

  it("given Markdown posts when generating static params data then returns slugs from frontmatter", async () => {
    fsMock.setMarkdownFiles({
      "alpha.md": completePost({
        title: "Alpha",
        date: "2026-05-06",
        description: "Alpha description",
        slug: "alpha-slug",
        body: "Alpha body",
      }),
      "beta.md": completePost({
        title: "Beta",
        date: "2026-05-07",
        description: "Beta description",
        slug: "beta-slug",
        body: "Beta body",
      }),
    });
    const { getAllPostSlugs } = await importPostsModule();

    const slugs = getAllPostSlugs();

    expect(slugs).toEqual(["alpha-slug", "beta-slug"]);
  });

  it("given missing required frontmatter when listing posts then fails fast", async () => {
    fsMock.setMarkdownFiles({
      "missing-title.md": `---
	date: 2026-05-06
description: Missing title
slug: missing-title
---

Body
`,
    });
    const { getAllPosts } = await importPostsModule();

    expect(() => getAllPosts()).toThrow(/title/i);
  });

  it("given an unknown slug when fetching one post then fails fast", async () => {
    fsMock.setMarkdownFiles({
      "known.md": completePost({
        title: "Known",
        date: "2026-05-08",
        description: "Known description",
        slug: "known-slug",
        body: "Known body",
      }),
    });
    const { getPostBySlug } = await importPostsModule();

    expect(() => getPostBySlug("unknown-slug")).toThrow(/unknown-slug/);
  });

  it("given duplicate frontmatter slugs when listing posts then fails fast", async () => {
    fsMock.setMarkdownFiles({
      "first.md": completePost({
        title: "First duplicate",
        date: "2026-05-09",
        description: "First duplicate description",
        slug: "duplicate-slug",
        body: "First duplicate body",
      }),
      "second.md": completePost({
        title: "Second duplicate",
        date: "2026-05-10",
        description: "Second duplicate description",
        slug: "duplicate-slug",
        body: "Second duplicate body",
      }),
    });
    const { getAllPosts } = await importPostsModule();

    expect(() => getAllPosts()).toThrow(/Duplicate post slug found: duplicate-slug/);
  });
});
