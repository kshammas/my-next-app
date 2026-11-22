'use client';

import { ArrowUpRight, Play, Radio } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { demoStreams } from '@/lib/demo-data';
import { useApi } from '@/lib/use-api';
import type { StreamItem } from '@/lib/types';

export default function LivePage() {
  const { data: streams } = useApi<StreamItem[]>('/api/live', demoStreams);
  const featured = streams.find((item) => item.live) ?? streams[0];

  return (
    <AppShell>
      <div className="app-content">
        <PageHeader title="Live & Videos" />

        {featured ? (
          <a
            href={featured.url}
            target="_blank"
            rel="noreferrer"
            className="relative mt-5 block h-[190px] overflow-hidden rounded-[26px] bg-gradient-to-br from-[#8a4b12] via-[#6a350c] to-[#2d1806] sm:h-[260px] lg:h-[320px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(247,227,5,0.28),transparent_45%)]" />
            <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#ef4444] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> {featured.live ? 'Live now' : 'Featured'}
            </span>
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#06451f]">
              <Play size={24} fill="currentColor" />
            </span>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[17px] font-extrabold text-white">{featured.title}</p>
              <p className="text-[11px] text-white/80">
                {featured.subtitle} {featured.viewers ? `· ${featured.viewers}` : ''}
              </p>
            </div>
          </a>
        ) : null}

        <h2 className="section-title mt-6">Watch again</h2>
        <p className="section-subtitle mt-0.5">Sessions and highlights from the fest</p>

        <div className="grid-list mt-3">
          {streams.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="soft-card flex items-center gap-3 p-3"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0a5c2e] to-[#03301a] text-white">
                {item.live ? <Radio size={22} /> : <Play size={20} fill="currentColor" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-extrabold text-[#073b1d]">{item.title}</p>
                <p className="truncate text-[11px] text-slate-500">{item.subtitle}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
            </a>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
