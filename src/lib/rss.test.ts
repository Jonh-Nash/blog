import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import type { PostSummary } from "./posts";
import { buildRssFeed } from "./rss";
import { siteMetadata } from "./site";

const makePost = ({
  title,
  date,
  slug,
}: {
  title: string;
  date: string;
  slug: string;
}): PostSummary => ({
  title,
  date,
  slug,
  tags: ["idea"],
});

const parseXml = (xml: string): Document => {
  const document = new DOMParser().parseFromString(xml, "application/xml");
  const parseError = document.querySelector("parsererror");

  expect(parseError?.textContent).toBeUndefined();

  return document;
};

describe("buildRssFeed", () => {
  it("keeps RSS metadata shape internal to the RSS module", () => {
    const source = readFileSync(`${process.cwd()}/src/lib/rss.ts`, "utf8");

    expect(source).not.toMatch(/\bexport\s+type\s+SiteMetadata\b/);
  });

  it("given site metadata when building the feed then returns RSS 2.0 channel metadata", () => {
    const xml = buildRssFeed([], siteMetadata);

    const document = parseXml(xml);
    const rss = document.querySelector("rss");
    const channel = document.querySelector("channel");

    expect(rss?.getAttribute("version")).toBe("2.0");
    expect(channel?.querySelector("title")?.textContent).toBe(siteMetadata.title);
    expect(channel?.querySelector("description")?.textContent).toBe(siteMetadata.description);
    expect(channel?.querySelector("link")?.textContent).toBe(siteMetadata.baseUrl);
    expect(channel?.querySelector("language")?.textContent).toBe(siteMetadata.language);
  });

  it("given posts in any order when building the feed then emits items newest first", () => {
    const posts = [
      makePost({
        title: "Old post",
        date: "2026-05-01",
        slug: "old-post",
      }),
      makePost({
        title: "New post",
        date: "2026-05-03",
        slug: "new-post",
      }),
      makePost({
        title: "Middle post",
        date: "2026-05-02",
        slug: "middle-post",
      }),
    ];

    const xml = buildRssFeed(posts, siteMetadata);

    const document = parseXml(xml);
    const titles = Array.from(document.querySelectorAll("item > title")).map(
      (title) => title.textContent,
    );

    expect(titles).toEqual(["New post", "Middle post", "Old post"]);
  });

  it("given a post summary when building the feed then emits article RSS item fields", () => {
    const posts = [
      makePost({
        title: "RSS post",
        date: "2026-05-04",
        slug: "rss-post",
      }),
    ];

    const xml = buildRssFeed(posts, siteMetadata);

    const document = parseXml(xml);
    const item = document.querySelector("item");
    const expectedUrl = "https://jonh-nash.github.io/blog/posts/rss-post";

    expect(item?.querySelector("title")?.textContent).toBe("RSS post");
    expect(item?.querySelector("description")).toBeNull();
    expect(item?.querySelector("link")?.textContent).toBe(expectedUrl);
    expect(item?.querySelector("guid")?.textContent).toBe(expectedUrl);
    expect(item?.querySelector("pubDate")?.textContent).toBe(
      new Date("2026-05-04").toUTCString(),
    );
  });

  it("given XML special characters when building the feed then escapes text and URLs", () => {
    const posts = [
      makePost({
        title: "A & B <C> \"D\" 'E'",
        date: "2026-05-05",
        slug: "xml-&-post",
      }),
    ];

    const xml = buildRssFeed(posts, siteMetadata);

    expect(xml).toContain("A &amp; B &lt;C&gt; &quot;D&quot; &apos;E&apos;");
    expect(xml).toContain("https://jonh-nash.github.io/blog/posts/xml-&amp;-post");
    expect(parseXml(xml).querySelector("item > title")?.textContent).toBe("A & B <C> \"D\" 'E'");
  });

  it("given posts when building the feed then does not mutate the input order", () => {
    const posts = [
      makePost({
        title: "Old post",
        date: "2026-05-01",
        slug: "old-post",
      }),
      makePost({
        title: "New post",
        date: "2026-05-03",
        slug: "new-post",
      }),
    ];

    buildRssFeed(posts, siteMetadata);

    expect(posts.map((post) => post.slug)).toEqual(["old-post", "new-post"]);
  });

  it("given a post with an invalid date when building the feed then fails fast", () => {
    const posts = [
      makePost({
        title: "Invalid date post",
        date: "not-a-date",
        slug: "invalid-date-post",
      }),
    ];

    expect(() => buildRssFeed(posts, siteMetadata)).toThrow(
      "Invalid post date for RSS feed: not-a-date",
    );
  });
});
