'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronRight,
  Coins,
  Download,
  LifeBuoy,
  LogOut,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { demoSession } from '@/lib/demo-data';
import { apiSend, useApi } from '@/lib/use-api';
import type { Session } from '@/lib/types';

type InstallPrompt = Event & { prompt: () => Promise<void> };

const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15532E]';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useApi<Session>('/api/session', demoSession);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await apiSend('/api/session', 'DELETE');
      router.push('/welcome');
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function install() {
    const prompt = (window as unknown as { hr26InstallPrompt?: InstallPrompt }).hr26InstallPrompt;
    if (prompt) {
      await prompt.prompt();
      (window as unknown as { hr26InstallPrompt?: InstallPrompt }).hr26InstallPrompt = undefined;
      return;
    }
    setMessage('Use your browser menu → “Install app” / “Add to Home Screen”.');
  }

  const initials = session.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <AppShell showBottomNav>
      <div className="min-h-full bg-[#F5FAF6] pb-6 pt-[max(32px,env(safe-area-inset-top))]">
        <section className="px-4 pb-1 text-center">
          <h1 className="sr-only">Profile</h1>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#FDF6D4] bg-[#15532E] text-[24px] font-extrabold text-[#EECE2D] shadow-sm">
            {initials || 'G'}
          </div>
          <h2 className="mt-3 text-[19px] font-extrabold text-[#15532E]">{session.name}</h2>
          <span className="mt-2 inline-block rounded-full bg-[#FDF6D4] px-3.5 py-1 text-[11px] font-bold text-[#15532E]">
            Jamia No. {session.jamiaId}
          </span>
        </section>

        <section className="mx-4 mt-5 rounded-[22px] bg-white p-4 shadow-sm" aria-label="Your details">
          <h3 className="text-[10px] font-extrabold tracking-[0.14em] text-[#8FA79A]">
            YOUR DETAILS
          </h3>
          <div className="mt-3 flex items-center justify-between gap-3 border-b border-[#13512C]/10 pb-3 text-[13px]">
            <span className="font-bold text-[#15532E]">Jamia ID</span>
            <span className="text-[#6B7B72]">{session.jamiaId}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-[13px]">
            <span className="font-bold text-[#15532E]">Campus</span>
            <span className="capitalize text-[#6B7B72]">{session.campus}</span>
          </div>
        </section>

        <section className="mx-4 mt-4 overflow-hidden rounded-[22px] bg-white shadow-sm" aria-label="Account menu">
          <Link
            href="/wallet"
            className={`flex min-h-[56px] items-center gap-3 border-b border-[#13512C]/10 px-4 py-3 transition-colors hover:bg-[#F5FAF6] ${focusOnLight}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FDF6D4] text-[#15532E]">
              <Coins size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-[13px] font-bold text-[#15532E]">
              Glocal Points
            </span>
            <span className="text-[12px] font-extrabold text-[#15532E]">{session.points} GP</span>
            <ChevronRight size={16} className="shrink-0 text-[#8FA79A]" aria-hidden="true" />
          </Link>

          <Link
            href="/notifications"
            className={`flex min-h-[56px] items-center gap-3 border-b border-[#13512C]/10 px-4 py-3 transition-colors hover:bg-[#F5FAF6] ${focusOnLight}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#15532E]">
              <Bell size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-bold text-[#15532E]">Notifications</span>
              <span className="mt-0.5 block text-[11px] text-[#6B7B72]">Push notifications</span>
            </span>
            <ChevronRight size={16} className="shrink-0 text-[#8FA79A]" aria-hidden="true" />
          </Link>

          <Link
            href="/support"
            className={`flex min-h-[56px] items-center gap-3 border-b border-[#13512C]/10 px-4 py-3 transition-colors hover:bg-[#F5FAF6] ${focusOnLight}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#15532E]">
              <LifeBuoy size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-[13px] font-bold text-[#15532E]">
              Help &amp; support
            </span>
            <ChevronRight size={16} className="shrink-0 text-[#8FA79A]" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => void install()}
            className={`flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F5FAF6] ${focusOnLight}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#15532E]">
              <Download size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-[13px] font-bold text-[#15532E]">Install app</span>
            <ChevronRight size={16} className="shrink-0 text-[#8FA79A]" aria-hidden="true" />
          </button>
        </section>

        {message ? (
          <p
            role="status"
            className="mx-4 mt-4 rounded-[14px] bg-[#E7F4EA] px-4 py-3 text-[11px] font-semibold leading-relaxed text-[#0A5C2E]"
          >
            {message}
          </p>
        ) : null}

        <div className="mx-4 mt-4">
          <button
            type="button"
            onClick={() => void signOut()}
            disabled={busy}
            className={`flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[18px] bg-white p-4 text-[13px] font-bold text-[#B64235] shadow-sm transition-colors hover:bg-[#FDECEA] disabled:opacity-50 ${focusOnLight}`}
          >
            <LogOut size={17} aria-hidden="true" /> {busy ? 'Signing out…' : 'Sign out'}
          </button>
        </div>

        <footer className="pb-6 pt-8 text-center text-[11px] font-semibold text-[#15532E]/60">
          Rendezvous 26
        </footer>
      </div>
    </AppShell>
  );
}
