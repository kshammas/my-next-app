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
} from '@/components/icons';
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

function shortDay(date: string) {
  const [weekday, rest] = date.split(', ');
  const day = rest?.split('/')[0] ?? '';
  return `${(weekday ?? '').slice(0, 3).toUpperCase()} ${day}`.trim();
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
      <div className="ar-page">
        <header className="flex items-center gap-3 bg-[#0b5038] px-4 py-3.5 text-white">
          <Link
            href="/home"
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 ${focusOnDark}`}
            aria-label="Go back"
          >
            <ChevronLeft size={20} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="flex-1 pr-9 text-center text-[14px] font-bold">Schedule</h1>
        </header>

        <div className="mx-4 mt-2 grid grid-cols-3 gap-[7px]" aria-label="Stages">
          {stages.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => {
                setActive(stage);
                setDetail(null);
              }}
              aria-pressed={stage === active}
              className={`flex min-h-[48px] flex-col justify-center gap-[3px] rounded-[13px] border px-2.5 py-1.5 text-left transition-colors ${focusOnLight} ${
                stage === active
                  ? 'border-[#c6e1cf] bg-[#e9f5ec] text-[#176c41]'
                  : 'border-[#dfe9e2] bg-white text-[#718279]'
              }`}
            >
              <small className="text-[7px] font-bold uppercase tracking-[0.7px]">
                {shortDay(stageData[stage].date)}
              </small>
              <strong className="text-[10px] font-bold">{stage}</strong>
            </button>
          ))}
        </div>

        <div className="px-4 pb-8 pt-3">
          <label className="ar-search focus-within:ring-2 focus-within:ring-[#16824f]/20">
            <Search className="h-[18px] w-[18px] shrink-0 text-[#8ca197]" aria-hidden="true" />
            <span className="sr-only">Search schedule</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search events"
              className="text-[12px]"
            />
          </label>

          <div className="ar-chip-row mt-3 pb-1" aria-label="Event categories">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                data-active={category === item}
                className={`ar-chip ${focusOnLight}`}
              >
                {item}
              </button>
            ))}
          </div>

          {notice ? (
            <p
              role="status"
              className="mt-3 rounded-[14px] border border-[#cbe6d5] bg-[#edf7f0] px-3 py-2.5 text-[10px] font-semibold text-[#15774a]"
            >
              {notice}
            </p>
          ) : null}

          {visible.length === 0 ? (
            <div className="ar-empty mt-4 rounded-[16px] border border-[#e3efe8] bg-white px-6 py-10">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#eef3f0] text-[#61716a]">
                <Search size={22} aria-hidden="true" />
              </span>
              <strong className="mt-3">No events found</strong>
              <p className="mx-auto max-w-[240px]">Try another search term or category.</p>
              <button
                type="button"
                onClick={clearFilters}
                className={`mt-4 min-h-[38px] rounded-full bg-[#16824f] px-6 text-[10px] font-bold text-white ${focusOnDark}`}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {mainEntries.length > 0 ? (
                <section aria-label={`${active} schedule`}>
                  <div className="mb-2.5 mt-4 flex items-baseline justify-between gap-3">
                    <h2 className="m-0 text-[14px] font-bold text-[#1b5237]">{current.date}</h2>
                    <span className="text-[9px] text-[#8a978f]">{mainEntries.length} events</span>
                  </div>
                  <div className="grid gap-0">
                    {mainEntries.map((entry) => {
                      const registered = isRegistered(active, entry);
                      const selected = detail?.stage === active && detail.entry === entry;
                      return (
                        <article
                          key={entryId(active, entry)}
                          className="grid grid-cols-[55px_16px_1fr] gap-[7px]"
                        >
                          <div className="flex flex-col items-end pt-[3px]">
                            <strong className="text-[9px] font-bold text-[#53685a]">{entry.time}</strong>
                            <span className="mt-1 text-[8px] text-[#a0aaa4]">{entry.duration}</span>
                          </div>
                          <div className="relative flex justify-center">
                            <span
                              aria-hidden="true"
                              className="absolute bottom-[-5px] left-1/2 top-3 w-px -translate-x-1/2 bg-[#d5e6db]"
                            />
                            <i
                              aria-hidden="true"
                              className={`relative z-[1] mt-1 h-[9px] w-[9px] rounded-full border-2 ${
                                registered
                                  ? 'border-[#137d49] bg-[#16834e] shadow-[0_0_0_3px_#e2f1e6]'
                                  : 'border-[#b5d8c1] bg-[#f4f9f5]'
                              }`}
                            />
                          </div>
                          <div
                            className={`relative min-h-[83px] rounded-[14px] border border-[#dce8e0] bg-white p-[9px_10px] shadow-[0_1px_3px_rgba(16,57,38,0.05)] ${
                              selected ? 'ring-2 ring-[#16824f]/25' : ''
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setDetail({ stage: active, entry })}
                              className={`block w-full text-left ${registered ? 'pr-6' : ''} ${focusOnLight}`}
                              aria-label={`View details for ${entry.title}`}
                            >
                              <span className="block text-[7px] font-bold uppercase tracking-[0.7px] text-[#14804b]">
                                {entry.category}
                              </span>
                              <strong className="mt-1 block truncate text-[11px] font-bold text-[#254431]">
                                {entry.title}
                              </strong>
                              <small className="mt-1 flex items-center gap-1 text-[8px] text-[#89978f]">
                                <MapPin size={10} aria-hidden="true" /> {stageVenues[active]}
                              </small>
                            </button>
                            {registered ? (
                              <span className="absolute right-[9px] top-[9px] text-[#15774a]">
                                <Check size={12} aria-hidden="true" />
                              </span>
                            ) : null}
                            <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#e6efe9] pt-2">
                              <span
                                className={`inline-flex items-center gap-1 text-[8px] font-bold ${
                                  registered ? 'text-[#15774a]' : 'text-[#94a29a]'
                                }`}
                              >
                                {registered ? <Check size={10} aria-hidden="true" /> : null}
                                {registered ? 'In your program' : 'Not saved yet'}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleRegistration(active, entry)}
                                className={`min-h-[30px] rounded-full px-3 text-[9px] font-bold ${
                                  registered
                                    ? 'bg-[#eef3f0] text-[#61716a]'
                                    : 'bg-[#e6f5ea] text-[#166c43]'
                                } ${focusOnLight}`}
                              >
                                {registered ? 'Remove' : 'Add'}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {extraVisible ? (
                <section aria-label="Friday schedule">
                  <div className="mb-2.5 mt-4 flex items-baseline justify-between gap-3">
                    <h2 className="m-0 text-[14px] font-bold text-[#1b5237]">Friday, 20/11/2026</h2>
                    <span className="text-[9px] text-[#8a978f]">1 event</span>
                  </div>
                  <div className="grid gap-0">
                    <article className="grid grid-cols-[55px_16px_1fr] gap-[7px]">
                      <div className="flex flex-col items-end pt-[3px]">
                        <strong className="text-[9px] font-bold text-[#53685a]">
                          {extraFridayEntry.time}
                        </strong>
                        <span className="mt-1 text-[8px] text-[#a0aaa4]">{extraFridayEntry.duration}</span>
                      </div>
                      <div className="relative flex justify-center">
                        <span
                          aria-hidden="true"
                          className="absolute bottom-[-5px] left-1/2 top-3 w-px -translate-x-1/2 bg-[#d5e6db]"
                        />
                        <i
                          aria-hidden="true"
                          className={`relative z-[1] mt-1 h-[9px] w-[9px] rounded-full border-2 ${
                            isRegistered(active, extraFridayEntry)
                              ? 'border-[#137d49] bg-[#16834e] shadow-[0_0_0_3px_#e2f1e6]'
                              : 'border-[#b5d8c1] bg-[#f4f9f5]'
                          }`}
                        />
                      </div>
                      <div
                        className={`relative min-h-[83px] rounded-[14px] border border-[#dce8e0] bg-white p-[9px_10px] shadow-[0_1px_3px_rgba(16,57,38,0.05)] ${
                          detail?.stage === active && detail.entry === extraFridayEntry
                            ? 'ring-2 ring-[#16824f]/25'
                            : ''
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setDetail({ stage: active, entry: extraFridayEntry })}
                          className={`block w-full text-left ${
                            isRegistered(active, extraFridayEntry) ? 'pr-6' : ''
                          } ${focusOnLight}`}
                          aria-label="View details for Tarteel"
                        >
                          <span className="block text-[7px] font-bold uppercase tracking-[0.7px] text-[#14804b]">
                            {extraFridayEntry.category}
                          </span>
                          <strong className="mt-1 block text-[11px] font-bold text-[#254431]">
                            {extraFridayEntry.title}
                          </strong>
                          <small className="mt-1 flex items-center gap-1 text-[8px] text-[#89978f]">
                            <MapPin size={10} aria-hidden="true" /> {stageVenues[active]}
                          </small>
                        </button>
                        {isRegistered(active, extraFridayEntry) ? (
                          <span className="absolute right-[9px] top-[9px] text-[#15774a]">
                            <Check size={12} aria-hidden="true" />
                          </span>
                        ) : null}
                        <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#e6efe9] pt-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[8px] font-bold ${
                              isRegistered(active, extraFridayEntry)
                                ? 'text-[#15774a]'
                                : 'text-[#94a29a]'
                            }`}
                          >
                            {isRegistered(active, extraFridayEntry) ? (
                              <Check size={10} aria-hidden="true" />
                            ) : null}
                            {isRegistered(active, extraFridayEntry)
                              ? 'In your program'
                              : 'Not saved yet'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleRegistration(active, extraFridayEntry)}
                            className={`min-h-[30px] rounded-full px-3 text-[9px] font-bold ${
                              isRegistered(active, extraFridayEntry)
                                ? 'bg-[#eef3f0] text-[#61716a]'
                                : 'bg-[#e6f5ea] text-[#166c43]'
                            } ${focusOnLight}`}
                          >
                            {isRegistered(active, extraFridayEntry) ? 'Remove' : 'Add'}
                          </button>
                        </div>
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
                <p className="ar-eyebrow">
                  {detail.stage} · {stageData[detail.stage].date}
                </p>
                <h2 className="mt-1 text-[16px] font-bold tracking-[-0.4px] text-[#0b2118]">
                  {detail.entry.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="ar-icon-button"
                aria-label="Close event details"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5eb] px-2.5 py-1 text-[9px] font-bold text-[#15774a]">
                <Clock3 size={12} aria-hidden="true" /> {detail.entry.time}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5eb] px-2.5 py-1 text-[9px] font-bold text-[#15774a]">
                <MapPin size={12} aria-hidden="true" /> {stageVenues[detail.stage]}
              </span>
              <span className="rounded-full bg-[#edf7f0] px-2.5 py-1 text-[9px] font-bold text-[#15774a]">
                {detail.entry.category}
              </span>
            </div>

            <p className="mt-4 text-[10px] leading-relaxed text-[#61716a]">
              {detail.entry.duration}. Held at {stageVenues[detail.stage]} as part of the {detail.stage}{' '}
              programme. Arrive a few minutes early and carry your participant card.
            </p>

            <button
              type="button"
              onClick={() => toggleRegistration(detail.stage, detail.entry)}
              className={`mt-5 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full text-[11px] font-bold text-white transition-colors ${
                detailRegistered
                  ? 'bg-[#6b7b72] hover:bg-[#5b6b61]'
                  : 'bg-[#16824f] hover:bg-[#0b5038]'
              } ${focusOnLight}`}
            >
              {detailRegistered ? <Check size={15} aria-hidden="true" /> : null}
              {detailRegistered ? 'Remove from my program' : 'Add to my program'}
            </button>
            <button
              type="button"
              onClick={() => setDetail(null)}
              className={`mt-2 flex min-h-[42px] w-full items-center justify-center rounded-full border border-[#dbe6df] text-[10px] font-bold text-[#166c43] ${focusOnLight}`}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
