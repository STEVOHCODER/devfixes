import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://devfixes.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DevFixes - Fix programming errors faster",
    template: "%s | DevFixes",
  },
  description:
    "Search programming errors, identify root causes, and get probability-ranked fixes with AI-assisted debugging.",
  applicationName: "DevFixes",
  keywords: [
    "programming errors",
    "debugging",
    "error messages",
    "stack trace",
    "developer tools",
  ],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "DevFixes",
    title: "Fix programming errors faster",
    description:
      "Paste an error or stack trace. Find the root cause and the most likely fix.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFixes",
    description: "Errors in. Answers out.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#080b0e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <body suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT ? (
          <Script
            id="devfixes-adsense"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
          />
        ) : null}
        <div className="ambient-grid" aria-hidden="true" />
        <SiteHeader />
        <main className="min-h-[calc(100vh-68px)]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
