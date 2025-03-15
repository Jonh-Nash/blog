import { getAllMarkdownInDir } from "@/lib/mdUtils";
import { marked } from "marked";
import Link from "next/link";

interface AiNewsPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  const posts = getAllMarkdownInDir("ai-news");
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function AiNewsPage({ params }: AiNewsPageProps) {
  const posts = getAllMarkdownInDir("ai-news");
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post)
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold text-white mb-4">
          記事が見つかりません
        </h1>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-indigo-500 text-sm font-medium rounded-md text-indigo-400 bg-gray-900 hover:bg-gray-800 transition duration-150"
        >
          ホームに戻る
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-400">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="hover:text-indigo-400">
              Home
            </Link>
            <svg
              className="h-4 w-4 mx-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li className="flex items-center">
            <Link href="/ai-news" className="hover:text-indigo-400">
              AI News
            </Link>
            <svg
              className="h-4 w-4 mx-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li>
            <span className="text-gray-300">{post.meta.title}</span>
          </li>
        </ol>
      </nav>

      {/* Article header */}
      <header className="mb-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-300 mb-4">
          <svg
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
            />
          </svg>
          AI News
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          {post.meta.title}
        </h1>
        <div className="flex items-center text-gray-400 mb-4">
          <time dateTime={post.meta.date} className="text-sm">
            {new Date(post.meta.date).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.meta.tags && post.meta.tags.length > 0 && (
            <>
              <span className="mx-2">&bull;</span>
              <div className="flex space-x-2">
                {post.meta.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {post.meta.profile && (
          <div className="flex items-center mb-6">
            {post.meta.profile.image && (
              <img
                src={post.meta.profile.image}
                alt={post.meta.profile.name || "Author"}
                className="h-10 w-10 rounded-full mr-3"
              />
            )}
            <div>
              <p className="text-sm font-medium text-white">
                {post.meta.profile.name}
              </p>
              <div className="flex space-x-3 mt-1">
                {post.meta.profile.github && (
                  <a
                    href={post.meta.profile.github}
                    className="text-gray-400 hover:text-indigo-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">GitHub</span>
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}
                {post.meta.profile.twitter && (
                  <a
                    href={post.meta.profile.twitter}
                    className="text-gray-400 hover:text-indigo-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                )}
                {post.meta.profile.linkedin && (
                  <a
                    href={post.meta.profile.linkedin}
                    className="text-gray-400 hover:text-indigo-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
                {post.meta.profile.website && (
                  <a
                    href={post.meta.profile.website}
                    className="text-gray-400 hover:text-indigo-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">Website</span>
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <hr className="border-gray-800 my-6" />
      </header>

      {/* Article content */}
      <article className="prose prose-invert prose-indigo max-w-none prose-headings:text-white prose-a:text-indigo-400 prose-code:bg-gray-800 prose-code:text-indigo-300 prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700">
        <div dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
      </article>
    </div>
  );
}
