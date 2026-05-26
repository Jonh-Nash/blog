import Link from "next/link";

import type { PostSummary } from "../lib/posts";

type PostListProps = {
  posts: PostSummary[];
};

export function PostList({ posts }: PostListProps) {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-card" key={post.slug}>
          <h2>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </h2>
          <time dateTime={post.date}>{post.date}</time>
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <p>{post.description}</p>
        </article>
      ))}
    </div>
  );
}
