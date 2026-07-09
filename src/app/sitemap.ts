import { MetadataRoute } from 'next'
import { getJobs, getCategories } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://govjobwala.com'

  const [jobs, categories] = await Promise.all([
    getJobs(),
    getCategories()
  ]);

  const jobUrls = jobs.filter(j => j.isLive).map(job => ({
    url: `${baseUrl}/jobs/${job.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const categoryUrls = categories.map(cat => ({
    url: `${baseUrl}/jobs?cat=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...jobUrls,
    ...categoryUrls,
  ]
}
