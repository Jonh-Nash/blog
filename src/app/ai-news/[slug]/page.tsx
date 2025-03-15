import { getAllMarkdownInDir } from "@/lib/mdUtils";
import { marked } from "marked";

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

  if (!post) return <div>記事が見つかりません</div>;

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold">{post.meta.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
    </main>
  );
}
