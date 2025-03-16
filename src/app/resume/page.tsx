import { getSingleMarkdown } from "../../lib/mdUtils";
import { marked } from "marked";
import Link from "next/link";

export default function ResumePage() {
  const resume = getSingleMarkdown("resume.md");

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
          <li>
            <span className="text-gray-300">Resume</span>
          </li>
        </ol>
      </nav>

      <header className="mb-6">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h1 className="text-3xl font-bold text-white">
            {resume.meta.title || "Resume"}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {resume.meta.tags &&
            resume.meta.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-300"
              >
                {tag}
              </span>
            ))}
        </div>

        <hr className="border-gray-800 my-6" />
      </header>

      <article className="prose prose-invert prose-indigo max-w-none prose-headings:text-white prose-a:text-indigo-400 prose-code:bg-gray-800 prose-code:text-indigo-300 prose-strong:text-indigo-300">
        <div dangerouslySetInnerHTML={{ __html: marked(resume.content) }} />
      </article>

      <div className="text-center mt-12 pt-6 border-t border-gray-800">
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
