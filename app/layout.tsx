import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const title =
  "OpenUsage - AI Limits Tracker for Cursor, Claude Code, Codex and more";
const description =
  "Never hit your AI limits by surprise. See every AI coding subscription in your menu bar. Track Claude Code, Codex, Cursor, Devin and Grok. Free and open source for macOS.";

export const metadata: Metadata = {
  metadataBase: new URL("https://openusage.dev"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://openusage.dev",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
