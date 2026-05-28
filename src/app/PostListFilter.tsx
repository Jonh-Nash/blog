"use client";

import { useSearchParams } from "next/navigation";

import { PostList } from "../components/PostList";
import type { PostSummary } from "../lib/posts";

type PostListFilterProps = {
  posts: PostSummary[];
};

export function PostListFilter({ posts }: PostListFilterProps) {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");
  const selectedTag = tag && tag !== "" ? tag : undefined;
  const visiblePosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  return <PostList posts={visiblePosts} selectedTag={selectedTag} />;
}
