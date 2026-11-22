'use client';

import { useState } from 'react';
import { Search, Trophy } from 'lucide-react';
import { AppShell } from '@/components/AppShell';

const categories = ['All events'];

export default function ResultsPage() {
  const [category, setCategory] = useState('All events');
  const [query, setQuery] = useState('');

  return (
    <AppShell>
      <div className="min-h-full bg-[#F5F7F4] px-4 pb-8 pt-5">
        <h1 className="text-[26px] font-black text-[#00000B]">Results</h1>
        <p className="mt-1 text-[11px] text-[#7C8389]">
          Follow the rankings. Celebrate every achievement.
        </p>

        <section className="mt-6 rounded-[18px] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#166535]" aria-hidden="true" />
              <h2 className="text-[13px] font-extrabold text-[#121826]">Team Points</h2>
            </div>
            <button
              type="button"
              className="min-h-[36px] rounded-full bg-[#F0FDF4] px-4 text-[11px] font-bold text-[#166535]"
            >
              Retry
            </button>
          </div>
          <p className="mt-2 text-[11px] text-[#96A2B2]">Couldn&apos;t load. Tap to retry.</p>
        </section>

        <section className="mt-5">
          <h2 className="text-[16px] font-extrabold text-[#121826]">Event Results</h2>
          <p className="mt-1 text-[11px] text-[#7C8389]">
            Overall Event Rankings &amp; Program Winners
          </p>

          <label className="mt-2 flex min-h-[46px] items-center gap-2 rounded-[12px] bg-[#F9FAFC] px-3">
            <Search className="h-4 w-4 shrink-0 text-[#BBC0C6]" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search events..."
              className="w-full bg-transparent text-[12px] text-[#222834] outline-none placeholder:text-[#BBC0C6]"
            />
          </label>

          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={item === category}
                className={`min-h-[32px] shrink-0 rounded-full px-4 text-[11px] font-bold ${
                  item === category ? 'bg-[#166535] text-white' : 'bg-white text-[#6B7B72]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-[12px] font-bold text-[#121826]">Browse results</p>
            <span className="rounded-full bg-[#F0FDF4] px-3 py-1 text-[10px] font-extrabold text-[#166535]">
              0 EVENTS
            </span>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[14px] font-extrabold text-[#222834]">No events found</p>
            <p className="mx-auto mt-2 max-w-[280px] text-[11px] leading-relaxed text-[#8B9096]">
              Try another event name or select a different category.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
