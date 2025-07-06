import { z, defineCollection } from "astro:content";

const news = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
    pubDate: z.coerce.date().optional(),
  }),
});

export const collections = { news };
