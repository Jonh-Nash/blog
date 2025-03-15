import { getAllMarkdownInDir, getSummary } from "../../lib/mdUtils";
import Link from "next/link";

export default function AiNewsPage() {
  const aiNewsPosts = getAllMarkdownInDir("ai-news");

  return (
    <div className="max-w-4xl mx-auto">
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
          <li>
            <span className="text-gray-300">AI News</span>
          </li>
        </ol>
      </nav>

      <header className="mb-10">
        <div className="flex items-center mb-4">
          <svg
            className="h-8 w-8 text-indigo-400 mr-3"
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
          <h1 className="text-3xl font-bold text-white">AI News</h1>
        </div>
        <p className="text-gray-400 max-w-3xl">
          最新の人工知能に関するニュース、研究論文、および業界の動向についての分析。常に最先端の技術動向をキャッチアップ。
        </p>
      </header>

      {/* News List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiNewsPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/ai-news/${post.slug}`}
            className="block group"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition duration-300">
              <div className="p-6">
                <div className="flex items-center mb-3">
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
                  {getSummary(post.content, 120)}
                </p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <time dateTime={post.meta.date}>
                    {new Date(post.meta.date).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  {post.meta.tags && post.meta.tags.length > 0 && (
                    <>
                      <div className="mx-1">&middot;</div>
                      <div className="flex space-x-1">
                        {post.meta.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-indigo-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.meta.tags.length > 2 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-indigo-300">
                            +{post.meta.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {aiNewsPosts.length === 0 && (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-12 w-12 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="mt-2 text-xl font-medium text-gray-300">
            AIニュースはまだありません
          </h3>
          <p className="mt-1 text-gray-500">
            新しいAIニュースは近日中に追加されます。
          </p>
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-indigo-500 text-sm font-medium rounded-md text-indigo-400 bg-gray-900 hover:bg-gray-800 transition duration-150"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
