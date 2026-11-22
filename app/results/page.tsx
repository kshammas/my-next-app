'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Radio, Search, Trophy } from 'lucide-react';
import { AppShell } from '@/components/AppShell';

type Tab = 'Leaderboard' | 'Event results';

const tabs: Tab[] = ['Leaderboard', 'Event results'];

const standings = [
  { rank: 1, code: 'JM001C', points: '1,120' },
  { rank: 2, code: 'JM001A', points: '1,071' },
  { rank: 3, code: 'JM001B', points: '866' },
];

export default function ResultsPage() {
  const [tab, setTab] = useState<Tab>('Leaderboard');
  const [query, setQuery] = useState('');

  return (
    <AppShell showBottomNav>
      <div className="min-h-full bg-[#F5FAF6] pb-8">
        <header className="relative flex min-h-[64px] items-center justify-center bg-[#13512C] px-14 py-4 text-white">
          <Link
            href="/home"
            aria-label="Go back"
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF6D4]"
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="text-[18px] font-extrabold tracking-tight">Results</h1>
        </header>

        <div className="mx-4 mt-4 flex gap-2 rounded-full bg-[#E7EFE9] p-1" role="tablist" aria-label="Results sections">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              className={`min-h-[42px] flex-1 rounded-full text-[12px] font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15532E] ${
                tab === item ? 'bg-white text-[#13512C] shadow-sm' : 'text-[#6B7B72]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === 'Leaderboard' ? (
          <div className="px-4 pt-5" role="tabpanel">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-[#13512C]" aria-hidden="true" />
                <h2 className="text-[16px] font-extrabold text-[#13512C]">Leaderboard</h2>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[#D64545] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-white">
                <Radio size={11} aria-hidden="true" /> Live
              </span>
            </div>

            <section className="mt-4 overflow-hidden rounded-[22px] bg-white shadow-sm">
              <div className="border-b border-[#13512C]/10 px-4 py-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8FA79A]">
                  Currently leading
                </p>
              </div>

              {standings.map((row) => (
                <div
                  key={row.code}
                  className="flex items-center gap-3 border-b border-[#13512C]/10 px-4 py-4 last:border-b-0"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold ${
                      row.rank === 1
                        ? 'bg-[#FDF6D4] text-[#13512C]'
                        : 'bg-[#EAF4ED] text-[#15532E]'
                    }`}
                  >
                    {row.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-extrabold text-[#15532E]">{row.code}</p>
                  </div>
                  <p className="text-[15px] font-extrabold tabular-nums text-[#13512C]">
                    {row.points}
                    <span className="ml-1 text-[10px] font-semibold text-[#8FA79A]">points</span>
                  </p>
                </div>
              ))}

              <div className="bg-[#F5FAF6] px-4 py-3 text-center text-[11px] font-semibold text-[#6B7B72]">
                After 144 Results
              </div>
            </section>
          </div>
        ) : (
          <div className="px-4 pt-5" role="tabpanel">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[16px] font-extrabold text-[#13512C]">Event results</h2>
              <span className="rounded-full bg-[#FDF6D4] px-3 py-1 text-[10px] font-extrabold text-[#13512C]">
                LIVE
              </span>
            </div>

            <label className="mt-4 flex min-h-[48px] items-center gap-2.5 rounded-[16px] bg-white px-4 shadow-sm focus-within:ring-2 focus-within:ring-[#13512C]/25">
              <Search className="h-[18px] w-[18px] shrink-0 text-[#8FA79A]" aria-hidden="true" />
              <span className="sr-only">Search events</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events..."
                className="w-full bg-transparent text-[12px] text-[#13512C] outline-none placeholder:text-[#9AAEA3]"
              />
            </label>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                aria-pressed="true"
                className="min-h-[44px] rounded-full bg-[#13512C] px-5 text-[11px] font-bold text-white"
              >
                All
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <h3 className="text-[13px] font-extrabold text-[#15532E]">Browse results</h3>
              <span className="rounded-full bg-[#EAF4ED] px-3 py-1 text-[10px] font-extrabold text-[#15532E]">
                0 announced events
              </span>
            </div>

            <div className="mt-10 text-center">
              <p className="text-[14px] font-extrabold text-[#15532E]">No events found</p>
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
