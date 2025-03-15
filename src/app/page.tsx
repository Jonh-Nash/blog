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
    <main className="p-4">
      <h1 className="text-3xl font-bold">Home</h1>

      {/* 経歴 */}
      <section className="mt-6">
        <h2 className="text-2xl font-semibold">経歴</h2>
        <p>{getSummary(resume.content, 80)}</p>
        <Link href="./resume.html" className="text-blue-500">
          詳しく見る
        </Link>
      </section>

      {/* スキルマップ */}
      <section className="mt-6">
        <h2 className="text-2xl font-semibold">スキルマップ</h2>
        <p>{getSummary(skillmap.content, 80)}</p>
        <Link href="./skillmap.html" className="text-blue-500">
          詳しく見る
        </Link>
      </section>

      {/* エッセイ */}
      <section className="mt-6">
        <h2 className="text-2xl font-semibold">Essay</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {essayPosts.map((post) => (
            <Link
              key={post.slug}
              href={`./essay/${post.slug}.html`}
              className="block p-4 border rounded-md"
            >
              <h3 className="text-xl font-medium">{post.meta.title}</h3>
              <p>{getSummary(post.content, 60)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* AIニュース */}
      <section className="mt-6">
        <h2 className="text-2xl font-semibold">AI News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiNewsPosts.map((post) => (
            <Link
              key={post.slug}
              href={`./ai-news/${post.slug}.html`}
              className="block p-4 border rounded-md"
            >
              <h3 className="text-xl font-medium">{post.meta.title}</h3>
              <p>{getSummary(post.content, 60)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
