'use client';

import { useState } from 'react';
import { Radio, Search } from 'lucide-react';
import { AppShell } from '@/components/AppShell';

type Tab = 'Leaderboard' | 'Event results';

const tabs: Tab[] = ['Leaderboard', 'Event results'];

const standings = [
  { code: 'JM001C', points: '1,120' },
  { code: 'JM001A', points: '1,071' },
  { code: 'JM001B', points: '866' },
];

export default function ResultsPage() {
  const [tab, setTab] = useState<Tab>('Leaderboard');
  const [query, setQuery] = useState('');

  return (
    <AppShell showBottomNav>
      <div className="min-h-full bg-[#F2F7F3] pb-8">
        <header className="flex min-h-[64px] items-center justify-between px-5 pb-2 pt-[max(12px,env(safe-area-inset-top))]">
          <h1 className="text-[18px] font-extrabold tracking-tight text-[#0C3523]">Results</h1>
          <span className="flex items-center gap-1 rounded-full bg-[#DCFCE7] px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest text-[#15803D]">
            <Radio size={11} aria-hidden="true" /> Live
          </span>
        </header>

        <div
          className="mx-4 mt-2 flex gap-2 rounded-full bg-[#E5F0EA] p-1"
          role="tablist"
          aria-label="Results sections"
        >
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              className={`min-h-[42px] flex-1 rounded-full text-[12px] font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C801D] ${
                tab === item ? 'bg-white text-[#0C3523] shadow-sm' : 'text-[#6B7B72]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === 'Leaderboard' ? (
          <div className="px-4 pt-6" role="tabpanel">
            <section className="overflow-hidden rounded-[24px] bg-[#ECFDF3] shadow-sm">
              <div className="px-5 pt-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#5B8A6C]">
                  Currently leading
                </p>
              </div>
              <div className="px-5 pb-4 pt-3">
                <p className="text-[30px] font-extrabold leading-none tracking-tight text-[#0C3523]">
                  JM001C
                </p>
                <div className="mt-3 flex items-end gap-2">
                  <p className="text-[40px] font-extrabold leading-none text-[#0C801D]">1,120</p>
                  <p className="pb-1 text-[12px] font-bold text-[#5B6B61]">points</p>
                </div>
              </div>
              <div className="bg-white/70 px-5 py-3 text-center text-[11px] font-bold text-[#5B6B61]">
                After 144 Results
              </div>
            </section>

            <section className="mt-4 overflow-hidden rounded-[24px] bg-white shadow-sm">
              {standings.map((row, index) => (
                <div
                  key={row.code}
                  className={`flex items-center justify-between gap-3 px-5 py-5 ${
                    index < standings.length - 1 ? 'border-b border-[#0C3523]/10' : ''
                  }`}
                >
                  <p className="text-[14px] font-extrabold text-[#0C3523]">{row.code}</p>
                  <p className="text-[15px] font-extrabold tabular-nums text-[#0C801D]">
                    {row.points}
                  </p>
                </div>
              ))}
            </section>
          </div>
        ) : (
          <div className="px-4 pt-6" role="tabpanel">
            <label className="flex min-h-[48px] items-center gap-2.5 rounded-[16px] bg-white px-4 shadow-sm focus-within:ring-2 focus-within:ring-[#0C801D]/25">
              <Search className="h-[18px] w-[18px] shrink-0 text-[#8FA79A]" aria-hidden="true" />
              <span className="sr-only">Search events</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events"
                className="w-full bg-transparent text-[12px] text-[#0C3523] outline-none placeholder:text-[#9AAEA3]"
              />
            </label>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                aria-pressed="true"
                className="min-h-[44px] rounded-full bg-[#0C801D] px-6 text-[11px] font-bold text-white"
              >
                All
              </button>
            </div>

            <div className="mt-4">
              <span className="inline-flex rounded-full bg-[#E5F0EA] px-3 py-1 text-[10px] font-bold text-[#5B6B61]">
                0 announced events
              </span>
            </div>

            <div className="mt-24 text-center">
              <p className="text-[14px] font-extrabold text-[#0C3523]">No events found</p>
              <p className="mx-auto mt-2 max-w-[280px] text-[11px] leading-relaxed text-[#6B7B72]">
                Try another search term or category.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
