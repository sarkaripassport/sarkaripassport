import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BreakingNews from "@/components/layout/BreakingNews";
import { getSettings } from "@/lib/db";
import Script from "next/script";
import PartytownLoader from "@/components/PartytownLoader";
import ClientSetup from "@/components/ClientSetup";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  adjustFontFallback: true,
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
      icon: '/logo.svg',
      apple: '/logo.svg',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://moxkepugwmwleryhhhsv.supabase.co';

  return (
    <html
      lang={resolvedParams.lang || "en"}
      className={`${inter.variable} h-full antialiased bg-brand-light text-brand-navy`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href={supabaseUrl} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={supabaseUrl} />
        <PartytownLoader />
        <Script
          id="peba-interceptor"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;

                const userAgent = navigator.userAgent || '';
                const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse|chrome-lighthouse/i.test(userAgent);

                // If it's Googlebot or another crawler, bypass optimization to ensure 100% standard rendering and GSC indexing
                if (isBot) {
                  return;
                }

                const deferredScripts = [];
                let pageLoaded = false;

                // 1. Monkey-patch createElement to intercept dynamically generated elements
                const originalCreateElement = document.createElement;
                document.createElement = function(tagName, options) {
                  const element = originalCreateElement.call(document, tagName, options);
                  if (tagName && tagName.toLowerCase() === 'script') {
                    Object.defineProperty(element, 'src', {
                      set: function(url) {
                        if (url && url.includes('/peba/')) {
                          deferredScripts.push({
                            src: url,
                            async: element.async !== false,
                            defer: element.defer || false,
                            crossOrigin: element.crossOrigin || null
                          });
                        } else {
                          this.setAttribute('src', url);
                        }
                      },
                      get: function() {
                        return this.getAttribute('src');
                      },
                      configurable: true
                    });
                  }
                  return element;
                };

                // 2. Ultra-lightweight MutationObserver to catch parser-inserted root tags (no subtree: true)
                const observer = new MutationObserver((mutations) => {
                  for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                      if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                        const src = node.getAttribute('src');
                        if (src && src.includes('/peba/')) {
                          node.parentNode.removeChild(node);
                          deferredScripts.push({
                            src: src,
                            async: node.async !== false,
                            defer: node.defer || false,
                            crossOrigin: node.crossOrigin || null
                          });
                        }
                      }
                    }
                  }
                });

                // Observe only the head childList (extremely fast, no subtree overhead)
                if (document.head) {
                  observer.observe(document.head, { childList: true });
                }

                // Observe the body childList once DOMContentLoaded is triggered
                document.addEventListener('DOMContentLoaded', () => {
                  if (document.body) {
                    observer.observe(document.body, { childList: true });
                  }
                });

                // 3. Defer loading of all intercepted scripts until user interaction
                const loadDeferred = () => {
                  if (pageLoaded) return;
                  pageLoaded = true;
                  cleanupListeners();
                  observer.disconnect();
                  deferredScripts.forEach((scriptData) => {
                    const script = originalCreateElement.call(document, 'script');
                    script.src = scriptData.src;
                    script.type = 'text/partytown'; // Delegate to Web Worker!
                    script.async = scriptData.async;
                    script.defer = scriptData.defer;
                    if (scriptData.crossOrigin) script.crossOrigin = scriptData.crossOrigin;
                    document.head.appendChild(script);
                  });
                };

                const cleanupListeners = () => {
                  window.removeEventListener('mousemove', loadDeferred);
                  window.removeEventListener('scroll', loadDeferred);
                  window.removeEventListener('touchstart', loadDeferred);
                  window.removeEventListener('keydown', loadDeferred);
                };

                window.addEventListener('load', () => {
                  // Trigger loading on mouse move, scroll, touch start, or key down
                  window.addEventListener('mousemove', loadDeferred, { passive: true });
                  window.addEventListener('scroll', loadDeferred, { passive: true });
                  window.addEventListener('touchstart', loadDeferred, { passive: true });
                  window.addEventListener('keydown', loadDeferred, { passive: true });

                  // Fallback load after 6 seconds for human users who just wait
                  setTimeout(loadDeferred, 6000);
                });
              })();
            `
          }}
        />
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
        <ClientSetup adsenseId={settings.analytics?.adsense_id} gaId={settings.analytics?.ga_id} />
        <Footer lang={resolvedParams.lang || 'en'} />
      </body>
    </html>
  );
}
