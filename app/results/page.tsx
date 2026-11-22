'use client';

import { useState } from 'react';
import { Medal, Trophy } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { demoResults } from '@/lib/demo-data';
import { useApi } from '@/lib/use-api';
import type { Results, ResultRow } from '@/lib/types';

const medal: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

function Leaderboard({ rows }: { rows: ResultRow[] }) {
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <article
          key={`${row.name}-${row.rank}`}
          className={`flex items-center gap-3 rounded-2xl p-3.5 ${
            row.rank <= 3 ? 'bg-[#fff9dc]' : 'bg-white'
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f4ea] text-[13px] font-extrabold text-[#064e24]">
            {medal[row.rank] ?? `#${row.rank}`}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-extrabold text-[#073b1d]">{row.name}</p>
            <p className="text-[10.5px] text-slate-400">{row.detail}</p>
          </div>
          <div className="text-right">
            <p className="text-[15px] font-extrabold text-[#0a7a33]">{row.score}</p>
            <p className="text-[9px] font-semibold text-slate-400">POINTS</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function ResultsPage() {
  const { data } = useApi<Results>('/api/results', demoResults);
  const [tab, setTab] = useState<'groups' | 'individuals'>('groups');

  return (
    <AppShell>
      <div className="px-4 pt-6 pb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f4ea]">
            <Trophy className="h-6 w-6 text-[#0a7a33]" />
          </div>
          <div>
            <h1 className="text-[20px] font-extrabold text-[#073b1d]">Results</h1>
            <p className="text-[11px] text-slate-500">Live standings at Rendezvous 26</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1.5">
          {(['groups', 'individuals'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-xl py-2.5 text-[12px] font-bold capitalize ${
                tab === key ? 'bg-[#064e24] text-white' : 'text-slate-500'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <Leaderboard rows={data[tab]} />
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-[#e9f3ec] p-4 text-[12px] text-[#0a5c2e]">
          <Medal size={18} /> Scores refresh from the event API each time you open this page.
        </div>
      </div>
    </AppShell>
  );
}
