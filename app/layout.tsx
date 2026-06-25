import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = "https://openusage.dev";
const title =
  "OpenUsage - AI Limits Tracker for Cursor, Claude Code, Codex and more";
const description =
  "Never hit your AI limits by surprise. See every AI coding subscription in your menu bar. Track Claude Code, Codex, Cursor, Devin and Grok. Free and open source for macOS.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · OpenUsage",
  },
  description,
  applicationName: "OpenUsage",
  keywords: [
    "AI usage tracker",
    "AI limits",
    "Claude Code usage",
    "Codex usage",
    "Cursor usage",
    "token tracking",
    "macOS menu bar app",
    "open source",
  ],
  authors: [{ name: "Robin Ebers", url: "https://itsbyrob.in" }],
  creator: "Robin Ebers",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    siteName: "OpenUsage",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@robinebers",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OpenUsage",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS 14+",
  description,
  url: siteUrl,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Robin Ebers", url: "https://itsbyrob.in" },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
