import type { Metadata } from "next";

import { siteMetadata } from "../lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={siteMetadata.language}>
      <body>{children}</body>
    </html>
  );
}
