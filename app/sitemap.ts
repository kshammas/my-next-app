import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://home-rendezvous26.vercel.app';

const routes: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/welcome', priority: 0.9 },
  { path: '/login', priority: 0.8 },
  { path: '/home', priority: 0.9 },
  { path: '/results', priority: 0.8 },
  { path: '/schedule', priority: 0.8 },
  { path: '/live', priority: 0.8 },
  { path: '/map', priority: 0.7 },
  { path: '/store', priority: 0.7 },
  { path: '/wallet', priority: 0.7 },
  { path: '/points', priority: 0.6 },
  { path: '/programs', priority: 0.6 },
  { path: '/notifications', priority: 0.5 },
  { path: '/profile', priority: 0.5 },
  { path: '/support', priority: 0.5 },
];

// Fixed to the last content update so the sitemap stays prerenderable.
const lastModified = new Date('2026-11-24T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority,
  }));
}
