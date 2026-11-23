'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronLeft,
  Clock3,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { usePrototype } from '@/lib/prototype-store';
import type { Program } from '@/lib/types';

type Entry = {
  time: string;
  duration: string;
  title: string;
  category: string;
};

const stageData: Record<string, { date: string; entries: Entry[] }> = {
  'Stage 1': {
    date: 'Thursday, 19/11/2026',
    entries: [
      { time: '2:40PM - 3:20PM', duration: 'Duration: 40m', title: 'Tarteel', category: 'Senior' },
      { time: '4:00PM - 5:00PM', duration: 'Duration: 1h', title: 'Sharia Talk', category: 'Senior' },
      { time: '5:00PM - 5:45PM', duration: 'Duration: 45m', title: 'Arabic Kathaprasangam', category: 'Junior' },
      { time: '6:30PM - 7:30PM', duration: 'Duration: 1h', title: 'Jalsa Arabic', category: 'Junior' },
      { time: '7:30PM - 8:30PM', duration: 'Duration: 1h', title: 'Mappilappattu', category: 'Junior' },
      { time: '9:15PM - 10:15PM', duration: 'Duration: 1h', title: 'Madh Song', category: 'Senior' },
      { time: '10:15PM - 10:45PM', duration: 'Duration: 30m', title: 'Qaseeda', category: 'General' },
    ],
  },
  'Stage 2': {
    date: 'Thursday, 19/11/2026',
    entries: [
      { time: '4:00PM - 5:00PM', duration: 'Duration: 1h', title: 'Expert Talk', category: 'Senior' },
      { time: '6:30PM - 7:30PM', duration: 'Duration: 1h', title: 'Panel Discussion', category: 'General' },
    ],
  },
  'Stage 3': {
    date: 'Thursday, 19/11/2026',
    entries: [
      { time: '5:00PM - 5:45PM', duration: 'Duration: 45m', title: 'Naat Competition', category: 'Junior' },
    ],
  },
  'Stage 4': {
    date: 'Friday, 20/11/2026',
    entries: [
      { time: '7:00AM - 7:40AM', duration: 'Duration: 40m', title: 'Tarteel', category: 'Junior' },
    ],
  },
  'Stage 5': {
    date: 'Friday, 20/11/2026',
    entries: [
      { time: '10:00AM - 11:00AM', duration: 'Duration: 1h', title: 'Quiz Finale', category: 'General' },
    ],
  },
};

const stages = Object.keys(stageData);

// The extra day-wise card from the reference lives under Stage 1.
const extraFridayEntry: Entry = {
  time: '7:00AM - 7:40AM',
  duration: 'Duration: 40m',
  title: 'Tarteel',
  category: 'Junior',
};

const stageVenues: Record<string, string> = {
  'Stage 1': 'Main Stage',
  'Stage 2': 'MNC Conference Hall',
  'Stage 3': 'Zahra Block',
  'Stage 4': 'Library',
  'Stage 5': 'Seminar Hall',
};

const categories = ['All', 'Senior', 'Junior', 'General'];

const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15532E]';
const focusOnDark =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF6D4]';

