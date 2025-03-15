import { getSingleMarkdown } from "../../lib/mdUtils";
import { marked } from "marked";

export default function SkillmapPage() {
  const skillmap = getSingleMarkdown("skillmap.md");

  return (
    <main className="p-4">
      <div dangerouslySetInnerHTML={{ __html: marked(skillmap.content) }} />
    </main>
  );
}
