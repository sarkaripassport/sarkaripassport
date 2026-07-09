import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BreakingNews from "@/components/layout/BreakingNews";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

import { getSettings } from "@/lib/db";
import Script from "next/script";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const settings = await getSettings();
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  
  return {
    metadataBase: new URL('https://govjobwala.com'),
    title: {
      default: (settings.seo.title as any)[lang] || settings.seo.title.en,
      template: '%s | GovJobWala'
    },
    description: (settings.seo.description as any)[lang] || settings.seo.description.en,
    keywords: (settings.seo.keywords as any)[lang] || settings.seo.keywords.en,
    verification: {
      google: settings.seo.gscVerification || undefined,
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en': '/en',
        'hi': '/hi',
        'mr': '/mr'
      }
    }
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  const settings = await getSettings();
  
  // Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GovJobWala",
    "url": "https://govjobwala.com",
    "logo": "https://govjobwala.com/logo.svg",
    "sameAs": [
      "https://facebook.com/govjobwala",
      "https://twitter.com/govjobwala",
      "https://linkedin.com/company/govjobwala"
    ]
  };

  return (
    <html
      lang={resolvedParams.lang || "en"}
      className={`${inter.variable} h-full antialiased bg-brand-light text-brand-navy`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Navbar lang={resolvedParams.lang || 'en'} />
        <BreakingNews lang={resolvedParams.lang as 'en' | 'hi' | 'mr'} />
        <main className="flex-grow flex flex-col pb-16 md:pb-0">{children}</main>
        <WhatsAppFloat />
        <Footer />
        
        {/* Google Analytics */}
        {settings.analytics?.ga_id && (
          <GoogleAnalytics gaId={settings.analytics.ga_id} />
        )}
        
        {/* Google Tag Manager */}
        {settings.analytics?.gtm_id && (
          <GoogleTagManager gtmId={settings.analytics.gtm_id} />
        )}
        
        {/* Google AdSense */}
        {settings.analytics?.adsense_id && (
          <Script
            id="adsbygoogle-init"
            strategy="lazyOnload"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.analytics.adsense_id}`}
          />
        )}
      </body>
    </html>
  );
}
