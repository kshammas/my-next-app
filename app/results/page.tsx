'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Radio, RefreshCw, Search, Trophy } from 'lucide-react';
import { AppShell } from '@/components/AppShell';

type Tab = 'Leaderboard' | 'Event results';
type LoadState = 'loading' | 'ready' | 'error';

const tabs: Tab[] = ['Leaderboard', 'Event results'];

// Reference standings are kept exactly as shown in the design.
const standings = [
  { code: 'JM001C', points: '1,120' },
  { code: 'JM001A', points: '1,071' },
  { code: 'JM001B', points: '866' },
];

type EventResult = {
  id: string;
  title: string;
  category: string;
  winner: string;
  score: string;
  detail: string;
  status: 'Final' | 'Declared' | 'Awaiting';
};

const eventResults: EventResult[] = [
  {
    id: 'r-1',
    title: 'Quran Competition',
    category: 'Competition',
    winner: 'JM001C',
    score: '1,120',
    detail: 'Day 1 · Seminar Hall',
    status: 'Final',
  },
  {
    id: 'r-2',
    title: 'Naat Competition',
    category: 'Competition',
    winner: 'JM001A',
    score: '1,071',
    detail: 'Day 2 · Seminar Hall',
    status: 'Final',
  },
  {
    id: 'r-3',
    title: 'Cultural Night',
    category: 'Cultural',
    winner: 'JM001C',
    score: '1,120',
    detail: 'Day 2 · Main Ground',
    status: 'Declared',
  },
  {
    id: 'r-4',
    title: 'Tarteel',
    category: 'Spiritual',
    winner: 'JM001B',
    score: '866',
    detail: 'Day 1 · Main Stage',
    status: 'Final',
  },
  {
    id: 'r-5',
    title: 'Expert Talk 02',
    category: 'Talk',
    winner: 'Awaiting declaration',
    score: '—',
    detail: 'Day 1 · Main Hall',
    status: 'Awaiting',
  },
];

const categories = ['All', 'Competition', 'Cultural', 'Spiritual', 'Talk'];

const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C801D]';

export default function ResultsPage() {
  const [tab, setTab] = useState<Tab>('Leaderboard');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [loadState, setLoadState] = useState<LoadState>('ready');
  const loadTimer = useRef<number | null>(null);

  // Local-only loading simulation. The reference view is shown immediately;
  // the first refresh fails so the retry state can be seen, then retry succeeds.
  useEffect(
    () => () => {
      if (loadTimer.current !== null) window.clearTimeout(loadTimer.current);
    },
    [],
  );

  function beginLoad(shouldFail: boolean) {
    if (loadTimer.current !== null) window.clearTimeout(loadTimer.current);
    setLoadState('loading');
    loadTimer.current = window.setTimeout(() => {
      setLoadState(shouldFail ? 'error' : 'ready');
      loadTimer.current = null;
    }, 600);
  }

  function refresh() {
    beginLoad(true);
  }

  function retry() {
    beginLoad(false);
  }

  const search = query.trim().toLowerCase();
  const filteredResults = eventResults.filter((result) => {
    const matchesCategory = category === 'All' || result.category === category;
    const matchesSearch =
      search.length === 0 ||
      `${result.title} ${result.winner} ${result.detail}`.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <AppShell showBottomNav>
      <div className="min-h-full bg-[#F2F7F3] pb-8">
        <header className="flex min-h-[64px] items-center justify-between px-5 pb-2 pt-[max(12px,env(safe-area-inset-top))]">
          <h1 className="text-[18px] font-extrabold tracking-tight text-[#0C3523]">Results</h1>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-[#DCFCE7] px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest text-[#15803D]">
              <Radio size={11} aria-hidden="true" /> Live
            </span>
            <button
              type="button"
              onClick={refresh}
              aria-label="Refresh results"
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#5B8A6C] shadow-sm transition-colors hover:bg-[#ECFDF3] ${focusOnLight}`}
            >
              <RefreshCw size={15} aria-hidden="true" />
            </button>
          </div>
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

        {loadState === 'loading' ? (
          <div className="px-4 pt-6" role="status" aria-label="Loading results">
            <span className="sr-only">Loading results…</span>
            <div className="skeleton h-[150px] rounded-[24px]" />
            <div className="mt-4 space-y-2">
              <div className="skeleton h-[70px] rounded-[20px]" />
              <div className="skeleton h-[70px] rounded-[20px]" />
              <div className="skeleton h-[70px] rounded-[20px]" />
            </div>
          </div>
        ) : loadState === 'error' ? (
          <div className="px-4 pt-6" role="alert">
            <div className="rounded-[24px] bg-white px-6 py-10 text-center shadow-sm">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEA] text-[#B64235]">
                <AlertCircle size={22} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[14px] font-extrabold text-[#0C3523]">
                Couldn&apos;t refresh results
              </h2>
              <p className="mx-auto mt-2 max-w-[260px] text-[11px] leading-relaxed text-[#6B7B72]">
                The demo results are still available. Try again to load the latest standings.
              </p>
              <button
                type="button"
                onClick={retry}
                className={`mx-auto mt-5 flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#0C801D] px-6 text-[11px] font-bold text-white transition-colors hover:bg-[#0A6E19] ${focusOnLight}`}
              >
                <RefreshCw size={14} aria-hidden="true" /> Retry
              </button>
            </div>
          </div>
        ) : tab === 'Leaderboard' ? (
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

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Result categories">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                  className={`min-h-[38px] shrink-0 rounded-full px-4 text-[10px] font-bold transition-colors ${focusOnLight} ${
                    category === item
                      ? 'bg-[#0C801D] text-white'
                      : 'bg-white text-[#6B7B72] shadow-sm'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-3">
              <span className="inline-flex rounded-full bg-[#E5F0EA] px-3 py-1 text-[10px] font-bold text-[#5B6B61]">
                {filteredResults.length} announced events
              </span>
            </div>

            {filteredResults.length === 0 ? (
              <div className="mt-16 text-center">
                <p className="text-[14px] font-extrabold text-[#0C3523]">No events found</p>
                <p className="mx-auto mt-2 max-w-[280px] text-[11px] leading-relaxed text-[#6B7B72]">
                  Try another search term or category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setCategory('All');
                  }}
                  className={`mx-auto mt-4 min-h-[40px] rounded-full bg-white px-5 text-[11px] font-bold text-[#0C801D] shadow-sm ${focusOnLight}`}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredResults.map((result) => (
                  <article key={result.id} className="rounded-[20px] bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="text-[14px] font-extrabold text-[#0C3523]">{result.title}</h2>
                        <p className="mt-1 text-[11px] text-[#6B7B72]">{result.detail}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide ${
                          result.status === 'Awaiting'
                            ? 'bg-[#FEF3C6] text-[#8A6A00]'
                            : 'bg-[#DCFCE7] text-[#15803D]'
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3 border-t border-[#0C3523]/10 pt-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDE047] text-[#0C3523]">
                        <Trophy size={16} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#5B8A6C]">
                          Winner
                        </p>
                        <p className="truncate text-[13px] font-extrabold text-[#0C3523]">
                          {result.winner}
                        </p>
                      </div>
                      <p className="text-[15px] font-extrabold tabular-nums text-[#0C801D]">
                        {result.score}
                      </p>
                    </div>
                    <div className="mt-3">
                      <span className="inline-flex rounded-full bg-[#E5F0EA] px-2.5 py-1 text-[10px] font-bold text-[#5B6B61]">
                        {result.category}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
