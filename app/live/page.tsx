'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ChevronLeft,
  Clock3,
  Megaphone,
  Play,
  Radio,
  RefreshCw,
  X,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';

type LoadState = 'loading' | 'ready' | 'error';

const stages = [
  { name: 'Stage 01', place: 'Main Stage', status: 'Watching', tone: 'active' },
  { name: 'Stage 02', place: 'MNC Conference Hall', status: 'SOON', tone: 'soon' },
  { name: 'Stage 03', place: 'Zahra Block', status: 'OFFLINE', tone: 'offline' },
  { name: 'Stage 04', place: 'Library', status: 'OFFLINE', tone: 'offline' },
] as const;

type StageName = (typeof stages)[number]['name'];

const stageDetails: Record<StageName, { now: string; next: string; note: string }> = {
  'Stage 01': {
    now: 'Expert talks and recitation',
    next: 'Cultural Night · 7:00 PM',
    note: 'The main stage is the hub of the festival. Seating is first come, first served.',
  },
  'Stage 02': {
    now: 'Preparation in progress',
    next: 'Panel Discussion · 6:30 PM',
    note: 'Sessions will begin shortly. Check back here for the latest stage status.',
  },
  'Stage 03': {
    now: 'No session in progress',
    next: 'Naat Competition · 5:00 PM',
    note: 'This stage is currently offline. The next programme will appear here.',
  },
  'Stage 04': {
    now: 'No session in progress',
    next: 'Tarteel · 7:00 AM',
    note: 'This stage is currently offline. The next programme will appear here.',
  },
};

type UpdateCategory = 'Announcement' | 'Result' | 'Schedule';

type Update = {
  id: string;
  category: UpdateCategory;
  title: string;
  body: string;
  time: string;
  pinned?: boolean;
};

const updates: Update[] = [
  {
    id: 'u-1',
    category: 'Announcement',
    title: 'Main Stage seating rearranged',
    body: 'The front rows are reserved for guests. Please use the side entrances.',
    time: '10 min ago',
    pinned: true,
  },
  {
    id: 'u-2',
    category: 'Schedule',
    title: 'Expert Talk 02 moved to 10:30 AM',
    body: 'The session has shifted to Main Hall. Your saved program updates automatically.',
    time: '35 min ago',
  },
  {
    id: 'u-3',
    category: 'Result',
    title: 'Quran Competition results declared',
    body: 'JM001C leads the overall standings with 1,120 points after 144 results.',
    time: '1 hr ago',
  },
  {
    id: 'u-4',
    category: 'Announcement',
    title: 'Urse Ajmer begins at 4:30 PM',
    body: 'Gather at the Courtyard. Volunteers in green vests will guide the way.',
    time: '2 hr ago',
  },
];

const stageFilters = ['All stages', 'Watching', 'SOON', 'OFFLINE'] as const;
type StageFilter = (typeof stageFilters)[number];

const updateFilters = ['All', 'Announcement', 'Result', 'Schedule'] as const;
type UpdateFilter = (typeof updateFilters)[number];

const focusOnDark =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF6D4]';
const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15532E]';

