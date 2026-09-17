import Link from "next/link";
import type { Metadata } from "next";

import { getAllPostSlugs, getPostBySlug } from "../../../lib/posts";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return {
    title: post.title,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return (
    <main className="site-shell">
      <article className="post-detail">
        <Link className="back-link" href="/">
          Back to posts
        </Link>
        <header>
          <p className="eyebrow">Post</p>
          <h1>{post.title}</h1>
          <time dateTime={post.date}>{post.date}</time>
        </header>
        {post.source ? (
          <aside className="post-source" aria-label="この記事の参照元">
            <p className="eyebrow">Source</p>
            <a href={post.source.url}>{post.source.title}</a>
            {post.source.author ? <span>{post.source.author}</span> : null}
            {post.source.publishedDate ? (
              <span>公開: {post.source.publishedDate}</span>
            ) : null}
            {post.source.accessedDate ? (
              <span>閲覧: {post.source.accessedDate}</span>
            ) : null}
          </aside>
        ) : null}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  );
}
