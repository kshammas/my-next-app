'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock3,
  Gift,
  LifeBuoy,
  MapPin,
  Play,
  Radio,
  ScanLine,
  ShoppingBag,
  Trophy,
  Wallet,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { AppShell } from '@/components/AppShell';
import { usePrototype } from '@/lib/prototype-store';
import type { AppNotification, Program, Session } from '@/lib/types';

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
  { label: 'My Program', href: '/programs', icon: <ClipboardList className="h-7 w-7 text-[#13512C]" /> },
  { label: 'Live', href: '/live', icon: <Radio className="h-7 w-7 text-[#13512C]" /> },
  { label: 'Schedule', href: '/schedule', icon: <CalendarDays className="h-7 w-7 text-[#13512C]" /> },
  { label: 'Map', href: '/map', icon: <MapPin className="h-7 w-7 text-[#13512C]" /> },
  { label: 'Store', href: '/store', icon: <ShoppingBag className="h-7 w-7 text-[#13512C]" /> },
  { label: 'Glocal Wallet', href: '/wallet', icon: <Wallet className="h-7 w-7 text-[#13512C]" /> },
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

function UpcomingEvents({ programs }: { programs: Program[] }) {
  return (
    <section className="mx-4 mb-6 mt-5 rounded-[20px] bg-white px-5 py-4 shadow-sm" aria-label="Upcoming events">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[14px] font-extrabold text-[#171717]">Upcoming events</h2>
        <Link href="/schedule" className="text-[11px] font-bold text-[#13512C]">
          See schedule
        </Link>
      </div>

      {programs.length ? (
        <div className="mt-3 space-y-2">
          {programs.slice(0, 2).map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 rounded-[14px] bg-[#F5FAF6] px-3 py-2.5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white text-[#13512C]">
                <CalendarDays size={17} strokeWidth={2.2} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-extrabold text-[#243B2E]">{event.title}</p>
                <p className="mt-0.5 flex items-center gap-2 text-[10px] text-[#7E7E80]">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={10} aria-hidden="true" /> {event.start}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={10} aria-hidden="true" /> {event.venue}
                  </span>
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#E6F3EA] px-2 py-0.5 text-[9px] font-extrabold text-[#13512C]">
                {event.day}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-[11px] text-[#7E7E80]">Nothing in your program yet.</p>
      )}
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

function ParticipantHome({
  session,
  notifications,
  programs,
}: {
  session: Session;
  notifications: AppNotification[];
  programs: Program[];
}) {
  return (
    <AppShell showBottomNav>
      <div className="min-h-full bg-[#F6F8F5] pb-8">
        <BrandHeader />

        <section className="mx-4 rounded-[22px] bg-[#0C3523] px-5 py-4 text-white shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[17px] font-extrabold tracking-tight">{session.name}</p>
              <p className="mt-1 text-[11px] text-[#B9D8C6]">ID:{session.jamiaId}</p>
            </div>
            <Link
              href="/profile"
              aria-label="Open profile"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/20"
            >
              <ChevronRight size={22} strokeWidth={2.6} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-[16px] bg-black/20 px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#A1C8B3]">
                Glocal points
              </p>
              <p className="mt-1 text-[26px] font-extrabold leading-none">
                {session.points}
                <span className="ml-1.5 text-[12px] font-bold text-white/70">GP</span>
              </p>
            </div>
            <Link
              href="/wallet"
              className="flex min-h-[38px] items-center gap-1 rounded-full bg-[#FDE047] px-4 text-[11px] font-extrabold text-[#0C3523] transition hover:bg-[#F7DF5B]"
            >
              Wallet
              <ArrowUpRight size={14} strokeWidth={2.6} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
          <Link
            href="/points"
            className="flex min-h-[64px] items-center gap-3 rounded-[18px] bg-[#FDE047] px-4 shadow-sm transition-transform duration-150 active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-white/50 text-[#0C3523]">
              <ScanLine size={20} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span className="text-[12px] font-extrabold leading-tight text-[#0C3523]">
              Scan to redeem
            </span>
          </Link>
          <Link
            href="/points"
            className="flex min-h-[64px] items-center gap-3 rounded-[18px] bg-white px-4 shadow-sm transition-transform duration-150 active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#E6F3EA] text-[#13512C]">
              <Gift size={20} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span className="text-[12px] font-extrabold leading-tight text-[#243B2E]">
              Earn points
            </span>
          </Link>
        </div>

        <section className="mx-4 mt-5" aria-label="Explore">
          <div className="grid grid-cols-3 gap-2.5">
            {participantTiles.map(({ label, href, icon }) => (
              <Link
                key={label}
                href={href}
                className="flex min-h-[86px] flex-col items-center justify-center gap-2 rounded-[18px] bg-white px-1 text-center shadow-sm transition-transform duration-150 active:scale-[0.98]"
              >
                <span aria-hidden="true">{icon}</span>
                <span className="text-[11px] font-bold leading-tight text-[#3F4B55]">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-4 mb-6 mt-5 overflow-hidden rounded-[22px] bg-white shadow-sm">
          <Link href="/live" className="block">
            <div className="relative flex h-[116px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#00130D] via-[#09301E] to-[#15532E]">
              <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full border border-white/10" />
              <div className="absolute -bottom-16 right-0 h-44 w-44 rounded-full border border-white/10" />
              <span className="absolute right-3 top-3 rounded-full bg-[#FDE047] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-[#0C3523]">
                Live
              </span>
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30">
                <Play size={24} fill="currentColor" aria-hidden="true" />
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <div>
                <h2 className="text-[15px] font-extrabold text-[#171717]">Watch Live</h2>
                <p className="mt-1 text-[11px] text-[#7E7E80]">Catch every moment, live</p>
              </div>
              <span className="flex min-h-[36px] shrink-0 items-center rounded-full bg-[#FDE047] px-4 text-[10px] font-extrabold text-[#0C3523]">
                Watch Live
              </span>
            </div>
          </Link>
        </section>

        <Announcements notifications={notifications} />
        <UpcomingEvents programs={programs} />
      </div>
    </AppShell>
  );
}

export default function HomePage() {
  const { guestMode, session, notifications, programs } = usePrototype();

  return guestMode ? (
    <GuestHome notifications={notifications} />
  ) : (
    <ParticipantHome session={session} notifications={notifications} programs={programs} />
  );
}
