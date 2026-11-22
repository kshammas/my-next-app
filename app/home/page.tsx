'use client';

import Link from 'next/link';
import {
  Bell,
  CalendarDays,
  LifeBuoy,
  Map,
  Radio,
  Trophy,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { AppShell } from '@/components/AppShell';

const tiles: { label: string; href: string; icon: ReactNode; badge?: string }[] = [
  { label: 'Map', href: '/map', icon: <Map className="h-7 w-7 text-[#3F4B55]" /> },
  {
    label: 'Live',
    href: '/live',
    icon: <Radio className="h-7 w-7 text-[#3F4B55]" />,
    badge: '(0)',
  },
  {
    label: 'Schedule',
    href: '/schedule',
    icon: <CalendarDays className="h-7 w-7 text-[#3F4B55]" />,
  },
  { label: 'Result', href: '/results', icon: <Trophy className="h-7 w-7 text-[#3F4B55]" /> },
  { label: 'Support', href: '/support', icon: <LifeBuoy className="h-7 w-7 text-[#3F4B55]" /> },
  { label: 'Notification', href: '/notifications', icon: <Bell className="h-7 w-7 text-[#3F4B55]" /> },
];

export default function HomePage() {
  return (
    <AppShell>
      <div className="min-h-full bg-[#F6F8F5] pb-8">
        <header className="px-5 pb-9 pt-14">
          <h1 className="text-[27px] font-black uppercase leading-none tracking-tight text-[#000000]">
            Rendezvous 26
          </h1>
          <p className="mt-0.5 text-[8.5px] font-bold tracking-[0.06em] text-[#3A443E]">
            JAMIA MADEENATHUNOOR LIFE FESTIVAL
          </p>
        </header>

        <section className="mx-4 rounded-[20px] bg-[#113E29] px-4 py-3 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold tracking-wide text-[#A1C8B3]">
                GUEST ACCOUNT
              </p>
              <p className="mt-1 text-[11px] text-[#A1C8B3]/80">Limited Access Mode</p>
            </div>
            <Link
              href="/welcome"
              className="flex min-h-[38px] shrink-0 items-center justify-center rounded-full bg-[#2E4E41] px-5 text-[12px] font-bold text-white"
            >
              Sign In
            </Link>
          </div>
        </section>

        <section className="relative mx-4 mt-3 h-[120px] overflow-hidden rounded-[20px] bg-[#00130D] px-5 pb-3 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(105,170,110,0.28),transparent_52%)]" />
          <div className="absolute -left-8 top-6 h-28 w-28 rounded-full border border-white/10" />
          <div className="absolute -bottom-16 right-10 h-40 w-40 rounded-full border border-white/10" />
          <div className="relative flex h-full flex-col justify-end">
            <p className="text-[15px] font-extrabold">Earn Glocal Points</p>
            <p className="mt-1 text-[11px] text-white/70">
              Participate and claim your rewards
            </p>
          </div>
        </section>

        <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
          {tiles.map(({ label, href, icon, badge }) => (
            <Link
              key={label}
              href={href}
              className="relative flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-[18px] bg-white shadow-sm transition-transform duration-150 active:scale-[0.98]"
            >
              <span aria-hidden="true">{icon}</span>
              {badge ? (
                <span className="absolute right-3 top-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#EECE2D] px-1 text-[10px] font-extrabold text-[#15532E]">
                  {badge}
                </span>
              ) : null}
              <span className="text-[11px] font-semibold text-[#3F4B55]">{label}</span>
            </Link>
          ))}
        </div>

        <section className="mx-4 mb-6 mt-5 rounded-[20px] bg-white px-5 py-4 text-center shadow-sm">
          <h2 className="text-[14px] font-extrabold text-[#171717]">Guest Browsing Mode</h2>
          <p className="mx-auto mt-3 max-w-xs text-[11px] leading-relaxed text-[#7E7E80]">
            You&apos;re browsing as a guest. Log in with your participant card to unlock more
            features
          </p>
          <Link
            href="/welcome"
            className="mx-auto mt-3 flex min-h-[44px] w-full max-w-[190px] items-center justify-center rounded-full bg-[#075F47] text-[12px] font-bold text-white"
          >
            Back to Login
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
