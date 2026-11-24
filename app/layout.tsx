import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { PwaRegister } from '@/components/PwaRegister';
import { PrototypeProvider } from '@/lib/prototype-store';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://home-rendezvous26.vercel.app';
const siteName = 'Rendezvous 26';
const siteDescription =
  'The official web app for Rendezvous 26 — Jamia Madeenathunoor Life Festival. Schedule, scores, live events and Glocal Points.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    'Rendezvous 26',
    'Rendezvous',
    'Jamia Madeenathunoor',
    'Life Festival',
    'festival schedule',
    'live events',
    'Glocal Points',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  category: 'events',
  alternates: { canonical: '/' },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: '/rendezvous-logo.png',
        width: 1024,
        height: 1024,
        alt: 'Rendezvous 26 logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: ['/rendezvous-logo.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteName,
  },
  icons: {
    icon: [{ url: '/rendezvous-logo.png', type: 'image/png', sizes: 'any' }],
    apple: [{ url: '/icon-192x192.png', type: 'image/png', sizes: '192x192' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#064e24',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <PwaRegister />
        <PrototypeProvider>{children}</PrototypeProvider>
      </body>
    </html>
  );
}
