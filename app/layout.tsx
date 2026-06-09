import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/AppChrome";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotel Pipeline OS",
  description: "Approval-based outreach CRM for hospitality creative services.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="h-full bg-zinc-950 text-zinc-100 antialiased">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
