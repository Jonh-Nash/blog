import { getSingleMarkdown } from "../../lib/mdUtils";
import { marked } from "marked";

export default function ResumePage() {
  const resume = getSingleMarkdown("resume.md");

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold">{resume.meta.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: marked(resume.content) }} />
    </main>
  );
}
