import { MetadataRoute } from 'next'
import { getJobs, getCategories } from '@/lib/db'
import { BASE_URL } from '@/lib/seo'

// Cache the sitemap using ISR (revalidates every hour) for blazing fast TTFB
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [jobs, categories] = await Promise.all([
    getJobs(),
    getCategories()
  ]);

  const locales = ['en', 'hi', 'mr'];

  const getAlternates = (path: string) => ({
    languages: {
      'en': `${BASE_URL}/en${path}`,
      'hi': `${BASE_URL}/hi${path}`,
      'mr': `${BASE_URL}/mr${path}`,
      'x-default': `${BASE_URL}/en${path}`,
    }
  });

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

  // Generate for all locales so Google indexes every language properly
  const staticUrls: MetadataRoute.Sitemap = locales.flatMap(locale => 
    staticRoutes.map(route => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'hourly' : 'daily',
      priority: route === '' ? 1 : 0.8,
      alternates: getAlternates(route)
    }))
  );

  const jobUrls: MetadataRoute.Sitemap = locales.flatMap(locale => 
    jobs.filter(j => j.isLive).map(job => ({
      url: `${BASE_URL}/${locale}/jobs/${job.slug}`,
      lastModified: new Date(job.updated_at || job.created_at || new Date()),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: getAlternates(`/jobs/${job.slug}`)
    }))
  );

  const specialSlugs = ['results', 'admit-card', 'answer-key', 'syllabus', 'admission'];

  const categoryUrls: MetadataRoute.Sitemap = locales.flatMap(locale => 
    categories.map(cat => {
      const route = specialSlugs.includes(cat.slug) ? `/${cat.slug}` : `/category/${cat.slug}`;
      return {
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: getAlternates(route)
      };
    })
  );

  return [
    ...staticUrls,
    ...jobUrls,
    ...categoryUrls,
  ]
}
