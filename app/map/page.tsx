'use client';

import Link from 'next/link';
import { ChevronLeft, MapPin } from 'lucide-react';
import { AppShell } from '@/components/AppShell';

export default function MapPage() {
  return (
    <AppShell>
      <div className="min-h-full bg-[#F5FAF6]">
        <header className="flex items-center gap-3 bg-[#13512C] px-4 py-4 text-white">
          <Link
            href="/home"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15"
            aria-label="Go back"
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="flex-1 pr-11 text-center text-[18px] font-extrabold">Map</h1>
          <span className="h-11 w-11" aria-hidden="true" />
        </header>

        <div className="flex flex-col items-center px-5 pb-12 pt-16 sm:pt-24">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#DDEBDE] sm:h-32 sm:w-32">
            <MapPin size={46} strokeWidth={1.8} className="text-[#2E7D4F]" aria-hidden="true" />
          </div>

          <h2 className="mt-8 text-center text-[20px] font-extrabold text-[#13512C]">
            Stage Map Unavailable
          </h2>
          <p className="mx-auto mt-3 max-w-[300px] text-center text-[13px] leading-relaxed text-[#6B7B72]">
            The interactive venue map and stage directions will be available soon.
          </p>

          <Link
            href="/home"
            className="mt-9 flex min-h-[44px] items-center justify-center rounded-full bg-[#13512C] px-7 text-[13px] font-bold text-white transition-colors hover:bg-[#0E3D21] active:scale-[0.98]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
