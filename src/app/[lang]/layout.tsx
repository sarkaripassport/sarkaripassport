import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BreakingNews from "@/components/layout/BreakingNews";
import { getSettings } from "@/lib/db";
import Script from "next/script";
import ClientSetup from "@/components/ClientSetup";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const settings = await getSettings();
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  
  const title = (settings.seo.title as any)[lang] || settings.seo.title.en;
  const description = (settings.seo.description as any)[lang] || settings.seo.description.en;

  return {
    metadataBase: new URL('https://govjobwala.com'),
    title: {
      default: title,
      template: '%s | GovJobWala'
    },
    description: description,
    keywords: (settings.seo.keywords as any)[lang] || settings.seo.keywords.en,
    verification: {
      google: settings.seo.gscVerification || undefined,
    },
    openGraph: {
      title: title,
      description: description,
      url: 'https://govjobwala.com',
      siteName: 'GovJobWala',
      locale: `${lang}_IN`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: title,
      description: description,
    },
    formatDetection: {
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'GovJobWala',
    },
    icons: {
      icon: '/icon-192x192.png',
      apple: '/icon-192x192.png',
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
      <head>
      </head>
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
        <ClientSetup />
        <Footer lang={resolvedParams.lang || 'en'} />
        
        {/* Google Analytics */}
        {settings.analytics?.ga_id && (
          <Script 
            id="google-analytics" 
            strategy="lazyOnload" 
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.analytics.ga_id}`} 
          />
        )}
        {settings.analytics?.ga_id && (
          <Script id="ga-setup" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.analytics.ga_id}');
            `}
          </Script>
        )}
        
        {/* Google Tag Manager */}
        {settings.analytics?.gtm_id && (
          <Script id="google-tag-manager" strategy="lazyOnload">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${settings.analytics.gtm_id}');
            `}
          </Script>
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
