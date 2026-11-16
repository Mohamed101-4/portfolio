import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { profile } from "@/content/site";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const description =
  "Mohamed Ali — Computer Science and Engineering at Ohio State. Backend systems at Visa, distributed LLM inference, autonomous software agents.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: "Mohamed Ali — Software Engineer", template: "%s — Mohamed Ali" },
  description,
  keywords: ["Mohamed Ali", "software engineer", "Ohio State", "Visa", "LLM inference", "distributed systems", "portfolio"],
  authors: [{ name: profile.name }],
  openGraph: {
    title: "Mohamed Ali — Software Engineer",
    description,
    type: "website",
    images: [{ url: profile.photo, width: 1200, height: 1200, alt: profile.name }],
  },
  twitter: { card: "summary", title: "Mohamed Ali — Software Engineer", description },
};

export const viewport: Viewport = { themeColor: "#f2eee6" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    alumniOf: profile.school,
    sameAs: [profile.links.linkedin, profile.links.github],
  };
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
