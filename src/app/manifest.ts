import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GovJobWala',
    short_name: 'GovJob',
    description: "India's Trusted Government Job Portal",
    start_url: '/',
    display: 'standalone', // Hides the browser address bar
    background_color: '#F4F7FA',
    theme_color: '#0B1B3D',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
