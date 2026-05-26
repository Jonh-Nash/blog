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
    description: post.description,
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
          <p>{post.description}</p>
        </header>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  );
}
