import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Home from "./page";
import type { PostSummary } from "../lib/posts";

const postsMock = vi.hoisted(() => {
  let posts: PostSummary[] = [];
  const getAllPosts = vi.fn(() => posts);

  return {
    getAllPosts,
    setPosts(nextPosts: PostSummary[]) {
      posts = nextPosts;
    },
  };
});

const navigationMock = vi.hoisted(() => {
  let searchParams = new URLSearchParams();
  const useSearchParams = vi.fn(() => searchParams);

  return {
    setSearchParams(nextSearchParams: { tag?: string | string[] }) {
      searchParams = new URLSearchParams();
      const tag = nextSearchParams.tag;

      if (Array.isArray(tag)) {
        tag.forEach((value) => searchParams.append("tag", value));
      } else if (tag !== undefined) {
        searchParams.set("tag", tag);
      }
    },
    useSearchParams,
  };
});

vi.mock("../lib/posts", () => ({
  getAllPosts: postsMock.getAllPosts,
}));

vi.mock("next/navigation", () => ({
  useSearchParams: navigationMock.useSearchParams,
}));

const renderHome = (searchParams: { tag?: string | string[] }) => {
  navigationMock.setSearchParams(searchParams);
  render(<Home />);
};

const makePost = ({
  title,
  slug,
  tags,
}: {
  title: string;
  slug: string;
  tags: string[];
}): PostSummary => ({
  title,
  date: "2026-05-01",
  description: `${title} description`,
  slug,
  tags,
});

describe("Home page tag filtering", () => {
  beforeEach(() => {
    postsMock.getAllPosts.mockClear();
    postsMock.setPosts([
      makePost({ title: "Idea post", slug: "idea-post", tags: ["idea"] }),
      makePost({ title: "Build post", slug: "build-post", tags: ["build"] }),
      makePost({ title: "Mixed post", slug: "mixed-post", tags: ["idea", "build"] }),
    ]);
  });

  afterEach(() => {
    cleanup();
  });

  it("given no tag query when rendering the page then displays all posts without filter status", async () => {
    renderHome({});

    expect(screen.getByRole("link", { name: "Idea post" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Build post" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Mixed post" })).toBeTruthy();
    expect(screen.queryByText(/Filtered by tag:/)).toBeNull();
  });

  it("given an idea tag query when rendering the page then displays only posts with the idea tag", async () => {
    renderHome({ tag: "idea" });

    await waitFor(() => {
      expect(screen.queryByRole("link", { name: "Build post" })).toBeNull();
    });
    expect(screen.getByRole("link", { name: "Idea post" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Mixed post" })).toBeTruthy();
  });

  it("given an idea tag query when rendering the page then displays the active filter status", async () => {
    renderHome({ tag: "idea" });

    expect(await screen.findByText("Filtered by tag: idea")).toBeTruthy();
  });

  it("given repeated tag query values when rendering the page then uses the first tag value", async () => {
    renderHome({ tag: ["idea", "build"] });

    expect(screen.getByRole("link", { name: "Idea post" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Mixed post" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Build post" })).toBeNull();
  });

  it("given an unknown tag query when rendering the page then displays the empty state", async () => {
    renderHome({ tag: "missing" });

    expect(await screen.findByText("No posts found.")).toBeTruthy();
    expect(screen.queryByRole("article")).toBeNull();
  });
});
