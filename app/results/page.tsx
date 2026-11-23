'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, RefreshCw, Search, Trophy } from 'lucide-react';
import { AppShell } from '@/components/AppShell';

type Tab = 'Leaderboard' | 'Event results';
type LoadState = 'loading' | 'ready' | 'error';

const tabs: Tab[] = ['Leaderboard', 'Event results'];

// Reference standings are kept exactly as shown in the design.
const standings = [
  { code: 'JM001C', points: 1120 },
  { code: 'JM001A', points: 1071 },
  { code: 'JM001B', points: 866 },
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

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b5038]';

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
      <div className="ar-page">
        <div className="px-4 pt-[max(17px,env(safe-area-inset-top))]">
          <section className="res-header-card">
            <div className="res-heading-row">
              <h1 className="ar-heading">Results</h1>
              <div className="flex items-center gap-2">
                <span className="ar-live">Live</span>
                <button
                  type="button"
                  onClick={refresh}
                  aria-label="Refresh results"
                  className={`ar-icon-button ${focusRing}`}
                >
                  <RefreshCw size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="res-tabs ar-tabs" role="tablist" aria-label="Results sections">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={tab === item}
                  data-active={tab === item}
                  onClick={() => setTab(item)}
                  className={`ar-tab ${focusRing}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        </div>

        {loadState === 'loading' ? (
          <div className="px-4 pt-6" role="status" aria-label="Loading results">
            <span className="sr-only">Loading results…</span>
            <div className="skeleton h-[150px] rounded-[27px]" />
            <div className="mt-4 space-y-2">
              <div className="skeleton h-[62px] rounded-[14px]" />
              <div className="skeleton h-[62px] rounded-[14px]" />
              <div className="skeleton h-[62px] rounded-[14px]" />
            </div>
          </div>
        ) : loadState === 'error' ? (
          <div className="px-4 pt-6" role="alert">
            <div className="ar-card px-6 py-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fdecec] text-[#b64235]">
                <AlertCircle size={22} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[14px] font-extrabold text-[#14241d]">
                Couldn&apos;t refresh results
              </h2>
              <p className="mx-auto mt-2 max-w-[260px] text-[11px] leading-relaxed text-[#61716a]">
                The demo results are still available. Try again to load the latest standings.
              </p>
              <button
                type="button"
                onClick={retry}
                className={`mx-auto mt-5 flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#08754b] px-6 text-[11px] font-bold text-white transition-colors hover:bg-[#0b5038] ${focusRing}`}
              >
                <RefreshCw size={14} aria-hidden="true" /> Retry
              </button>
            </div>
          </div>
        ) : tab === 'Leaderboard' ? (
          <div className="res-content px-4" role="tabpanel">
            <section className="res-feature-card">
              <div className="res-feature-orb" aria-hidden="true" />
              <div className="res-feature-body">
                <p className="ar-eyebrow flex items-center gap-2">
                  <span className="grid h-[25px] w-[25px] place-items-center rounded-full bg-[#d7efdf]">
                    <Trophy size={13} aria-hidden="true" />
                  </span>
                  Currently leading
                </p>
                <h2>JM001C</h2>
                <strong className="res-feature-points">1,120</strong>
                <p className="res-feature-caption">points</p>
              </div>
            </section>

            <p className="res-update">After 144 Results</p>

            <div className="flex flex-col gap-[7px]">
              {standings.map((row, index) => (
                <div key={row.code} className="res-rank" data-place={index + 1}>
                  <span className="res-rank-num">{index + 1}</span>
                  <div className="res-rank-body">
                    <div className="res-rank-line">
                      <span className="res-rank-name">{row.code}</span>
                      <strong>{row.points.toLocaleString('en-US')}</strong>
                    </div>
                    <div className="res-rank-track">
                      <i
                        className="res-rank-fill"
                        style={{ width: `${Math.round((row.points / standings[0].points) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="res-content px-4" role="tabpanel">
            <label className="ar-search">
              <Search className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="sr-only">Search events</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events"
              />
            </label>

            <div className="ar-chip-row mt-3" aria-label="Result categories">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={category === item}
                  data-active={category === item}
                  onClick={() => setCategory(item)}
                  className={`ar-chip ${focusRing}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <p className="ar-muted-caption ml-1 mt-3">{filteredResults.length} announced events</p>

            {filteredResults.length === 0 ? (
              <div className="ar-empty" role="status">
                <strong>No events found</strong>
                <p>Try another search term or category.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setCategory('All');
                  }}
                  className={`mt-4 min-h-[40px] rounded-full border border-[#dce8e0] bg-white px-5 text-[11px] font-bold text-[#08754b] ${focusRing}`}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-[9px] sm:grid-cols-2">
                {filteredResults.map((result) => (
                  <article
                    key={result.id}
                    className="flex items-center gap-[11px] rounded-[16px] border border-[#dbe6df] bg-white p-[13px]"
                  >
                    <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[12px] bg-[#eaf6ed] text-[#16804c]">
                      <Trophy size={17} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <strong className="block text-[12px] font-bold text-[#14241d]">
                        {result.title}
                      </strong>
                      <small className="mt-[3px] block text-[9px] not-italic text-[#829087]">
                        {result.detail}
                      </small>
                      <span className="mt-1 block truncate text-[10px] font-bold text-[#15814b]">
                        {result.winner} · {result.score}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-extrabold uppercase tracking-wide ${
                        result.status === 'Awaiting'
                          ? 'bg-[#fef3c6] text-[#8a6a00]'
                          : 'bg-[#e6f5ea] text-[#267c4f]'
                      }`}
                    >
                      {result.status}
                    </span>
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
