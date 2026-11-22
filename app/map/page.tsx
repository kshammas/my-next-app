'use client';

import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { demoVenues } from '@/lib/demo-data';
import { useApi } from '@/lib/use-api';
import type { Venue } from '@/lib/types';

export default function MapPage() {
  const { data: venues } = useApi<Venue[]>('/api/map', demoVenues);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = venues.find((venue) => venue.id === selectedId) ?? null;

  return (
    <AppShell>
      <div className="px-4 pt-6 pb-10">
        <PageHeader title="Campus Map" />

        <p className="mt-4 text-[12px] text-slate-500">
          Find your way around the fest. Tap a marker for details.
        </p>

        <div className="relative mt-4 h-[340px] overflow-hidden rounded-[26px] border border-emerald-100 bg-[#eaf3ec]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d="M0 78 Q30 62 52 78 T100 72 L100 100 L0 100 Z" fill="#dcebdc" />
            <path d="M6 14 L94 12 M8 46 L92 44 M14 74 L86 72 M22 4 L18 96 M52 4 L56 96 M82 6 L78 94" stroke="#fff" strokeWidth="3" opacity="0.9" />
            <rect x="36" y="50" width="26" height="20" rx="3" fill="#cfe3d1" />
            <rect x="64" y="20" width="18" height="16" rx="3" fill="#cfe3d1" />
            <rect x="14" y="58" width="16" height="14" rx="3" fill="#cfe3d1" />
          </svg>

          {venues.map((venue) => (
            <button
              key={venue.id}
              onClick={() => setSelectedId(venue.id)}
              style={{ left: `${venue.x}%`, top: `${venue.y}%` }}
              aria-label={venue.name}
              className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[12px] font-extrabold shadow-md ${
                selectedId === venue.id ? 'bg-[#f7e305] text-[#06451f]' : 'bg-[#064e24] text-white'
              }`}
            >
              {venue.label}
            </button>
          ))}

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold text-[#0a5c2e]">
            <Navigation size={12} /> Jamia Madeenathunoor
          </div>
        </div>

        <div className="soft-card mt-4 flex items-start gap-3 p-4">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#0a7a33]" />
          <div>
            <p className="text-[14px] font-extrabold text-[#073b1d]">
              {selected ? selected.name : 'Choose a venue'}
            </p>
            <p className="mt-0.5 text-[12px] text-slate-500">
              {selected ? selected.note : 'Tap any marker on the map to see what is happening there.'}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {venues.map((venue) => (
            <button
              key={venue.id}
              onClick={() => setSelectedId(venue.id)}
              className={`rounded-2xl p-3 text-left text-[12px] font-bold ${
                selectedId === venue.id ? 'bg-[#064e24] text-white' : 'bg-white text-[#073b1d]'
              }`}
            >
              <span className="mr-2 opacity-60">{venue.label}</span>
              {venue.name}
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
