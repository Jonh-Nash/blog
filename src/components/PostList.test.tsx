import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { PostList } from "./PostList";
import type { PostSummary } from "../lib/posts";

afterEach(() => {
  cleanup();
});

describe("PostList", () => {
  it("given post summaries when rendering the list then passes title date description and slug to detail links", () => {
    const posts: PostSummary[] = [
      {
        title: "First post",
        date: "2026-05-01",
        description: "First description",
        slug: "first-post",
        tags: ["idea"],
      },
      {
        title: "Second post",
        date: "2026-05-02",
        description: "Second description",
        slug: "second-post",
        tags: ["idea"],
      },
    ];

    render(<PostList posts={posts} />);

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(2);

    const firstArticle = within(articles[0]);
    expect(firstArticle.getByText("First post")).toBeTruthy();
    expect(firstArticle.getByText("2026-05-01")).toBeTruthy();
    expect(firstArticle.getByText("First description")).toBeTruthy();
    expect(firstArticle.getByRole("link", { name: "First post" }).getAttribute("href")).toBe(
      "/posts/first-post",
    );

    const secondArticle = within(articles[1]);
    expect(secondArticle.getByText("Second post")).toBeTruthy();
    expect(secondArticle.getByText("2026-05-02")).toBeTruthy();
    expect(secondArticle.getByText("Second description")).toBeTruthy();
    expect(secondArticle.getByRole("link", { name: "Second post" }).getAttribute("href")).toBe(
      "/posts/second-post",
    );
  });

  it("given GitHub Pages project hosting when rendering links then does not hard-code the basePath", () => {
    const posts: PostSummary[] = [
      {
        title: "Base path post",
        date: "2026-05-03",
        description: "Base path description",
        slug: "base-path-post",
        tags: ["idea"],
      },
    ];

    render(<PostList posts={posts} />);

    const link = screen.getByRole("link", { name: "Base path post" });
    expect(link.getAttribute("href")).toBe("/posts/base-path-post");
    expect(link.getAttribute("href")).not.toContain("/blog/");
  });

  it("given post summaries with tags when rendering the list then displays the idea tag", () => {
    const posts: PostSummary[] = [
      {
        title: "Tagged post",
        date: "2026-05-04",
        description: "Tagged description",
        slug: "tagged-post",
        tags: ["idea"],
      },
    ];

    render(<PostList posts={posts} />);

    const article = screen.getByRole("article");
    expect(within(article).getByText("idea")).toBeTruthy();
    expect(within(article).queryByText("thought")).toBeNull();
  });
});
