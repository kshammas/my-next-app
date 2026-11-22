import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { PwaRegister } from '@/components/PwaRegister';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Rendezvous 26',
    template: '%s · Rendezvous 26',
  },
  description:
    'The official web app for Rendezvous 26 — Jamia Madeenathunoor Life Festival. Schedule, scores, live events and Glocal Points.',
  applicationName: 'Rendezvous 26',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rendezvous 26',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
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
        {children}
      </body>
    </html>
  );
}
