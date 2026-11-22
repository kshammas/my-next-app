'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, LogOut } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { demoSession } from '@/lib/demo-data';
import { apiSend, useApi } from '@/lib/use-api';
import type { Session } from '@/lib/types';

type InstallPrompt = Event & { prompt: () => Promise<void> };

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useApi<Session>('/api/session', demoSession);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await apiSend('/api/session', 'DELETE');
      router.push('/login');
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
    <AppShell>
      <div className="min-h-full bg-[#f4f8f5]">
        <div className="rounded-b-[32px] bg-gradient-to-br from-[#e3f3e8] to-[#f9f9e4] px-5 pb-6 pt-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#064e24] text-[24px] font-extrabold text-[#f7e305]">
            {initials || 'G'}
          </div>
          <h1 className="mt-3 text-[19px] font-extrabold text-[#073b1d]">{session.name}</h1>
          <span className="mt-1.5 inline-block rounded-full bg-[#d3eedb] px-3.5 py-1 text-[11px] font-semibold text-[#085c2b]">
            Jamia No. {session.jamiaId}
          </span>
        </div>

        <div className="mx-auto grid w-full max-w-2xl gap-3 px-5 py-4 lg:max-w-none lg:grid-cols-2">
          <div className="space-y-3 rounded-[22px] bg-white p-4">
            <div className="flex justify-between text-[13.5px]">
              <span className="font-semibold text-[#073b1d]">Jamia ID</span>
              <span className="text-slate-500">{session.jamiaId}</span>
            </div>
            <div className="flex justify-between text-[13.5px]">
              <span className="font-semibold text-[#073b1d]">Campus</span>
              <span className="capitalize text-slate-500">{session.campus}</span>
            </div>
            <div className="flex justify-between text-[13.5px]">
              <span className="font-semibold text-[#073b1d]">Saved sessions</span>
              <span className="text-slate-500">{session.registered.length}</span>
            </div>
          </div>

          <div className="space-y-3 rounded-[22px] bg-white p-4">
            <Link href="/points" className="flex min-h-[44px] items-center justify-between text-[13.5px] font-semibold text-[#073b1d]">
              <span>Glocal Points</span>
              <span>{session.points} GP ›</span>
            </Link>
            <Link href="/wallet" className="flex min-h-[44px] items-center justify-between text-[13.5px] font-semibold text-[#073b1d]">
              <span>Glocal Wallet</span>
              <span>›</span>
            </Link>
            <Link href="/programs" className="flex min-h-[44px] items-center justify-between text-[13.5px] font-semibold text-[#073b1d]">
              <span>My Program</span>
              <span>›</span>
            </Link>
            <button
              onClick={() => void install()}
              className="flex min-h-[44px] w-full items-center justify-between text-[13.5px] font-semibold text-[#073b1d]"
            >
              <span className="flex items-center gap-2"><Download size={16} /> Install app</span>
              <span>›</span>
            </button>
          </div>

          {message ? <p role="status" className="rounded-2xl bg-[#e7f4ea] p-3 text-[12px] text-[#0a5c2e] lg:col-span-2">{message}</p> : null}

          <button
            onClick={() => void signOut()}
            disabled={busy}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[20px] bg-white p-4 font-semibold text-[13.5px] text-red-600 disabled:opacity-50 lg:col-span-2"
          >
            <LogOut size={16} /> {busy ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
