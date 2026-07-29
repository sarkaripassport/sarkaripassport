import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/og'],
      disallow: ['/admin/', '/admin', '/api/auth/'],
    },
    sitemap: 'https://govjobwala.com/sitemap.xml',
  }
}
