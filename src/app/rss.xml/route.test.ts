import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PostSummary } from "../../lib/posts";

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

vi.mock("../../lib/posts", () => ({
  getAllPosts: postsMock.getAllPosts,
}));

const makePost = ({
  title,
  date,
  description,
  slug,
}: {
  title: string;
  date: string;
  description: string;
  slug: string;
}): PostSummary => ({
  title,
  date,
  description,
  slug,
  tags: ["idea"],
});

describe("GET /rss.xml", () => {
  beforeEach(() => {
    postsMock.getAllPosts.mockClear();
    postsMock.setPosts([
      makePost({
        title: "First RSS post",
        date: "2026-05-01",
        description: "First RSS description",
        slug: "first-rss-post",
      }),
      makePost({
        title: "Latest RSS post",
        date: "2026-05-03",
        description: "Latest RSS description",
        slug: "latest-rss-post",
      }),
    ]);
  });

  it("given configured posts when requesting rss.xml then returns an XML response", async () => {
    const { GET } = await import("./route");

    const response = await GET();
    const body = await response.text();

    expect(postsMock.getAllPosts).toHaveBeenCalledOnce();
    expect(response.headers.get("Content-Type")).toBe("text/xml; charset=utf-8");
    expect(body).toContain('<rss version="2.0">');
    expect(body).toContain("<channel>");
    expect(body).toContain("<item>");
  });

  it("given configured posts when requesting rss.xml then includes all posts newest first", async () => {
    const { GET } = await import("./route");

    const response = await GET();
    const body = await response.text();

    expect(body.indexOf("<title>Latest RSS post</title>")).toBeLessThan(
      body.indexOf("<title>First RSS post</title>"),
    );
    expect(body).toContain("https://jonh-nash.github.io/blog/posts/latest-rss-post");
    expect(body).toContain(new Date("2026-05-03").toUTCString());
    expect(body).toContain("<description>Latest RSS description</description>");
  });

  it("given the route module when statically exporting then marks rss.xml as force static", async () => {
    const routeModule = await import("./route");

    expect(routeModule.dynamic).toBe("force-static");
  });
});
