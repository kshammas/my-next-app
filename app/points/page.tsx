'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Check, ChevronLeft, Clock3, Coins, ScanLine } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { QrScanner } from '@/components/QrScanner';
import { usePrototype } from '@/lib/prototype-store';

const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15814b]';

export default function PointsPage() {
  const { activities, session, claimActivity } = usePrototype();
  const [selectedId, setSelectedId] = useState('prochat');
  const [scanning, setScanning] = useState(false);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  const selected = activities.find((item) => item.id === selectedId) ?? activities[0];
  const claimedCount = activities.filter((item) => item.claimed).length;
  const progress = activities.length ? (claimedCount / activities.length) * 100 : 0;

  function claim(activityId: string) {
    const result = claimActivity(activityId);
    setNotice({ text: result.message, ok: result.ok });
  }

  return (
    <AppShell showBottomNav>
      <div className="min-h-full bg-[linear-gradient(155deg,#ffffff,#fbfdfb_38%,#fffbef)] pb-8">
        <header className="flex min-h-[56px] items-center justify-between px-5 pt-[max(12px,env(safe-area-inset-top))]">
          <Link
            href="/home"
            aria-label="Go back"
            className={`grid h-[38px] w-[38px] place-items-center rounded-full bg-[#eaf5ee] text-[#14563a] shadow-sm ${focusOnLight}`}
          >
            <ChevronLeft size={20} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="inline-flex min-h-[34px] items-center justify-center rounded-[22px] bg-[#f5e500] px-3 text-[10px] font-[720] text-[#145137]">
            Redeem
          </h1>
        </header>

        <section className="px-5 pt-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[21px] font-[750] tracking-[-0.6px] text-[#15583a]">Glocal Points</h2>
            <span className="inline-flex min-h-[34px] min-w-[46px] items-center justify-center gap-1.5 rounded-[22px] bg-[#14563a] px-[11px] text-[10px] font-[720] text-white">
              <Coins size={13} aria-hidden="true" /> {session.points} GP
            </span>
          </div>
          <p className="mt-1 text-[10px] text-[#84928a]">
            {claimedCount} of {activities.length} activities completed
          </p>
          <div className="mt-3 h-[5px] overflow-hidden rounded-[10px] bg-[#eaf3ec]">
            <div
              className="h-full rounded-[10px] bg-[#1b9854] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {notice ? (
          <div
            role="status"
            className={`mx-4 mt-4 flex items-start gap-2 rounded-[22px] border px-4 py-3 text-[10px] font-semibold leading-relaxed ${
              notice.ok
                ? 'border-[#cfe5d6] bg-[#e9f5ed] text-[#177c4a]'
                : 'border-[#fecdd3] bg-[#fff1f2] text-[#be123c]'
            }`}
          >
            {notice.ok ? (
              <Check size={15} strokeWidth={2.8} className="mt-0.5 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle size={15} strokeWidth={2.4} className="mt-0.5 shrink-0" aria-hidden="true" />
            )}
            <span>{notice.text}</span>
          </div>
        ) : null}

        <section className="mt-5 space-y-3 px-4" aria-label="Points activities">
          {activities.map((activity, index) => {
            const claimed = activity.claimed;
            const active = activity.id === selected?.id;
            return (
              <article
                key={activity.id}
                className={`rounded-[22px] border bg-white p-4 shadow-[0_2px_8px_rgba(20,52,37,0.06)] ${
                  active ? 'border-[#add5bd] ring-2 ring-[#15814b]/15' : 'border-[#dbe6df]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full border-2 text-[18px] font-bold transition-[border-color,transform] duration-200 ${
                      claimed
                        ? active
                          ? 'scale-[1.04] border-[#eadb14] bg-[#155a3d] text-white'
                          : 'border-[#e1dc42] bg-[#155a3d] text-white'
                        : active
                          ? 'scale-[1.04] border-[#eadb14] bg-[#e9f5ed] text-[#7a8980]'
                          : 'border-transparent bg-[#e9f5ed] text-[#7a8980]'
                    }`}
                  >
                    {claimed ? <Check size={20} strokeWidth={2.8} aria-hidden="true" /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[12px] font-bold text-[#275b3d]">{activity.title}</h3>
                    {activity.when ? (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#eaf6ed] px-2 py-0.5 text-[9px] font-semibold text-[#5b7e67]">
                        <Clock3 size={11} aria-hidden="true" /> {activity.when}
                      </span>
                    ) : null}
                  </div>
                  <span className="inline-flex min-h-[34px] shrink-0 items-center justify-center rounded-[22px] bg-[#f5e500] px-[11px] text-[10px] font-[720] text-[#145137]">
                    +{activity.reward} Coins
                  </span>
                </div>

                {active && activity.id === 'prochat' ? (
                  <p className="mt-3 text-[10px] leading-[1.55] text-[#87948d]">
                    Join an engaging Pro Chat session led by Anshif Nurani at Conferance Hall, 9:oo
                    PM
                  </p>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#e0ebe3] pt-3">
                  {claimed ? (
                    <span className="text-[10px] font-bold text-[#13824a]">Claimed</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(activity.id);
                        setNotice(null);
                        setScanning(true);
                      }}
                      className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-[22px] bg-[#14563a] px-4 text-[10px] font-bold text-white transition-colors hover:bg-[#0b5038] ${focusOnLight}`}
                    >
                      <ScanLine size={14} aria-hidden="true" /> Scan to claim
                    </button>
                  )}
                  {activity.id === 'prochat' ? (
                    <span className="text-[9px] font-bold text-[#7d9c87]">Coming soon</span>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>

        <div className="mx-auto mt-5 flex w-full max-w-[220px] flex-col items-center justify-center gap-2 rounded-[27px] border border-[#cfe5d6] bg-white px-4 py-3 shadow-[0_-8px_30px_rgba(29,69,45,0.1)]">
          <span className="block h-1 w-[34px] rounded-[5px] bg-[#dce8e0]" aria-hidden="true" />
          <span className="text-[10px] font-bold text-[#718479]">Coming soon</span>
        </div>

        {scanning ? (
          <QrScanner
            activityId={selected?.id}
            onClose={() => setScanning(false)}
            onResult={(value) => claim(value)}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
