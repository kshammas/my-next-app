import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rendezvous 26',
    short_name: 'Rendezvous',
    description: 'Jamia Madeenathunoor Life Festival — schedule, scores, live events and Glocal Points.',
    start_url: '/home',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f4f8f6',
    theme_color: '#064e24',
    categories: ['entertainment', 'events', 'lifestyle'],
    // Chromium needs real 192x192 and 512x512 files; both are resized copies of
    // public/rendezvous-logo.png, so the installed app uses the same logo artwork.
    icons: [
      { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/rendezvous-logo.png', sizes: '1024x1024', type: 'image/png' },
    ],
  };
}
