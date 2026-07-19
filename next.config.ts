import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:lang/category/results',
        destination: '/:lang/results',
        permanent: true,
      },
      {
        source: '/:lang/category/admit-card',
        destination: '/:lang/admit-card',
        permanent: true,
      },
      {
        source: '/:lang/category/answer-key',
        destination: '/:lang/answer-key',
        permanent: true,
      },
      {
        source: '/:lang/category/syllabus',
        destination: '/:lang/syllabus',
        permanent: true,
      },
      {
        source: '/:lang/category/admission',
        destination: '/:lang/admission',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.html',
        destination: '/en/sitemap',
      }
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://firebase.googleapis.com https://apis.google.com https://*.firebaseio.com https://www.gstatic.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.firebaseio.com wss://*.firebaseio.com https://firebase.googleapis.com https://firebaseinstallations.googleapis.com https://fcmregistrations.googleapis.com https://www.google-analytics.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://cloudflareinsights.com; frame-src 'self' https://www.youtube.com https://youtube.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net; media-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self';`
          }
        ],
      },
    ];
  },
  experimental: {
    optimizeCss: true,
    nextScriptWorkers: true,
  },
};

export default nextConfig;
