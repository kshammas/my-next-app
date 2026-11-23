'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft, MapPin, Navigation, Search } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { demoVenues } from '@/lib/demo-data';
import type { Venue } from '@/lib/types';

const venueCategories: Record<string, string> = {
  'v-1': 'Events',
  'v-2': 'Talks',
  'v-3': 'Competitions',
  'v-4': 'Expo',
  'v-5': 'Spiritual',
};

const filters = ['All', 'Events', 'Talks', 'Competitions', 'Expo', 'Spiritual'];

const focusOnDark =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF6D4]';
const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#13512C]';

export default function MapPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string>('v-1');

  const search = query.trim().toLowerCase();
  const visibleVenues = demoVenues.filter((venue) => {
    const matchesFilter = filter === 'All' || venueCategories[venue.id] === filter;
    const matchesSearch =
      search.length === 0 ||
      `${venue.name} ${venue.note} ${venueCategories[venue.id]}`.toLowerCase().includes(search);
    return matchesFilter && matchesSearch;
  });
  const selected = visibleVenues.find((venue) => venue.id === selectedId) ?? visibleVenues[0] ?? null;

  function clearFilters() {
    setQuery('');
    setFilter('All');
  }

  return (
    <AppShell>
      <div className="ar-page">
        <header className="grid min-h-[66px] grid-cols-[42px_1fr_42px] items-center gap-[5px] px-4 pb-2 pt-[5px]">
          <Link
            href="/home"
            className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#EAF7EF] text-[#166C43] ${focusOnLight}`}
            aria-label="Go back"
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="text-[21px] font-[750] tracking-[-0.6px] text-[#145B3C]">Map</h1>
          <span className="h-[34px] w-[34px]" aria-hidden="true" />
        </header>

        <div className="px-4 pt-1">
          <label className="flex min-h-[39px] items-center gap-[9px] rounded-[14px] border border-[#D8E4DE] bg-white px-[13px] shadow-[0_2px_5px_rgba(16,57,38,0.08)] focus-within:border-[#16824F]">
            <Search className="h-4 w-4 shrink-0 text-[#8CA197]" aria-hidden="true" />
            <span className="sr-only">Search venues</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search venues"
              className="w-full bg-transparent py-[10px] text-[12px] text-[#14241D] outline-none placeholder:text-[#95A49B]"
            />
          </label>

          <div className="ar-chip-row mt-3 pb-1" aria-label="Location categories">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={filter === item}
                data-active={filter === item}
                onClick={() => setFilter(item)}
                className={`ar-chip ${focusOnLight}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="relative mt-4 aspect-square overflow-hidden rounded-[21px] border border-[#D5E6DA] bg-[#EAF4ED] shadow-[0_3px_9px_rgba(24,77,48,0.06)] sm:aspect-auto sm:h-[420px]">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect width="100" height="100" fill="#EAF4ED" />
              <path d="M0 24 H100 M0 62 H100 M28 0 V100 M76 0 V100" stroke="#F8FBF8" strokeWidth="5" fill="none" opacity="0.9" />
              <path d="M-5 90 C 25 72, 48 96, 105 74" stroke="#C5DECF" strokeWidth="9" fill="none" />
              <circle cx="48" cy="68" r="13" fill="#D4E8D9" />
              <rect x="8" y="31" width="13" height="22" rx="2" fill="#D4E8D9" />
              <rect x="56" y="6" width="15" height="13" rx="2" fill="#D4E8D9" />
              <rect x="82" y="70" width="13" height="18" rx="2" fill="#D4E8D9" />
              <rect x="34" y="76" width="10" height="9" rx="2" fill="#D4E8D9" />
            </svg>

            <span className="absolute right-[11px] top-[11px] z-10 grid h-[25px] w-[25px] place-items-center rounded-full border border-[#D5E6DA] bg-white text-[9px] font-[750] text-[#29714A]">
              N
            </span>

            <span className="absolute left-[46%] top-[50%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[8px] font-extrabold text-[#1A7447] shadow-sm">
              <Navigation size={11} aria-hidden="true" /> You are here
            </span>

            {visibleVenues.map((venue: Venue) => {
              const isSelected = selected?.id === venue.id;
              return (
                <button
                  key={venue.id}
                  type="button"
                  onClick={() => setSelectedId(venue.id)}
                  aria-pressed={isSelected}
                  aria-label={`Select ${venue.name}`}
                  style={{ left: `${venue.x}%`, top: `${venue.y}%` }}
                  className={`absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 transition-transform ${focusOnLight} ${
                    isSelected ? 'scale-105' : 'hover:scale-105'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-[12px] font-extrabold ${
                      isSelected
                        ? 'border-[#13512C] bg-[#EECE2D] text-[#13512C] shadow-lg'
                        : 'border-white bg-[#13512C] text-white shadow-md'
                    }`}
                  >
                    {venue.label}
                  </span>
                  <span className="max-w-[110px] truncate rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold text-[#13512C] shadow-sm">
                    {venue.name}
                  </span>
                </button>
              );
            })}

            {visibleVenues.length === 0 ? (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/75 px-6 text-center">
                <div>
                  <MapPin size={26} className="mx-auto text-[#6B7B72]" aria-hidden="true" />
                  <p className="mt-2 text-[13px] font-extrabold text-[#13512C]">
                    No venues match your filters
                  </p>
                  <p className="mt-1 text-[11px] text-[#6B7B72]">Try another category or search.</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mx-[2px] mb-[11px] mt-[9px] flex gap-[14px]">
            <span className="flex items-center gap-[5px] text-[8px] text-[#83928A]">
              <i className="inline-block h-[7px] w-[7px] rounded-full bg-[#16804B]" /> Festival venue
            </span>
            <span className="flex items-center gap-[5px] text-[8px] text-[#83928A]">
              <i className="inline-block h-[3px] w-[12px] rounded-[3px] bg-[#BEDAC7]" /> Campus path
            </span>
          </div>

          {selected ? (
            <section
              className="flex items-center gap-[9px] rounded-[15px] border border-[#CFE2D5] bg-white p-[11px]"
              aria-label="Selected venue"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#EAF7EF] text-[12px] font-extrabold text-[#187B4B]">
                {selected.label}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-[#84988A]">
                  Selected venue
                </p>
                <h2 className="mt-[2px] text-[11px] font-bold text-[#28583D]">{selected.name}</h2>
                <p className="mt-[2px] text-[8px] leading-snug text-[#8A9890]">{selected.note}</p>
              </div>
              <span className="shrink-0 rounded-full bg-[#EAF7EF] px-2 py-1 text-[8px] font-bold text-[#1A7447]">
                {venueCategories[selected.id]}
              </span>
            </section>
          ) : null}

          <div className="mt-5 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold text-[#145B3C]">Venues</h2>
            <span className="ar-muted-caption">{visibleVenues.length} places</span>
          </div>

          {visibleVenues.length === 0 ? (
            <div className="ar-card mt-3 flex flex-col items-center px-6 py-12 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF7EF] text-[#187B4B]">
                <MapPin size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[12px] font-[730] text-[#14241D]">No venues found</h3>
              <p className="mx-auto mt-[6px] max-w-[260px] text-[10px] leading-[1.6] text-[#85928B]">
                Try another location category or search term.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className={`mt-4 min-h-[35px] rounded-full border border-[#158452] bg-[#16824F] px-5 text-[9px] font-bold text-white ${focusOnDark}`}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-1">
              {visibleVenues.map((venue) => {
                const isSelected = selected?.id === venue.id;
                return (
                  <button
                    key={venue.id}
                    type="button"
                    onClick={() => setSelectedId(venue.id)}
                    aria-pressed={isSelected}
                    className={`flex min-h-[41px] items-center gap-[8px] border-b border-[#E1EBE4] px-[5px] py-[7px] text-left ${focusOnLight} ${
                      isSelected ? 'text-[#145D3C]' : 'text-[#72837A]'
                    }`}
                  >
                    <span
                      className={`flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-[9px] text-[9px] font-extrabold ${
                        isSelected ? 'bg-[#EAF7EF] text-[#187B4B]' : 'bg-[#F1F6F3] text-[#218151]'
                      }`}
                    >
                      {venue.label}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10px] font-semibold">{venue.name}</span>
                      <span className="mt-[2px] block truncate text-[8px] text-[#93A098]">
                        {venue.note}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-[#F1F6F3] px-2 py-[3px] text-[8px] font-bold text-[#74857A]">
                      {venueCategories[venue.id]}
                    </span>
                    {isSelected ? (
                      <Check size={14} className="shrink-0 text-[#16824F]" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
