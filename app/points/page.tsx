'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft, Clock3, Coins, ScanLine } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { QrScanner } from '@/components/QrScanner';
import { demoActivities, demoSession } from '@/lib/demo-data';
import { apiSend, useApi } from '@/lib/use-api';
import type { PointActivity, Session } from '@/lib/types';

const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C801D]';

export default function PointsPage() {
  const { data: activities, setData } = useApi<PointActivity[]>('/api/points', demoActivities);
  const { data: session, setData: setSession } = useApi<Session>('/api/session', demoSession);
  const [selectedId, setSelectedId] = useState('prochat');
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
      setNotice(`+${selected.reward} Coins added to your wallet.`);
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Could not claim this activity.');
    }
  }

  return (
    <AppShell showBottomNav>
      <div className="min-h-full bg-gradient-to-b from-[#FCFEFB] via-[#F7FCF6] to-[#F5FAF6] pb-8">
        <header className="flex min-h-[56px] items-center justify-between px-5 pt-[max(12px,env(safe-area-inset-top))]">
          <Link
            href="/home"
            aria-label="Go back"
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#0C3523] shadow-sm ${focusOnLight}`}
          >
            <ChevronLeft size={20} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="text-[17px] font-extrabold tracking-tight text-[#0C3523]">Redeem</h1>
        </header>

        <section className="px-5 pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[16px] font-extrabold text-[#0C3523]">Glocal Points</h2>
            <span className="flex items-center gap-1 text-[12px] font-extrabold text-[#0C801D]">
              <Coins size={14} aria-hidden="true" /> {session.points} GP
            </span>
          </div>
          <p className="mt-1 text-[11px] font-semibold text-[#5B6B61]">
            {claimedCount} of {activities.length} activities completed
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#0C801D] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {notice ? (
          <p
            role="status"
            className="mx-4 mt-4 rounded-[14px] bg-[#ECFDF3] px-4 py-3 text-[11px] font-semibold leading-relaxed text-[#0C801D]"
          >
            {notice}
          </p>
        ) : null}

        <section className="mt-5 space-y-3 px-4" aria-label="Points activities">
          {activities.map((activity, index) => {
            const claimed = activity.claimed;
            const active = activity.id === selected?.id;
            return (
              <article
                key={activity.id}
                className={`rounded-[22px] bg-white/90 p-4 shadow-sm ${
                  active ? 'ring-2 ring-[#0C801D]/15' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${
                      claimed ? 'bg-[#ECFDF3] text-[#0C801D]' : 'bg-[#FDE047] text-[#0C3523]'
                    }`}
                  >
                    {claimed ? <Check size={16} strokeWidth={2.8} aria-hidden="true" /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[13px] font-extrabold text-[#0C3523]">{activity.title}</h3>
                    {activity.when ? (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#F5FAF6] px-2 py-0.5 text-[10px] font-semibold text-[#5B6B61]">
                        <Clock3 size={11} aria-hidden="true" /> {activity.when}
                      </span>
                    ) : null}
                  </div>
                  <span className="shrink-0 rounded-full bg-[#FDE047] px-2.5 py-1 text-[10px] font-extrabold text-[#0C3523]">
                    +{activity.reward} Coins
                  </span>
                </div>

                {active && activity.id === 'prochat' ? (
                  <p className="mt-3 text-[11px] leading-relaxed text-[#5B6B61]">
                    Join an engaging Pro Chat session led by Anshif Nurani at Conferance Hall, 9:oo
                    PM
                  </p>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#0C3523]/10 pt-3">
                  {claimed ? (
                    <span className="text-[11px] font-bold text-[#0C801D]">Claimed</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(activity.id);
                        setScanning(true);
                      }}
                      className={`flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#0C801D] px-4 text-[11px] font-bold text-white transition-colors hover:bg-[#0A6E19] ${focusOnLight}`}
                    >
                      <ScanLine size={14} aria-hidden="true" /> Scan to claim
                    </button>
                  )}
                  {activity.id === 'prochat' ? (
                    <span className="text-[10px] font-bold text-[#8A9A90]">Coming soon</span>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>

        <div className="mx-auto mt-5 flex min-h-[44px] w-full max-w-[220px] items-center justify-center rounded-full bg-white/80 text-[12px] font-extrabold text-[#6B7B72] shadow-sm">
          Coming soon
        </div>

        {scanning ? (
          <QrScanner onClose={() => setScanning(false)} onResult={(value) => void claim(value)} />
        ) : null}
      </div>
    </AppShell>
  );
}
