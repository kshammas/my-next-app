'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  LifeBuoy,
  MapPin,
  QrCode,
  Radio,
  ShoppingBag,
  Trophy,
  Wallet,
} from '@/components/icons';
import { useState, type ReactNode } from 'react';
import { AppShell } from '@/components/AppShell';
import { usePrototype } from '@/lib/prototype-store';
import type { AppNotification, Session } from '@/lib/types';

const guestTiles: { label: string; href: string; icon: ReactNode; badge?: string }[] = [
  { label: 'Map', href: '/map', icon: <MapPin className="h-7 w-7 text-[#3F4B55]" /> },
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

const participantTiles: { label: string; href: string; icon: ReactNode }[] = [
  { label: 'My Program', href: '/programs', icon: <ClipboardList className="h-7 w-7 text-[#16824C]" /> },
  { label: 'Live', href: '/live', icon: <Radio className="h-7 w-7 text-[#16824C]" /> },
  { label: 'Schedule', href: '/schedule', icon: <CalendarDays className="h-7 w-7 text-[#16824C]" /> },
  { label: 'Map', href: '/map', icon: <MapPin className="h-7 w-7 text-[#16824C]" /> },
  { label: 'Store', href: '/store', icon: <ShoppingBag className="h-7 w-7 text-[#16824C]" /> },
  { label: 'Glocal Wallet', href: '/wallet', icon: <Wallet className="h-7 w-7 text-[#16824C]" /> },
];

const highlights = [
  {
    title: 'Earn Glocal Points',
    subtitle: 'Participate and claim your rewards',
    image: '/images/1.jpg.jpeg',
    href: '/points',
    action: false,
  },
  {
    title: 'Watch Live',
    subtitle: 'Catch every moment, live',
    image: '/images/2.jpg.jpeg',
    href: '/live',
    action: true,
  },
  {
    title: 'Your festival, your story',
    subtitle: "See what's happening around you",
    image: '/images/3.jpg.jpeg',
    href: '/map',
    action: false,
  },
];

function BrandHeader() {
  return (
    <header className="px-5 pb-5 pt-12">
      <h1 className="sr-only">Rendezvous 26 — Jamia Madeenathunoor Life Festival</h1>
      <Image
        className="h-auto w-[196px] object-contain"
        src="/rend-logo-mobilesrc.png"
        alt="Rendezvous 26 — Jamia Madeenathunoor Life Festival"
        width={196}
        height={40}
        priority
      />
    </header>
  );
}

function Announcements({ notifications }: { notifications: AppNotification[] }) {
  return (
    <section className="mx-4 mb-6 mt-5 rounded-[20px] bg-white px-5 py-4 shadow-sm" aria-label="Announcements">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E6F3EA]">
            <Bell size={14} strokeWidth={2.4} className="text-[#13512C]" aria-hidden="true" />
          </span>
          <h2 className="text-[14px] font-extrabold text-[#171717]">Announcements</h2>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[#FDE047] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#0C3523]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0C801D]" aria-hidden="true" /> Live updates
        </span>
      </div>

      {notifications.length ? (
        <div className="mt-3 divide-y divide-[#0C3523]/10">
          {notifications.slice(0, 2).map((item) => (
            <div key={item.id} className="flex gap-2.5 py-2.5 first:pt-0 last:pb-0">
              <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${item.read ? 'bg-[#C6D4CA]' : 'bg-[#0C801D]'}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-extrabold text-[#243B2E]">{item.title}</p>
                <p className="mt-0.5 line-clamp-1 text-[10px] leading-relaxed text-[#7E7E80]">{item.body}</p>
              </div>
              <span className="shrink-0 text-[9px] font-semibold text-[#9AA7A0]">{item.time}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-[11px] text-[#7E7E80]">No updates right now.</p>
      )}

      <Link
        href="/notifications"
        className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#13512C]"
      >
        View all <ChevronRight size={13} strokeWidth={2.6} aria-hidden="true" />
      </Link>
    </section>
  );
}

function GuestHome({ notifications }: { notifications: AppNotification[] }) {
  return (
    <AppShell>
      <div className="min-h-full bg-[#F6F8F5] pb-8">
        <BrandHeader />

        <section className="mx-4 rounded-[20px] bg-[#113E29] px-4 py-3 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold tracking-wide text-[#A1C8B3]">
                GUEST ACCOUNT
              </p>
              <p className="mt-1 text-[11px] text-[#A1C8B3]/80">Limited Access Mode</p>
            </div>
            <Link
              href="/login"
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
          {guestTiles.map(({ label, href, icon, badge }) => (
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

        <div className="mt-5">
          <Announcements notifications={notifications} />
        </div>

        <section className="mx-4 rounded-[20px] bg-white px-5 py-4 text-center shadow-sm">
          <h2 className="text-[14px] font-extrabold text-[#171717]">Guest Browsing Mode</h2>
          <p className="mx-auto mt-3 max-w-xs text-[11px] leading-relaxed text-[#7E7E80]">
            You&apos;re browsing as a guest. Log in with your participant card to unlock more
            features
          </p>
          <Link
            href="/login"
            className="mx-auto mt-3 flex min-h-[44px] w-full max-w-[190px] items-center justify-center rounded-full bg-[#075F47] text-[12px] font-bold text-white"
          >
            Back to Login
          </Link>
        </section>
      </div>
    </AppShell>
  );
}

function ParticipantHome({ session }: { session: Session }) {
  const [highlight, setHighlight] = useState(1);
  const current = highlights[highlight];

  return (
    <AppShell showBottomNav>
      <div className="home-page" style={{ background: 'var(--page)' }}>
        <header className="home-header">
          <div className="brand-lockup">
            <Image
              src="/rend-logo-mobilesrc.png"
              alt="Rendezvous 26 — Jamia Madeenathunoor Life Festival"
              width={196}
              height={40}
              priority
            />
          </div>
          <Link href="/notifications" className="header-round-button" aria-label="Notifications">
            <Bell size={21} strokeWidth={2} aria-hidden="true" />
          </Link>
          <span className="notification-dot" aria-hidden="true" />
        </header>

        <section className="participant-wallet-card">
          <div className="wallet-card-rings" aria-hidden="true" />
          <div className="participant-copy">
            <p className="participant-name">{session.name.toUpperCase()}</p>
            <p className="participant-id">ID: {session.jamiaId}</p>
            <div className="home-points">
              <strong>{session.points}</strong><span>GP</span>
            </div>
          </div>
          <div className="coin-pair" aria-hidden="true">
            <Image src="/images/gcoins.png" alt="" width={112} height={84} />
          </div>
          <div className="wallet-actions">
            <Link href="/points" className="redeem-button">
              <QrCode size={19} strokeWidth={2} aria-hidden="true" /> Scan to redeem
            </Link>
            <Link href="/points" className="earn-button">
              Earn points <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="shortcut-grid" aria-label="Festival shortcuts">
          {participantTiles.map(({ label, href, icon }) => (
            <Link key={label} href={href} className="shortcut-tile">
              <span aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </section>

        <section className="home-banner-wrap" aria-label="Festival highlights">
          <Link href={current.href} className="home-banner" aria-label={current.title}>
            <Image src={current.image} alt="" fill sizes="(max-width: 640px) 100vw, 540px" priority />
            <span className="banner-vignette" />
            <span className="banner-copy">
              <strong>{current.title}</strong>
              <small>{current.subtitle}</small>
            </span>
            {current.action ? (
              <span className="banner-action">
                Watch Live <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
              </span>
            ) : null}
          </Link>
          <div className="banner-dots" aria-label="Choose highlight">
            {highlights.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Show highlight ${index + 1}`}
                className={index === highlight ? 'banner-dot-active' : ''}
                onClick={() => setHighlight(index)}
              />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default function HomePage() {
  const { guestMode, session, notifications } = usePrototype();

  return guestMode ? (
    <GuestHome notifications={notifications} />
  ) : (
    <ParticipantHome session={session} />
  );
}
