'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { AppShell } from '@/components/AppShell';

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

export default function SchedulePage() {
  const [active, setActive] = useState('Stage 1');
  const current = stageData[active];

  return (
    <AppShell>
      <div className="min-h-full bg-[#F6F8F5]">
        <header className="flex items-center gap-3 bg-[#15532E] px-4 py-4 text-white">
          <Link
            href="/home"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15"
            aria-label="Go back"
          >
            <ChevronLeft size={22} strokeWidth={2.6} />
          </Link>
          <h1 className="flex-1 pr-10 text-center text-[18px] font-extrabold">Schedule</h1>
        </header>

        <div className="flex gap-2 overflow-x-auto bg-white px-4 py-3">
          {stages.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => setActive(stage)}
              aria-pressed={stage === active}
              className={`min-h-[40px] shrink-0 rounded-full px-4 text-[12px] font-bold ${
                stage === active ? 'bg-[#15532E] text-white' : 'bg-[#F6F8F5] text-[#6B7B72]'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>

        <div className="px-4 pb-8 pt-3">
          <h2 className="text-[13px] font-bold text-[#8C928E]">{current.date}</h2>

          <div className="mt-2 space-y-2">
            {current.entries.map((entry, index) => (
              <article
                key={`${entry.title}-${index}`}
                className="rounded-[16px] bg-white px-4 py-2.5 shadow-sm"
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
              </article>
            ))}
          </div>

          <h2 className="mt-5 text-[13px] font-bold text-[#8C928E]">Friday, 20/11/2026</h2>
          <article className="mt-2 rounded-[16px] bg-white px-4 py-2.5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold text-[#3F4B55]">7:00AM - 7:40AM</p>
              <p className="text-[10px] text-[#9AA19C]">Duration: 40m</p>
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <h3 className="text-[14px] font-extrabold text-[#1A2E23]">Tarteel</h3>
              <span className="shrink-0 rounded-full bg-[#EFF3F0] px-2.5 py-0.5 text-[9px] font-bold text-[#6B7B72]">
                Junior
              </span>
            </div>
          </article>
        </div>
      </div>
    </AppShell>
  );
}
