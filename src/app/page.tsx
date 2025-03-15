import Link from "next/link";
import {
  getSingleMarkdown,
  getAllMarkdownInDir,
  getSummary,
} from "@/lib/mdUtils";

export default function Home() {
  const resume = getSingleMarkdown("resume.md");
  const skillmap = getSingleMarkdown("skillmap.md");
  const essayPosts = getAllMarkdownInDir("essay");
  const aiNewsPosts = getAllMarkdownInDir("ai-news");

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          <span className="text-indigo-400">福島のブログ</span>へようこそ
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400">
          Machine learning insights, software engineering experiments, and
          technical essays on AI advancement.
        </p>
      </div>

      {/* 経歴 - カードなし */}
      <section className="border-b border-gray-800 pb-8">
        <div className="flex items-center mb-4">
          <svg
            className="h-6 w-6 text-indigo-400 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-white">経歴</h2>
        </div>
        <p className="text-gray-400 mb-4">{getSummary(resume.content, 200)}</p>
        <Link
          href="/resume"
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition duration-150"
        >
          詳しく見る
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </section>

      {/* スキルマップ - カードなし */}
      <section className="border-b border-gray-800 pb-8">
        <div className="flex items-center mb-4">
          <svg
            className="h-6 w-6 text-indigo-400 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-white">スキルマップ</h2>
        </div>
        <p className="text-gray-400 mb-4">
          {getSummary(skillmap.content, 200)}
        </p>
        <Link
          href="/skillmap"
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition duration-150"
        >
          詳しく見る
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </section>

      {/* Essays */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-white mr-4">Essays</h2>
            <div className="flex-grow h-px bg-gray-800 w-16"></div>
          </div>
          <Link
            href="/essay"
            className="text-indigo-400 hover:text-indigo-300 transition duration-150 text-sm flex items-center"
          >
            すべてのエッセイを見る
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {essayPosts.slice(0, 4).map((post) => (
            <Link
              key={post.slug}
              href={`/essay/${post.slug}`}
              className="block group"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-indigo-900 text-indigo-300">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="ml-3 text-xl font-semibold text-white group-hover:text-indigo-400 transition duration-150">
                      {post.meta.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-gray-400">
                    {getSummary(post.content, 100)}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <time dateTime={post.meta.date}>{post.meta.date}</time>
                    <div className="mx-1">&middot;</div>
                    <div className="flex space-x-1">
                      {post.meta.tags &&
                        post.meta.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-indigo-300"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {essayPosts.length > 4 && (
          <div className="mt-6 text-center">
            <Link
              href="/essay"
              className="inline-flex items-center px-4 py-2 border border-indigo-500 text-sm font-medium rounded-md text-indigo-400 bg-gray-900 hover:bg-gray-800 transition duration-150"
            >
              エッセイをもっと見る
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* AI News */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-white mr-4">AI News</h2>
            <div className="flex-grow h-px bg-gray-800 w-16"></div>
          </div>
          <Link
            href="/ai-news"
            className="text-indigo-400 hover:text-indigo-300 transition duration-150 text-sm flex items-center"
          >
            すべてのAIニュースを見る
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiNewsPosts.slice(0, 4).map((post) => (
            <Link
              key={post.slug}
              href={`/ai-news/${post.slug}`}
              className="block group"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-indigo-900 text-indigo-300">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="ml-3 text-xl font-semibold text-white group-hover:text-indigo-400 transition duration-150">
                      {post.meta.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-gray-400">
                    {getSummary(post.content, 100)}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <time dateTime={post.meta.date}>{post.meta.date}</time>
                    <div className="mx-1">&middot;</div>
                    <div className="flex space-x-1">
                      {post.meta.tags &&
                        post.meta.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-indigo-300"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {aiNewsPosts.length > 4 && (
          <div className="mt-6 text-center">
            <Link
              href="/ai-news"
              className="inline-flex items-center px-4 py-2 border border-indigo-500 text-sm font-medium rounded-md text-indigo-400 bg-gray-900 hover:bg-gray-800 transition duration-150"
            >
              AIニュースをもっと見る
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