export default function LivePage() {
  const [selectedName, setSelectedName] = useState<StageName>('Stage 01');
  const [detailName, setDetailName] = useState<StageName | null>(null);
  const [stageFilter, setStageFilter] = useState<StageFilter>('All stages');
  const [updateFilter, setUpdateFilter] = useState<UpdateFilter>('All');
  const [loadState, setLoadState] = useState<LoadState>('ready');
  const loadTimer = useRef<number | null>(null);

  // The reference stage view is shown immediately; refreshing simulates a
  // load and one failure so the error and retry states are reachable.
  useEffect(
    () => () => {
      if (loadTimer.current !== null) window.clearTimeout(loadTimer.current);
    },
    [],
  );

  const selected = stages.find((stage) => stage.name === selectedName) ?? stages[0];
  const detailStage = detailName ? stages.find((stage) => stage.name === detailName) : undefined;
  const visibleStages = stages.filter(
    (stage) => stageFilter === 'All stages' || stage.status === stageFilter,
  );
  const visibleUpdates = updates.filter(
    (update) => updateFilter === 'All' || update.category === updateFilter,
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

  return (
    <AppShell>
      <div className="min-h-full bg-[#F5FAF6]">
        <header className="flex items-center gap-3 bg-[#15532E] px-4 py-4 text-white">
          <Link
            href="/home"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ${focusOnDark}`}
            aria-label="Go back"
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="flex-1 pr-10 text-center text-[18px] font-extrabold">Live Screen</h1>
          <button
            type="button"
            onClick={refresh}
            aria-label="Refresh live updates"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ${focusOnDark}`}
          >
            <RefreshCw size={17} aria-hidden="true" />
          </button>
        </header>

        {loadState === 'loading' ? (
          <div className="px-4 pb-8 pt-4" role="status" aria-label="Loading live screen">
            <span className="sr-only">Loading live screen…</span>
            <div className="skeleton h-[290px] rounded-[20px]" />
            <div className="mt-4 space-y-2">
              <div className="skeleton h-[56px] rounded-[18px]" />
              <div className="skeleton h-[56px] rounded-[18px]" />
              <div className="skeleton h-[56px] rounded-[18px]" />
            </div>
          </div>
        ) : loadState === 'error' ? (
          <div className="px-4 pb-8 pt-6" role="alert">
            <div className="rounded-[24px] bg-white px-6 py-10 text-center shadow-sm">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEA] text-[#B64235]">
                <AlertCircle size={22} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[14px] font-extrabold text-[#15532E]">
                Couldn&apos;t refresh live updates
              </h2>
              <p className="mx-auto mt-2 max-w-[270px] text-[11px] leading-relaxed text-[#6B7B72]">
                The demo stage statuses are unchanged. Try again to reload the screen.
              </p>
              <button
                type="button"
                onClick={retry}
                className={`mx-auto mt-5 flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#15532E] px-6 text-[11px] font-bold text-white ${focusOnDark}`}
              >
                <RefreshCw size={14} aria-hidden="true" /> Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 pb-8 pt-4">
            <div className="rounded-[20px] bg-white p-4 shadow-sm">
              <div className="relative flex h-[190px] items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-[#15532E] to-[#0A3320] sm:h-[230px]">
                <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full border border-white/10" />
                <div className="absolute -bottom-16 right-4 h-44 w-44 rounded-full border border-white/10" />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/40">
                  {selected.tone === 'active' ? (
                    <Play size={24} aria-hidden="true" />
                  ) : (
                    <Radio size={24} aria-hidden="true" />
                  )}
                </span>
                <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-semibold text-white/70">
                  Preview only · no live stream in this prototype
                </p>
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[17px] font-extrabold text-[#15532E]">{selected.name}</p>
                  <p className="mt-1 text-[12px] text-[#15532E]/70">@ {selected.place}</p>
                </div>
                {selected.tone === 'active' ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-[#FEE2E1] px-3 py-1.5 text-[10px] font-extrabold uppercase text-[#AF2120]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#AF2120]" /> LIVE
                  </span>
                ) : (
                  <span className="rounded-full bg-[#EFF3F0] px-3 py-1.5 text-[10px] font-extrabold uppercase text-[#6B7B72]">
                    {selected.status}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDetailName(selected.name)}
                className={`mt-4 flex min-h-[42px] w-full items-center justify-center rounded-full bg-[#EAF4ED] text-[11px] font-bold text-[#15532E] transition-colors hover:bg-[#DDEBDE] ${focusOnLight}`}
              >
                View stage details
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-[#15532E]">All stages</h2>
              <span className="text-[12px] text-[#15532E]/70">{visibleStages.length} stages</span>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Stage filters">
              {stageFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={stageFilter === filter}
                  onClick={() => setStageFilter(filter)}
                  className={`min-h-[36px] shrink-0 rounded-full px-3.5 text-[10px] font-bold transition-colors ${focusOnLight} ${
                    stageFilter === filter
                      ? 'bg-[#15532E] text-white'
                      : 'bg-white text-[#6B7B72] shadow-sm'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-2 space-y-2">
              {visibleStages.map((stage) => {
                const active = stage.tone === 'active';
                const soon = stage.tone === 'soon';
                const selectedStage = stage.name === selectedName;
                return (
                  <button
                    key={stage.name}
                    type="button"
                    onClick={() => {
                      setSelectedName(stage.name);
                      setDetailName(stage.name);
                    }}
                    aria-pressed={selectedStage}
                    aria-label={`Select ${stage.name}, ${stage.place}`}
                    className={`flex min-h-[56px] w-full items-center justify-between gap-3 rounded-[18px] px-4 py-2 text-left transition-shadow ${focusOnLight} ${
                      active ? 'bg-[#15532E] text-white' : 'bg-white text-[#15532E] shadow-sm'
                    } ${selectedStage && !active ? 'ring-2 ring-[#15532E]/30' : ''}`}
                  >
                    <span className="min-w-0">
                      <span className="block text-[14px] font-extrabold">{stage.name}</span>
                      <span
                        className={`mt-0.5 block truncate text-[11px] ${
                          active ? 'text-white/70' : 'text-[#15532E]/60'
                        }`}
                      >
                        {stage.place}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                        active
                          ? 'bg-[#EECE2D] text-[#15532E]'
                          : soon
                            ? 'bg-[#FEF3C6] text-[#8A6A00]'
                            : 'bg-[#EFF3F0] text-[#6B7B72]'
                      }`}
                    >
                      {stage.status}
                    </span>
                  </button>
                );
              })}
            </div>

            <section className="mt-6" aria-label="Important announcements">
              <div className="flex items-center gap-2">
                <Megaphone size={16} className="text-[#15532E]" aria-hidden="true" />
                <h2 className="text-[15px] font-extrabold text-[#15532E]">
                  Important announcements
                </h2>
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Update categories">
                {updateFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={updateFilter === filter}
                    onClick={() => setUpdateFilter(filter)}
                    className={`min-h-[36px] shrink-0 rounded-full px-3.5 text-[10px] font-bold transition-colors ${focusOnLight} ${
                      updateFilter === filter
                        ? 'bg-[#15532E] text-white'
                        : 'bg-white text-[#6B7B72] shadow-sm'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {visibleUpdates.length === 0 ? (
                <div className="mt-3 rounded-[18px] bg-white px-6 py-10 text-center shadow-sm">
                  <h3 className="text-[14px] font-extrabold text-[#15532E]">No updates found</h3>
                  <p className="mx-auto mt-2 max-w-[260px] text-[11px] leading-relaxed text-[#6B7B72]">
                    Try another update category.
                  </p>
                  <button
                    type="button"
                    onClick={() => setUpdateFilter('All')}
                    className={`mx-auto mt-4 min-h-[40px] rounded-full bg-[#EAF4ED] px-5 text-[11px] font-bold text-[#15532E] ${focusOnLight}`}
                  >
                    Show all updates
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {visibleUpdates.map((update) => (
                    <article
                      key={update.id}
                      className={`rounded-[18px] bg-white p-4 shadow-sm ${
                        update.pinned ? 'border-l-4 border-l-[#EECE2D]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex rounded-full bg-[#EAF4ED] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#15532E]">
                          {update.category}
                        </span>
                        <span className="text-[10px] text-[#8C928E]">{update.time}</span>
                      </div>
                      <h3 className="mt-2 text-[13px] font-extrabold text-[#15532E]">
                        {update.title}
                      </h3>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#6B7B72]">
                        {update.body}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {detailStage ? (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${detailStage.name} details`}
        >
          <div className="modal-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8FA79A]">
                  Stage details
                </p>
                <h2 className="mt-1 text-[18px] font-extrabold tracking-tight text-[#15532E]">
                  {detailStage.name}
                </h2>
                <p className="mt-0.5 text-[11px] text-[#6B7B72]">@ {detailStage.place}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailName(null)}
                className="icon-button"
                aria-label="Close stage details"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                  detailStage.tone === 'active'
                    ? 'bg-[#FEE2E1] text-[#AF2120]'
                    : detailStage.tone === 'soon'
                      ? 'bg-[#FEF3C6] text-[#8A6A00]'
                      : 'bg-[#EFF3F0] text-[#6B7B72]'
                }`}
              >
                {detailStage.status}
              </span>
              <span className="rounded-full bg-[#EAF4ED] px-2.5 py-1 text-[10px] font-bold text-[#15532E]">
                {detailStage.place}
              </span>
            </div>

            <div className="mt-4 space-y-3 rounded-[16px] bg-[#F5FAF6] p-4">
              <div className="flex items-start gap-2">
                <Radio size={15} className="mt-0.5 shrink-0 text-[#15532E]" aria-hidden="true" />
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#8FA79A]">
                    Now
                  </p>
                  <p className="text-[12px] font-bold text-[#1A2E23]">
                    {stageDetails[detailStage.name].now}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock3 size={15} className="mt-0.5 shrink-0 text-[#15532E]" aria-hidden="true" />
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#8FA79A]">
                    Up next
                  </p>
                  <p className="text-[12px] font-bold text-[#1A2E23]">
                    {stageDetails[detailStage.name].next}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-[#6B7B72]">
              {stageDetails[detailStage.name].note}
            </p>
            <p className="mt-3 rounded-[14px] bg-[#FDF6D4] px-3 py-2.5 text-[11px] font-semibold leading-relaxed text-[#6B5A16]">
              This is a visual preview only — no external stream is opened from this prototype.
            </p>
            <button
              type="button"
              onClick={() => setDetailName(null)}
              className={`mt-5 flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#15532E] text-[12px] font-bold text-white ${focusOnDark}`}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
