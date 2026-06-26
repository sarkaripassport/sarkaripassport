import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { getSettings } from "@/lib/db";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  return {
    metadataBase: new URL('https://naukripassport.com'),
    title: {
      default: settings.seo.title,
      template: '%s | Naukri Passport'
    },
    description: settings.seo.description,
    keywords: settings.seo.keywords,
    verification: {
      google: settings.seo.gscVerification || undefined,
    },
    alternates: {
      canonical: '/',
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Naukri Passport",
    "url": "https://naukripassport.com",
    "logo": "https://naukripassport.com/logo.png",
    "sameAs": [
      "https://facebook.com/naukripassport",
      "https://twitter.com/naukripassport",
      "https://linkedin.com/company/naukripassport"
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased bg-brand-light text-brand-navy`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
