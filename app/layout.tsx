import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Parser",
  description: "AI Parser is a powerful tool to extract structured data and insights from unstructured text using advanced AI models.",
  keywords: ["AI", "Parser", "Text Analysis", "Data Extraction", "Natural Language Processing"],
  authors: [{ name: "Astro", url: "https://danmollel.space" }],
  openGraph: {
    title: "AI Parser - Extract Intelligence from Text",
    description: "Extract structured data and insights from unstructured text using AI Parser.",
    url: "https://danmollel.space",
    siteName: "AI Parser",
    images: [
      {
        url: "https://byiy0cu7m2.ufs.sh/f/Luc8xnAhTG7INjjx6QhlwjF13QBzmD9ZcIPMbxeOf5tnqH2r",
        width: 1200,
        height: 630,
        alt: "AI Parser Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Parser - Extract Intelligence from Text",
    description: "Extract structured data and insights from unstructured text using AI Parser.",
    images: ["https://byiy0cu7m2.ufs.sh/f/Luc8xnAhTG7INjjx6QhlwjF13QBzmD9ZcIPMbxeOf5tnqH2r"],
    creator: "@uiastro",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
