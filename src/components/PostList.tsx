import Link from "next/link";

import type { PostSummary } from "../lib/posts";

type PostListProps = {
  posts: PostSummary[];
  selectedTag?: string;
};

export function PostList({ posts, selectedTag }: PostListProps) {
  const filterStatus = selectedTag ? (
    <p className="filter-status">Filtered by tag: {selectedTag}</p>
  ) : null;

  return (
    <>
      {filterStatus}
      {posts.length === 0 ? (
        <p className="empty-state">No posts found.</p>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <article className="post-card" key={post.slug}>
              <h2>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              <time dateTime={post.date}>{post.date}</time>
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <Link
                    className="post-tag"
                    href={`/?tag=${encodeURIComponent(tag)}`}
                    key={tag}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <p>{post.description}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
