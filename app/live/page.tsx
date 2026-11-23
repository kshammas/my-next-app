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
      <div className="min-h-full bg-[#f3f8f5]">
        <header className="relative flex h-[94px] items-center justify-center bg-[#15563A] text-white">
          <Link
            href="/home"
            className={`absolute left-[15px] flex h-[53px] w-[53px] items-center justify-center rounded-full bg-white/10 ${focusOnDark}`}
            aria-label="Go back"
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="text-[20px] font-[730] tracking-[-0.4px]">Live Screen</h1>
          <button
            type="button"
            onClick={refresh}
            aria-label="Refresh live updates"
            className={`absolute right-[15px] flex h-[53px] w-[53px] items-center justify-center rounded-full bg-white/10 ${focusOnDark}`}
          >
            <RefreshCw size={17} aria-hidden="true" />
          </button>
        </header>

        {loadState === 'loading' ? (
          <div
            className="px-3 pb-[35px] pt-[18px] sm:px-[18px]"
            role="status"
            aria-label="Loading live screen"
          >
            <span className="sr-only">Loading live screen…</span>
            <div className="skeleton aspect-[1.18/1] rounded-[19px]" />
            <div className="mt-4 space-y-[9px] px-[10px]">
              <div className="skeleton h-[75px] rounded-[25px]" />
              <div className="skeleton h-[75px] rounded-[25px]" />
              <div className="skeleton h-[75px] rounded-[25px]" />
            </div>
          </div>
        ) : loadState === 'error' ? (
          <div className="px-3 pb-[35px] pt-6 sm:px-[18px]" role="alert">
            <div className="rounded-[25px] border border-[#D7E6DC] bg-white px-6 py-10 text-center shadow-sm">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FDE5E3] text-[#B73331]">
                <AlertCircle size={22} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[15px] font-[750] text-[#16583B]">
                Couldn&apos;t refresh live updates
              </h2>
              <p className="mx-auto mt-2 max-w-[270px] text-[11px] leading-relaxed text-[#6B7B72]">
                The demo stage statuses are unchanged. Try again to reload the screen.
              </p>
              <button
                type="button"
                onClick={retry}
                className={`mx-auto mt-5 flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(100deg,#22A972,#08764B)] px-6 text-[11px] font-bold text-white ${focusOnDark}`}
              >
                <RefreshCw size={14} aria-hidden="true" /> Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="px-3 pb-[35px] pt-[18px] sm:px-[18px]">
            <div className="relative flex aspect-[1.18/1] flex-col items-center justify-center overflow-hidden rounded-[19px] bg-black text-[#F6D124]">
              <span className="relative flex h-[35px] w-[35px] items-center justify-center">
                <span className="absolute inset-0 animate-spin rounded-full border-4 border-b-[#F0CD1D] border-l-[#F0CD1D] border-r-transparent border-t-transparent" />
                <span className="relative text-[#F6D124]">
                  {selected.tone === 'active' ? (
                    <Play size={14} aria-hidden="true" />
                  ) : (
                    <Radio size={14} aria-hidden="true" />
                  )}
                </span>
              </span>
              <p className="mt-3 text-center text-[9px] text-[#919191]">
                Preview only · no live stream in this prototype
              </p>
            </div>

            <div className="mb-[26px] mt-[17px] flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="m-0 mb-1 text-[23px] font-[750] leading-tight tracking-[-0.7px] text-[#16583B]">
                  {selected.name}
                </h2>
                <p className="m-0 flex items-center gap-[5px] text-[12px] text-[#7E8C84]">
                  @ {selected.place}
                </p>
              </div>
              {selected.tone === 'active' ? (
                <span className="inline-flex min-h-[27px] shrink-0 items-center gap-[7px] rounded-[18px] bg-[#FDE5E3] px-[11px] text-[11px] font-[750] text-[#B73331]">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#DC2B28]" /> LIVE
                </span>
              ) : (
                <span
                  className={`inline-flex min-h-[27px] shrink-0 items-center gap-[7px] rounded-[18px] px-[11px] text-[11px] font-[750] ${
                    selected.tone === 'soon'
                      ? 'bg-[#FFF4C9] text-[#8A5A17]'
                      : 'bg-[#EDF5EF] text-[#82978A]'
                  }`}
                >
                  <span
                    className={`h-[7px] w-[7px] rounded-full ${
                      selected.tone === 'soon' ? 'bg-[#D59D16]' : 'bg-[#95AA9C]'
                    }`}
                  />{' '}
                  {selected.status}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setDetailName(selected.name)}
              className={`flex min-h-[38px] w-full items-center justify-center rounded-[17px] bg-[#E5F1E9] text-[10px] font-bold text-[#245D40] transition-colors hover:bg-[#D6EADB] ${focusOnLight}`}
            >
              View stage details
            </button>

            <div className="mb-3 mt-6 flex items-center justify-between">
              <h2 className="text-[17px] font-[750] tracking-[-0.4px] text-[#16583B]">
                All stages
              </h2>
              <span className="text-[11px] text-[#7E8C84]">{visibleStages.length} stages</span>
            </div>

            <div className="flex gap-[7px] overflow-x-auto pb-1" aria-label="Stage filters">
              {stageFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={stageFilter === filter}
                  onClick={() => setStageFilter(filter)}
                  className={`inline-flex h-[28px] shrink-0 items-center rounded-[22px] px-[14px] text-[10px] font-bold transition-colors ${focusOnLight} ${
                    stageFilter === filter
                      ? 'bg-[linear-gradient(100deg,#22A972,#08764B)] text-white'
                      : 'bg-[#E5F1E9] text-[#245D40]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-3 grid gap-[9px] px-[10px]">
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
                    className={`flex min-h-[75px] w-full items-center justify-between gap-3 rounded-[25px] border px-[14px] py-3 text-left text-[#185B3B] transition-colors ${focusOnLight} ${
                      selectedStage
                        ? 'border-[#155B3B] bg-[#155B3B] text-white'
                        : 'border-[#D7E6DC] bg-white hover:bg-[#F7FBF8]'
                    } ${stage.tone === 'offline' ? 'opacity-60' : ''}`}
                  >
                    <span className="flex min-w-0 flex-col gap-[3px]">
                      <span className="text-[16px] font-[740]">{stage.name}</span>
                      <span
                        className={`truncate text-[12px] ${
                          selectedStage ? 'text-[#ADCAB8]' : 'text-[#829187]'
                        }`}
                      >
                        {stage.place}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-[17px] ${
                        selectedStage
                          ? 'bg-transparent p-0 text-[12px] font-[750] normal-case text-[#F0DC44]'
                          : `px-3 py-[7px] text-[10px] font-[750] uppercase ${
                              soon || active
                                ? 'bg-[#FFF4C7] text-[#89521A]'
                                : 'bg-[#ECF5EE] text-[#82968A]'
                            }`
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
                <Megaphone size={16} className="text-[#15563A]" aria-hidden="true" />
                <h2 className="text-[17px] font-[750] tracking-[-0.4px] text-[#16583B]">
                  Important announcements
                </h2>
              </div>

              <div className="mt-3 flex gap-[7px] overflow-x-auto pb-1" aria-label="Update categories">
                {updateFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={updateFilter === filter}
                    onClick={() => setUpdateFilter(filter)}
                    className={`inline-flex h-[28px] shrink-0 items-center rounded-[22px] px-[14px] text-[10px] font-bold transition-colors ${focusOnLight} ${
                      updateFilter === filter
                        ? 'bg-[linear-gradient(100deg,#22A972,#08764B)] text-white'
                        : 'bg-[#E5F1E9] text-[#245D40]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {visibleUpdates.length === 0 ? (
                <div className="mt-3 rounded-[25px] border border-[#D7E6DC] bg-white px-6 py-10 text-center shadow-sm">
                  <h3 className="text-[14px] font-[750] text-[#16583B]">No updates found</h3>
                  <p className="mx-auto mt-2 max-w-[260px] text-[11px] leading-relaxed text-[#6B7B72]">
                    Try another update category.
                  </p>
                  <button
                    type="button"
                    onClick={() => setUpdateFilter('All')}
                    className={`mx-auto mt-4 min-h-[40px] rounded-full bg-[#E5F1E9] px-5 text-[11px] font-bold text-[#245D40] ${focusOnLight}`}
                  >
                    Show all updates
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-[9px]">
                  {visibleUpdates.map((update) => (
                    <article
                      key={update.id}
                      className={`rounded-[18px] bg-white p-4 shadow-sm ${
                        update.pinned
                          ? 'border-y border-r border-y-[#D7E6DC] border-r-[#D7E6DC] border-l-4 border-l-[#F8E34D]'
                          : 'border border-[#D7E6DC]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex rounded-full bg-[#E6F5EA] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#286B48]">
                          {update.category}
                        </span>
                        <span className="text-[10px] text-[#93A098]">{update.time}</span>
                      </div>
                      <h3 className="mt-2 text-[13px] font-[750] text-[#16583B]">{update.title}</h3>
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
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#286B48]">
                  Stage details
                </p>
                <h2 className="mt-1 text-[18px] font-[750] tracking-tight text-[#0B2118]">
                  {detailStage.name}
                </h2>
                <p className="mt-0.5 text-[11px] text-[#61716A]">@ {detailStage.place}</p>
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
                className={`inline-flex min-h-[27px] items-center gap-[7px] rounded-[18px] px-[11px] text-[11px] font-[750] ${
                  detailStage.tone === 'active'
                    ? 'bg-[#FDE5E3] text-[#B73331]'
                    : detailStage.tone === 'soon'
                      ? 'bg-[#FFF4C9] text-[#8A5A17]'
                      : 'bg-[#EDF5EF] text-[#82978A]'
                }`}
              >
                <span
                  className={`h-[7px] w-[7px] rounded-full ${
                    detailStage.tone === 'active'
                      ? 'bg-[#DC2B28]'
                      : detailStage.tone === 'soon'
                        ? 'bg-[#D59D16]'
                        : 'bg-[#95AA9C]'
                  }`}
                />{' '}
                {detailStage.status}
              </span>
              <span className="rounded-full bg-[#E6F5EA] px-2.5 py-1 text-[10px] font-bold text-[#286B48]">
                {detailStage.place}
              </span>
            </div>

            <div className="mt-4 space-y-3 rounded-[16px] bg-[#F3F8F5] p-4">
              <div className="flex items-start gap-2">
                <Radio size={15} className="mt-0.5 shrink-0 text-[#15563A]" aria-hidden="true" />
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#286B48]">
                    Now
                  </p>
                  <p className="text-[12px] font-bold text-[#14241D]">
                    {stageDetails[detailStage.name].now}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock3 size={15} className="mt-0.5 shrink-0 text-[#15563A]" aria-hidden="true" />
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#286B48]">
                    Up next
                  </p>
                  <p className="text-[12px] font-bold text-[#14241D]">
                    {stageDetails[detailStage.name].next}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-[#61716A]">
              {stageDetails[detailStage.name].note}
            </p>
            <p className="mt-3 rounded-[14px] bg-[#FDF6D4] px-3 py-2.5 text-[11px] font-semibold leading-relaxed text-[#6B5A16]">
              This is a visual preview only — no external stream is opened from this prototype.
            </p>
            <button
              type="button"
              onClick={() => setDetailName(null)}
              className={`mt-5 flex min-h-[44px] w-full items-center justify-center rounded-full bg-[linear-gradient(100deg,#22A972,#08764B)] text-[12px] font-bold text-white ${focusOnDark}`}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
