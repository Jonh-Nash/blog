import { getAllMarkdownInDir } from "@/lib/mdUtils";
import { marked } from "marked";

interface EssayPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  const posts = getAllMarkdownInDir("essay");
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function EssayPage({ params }: EssayPageProps) {
  const posts = getAllMarkdownInDir("essay");
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) return <div>記事が見つかりません</div>;

  return (
    <main className="p-4">
      <article className="prose prose-invert prose-indigo max-w-none prose-headings:text-white prose-a:text-indigo-400 prose-code:bg-gray-800 prose-code:text-indigo-300 prose-strong:text-indigo-300">
        <h1 className="text-3xl font-bold">{post.meta.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
      </article>
    </main>
  );
}
