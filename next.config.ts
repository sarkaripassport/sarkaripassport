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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
