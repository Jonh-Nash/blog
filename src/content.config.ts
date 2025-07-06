import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const news = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./content/news" }),
  schema: z.object({
    title: z.string().optional(),
    pubDate: z.coerce.date().optional(),
  }),
});

export const collections = { news };
