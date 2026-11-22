'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ChevronRight, ScanLine } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { QrScanner } from '@/components/QrScanner';
import { demoActivities, demoSession } from '@/lib/demo-data';
import { apiSend, useApi } from '@/lib/use-api';
import type { PointActivity, Session } from '@/lib/types';

export default function PointsPage() {
  const { data: activities, setData } = useApi<PointActivity[]>('/api/points', demoActivities);
  const { data: session, setData: setSession } = useApi<Session>('/api/session', demoSession);
  const [selectedId, setSelectedId] = useState('glocal-vr');
  const [scanning, setScanning] = useState(false);
  const [notice, setNotice] = useState('');

  const selected = activities.find((item) => item.id === selectedId) ?? activities[0];

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
    <AppShell>
      <div className="px-5 pt-6 pb-8">
        <PageHeader title="Glocal Points" unread={0} />

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[12px] text-slate-500">
            {activities.filter((item) => item.claimed).length} of {activities.length} activities completed
          </p>
          <Link
            href="/wallet"
            className="rounded-full bg-[#f7e305] px-3.5 py-2 text-[12px] font-bold text-[#073b1d]"
          >
            {session.points} GP
          </Link>
        </div>

        {notice ? (
          <p className="mt-3 rounded-2xl bg-[#e7f4ea] p-3 text-[12px] font-semibold text-[#0a5c2e]">{notice}</p>
        ) : null}

        <div className="mt-5 space-y-4">
          {activities.map((activity, index) => {
            const active = activity.id === selected?.id;
            const left = index % 2 === 1;
            return (
              <button
                key={activity.id}
                onClick={() => setSelectedId(activity.id)}
                className={`flex w-full items-center gap-3 ${left ? 'flex-row-reverse' : ''}`}
              >
                <div className={`text-[13px] ${left ? 'text-right' : 'text-left'}`}>
                  <p className={`font-bold ${activity.claimed ? 'text-slate-400' : 'text-[#073b1d]'}`}>
                    {activity.title}
                  </p>
                  <p className="text-[11px] font-semibold text-[#0b7a3a]">+{activity.reward} Coins</p>
                </div>
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-[18px] font-extrabold ${
                    activity.claimed
                      ? 'bg-[#e6f0e9] text-slate-500'
                      : active
                        ? 'bg-[#064e24] text-white ring-4 ring-[#f7e305]'
                        : 'bg-[#064e24] text-white'
                  }`}
                >
                  {activity.claimed ? <Check size={22} /> : index + 1}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-t-[28px] bg-white p-6 shadow-[0_-4px_18px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-extrabold text-[#073b1d]">{selected?.title ?? 'Activity'}</h2>
            <span className="text-[15px] font-extrabold text-[#0b7a3a]">+{selected?.reward ?? 0}</span>
          </div>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">
            {selected?.description}
          </p>
          {selected?.claimed ? (
            <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e7f4ea] py-3.5 text-[13.5px] font-bold text-[#0a5c2e]">
              <Check size={17} /> Claimed
            </div>
          ) : (
            <button
              onClick={() => setScanning(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#064e24] py-3.5 text-[13.5px] font-bold text-white"
            >
              <ScanLine size={17} /> Scan to claim {selected?.reward ?? 0} points
            </button>
          )}
          <Link href="/schedule" className="mt-3 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400">
            See event schedule <ChevronRight size={13} />
          </Link>
        </div>

        {scanning ? (
          <QrScanner onClose={() => setScanning(false)} onResult={(value) => void claim(value)} />
        ) : null}
      </div>
    </AppShell>
  );
}
