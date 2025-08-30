import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navigation from "@/shared/components/navigation";

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
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
