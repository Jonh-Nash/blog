import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://TODO_USERNAME.github.io",
  base: "/",
  content: {
    dir: "content",
  },
  output: "static",
});
