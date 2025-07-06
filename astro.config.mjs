import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://Jonh-Nash.github.io",
  base: "/",
  content: {
    dir: "content",
  },
  output: "static",
});
