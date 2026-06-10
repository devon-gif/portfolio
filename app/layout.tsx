import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/AppChrome";
import { JsonLd } from "@/components/marketing/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
} from "@/lib/seo";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "hotel social media management",
    "hospitality creative support",
    "hotel video marketing",
    "restaurant social media content",
    "spa marketing creative",
    "event venue promotion",
  ],
  authors: [{ name: "Devon Archer" }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="h-full bg-zinc-950 text-zinc-100 antialiased">
        <JsonLd data={organizationJsonLd()} />
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
