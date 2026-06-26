import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Example 301 redirect for old URLs
      {
        source: '/old-jobs-page',
        destination: '/jobs',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
