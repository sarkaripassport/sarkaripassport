import { MetadataRoute } from 'next'
import { getJobs, getCategories } from '@/lib/db'
import { BASE_URL } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [jobs, categories] = await Promise.all([
    getJobs(),
    getCategories()
  ]);

  // Helper to generate alternates for a specific path
  const getAlternates = (path: string) => ({
    languages: {
      'en': `${BASE_URL}/en${path}`,
      'hi': `${BASE_URL}/hi${path}`,
      'mr': `${BASE_URL}/mr${path}`,
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

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.map(route => ({
    url: `${BASE_URL}/en${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'hourly' : 'daily',
    priority: route === '' ? 1 : 0.8,
    alternates: getAlternates(route)
  }));

  const jobUrls: MetadataRoute.Sitemap = jobs.filter(j => j.isLive).map(job => ({
    url: `${BASE_URL}/en/jobs/${job.slug}`,
    lastModified: new Date(job.updated_at || job.created_at || new Date()),
    changeFrequency: 'daily',
    priority: 0.8,
    alternates: getAlternates(`/jobs/${job.slug}`)
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${BASE_URL}/en/jobs?cat=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
    // Note: Query parameters aren't explicitly mapped in hreflang usually, but we do it here safely.
    alternates: getAlternates(`/jobs?cat=${cat.slug}`)
  }));

  return [
    ...staticUrls,
    ...jobUrls,
    ...categoryUrls,
  ]
}
