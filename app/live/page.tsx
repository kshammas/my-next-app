'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from '@/components/icons';
import { AppShell } from '@/components/AppShell';

const stages = [
  { name: 'Stage 01', place: 'Main Stage', status: 'Watching', tone: 'active' },
  { name: 'Stage 02', place: 'MNC Conference Hall', status: 'SOON', tone: 'soon' },
  { name: 'Stage 03', place: 'Zahra Block', status: 'OFFLINE', tone: 'offline' },
  { name: 'Stage 04', place: 'Library', status: 'OFFLINE', tone: 'offline' },
] as const;

type StageName = (typeof stages)[number]['name'];

const SAMPLE_VIDEO_ID = 'aqz-KE-bpKQ';
const sampleVideoSrc = `https://www.youtube.com/embed/${SAMPLE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${SAMPLE_VIDEO_ID}&rel=0&modestbranding=1&playsinline=1`;

const focusOnDark =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF6D4]';
const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15532E]';

export default function LivePage() {
  const [selectedName, setSelectedName] = useState<StageName>('Stage 01');
  const selected = stages.find((stage) => stage.name === selectedName) ?? stages[0];
  const isActive = selected.tone === 'active';
  const isOffline = selected.tone === 'offline';

  return (
    <AppShell>
      <div className="min-h-full bg-[#F5FAF6]">
        <header className="relative flex h-[65px] items-center justify-center bg-[#15532E] text-white">
          <Link
            href="/home"
            className={`absolute left-[15px] grid h-[34px] w-[34px] place-items-center rounded-full bg-white/10 ${focusOnDark}`}
            aria-label="Go back"
          >
            <ChevronLeft size={18} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="m-0 text-[14px] font-[730] tracking-[-0.3px]">Live Screen</h1>
        </header>

        <div className="pb-[40px]">
          <div
            role={isActive ? undefined : 'img'}
            aria-label={
              isActive
                ? undefined
                : isOffline
                  ? `${selected.name} offline — no live stream`
                  : 'Live video preview loading'
            }
            className="relative mx-[6px] mt-[14px] flex aspect-video items-center justify-center overflow-hidden rounded-[14px] bg-black"
          >
            {isActive ? (
              <iframe
                className="absolute inset-0 h-full w-full border-0"
                src={sampleVideoSrc}
                title="Stage 01 sample live stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : isOffline ? (
              <div className="flex flex-col items-center gap-[6px] text-white/70">
                <svg
                  className="h-[52px] w-[52px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M5.6 5.6 18.4 18.4" />
                </svg>
                <span className="text-[8px] font-[750] uppercase tracking-[0.14em] text-[#FACC16]">
                  Offline
                </span>
              </div>
            ) : (
              <>
                <span
                  className="h-[26px] w-[26px] animate-spin rounded-full border-[3px] border-b-[#FACC16] border-l-[#FACC16] border-r-transparent border-t-transparent"
                  aria-hidden="true"
                />
                <span className="sr-only">
                  Preview only — no live stream in this prototype.
                </span>
              </>
            )}
          </div>

          <div className="mx-[6px] mt-[15px] flex min-h-[31px] items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="m-0 text-[15px] font-[750] leading-[1.05] tracking-[-0.3px] text-[#15532E]">
                {selected.name}
              </h2>
              <p className="m-0 ml-[2px] mt-[5px] text-[8px] leading-[1.1] text-[#747F79]">
                @ {selected.place}
              </p>
            </div>
            {selected.tone === 'active' ? (
              <span className="mt-[7px] inline-flex min-h-[17px] shrink-0 items-center gap-[5px] rounded-full bg-[#FEE2E1] px-[7px] text-[7px] font-[750] leading-none text-[#B73331]">
                <span className="h-[5px] w-[5px] rounded-full bg-[#DC2B28]" /> LIVE
              </span>
            ) : (
              <span
                className={`mt-[7px] inline-flex min-h-[18px] shrink-0 items-center rounded-full px-[8px] text-[8px] font-[750] uppercase leading-none ${
                  selected.tone === 'soon'
                    ? 'bg-[#FFF3C6] text-[#8B4311]'
                    : 'bg-[#EFF9F1] text-[#A5B0AA]'
                }`}
              >
                {selected.status}
              </span>
            )}
          </div>

          <div className="mx-[14px] mt-[24px] flex items-center justify-between gap-2 pl-[2px]">
            <h2 className="m-0 text-[13px] font-[750] leading-none tracking-[-0.3px] text-[#15532E]">
              All stages
            </h2>
            <span className="text-[8px] leading-none text-[#747F79]">4 stages</span>
          </div>

          <div className="mx-[15px] mt-[10px] flex flex-col gap-[9px]">
            {stages.map((stage) => {
              const active = stage.tone === 'active';
              const soon = stage.tone === 'soon';
              const selectedStage = stage.name === selectedName;

              return (
                <button
                  key={stage.name}
                  type="button"
                  onClick={() => setSelectedName(stage.name)}
                  aria-pressed={selectedStage}
                  aria-label={`Select ${stage.name}, ${stage.place}`}
                  className={`flex min-h-[58px] w-full items-center justify-between gap-3 rounded-[12px] border px-[14px] py-[10px] text-left transition-colors ${focusOnLight} ${
                    active
                      ? 'border-[#15532E] bg-[#15532E] text-white'
                      : soon
                        ? 'border-[#DDE7DF] bg-white text-[#195030]'
                        : 'border-[#EFF9F1] bg-[#FBFDFA] text-[#719780]'
                  } ${
                    selectedStage && !active ? 'border-[#15532E] ring-1 ring-[#15532E]' : ''
                  }`}
                >
                  <span className="flex min-w-0 translate-y-[3px] flex-col gap-[3px]">
                    <span className="text-[11px] font-[750] leading-[1.15]">{stage.name}</span>
                    <span
                      className={`truncate text-[8px] leading-[1.1] ${
                        active ? 'text-[#A3C9B2]' : soon ? 'text-[#747F79]' : 'text-[#AAB0AC]'
                      }`}
                    >
                      {stage.place}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 translate-y-[3px] leading-none ${
                      active
                        ? 'text-[9px] font-[750] normal-case text-[#F7CC1B]'
                        : `inline-flex min-h-[18px] items-center rounded-full px-[8px] text-[7px] font-[750] uppercase ${
                            soon
                              ? 'bg-[#FFF3C6] text-[#8B4311]'
                              : 'bg-[#EFF9F1] text-[#A5B0AA]'
                          }`
                    }`}
                  >
                    {stage.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
