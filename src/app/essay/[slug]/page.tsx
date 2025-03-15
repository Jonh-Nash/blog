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
      <h1 className="text-3xl font-bold">{post.meta.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
    </main>
  );
}
