import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navigation } from "@/shared/components/navigation";
import {Footer} from "@/shared/components/footer";

export const metadata: Metadata = {
  title: "VoteCrypt",
  description: "Created with VoteCrypt",
  generator: "VoteCrypt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Skip link visible to keyboard users */}
        <a href="#maincontent" className="sr-only">Skip to main content</a>

        <Navigation />

        {/* Main landmark for screen readers and skip-to-main target */}
        <main id="maincontent" tabIndex={-1}>
          {children}
        </main>

        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
