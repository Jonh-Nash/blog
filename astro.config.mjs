import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://TODO_USERNAME.github.io/TODO_REPO",
  base: "/TODO_REPO/",
  content: {
    dir: "content",
  },
  output: "static",
});
