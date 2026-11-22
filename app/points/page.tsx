'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft, ChevronRight, Clock3, Coins, ScanLine } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { QrScanner } from '@/components/QrScanner';
import { demoActivities, demoSession } from '@/lib/demo-data';
import { apiSend, useApi } from '@/lib/use-api';
import type { PointActivity, Session } from '@/lib/types';

const focusOnDark =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF6D4]';
const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15532E]';

export default function PointsPage() {
  const { data: activities, setData } = useApi<PointActivity[]>('/api/points', demoActivities);
  const { data: session, setData: setSession } = useApi<Session>('/api/session', demoSession);
  const [selectedId, setSelectedId] = useState('welcome-reward');
  const [scanning, setScanning] = useState(false);
  const [notice, setNotice] = useState('');

  const selected = activities.find((item) => item.id === selectedId) ?? activities[0];
  const claimedCount = activities.filter((item) => item.claimed).length;
  const progress = activities.length ? (claimedCount / activities.length) * 100 : 0;

  async function claim(code: string) {
    if (!selected) return;
    setNotice('');
    try {
      const updated = await apiSend<Session>('/api/points', 'POST', {
        activityId: selected.id,
        code,
      });
      setSession(updated);
      setData((previous) =>
        previous.map((item) => (item.id === selected.id ? { ...item, claimed: true } : item)),
      );
      setNotice(`+${selected.reward} GP added to your wallet.`);
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Could not claim this activity.');
    }
  }

  return (
    <AppShell showBottomNav>
      <div className="min-h-full bg-[#F5FAF6] pb-8">
        <header className="relative flex min-h-[64px] items-center justify-center bg-[#13512C] px-14 py-4 text-white">
          <Link
            href="/home"
            aria-label="Go back"
            className={`absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25 ${focusOnDark}`}
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="text-[18px] font-extrabold tracking-tight">Redeem</h1>
        </header>

        <section
          className="relative mx-4 mt-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#15532E] to-[#0C3520] p-5 text-white shadow-sm"
          aria-label="Your Glocal Points balance"
        >
          <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full border border-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-16 right-16 h-36 w-36 rounded-full border border-white/10" aria-hidden="true" />
          <div className="relative flex items-start justify-between gap-3">
            <p className="text-[10px] font-extrabold tracking-[0.14em] text-[#A1C8B3]">
              AVAILABLE BALANCE
            </p>
            <Link
              href="/wallet"
              className={`flex min-h-[36px] items-center rounded-full bg-[#FDF6D4] px-4 text-[11px] font-extrabold text-[#15532E] transition-colors hover:bg-[#EECE2D] ${focusOnDark}`}
            >
              {session.points} GP
            </Link>
          </div>

          <div className="relative mt-4 flex items-baseline gap-2">
            <Coins size={22} className="self-center text-[#EECE2D]" aria-hidden="true" />
            <span className="text-[38px] font-extrabold leading-none">{session.points}</span>
            <span className="text-[13px] font-bold text-[#DCEBDD]">Glocal Points</span>
          </div>

          <div className="relative mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-[#EECE2D] transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] font-semibold text-[#A1C8B3]">
              {claimedCount} of {activities.length} activities completed
            </p>
          </div>
        </section>

        {notice ? (
          <p
            role="status"
            className="mx-4 mt-4 rounded-[14px] bg-[#E7F4EA] px-4 py-3 text-[11px] font-semibold leading-relaxed text-[#0A5C2E]"
          >
            {notice}
          </p>
        ) : null}

        <section className="mt-5 px-4" aria-label="Points activities">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-extrabold text-[#15532E]">Activities</h2>
            <span className="text-[11px] font-semibold text-[#6B7B72]">
              {activities.length} available
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {activities.map((activity, index) => {
              const claimed = activity.claimed;
              const active = activity.id === selected?.id;
              return (
                <article
                  key={activity.id}
                  className={`flex flex-col rounded-[20px] bg-white p-4 shadow-sm ${
                    active && !claimed ? 'ring-2 ring-[#EECE2D]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          claimed
                            ? 'bg-[#EAF4ED] text-[#15532E]'
                            : 'bg-[#FDF6D4] text-[#15532E]'
                        }`}
                      >
                        {claimed ? (
                          <Check size={18} strokeWidth={2.6} aria-hidden="true" />
                        ) : (
                          <span className="text-[13px] font-extrabold">{index + 1}</span>
                        )}
                      </span>
                      <h3 className="text-[13px] font-extrabold leading-snug text-[#15532E]">
                        {activity.title}
                      </h3>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-wide ${
                        claimed
                          ? 'bg-[#EAF4ED] text-[#15532E]'
                          : 'bg-[#EECE2D] text-[#15532E]'
                      }`}
                    >
                      {claimed ? 'CLAIMED' : 'CLAIM'}
                    </span>
                  </div>

                  <p className="mt-3 text-[11px] leading-relaxed text-[#6B7B72]">
                    {activity.description}
                  </p>

                  {activity.when ? (
                    <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EAF4ED] px-2.5 py-1 text-[10px] font-bold text-[#15532E]">
                      <Clock3 size={12} aria-hidden="true" /> {activity.when}
                    </span>
                  ) : null}

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#13512C]/10 pt-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-extrabold text-[#15532E]">
                        +{activity.reward} GP
                      </p>
                      <p className="mt-0.5 text-[10px] font-semibold text-[#8A9A90]">
                        {activity.reward} Glocal Coins
                      </p>
                    </div>
                    {claimed ? (
                      <span className="flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#EAF4ED] px-4 text-[11px] font-bold text-[#15532E]">
                        <Check size={14} aria-hidden="true" /> Claimed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(activity.id);
                          setScanning(true);
                        }}
                        aria-label={`Scan to claim ${activity.reward} Glocal Points from ${activity.title}`}
                        className={`flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#15532E] px-4 text-[11px] font-bold text-white transition-colors hover:bg-[#0E3D21] ${focusOnDark}`}
                      >
                        <ScanLine size={15} aria-hidden="true" /> Scan to Claim {activity.reward} points
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <Link
            href="/schedule"
            className={`mx-auto mt-5 flex min-h-[44px] w-full max-w-[220px] items-center justify-center gap-1 text-[11px] font-bold text-[#6B7B72] ${focusOnLight}`}
          >
            See event schedule <ChevronRight size={13} aria-hidden="true" />
          </Link>
        </section>

        {scanning ? (
          <QrScanner onClose={() => setScanning(false)} onResult={(value) => void claim(value)} />
        ) : null}
      </div>
    </AppShell>
  );
}
