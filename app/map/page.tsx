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
      <div className="min-h-full bg-[#F5FAF6]">
        <header className="flex items-center gap-3 bg-[#13512C] px-4 py-4 text-white">
          <Link
            href="/home"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 ${focusOnDark}`}
            aria-label="Go back"
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="flex-1 pr-11 text-center text-[18px] font-extrabold">Map</h1>
          <span className="h-11 w-11" aria-hidden="true" />
        </header>

        <div className="px-4 pb-10 pt-4">
          <label className="flex min-h-[46px] items-center gap-2.5 rounded-[16px] bg-white px-4 shadow-sm focus-within:ring-2 focus-within:ring-[#13512C]/20">
            <Search className="h-[18px] w-[18px] shrink-0 text-[#8FA79A]" aria-hidden="true" />
            <span className="sr-only">Search venues</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search venues"
              className="w-full bg-transparent text-[12px] text-[#1A2E23] outline-none placeholder:text-[#9AA19C]"
            />
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Location categories">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
                className={`min-h-[38px] shrink-0 rounded-full px-4 text-[10px] font-bold transition-colors ${focusOnLight} ${
                  filter === item ? 'bg-[#13512C] text-white' : 'bg-white text-[#6B7B72] shadow-sm'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="relative mt-4 h-[330px] overflow-hidden rounded-[24px] border border-[#13512C]/10 bg-[#E9F1E4] shadow-sm sm:h-[420px]">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect width="100" height="100" fill="#E9F1E4" />
              <path d="M0 24 H100 M0 62 H100 M28 0 V100 M76 0 V100" stroke="#FFFFFF" strokeWidth="5" fill="none" opacity="0.9" />
              <path d="M-5 90 C 25 72, 48 96, 105 74" stroke="#CFE3D3" strokeWidth="9" fill="none" />
              <circle cx="48" cy="68" r="13" fill="#D7E9D9" />
              <rect x="8" y="31" width="13" height="22" rx="2" fill="#DCE9D8" />
              <rect x="56" y="6" width="15" height="13" rx="2" fill="#DCE9D8" />
              <rect x="82" y="70" width="13" height="18" rx="2" fill="#DCE9D8" />
              <rect x="34" y="76" width="10" height="9" rx="2" fill="#DFECDA" />
            </svg>

            <span className="absolute left-[46%] top-[50%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[9px] font-extrabold text-[#13512C] shadow-sm">
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

          {selected ? (
            <section className="mt-4 overflow-hidden rounded-[20px] bg-[#13512C] p-4 text-white" aria-label="Selected venue">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#EECE2D] text-[14px] font-extrabold text-[#13512C]">
                  {selected.label}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#A1C8B3]">
                    Selected venue
                  </p>
                  <h2 className="mt-0.5 text-[16px] font-extrabold">{selected.name}</h2>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/75">{selected.note}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold text-white">
                  {venueCategories[selected.id]}
                </span>
              </div>
            </section>
          ) : null}

          <div className="mt-5 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold text-[#13512C]">Venues</h2>
            <span className="text-[12px] text-[#13512C]/70">{visibleVenues.length} places</span>
          </div>

          {visibleVenues.length === 0 ? (
            <div className="mt-3 flex flex-col items-center rounded-[20px] bg-white px-6 py-12 text-center shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF3F0] text-[#6B7B72]">
                <MapPin size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[14px] font-extrabold text-[#13512C]">No venues found</h3>
              <p className="mx-auto mt-2 max-w-[260px] text-[11px] leading-relaxed text-[#6B7B72]">
                Try another location category or search term.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className={`mt-4 min-h-[40px] rounded-full bg-[#13512C] px-6 text-[11px] font-bold text-white ${focusOnDark}`}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visibleVenues.map((venue) => {
                const isSelected = selected?.id === venue.id;
                return (
                  <button
                    key={venue.id}
                    type="button"
                    onClick={() => setSelectedId(venue.id)}
                    aria-pressed={isSelected}
                    className={`rounded-[18px] bg-white p-4 text-left shadow-sm transition-shadow ${focusOnLight} ${
                      isSelected ? 'ring-2 ring-[#13512C]/30' : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#E6F3EA] text-[12px] font-extrabold text-[#13512C]">
                        {venue.label}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-extrabold text-[#13512C]">
                          {venue.name}
                        </span>
                        <span className="mt-1 block text-[11px] leading-relaxed text-[#6B7B72]">
                          {venue.note}
                        </span>
                      </span>
                      {isSelected ? (
                        <Check size={16} className="mt-1 shrink-0 text-[#13512C]" aria-hidden="true" />
                      ) : null}
                    </div>
                    <span className="mt-3 inline-flex rounded-full bg-[#EFF3F0] px-2.5 py-1 text-[10px] font-bold text-[#6B7B72]">
                      {venueCategories[venue.id]}
                    </span>
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
