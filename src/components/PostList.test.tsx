import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { MouseEvent, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PostList } from "./PostList";
import type { PostSummary } from "../lib/posts";

vi.mock("next/link", () => ({
  default({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
      if (event.defaultPrevented) {
        return;
      }

      if (event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      const targetHref = href.startsWith("/?") ? `${window.location.pathname}${href.slice(1)}` : href;
      window.history.pushState({}, "", targetHref);
    };

    return (
      <a href={href} onClick={navigate} {...props}>
        {children}
      </a>
    );
  },
}));

beforeEach(() => {
  window.history.replaceState({}, "", "/blog/");
});

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

  it("given post summaries with tags when rendering the list then exposes each tag as a filter link", () => {
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
    const tagLink = within(article).getByRole("link", { name: "idea" });
    expect(tagLink.getAttribute("href")).toBe("/?tag=idea");
    expect(tagLink.getAttribute("href")).not.toContain("/blog/");
  });

  it("given post summaries with tags when clicking a tag then updates the URL query", () => {
    const posts: PostSummary[] = [
      {
        title: "Idea post",
        date: "2026-05-04",
        description: "Idea description",
        slug: "idea-post",
        tags: ["idea"],
      },
      {
        title: "Memo post",
        date: "2026-05-05",
        description: "Memo description",
        slug: "memo-post",
        tags: ["memo"],
      },
    ];

    render(<PostList posts={posts} />);

    fireEvent.click(screen.getByRole("link", { name: "idea" }));

    expect(window.location.pathname).toBe("/blog/");
    expect(window.location.search).toBe("?tag=idea");
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("given a tag that requires URL encoding when rendering the list then encodes the filter link query", () => {
    const posts: PostSummary[] = [
      {
        title: "Encoded tag post",
        date: "2026-05-05",
        description: "Encoded tag description",
        slug: "encoded-tag-post",
        tags: ["work notes"],
      },
    ];

    render(<PostList posts={posts} />);

    const article = screen.getByRole("article");
    const tagLink = within(article).getByRole("link", { name: "work notes" });
    expect(tagLink.getAttribute("href")).toBe("/?tag=work%20notes");
  });

  it("given a tag that requires URL encoding when clicking the tag then updates the URL query", () => {
    const posts: PostSummary[] = [
      {
        title: "Encoded tag post",
        date: "2026-05-05",
        description: "Encoded tag description",
        slug: "encoded-tag-post",
        tags: ["work notes"],
      },
    ];

    render(<PostList posts={posts} />);

    fireEvent.click(screen.getByRole("link", { name: "work notes" }));

    expect(window.location.pathname).toBe("/blog/");
    expect(window.location.search).toBe("?tag=work%20notes");
  });

  it("given a modified tag click when rendering the list then leaves the current URL unchanged", () => {
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

    fireEvent.click(screen.getByRole("link", { name: "idea" }), { metaKey: true });

    expect(window.location.pathname).toBe("/blog/");
    expect(window.location.search).toBe("");
    expect(screen.queryByText("Filtered by tag: idea")).toBeNull();
  });

  it("given no post summaries when rendering the list then displays the empty state", () => {
    const posts: PostSummary[] = [];

    render(<PostList posts={posts} />);

    expect(screen.getByText("No posts found.")).toBeTruthy();
    expect(screen.queryByRole("article")).toBeNull();
  });
});
