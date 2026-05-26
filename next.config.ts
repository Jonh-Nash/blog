import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/blog",
  assetPrefix: "/blog/",
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
