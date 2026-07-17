import { NextResponse } from 'next/server';
import { getJobs, getCategories } from '@/lib/db';
import { BASE_URL } from '@/lib/seo';

export async function GET() {
  const [jobs, categories] = await Promise.all([
    getJobs(),
    getCategories()
  ]);

  const locales = ['en', 'hi', 'mr'];

  const staticRoutes = [
    '',
    '/jobs',
    '/admit-card',
    '/results',
    '/answer-key',
    '/syllabus',
    '/tools',
    '/admission',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/careers',
    '/press',
  ];
  
  const specialSlugs = ['results', 'admit-card', 'answer-key', 'syllabus', 'admission'];

  // Helper to generate the exact XML <url> block for a given route and locale
  const generateUrlBlock = (locale: string, route: string, lastMod: string, changeFreq: string, priority: string) => {
    // Generate alternate links for all locales
    const alternates = locales.map(altLocale => {
      return `<xhtml:link rel="alternate" hreflang="${altLocale}" href="${BASE_URL}/${altLocale}${route}" />`;
    }).join('\n    ');
    
    // Add x-default pointing to English
    const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/en${route}" />`;

    return `
  <url>
    <loc>${BASE_URL}/${locale}${route}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
    ${alternates}
    ${xDefault}
  </url>`;
  };

  let xmlUrls = '';

  // 1. Static Routes
  for (const locale of locales) {
    for (const route of staticRoutes) {
      const lastMod = new Date().toISOString();
      const changeFreq = route === '' ? 'hourly' : 'daily';
      const priority = route === '' ? '1.0' : '0.8';
      xmlUrls += generateUrlBlock(locale, route, lastMod, changeFreq, priority);
    }
  }

  // 2. Job Routes
  const liveJobs = jobs.filter(j => j.isLive);
  for (const locale of locales) {
    for (const job of liveJobs) {
      const route = `/jobs/${job.slug}`;
      const lastMod = new Date(job.updated_at || job.created_at || new Date()).toISOString();
      xmlUrls += generateUrlBlock(locale, route, lastMod, 'daily', '0.8');
    }
  }

  // 3. Category Routes
  for (const locale of locales) {
    for (const cat of categories) {
      const route = specialSlugs.includes(cat.slug) ? `/${cat.slug}` : `/category/${cat.slug}`;
      const lastMod = new Date().toISOString();
      xmlUrls += generateUrlBlock(locale, route, lastMod, 'weekly', '0.6');
    }
  }

  // Wrap in valid sitemap XML tags with proper namespaces
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlUrls}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
