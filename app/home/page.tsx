'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  Bell,
  Calendar,
  ChevronRight,
  Clock,
  Home,
  Map,
  Radio,
  ScanLine,
  ShoppingCart,
  Trophy,
  User,
  Wallet,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { AppShell } from '@/components/AppShell';
import { demoDashboard, demoSession } from '@/lib/demo-data';
import { useApi } from '@/lib/use-api';
import type { Dashboard, Session } from '@/lib/types';

const menu: { label: string; href: string; icon: ReactNode }[] = [
  { label: 'My Program', href: '/programs', icon: <Calendar className="h-7 w-7 text-[#0a7a33]" /> },
  { label: 'Live', href: '/live', icon: <Radio className="h-7 w-7 text-[#0a7a33]" strokeWidth={2.5} /> },
  {
    label: 'Schedule',
    href: '/schedule',
    icon: (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0a7a33]">
        <Clock className="h-4 w-4 text-white" strokeWidth={3} />
      </span>
    ),
  },
  { label: 'Map', href: '/map', icon: <Map className="h-7 w-7 text-[#0a7a33]" /> },
  { label: 'Store', href: '/store', icon: <ShoppingCart className="h-7 w-7 text-[#0a7a33]" /> },
  { label: 'Glocal Wallet', href: '/wallet', icon: <Wallet className="h-7 w-7 text-[#0a7a33]" /> },
];

function GoldCoin({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full font-black text-[#b85a00] ${className}`}
      style={{
        background: 'radial-gradient(circle at 30% 30%, #ffe066, #f5a800 60%, #d98200)',
        border: '4px solid #f7b52a',
        boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.25), 0 4px 10px rgba(0,0,0,0.35)',
      }}
    >
      <span className="text-[38px] leading-none">G</span>
    </div>
  );
}

export default function HomePage() {
  const { data: session } = useApi<Session>('/api/session', demoSession);
  const { data: dashboard } = useApi<Dashboard>('/api/dashboard', demoDashboard);

  return (
    <AppShell>
      <div className="app-content">
        <h1 className="sr-only">Rendezvous 26 home</h1>
        <div className="flex items-center justify-between">
          <Image
            src="/rend-logo-mobilesrc.png"
            alt="Rendezvous 26 — Jamia Madeenathunoor Life Festival"
            width={168}
            height={52}
            priority
            className="h-[50px] w-auto object-contain"
          />
          <Link
            href="/notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-emerald-100 bg-white shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-[#111]" />
            <span className="absolute right-2.5 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
          </Link>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#064a27] to-[#03301a] p-5 text-white">
          <div className="absolute -right-4 -top-16 h-56 w-56 rounded-full border border-white/5" />
          <div className="absolute -top-8 right-8 h-40 w-40 rounded-full border border-white/5" />

          <p className="relative text-[12px] font-bold tracking-[0.2em] text-emerald-100/70">{session.name}</p>
          <p className="relative text-[12px] text-emerald-100/70">ID: {session.jamiaId}</p>

          <div className="relative mt-3 flex items-end gap-1.5">
            <span className="text-[56px] font-extrabold leading-none">{session.points}</span>
            <span className="mb-2 text-[13px] font-bold text-[#c8f06a]">GP</span>
            <div className="relative -mt-6 ml-auto h-[80px] w-[100px]">
              <GoldCoin className="absolute left-0 top-3 h-[62px] w-[62px]" />
              <GoldCoin className="absolute left-8 top-0 h-[68px] w-[68px]" />
            </div>
          </div>

          {dashboard.nextEvent ? (
            <p className="relative mt-2 text-[11px] text-emerald-100/75">
              Next: {dashboard.nextEvent.title} · {dashboard.nextEvent.time}
            </p>
          ) : null}

          <div className="relative mt-5 grid grid-cols-2 gap-3">
            <Link
              href="/wallet"
              className="flex min-h-[48px] items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl bg-[#ffe500] px-2 py-3 text-[13px] font-bold text-[#06451f] transition-transform duration-150 active:scale-[0.98]"
            >
              <ScanLine className="h-4 w-4 shrink-0" aria-hidden="true" /> Scan to redeem
            </Link>
            <Link
              href="/points"
              className="flex min-h-[48px] items-center justify-center gap-1 whitespace-nowrap rounded-2xl border border-white/20 bg-white/10 px-2 py-3 text-[13px] font-bold transition-transform duration-150 active:scale-[0.98]"
            >
              Earn points <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid-menu mt-4">
          {menu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex min-h-[104px] flex-col items-center justify-center gap-3 rounded-3xl border border-emerald-100 bg-white py-5 transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98] sm:min-h-[116px]"
            >
              <span aria-hidden="true">{item.icon}</span>
              <span className="text-center text-[12px] font-semibold text-slate-700">{item.label}</span>
            </Link>
          ))}
        </div>

        <Link
          href="/live"
          className="relative mt-4 block h-[150px] overflow-hidden rounded-[24px] bg-gradient-to-r from-[#8a4b12] via-[#6a350c] to-[#2d1806] shadow-md sm:h-[190px] lg:h-[220px]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(247,227,5,0.25),transparent_45%)]" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4">
            <p className="text-[18px] font-extrabold leading-tight text-white">Watch Live</p>
            <p className="text-[12px] text-white/90">Catch every moment, live</p>
          </div>
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-2xl bg-[#1a5cf0] px-4 py-2.5 text-[13px] font-bold text-white">
            Watch Live <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-[12px]">
          <span className="flex items-center gap-2 text-slate-600">
            <Trophy className="h-4 w-4 text-[#0a7a33]" /> Check the live leaderboard
          </span>
          <Link href="/results" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl px-3 font-bold text-[#064e24]">View</Link>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-[12px]">
          <span className="flex items-center gap-2 text-slate-600">
            <User className="h-4 w-4 text-[#0a7a33]" /> Your profile and card
          </span>
          <Link href="/profile" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl px-3 font-bold text-[#064e24]">Open</Link>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-[12px]">
          <span className="flex items-center gap-2 text-slate-600">
            <Home className="h-4 w-4 text-[#0a7a33]" /> Rendezvous 26 · Life Fest
          </span>
          <span className="text-slate-400">Jamia Madeenathunoor</span>
        </div>
      </div>
    </AppShell>
  );
}
