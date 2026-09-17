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
  slug,
  tags,
  body,
}: {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  body: string;
}) => {
  const formattedTags = tags.map((tag) => `  - ${tag}`).join("\n");

  return `---
title: ${title}
date: ${date}
slug: ${slug}
tags:
${formattedTags}
---

${body}
`;
};

const importPostsModule = async () => {
  vi.resetModules();
  return import("./posts");
};

describe("posts data module", () => {
  beforeEach(() => {
    fsMock.setMarkdownFiles({});
  });

  it("given Markdown frontmatter when listing posts then returns newest summaries first without article body", async () => {
    fsMock.setMarkdownFiles({
      "first.md": completePost({
        title: "First post",
        date: "2026-05-01",
        slug: "first-post",
        tags: ["idea"],
        body: "# First body",
      }),
      "second.md": completePost({
        title: "Second post",
        date: "2026-05-02",
        slug: "second-post",
        tags: ["idea"],
        body: "# Second body",
      }),
    });
    const { getAllPosts } = await importPostsModule();

    const posts = getAllPosts();

    expect(posts).toEqual([
      {
        title: "Second post",
        date: "2026-05-02",
        slug: "second-post",
        tags: ["idea"],
      },
      {
        title: "First post",
        date: "2026-05-01",
        slug: "first-post",
        tags: ["idea"],
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
        slug: "frontmatter-slug",
        tags: ["idea"],
        body: "# Rendered article\n\nThis body is rendered from Markdown.",
      }),
    });
    const { getPostBySlug } = await importPostsModule();

    const post = getPostBySlug("frontmatter-slug");

    expect(post).toMatchObject({
      title: "Slug sourced post",
      date: "2026-05-03",
      slug: "frontmatter-slug",
      tags: ["idea"],
    });
    expect(post.contentHtml).toContain("<h1");
    expect(post.contentHtml).toContain("Rendered article");
  });

  it("given raw HTML in Markdown when fetching one post then returns sanitized detail content", async () => {
    fsMock.setMarkdownFiles({
      "unsafe.md": completePost({
        title: "Unsafe HTML",
        date: "2026-05-04",
        slug: "unsafe-html",
        tags: ["idea"],
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
        slug: "unsafe-link",
        tags: ["idea"],
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
        slug: "alpha-slug",
        tags: ["idea"],
        body: "Alpha body",
      }),
      "beta.md": completePost({
        title: "Beta",
        date: "2026-05-07",
        slug: "beta-slug",
        tags: ["idea"],
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
slug: missing-title
tags:
  - idea
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
        slug: "known-slug",
        tags: ["idea"],
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
        slug: "duplicate-slug",
        tags: ["idea"],
        body: "First duplicate body",
      }),
      "second.md": completePost({
        title: "Second duplicate",
        date: "2026-05-10",
        slug: "duplicate-slug",
        tags: ["idea"],
        body: "Second duplicate body",
      }),
    });
    const { getAllPosts } = await importPostsModule();

    expect(() => getAllPosts()).toThrow(/Duplicate post slug found: duplicate-slug/);
  });

  it("given tags frontmatter when listing posts then returns tags in summary metadata", async () => {
    fsMock.setMarkdownFiles({
      "idea.md": completePost({
        title: "Idea post",
        date: "2026-05-11",
        slug: "idea-post",
        tags: ["idea"],
        body: "Idea body",
      }),
    });
    const { getAllPosts } = await importPostsModule();

    const posts = getAllPosts();

    expect(posts).toEqual([
      {
        title: "Idea post",
        date: "2026-05-11",
        slug: "idea-post",
        tags: ["idea"],
      },
    ]);
  });

  it("given tags frontmatter when fetching one post then returns tags in detail metadata", async () => {
    fsMock.setMarkdownFiles({
      "detail.md": completePost({
        title: "Detail idea",
        date: "2026-05-12",
        slug: "detail-idea",
        tags: ["idea"],
        body: "Detail body",
      }),
    });
    const { getPostBySlug } = await importPostsModule();

    const post = getPostBySlug("detail-idea");

    expect(post).toMatchObject({
      title: "Detail idea",
      date: "2026-05-12",
      slug: "detail-idea",
      tags: ["idea"],
    });
  });

  it("given source frontmatter when fetching a reading note then returns its citation metadata", async () => {
    fsMock.setMarkdownFiles({
      "reading-note.md": `---
title: An article response
date: 2026-09-07
slug: article-response
tags:
  - reading-note
source:
  title: The original article
  url: https://example.com/articles/original
  author: Example Author
  publishedDate: 2026-09-01
  accessedDate: 2026-09-07
---

> A short quotation.

My response.
`,
    });
    const { getPostBySlug } = await importPostsModule();

    const post = getPostBySlug("article-response");

    expect(post.source).toEqual({
      title: "The original article",
      url: "https://example.com/articles/original",
      author: "Example Author",
      publishedDate: "2026-09-01",
      accessedDate: "2026-09-07",
    });
    expect(post.contentHtml).toContain("<blockquote>");
    expect(post.contentHtml).toContain("A short quotation.");
  });

  it("given source frontmatter with only required fields when fetching then accepts it", async () => {
    fsMock.setMarkdownFiles({
      "minimal-source.md": `---
title: Minimal source
date: 2026-09-07
slug: minimal-source
tags:
  - reading-note
source:
  title: Original
  url: http://example.com/original
---

Response.
`,
    });
    const { getPostBySlug } = await importPostsModule();

    const post = getPostBySlug("minimal-source");

    expect(post.source).toEqual({
      title: "Original",
      url: "http://example.com/original",
    });
  });

  it.each([
    ["a non-object source", "source: original article", /source.*object/i],
    [
      "a source without a title",
      "source:\n  url: https://example.com/original",
      /source field.*title/i,
    ],
    [
      "a source with an unsafe URL",
      "source:\n  title: Original\n  url: javascript:alert(1)",
      /source url.*http/i,
    ],
  ])("given %s when listing posts then fails fast", async (_caseName, source, error) => {
    fsMock.setMarkdownFiles({
      "invalid-source.md": `---
title: Invalid source
date: 2026-09-07
slug: invalid-source
tags:
  - reading-note
${source}
---

Response.
`,
    });
    const { getAllPosts } = await importPostsModule();

    expect(() => getAllPosts()).toThrow(error);
  });

  it("given missing tags frontmatter when listing posts then fails fast", async () => {
    fsMock.setMarkdownFiles({
      "missing-tags.md": `---
title: Missing tags
date: 2026-05-13
slug: missing-tags
---

Body
`,
    });
    const { getAllPosts } = await importPostsModule();

    expect(() => getAllPosts()).toThrow(/tags/i);
  });

  it("given non-array tags frontmatter when listing posts then fails fast", async () => {
    fsMock.setMarkdownFiles({
      "string-tags.md": `---
title: String tags
date: 2026-05-14
slug: string-tags
tags: idea
---

Body
`,
    });
    const { getAllPosts } = await importPostsModule();

    expect(() => getAllPosts()).toThrow(/tags/i);
  });

  it("given an empty tag value when listing posts then fails fast", async () => {
    fsMock.setMarkdownFiles({
      "empty-tag.md": `---
title: Empty tag
date: 2026-05-15
slug: empty-tag
tags:
  - ""
---

Body
`,
    });
    const { getAllPosts } = await importPostsModule();

    expect(() => getAllPosts()).toThrow(/tags/i);
  });
});
