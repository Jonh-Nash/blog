import { Suspense } from "react";

import { PostListFilter } from "./PostListFilter";
import { PostList } from "../components/PostList";
import { getAllPosts } from "../lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="site-shell">
      <header className="site-header">
        <p className="eyebrow">Personal Blog</p>
        <h1>Blog</h1>
        <p>Markdown files in this repository are published as static posts.</p>
      </header>
      <Suspense fallback={<PostList posts={posts} />}>
        <PostListFilter posts={posts} />
      </Suspense>
    </main>
  );
}
