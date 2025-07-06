import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://Jonh-Nash.github.io",
  base: "/",
  content: {
    dir: "content",
  },
  output: "static",
  integrations: [sitemap()],
});