function entryId(stage: string, entry: Entry) {
  return `${stage}-${entry.time}-${entry.title}`.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

export default function SchedulePage() {
  const { session, toggleProgram } = usePrototype();
  const [active, setActive] = useState('Stage 1');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [detail, setDetail] = useState<{ stage: string; entry: Entry } | null>(null);
  const [notice, setNotice] = useState('');

  const current = stageData[active];
  const pool = active === 'Stage 1' ? [...current.entries, extraFridayEntry] : current.entries;
  const search = query.trim().toLowerCase();
  const visible = pool.filter((entry) => {
    const matchesCategory = category === 'All' || entry.category === category;
    const matchesSearch =
      search.length === 0 ||
      `${entry.title} ${entry.category} ${entry.time}`.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });
  const mainEntries = visible.filter((entry) => entry !== extraFridayEntry);
  const extraVisible = visible.includes(extraFridayEntry);

  function programFor(stage: string, entry: Entry): Program {
    return {
      id: entryId(stage, entry),
      title: entry.title,
      venue: stageVenues[stage] ?? stage,
      start: entry.time,
      day: stageData[stage].date,
    };
  }

  function isRegistered(stage: string, entry: Entry) {
    return session.registered.includes(entryId(stage, entry));
  }

  function toggleRegistration(stage: string, entry: Entry) {
    const wasRegistered = isRegistered(stage, entry);
    toggleProgram(programFor(stage, entry));
    setNotice(wasRegistered ? `${entry.title} removed from your program.` : `${entry.title} added to your program.`);
  }

  function clearFilters() {
    setQuery('');
    setCategory('All');
  }

  const detailRegistered = detail ? isRegistered(detail.stage, detail.entry) : false;

  return (
    <AppShell>
      <div className="min-h-full bg-[#F6F8F5]">
        <header className="flex items-center gap-3 bg-[#15532E] px-4 py-4 text-white">
          <Link
            href="/home"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ${focusOnDark}`}
            aria-label="Go back"
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="flex-1 pr-10 text-center text-[18px] font-extrabold">Schedule</h1>
        </header>

        <div className="flex gap-2 overflow-x-auto bg-white px-4 py-3" aria-label="Stages">
          {stages.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => {
                setActive(stage);
                setDetail(null);
              }}
              aria-pressed={stage === active}
              className={`min-h-[40px] shrink-0 rounded-full px-4 text-[12px] font-bold transition-colors ${focusOnLight} ${
                stage === active ? 'bg-[#15532E] text-white' : 'bg-[#F6F8F5] text-[#6B7B72]'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>

        <div className="px-4 pb-8 pt-3">
          <label className="flex min-h-[46px] items-center gap-2.5 rounded-[16px] bg-white px-4 shadow-sm focus-within:ring-2 focus-within:ring-[#15532E]/20">
            <Search className="h-[18px] w-[18px] shrink-0 text-[#8FA79A]" aria-hidden="true" />
            <span className="sr-only">Search schedule</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search events"
              className="w-full bg-transparent text-[12px] text-[#1A2E23] outline-none placeholder:text-[#9AA19C]"
            />
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Event categories">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`min-h-[38px] shrink-0 rounded-full px-4 text-[10px] font-bold transition-colors ${focusOnLight} ${
                  category === item ? 'bg-[#15532E] text-white' : 'bg-white text-[#6B7B72] shadow-sm'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {notice ? (
            <p
              role="status"
              className="mt-3 rounded-[14px] bg-[#ECFDF3] px-4 py-2.5 text-[11px] font-semibold text-[#0C801D]"
            >
              {notice}
            </p>
          ) : null}

          {visible.length === 0 ? (
            <div className="mt-4 flex flex-col items-center rounded-[20px] bg-white px-6 py-12 text-center shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF3F0] text-[#6B7B72]">
                <Search size={22} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[14px] font-extrabold text-[#1A2E23]">No events found</h2>
              <p className="mx-auto mt-2 max-w-[260px] text-[11px] leading-relaxed text-[#6B7B72]">
                Try another search term or category.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className={`mt-4 min-h-[40px] rounded-full bg-[#15532E] px-6 text-[11px] font-bold text-white ${focusOnDark}`}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {mainEntries.length > 0 ? (
                <section aria-label={`${active} schedule`}>
                  <h2 className="mt-5 text-[13px] font-bold text-[#8C928E]">{current.date}</h2>
                  <div className="mt-2 space-y-2">
                    {mainEntries.map((entry) => {
                      const registered = isRegistered(active, entry);
                      const selected = detail?.stage === active && detail.entry === entry;
                      return (
                        <article
                          key={entryId(active, entry)}
                          className={`rounded-[16px] bg-white px-4 py-2.5 shadow-sm ${
                            selected ? 'ring-2 ring-[#15532E]/25' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setDetail({ stage: active, entry })}
                            className={`w-full text-left ${focusOnLight}`}
                            aria-label={`View details for ${entry.title}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-[11px] font-semibold text-[#3F4B55]">{entry.time}</p>
                              <p className="text-[10px] text-[#9AA19C]">{entry.duration}</p>
                            </div>
                            <div className="mt-1 flex items-center justify-between gap-2">
                              <h3 className="truncate text-[14px] font-extrabold text-[#1A2E23]">
                                {entry.title}
                              </h3>
                              <span className="shrink-0 rounded-full bg-[#EFF3F0] px-2.5 py-0.5 text-[9px] font-bold text-[#6B7B72]">
                                {entry.category}
                              </span>
                            </div>
                          </button>
                          <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#0C3523]/10 pt-2">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                                registered ? 'text-[#0C801D]' : 'text-[#9AA19C]'
                              }`}
                            >
                              {registered ? <Check size={12} aria-hidden="true" /> : null}
                              {registered ? 'In your program' : 'Not saved yet'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleRegistration(active, entry)}
                              className={`min-h-[32px] rounded-full px-3 text-[10px] font-bold ${
                                registered
                                  ? 'bg-[#EFF3F0] text-[#6B7B72]'
                                  : 'bg-[#E6F3EA] text-[#15532E]'
                              } ${focusOnLight}`}
                            >
                              {registered ? 'Remove' : 'Add'}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {extraVisible ? (
                <section aria-label="Friday schedule">
                  <h2 className="mt-5 text-[13px] font-bold text-[#8C928E]">Friday, 20/11/2026</h2>
                  <div className="mt-2 space-y-2">
                    <article
                      className={`rounded-[16px] bg-white px-4 py-2.5 shadow-sm ${
                        detail?.stage === active && detail.entry === extraFridayEntry
                          ? 'ring-2 ring-[#15532E]/25'
                          : ''
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setDetail({ stage: active, entry: extraFridayEntry })}
                        className={`w-full text-left ${focusOnLight}`}
                        aria-label="View details for Tarteel"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[11px] font-semibold text-[#3F4B55]">
                            {extraFridayEntry.time}
                          </p>
                          <p className="text-[10px] text-[#9AA19C]">{extraFridayEntry.duration}</p>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <h3 className="text-[14px] font-extrabold text-[#1A2E23]">
                            {extraFridayEntry.title}
                          </h3>
                          <span className="shrink-0 rounded-full bg-[#EFF3F0] px-2.5 py-0.5 text-[9px] font-bold text-[#6B7B72]">
                            {extraFridayEntry.category}
                          </span>
                        </div>
                      </button>
                      <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#0C3523]/10 pt-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                            isRegistered(active, extraFridayEntry)
                              ? 'text-[#0C801D]'
                              : 'text-[#9AA19C]'
                          }`}
                        >
                          {isRegistered(active, extraFridayEntry) ? (
                            <Check size={12} aria-hidden="true" />
                          ) : null}
                          {isRegistered(active, extraFridayEntry)
                            ? 'In your program'
                            : 'Not saved yet'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleRegistration(active, extraFridayEntry)}
                          className={`min-h-[32px] rounded-full px-3 text-[10px] font-bold ${
                            isRegistered(active, extraFridayEntry)
                              ? 'bg-[#EFF3F0] text-[#6B7B72]'
                              : 'bg-[#E6F3EA] text-[#15532E]'
                          } ${focusOnLight}`}
                        >
                          {isRegistered(active, extraFridayEntry) ? 'Remove' : 'Add'}
                        </button>
                      </div>
                    </article>
                  </div>
                </section>
              ) : null}
            </>
          )}
        </div>
      </div>

      {detail ? (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${detail.entry.title} details`}
        >
          <div className="modal-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8FA79A]">
                  {detail.stage} · {stageData[detail.stage].date}
                </p>
                <h2 className="mt-1 text-[18px] font-extrabold tracking-tight text-[#15532E]">
                  {detail.entry.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="icon-button"
                aria-label="Close event details"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF4ED] px-2.5 py-1 text-[10px] font-bold text-[#15532E]">
                <Clock3 size={12} aria-hidden="true" /> {detail.entry.time}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF4ED] px-2.5 py-1 text-[10px] font-bold text-[#15532E]">
                <MapPin size={12} aria-hidden="true" /> {stageVenues[detail.stage]}
              </span>
              <span className="rounded-full bg-[#FDF6D4] px-2.5 py-1 text-[10px] font-bold text-[#15532E]">
                {detail.entry.category}
              </span>
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-[#6B7B72]">
              {detail.entry.duration}. Held at {stageVenues[detail.stage]} as part of the {detail.stage}{' '}
              programme. Arrive a few minutes early and carry your participant card.
            </p>

            <button
              type="button"
              onClick={() => toggleRegistration(detail.stage, detail.entry)}
              className={`mt-5 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full text-[12px] font-bold text-white transition-colors ${
                detailRegistered
                  ? 'bg-[#6B7B72] hover:bg-[#5B6B61]'
                  : 'bg-[#15532E] hover:bg-[#0E3D21]'
              } ${focusOnLight}`}
            >
              {detailRegistered ? <Check size={15} aria-hidden="true" /> : null}
              {detailRegistered ? 'Remove from my program' : 'Add to my program'}
            </button>
            <button
              type="button"
              onClick={() => setDetail(null)}
              className={`mt-2 flex min-h-[42px] w-full items-center justify-center rounded-full border border-[#15532E]/15 text-[11px] font-bold text-[#15532E] ${focusOnLight}`}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
