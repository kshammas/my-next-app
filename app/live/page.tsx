'use client';

import Link from 'next/link';
import { ChevronLeft, Play } from 'lucide-react';
import { AppShell } from '@/components/AppShell';

const stages = [
  { name: 'Stage 01', place: 'Main Stage', status: 'Watching', tone: 'active' },
  { name: 'Stage 02', place: 'MNC Conference Hall', status: 'SOON', tone: 'soon' },
  { name: 'Stage 03', place: 'Zahra Block', status: 'OFFLINE', tone: 'offline' },
  { name: 'Stage 04', place: 'Library', status: 'OFFLINE', tone: 'offline' },
] as const;

export default function LivePage() {
  return (
    <AppShell>
      <div className="min-h-full bg-[#F5FAF6]">
        <header className="flex items-center gap-3 bg-[#15532E] px-4 py-4 text-white">
          <Link
            href="/home"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15"
            aria-label="Go back"
          >
            <ChevronLeft size={22} strokeWidth={2.6} />
          </Link>
          <h1 className="flex-1 pr-10 text-center text-[18px] font-extrabold">Live Screen</h1>
        </header>

        <div className="px-4 pb-6 pt-4">
          <div className="rounded-[20px] bg-white p-4 shadow-sm">
            <div className="flex h-[190px] items-center justify-center rounded-[14px] bg-gradient-to-br from-[#15532E] to-[#0A3320] sm:h-[230px]">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#15532E]">
                <Play size={24} fill="currentColor" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[17px] font-extrabold text-[#15532E]">Stage 01</p>
                <p className="mt-1 text-[12px] text-[#15532E]/70">@ Main Stage</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-[#FEE2E1] px-3 py-1.5 text-[10px] font-extrabold uppercase text-[#AF2120]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#AF2120]" /> LIVE
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold text-[#15532E]">All stages</h2>
            <span className="text-[12px] text-[#15532E]/70">4 stages</span>
          </div>

          <div className="mt-2 space-y-2">
            {stages.map((stage) => {
              const active = stage.tone === 'active';
              const soon = stage.tone === 'soon';
              return (
                <div
                  key={stage.name}
                  className={`flex min-h-[56px] items-center justify-between gap-3 rounded-[18px] px-4 py-2 ${
                    active ? 'bg-[#15532E] text-white' : 'bg-white text-[#15532E] shadow-sm'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-extrabold">{stage.name}</p>
                    <p className={`mt-0.5 truncate text-[11px] ${active ? 'text-white/70' : 'text-[#15532E]/60'}`}>
                      {stage.place}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                      active
                        ? 'bg-[#EECE2D] text-[#15532E]'
                        : soon
                          ? 'bg-[#FEF3C6] text-[#8a6a00]'
                          : 'bg-[#EFF3F0] text-[#6B7B72]'
                    }`}
                  >
                    {stage.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
