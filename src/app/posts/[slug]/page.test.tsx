import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import PostPage from "./page";
import type { Post } from "../../../lib/posts";

const postsMock = vi.hoisted(() => ({
  getPostBySlug: vi.fn(),
}));

vi.mock("../../../lib/posts", () => ({
  getAllPostSlugs: () => [],
  getPostBySlug: postsMock.getPostBySlug,
}));

vi.mock("next/link", () => ({
  default({ children, href, ...props }: { children: ReactNode; href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

const post: Post = {
  title: "An article response",
  date: "2026-09-07",
  description: "What stayed with me",
  slug: "article-response",
  tags: ["reading-note"],
  source: {
    title: "The original article",
    url: "https://example.com/articles/original",
    author: "Example Author",
    publishedDate: "2026-09-01",
    accessedDate: "2026-09-07",
  },
  contentHtml: "<blockquote><p>A short quotation.</p></blockquote>",
};

afterEach(() => {
  cleanup();
  postsMock.getPostBySlug.mockReset();
});

describe("PostPage source metadata", () => {
  it("given a reading note with a source when rendering then displays a source card", async () => {
    postsMock.getPostBySlug.mockReturnValue(post);

    render(await PostPage({ params: Promise.resolve({ slug: post.slug }) }));

    const source = screen.getByRole("complementary", { name: "この記事の参照元" });
    const sourceLink = screen.getByRole("link", { name: "The original article" });

    expect(source).toBeTruthy();
    expect(sourceLink.getAttribute("href")).toBe("https://example.com/articles/original");
    expect(screen.getByText("Example Author")).toBeTruthy();
    expect(screen.getByText("公開: 2026-09-01")).toBeTruthy();
    expect(screen.getByText("閲覧: 2026-09-07")).toBeTruthy();
    expect(screen.getByText("A short quotation.")).toBeTruthy();
  });

  it("given a regular post without a source when rendering then omits the source card", async () => {
    postsMock.getPostBySlug.mockReturnValue({ ...post, source: undefined });

    render(await PostPage({ params: Promise.resolve({ slug: post.slug }) }));

    expect(screen.queryByRole("complementary", { name: "この記事の参照元" })).toBeNull();
  });
});
