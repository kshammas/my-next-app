'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarCheck2, ChevronLeft, Clock3, MapPin, Trash2 } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { apiSend, useApi } from '@/lib/use-api';
import type { Program } from '@/lib/types';

const initial: Program[] = [];

const focusOnDark =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF6D4]';
const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15532E]';

export default function ProgramsPage() {
  const { data: programs, setData } = useApi<Program[]>('/api/programs', initial);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function remove(program: Program) {
    setBusyId(program.id);
    setData((previous) => previous.filter((item) => item.id !== program.id));
    try {
      await apiSend('/api/programs', 'POST', { eventId: program.id, add: false });
    } catch {
      setData((previous) => [...previous, program]);
    } finally {
      setBusyId(null);
    }
  }

  const target = Math.max(5, programs.length);
  const progress = (programs.length / target) * 100;

  return (
    <AppShell showBottomNav>
      <div className="min-h-full bg-[#F5FAF6] pb-8">
        <header className="relative flex min-h-[64px] items-center justify-center bg-[#13512C] px-14 py-4 text-white">
          <Link
            href="/home"
            aria-label="Go back"
            className={`absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25 ${focusOnDark}`}
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="text-[18px] font-extrabold tracking-tight">My Program</h1>
        </header>

        <section className="px-4 pb-1 pt-5">
          <h2 className="text-[22px] font-black leading-tight tracking-tight text-[#15532E]">
            Your festival, at a glance.
          </h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-[#6B7B72]">
            Your festival schedule at a glance.
          </p>
        </section>

        <section className="mx-4 mt-4 rounded-[20px] bg-white p-4 shadow-sm" aria-label="Program progress">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold tracking-[0.14em] text-[#8FA79A]">
                YOUR PROGRESS
              </p>
              <p className="mt-1 text-[13px] font-bold text-[#15532E]">
                {programs.length} of {target} activities completed
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF6D4] text-[#15532E]">
              <CalendarCheck2 size={20} aria-hidden="true" />
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EAF4ED]">
            <div
              className="h-full rounded-full bg-[#EECE2D] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        <section className="mt-5 px-4" aria-label="Registered programs">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-extrabold text-[#15532E]">Registered programs</h2>
            <span className="text-[11px] font-semibold text-[#6B7B72]">
              {programs.length} saved
            </span>
          </div>

          {programs.length === 0 ? (
            <div className="flex flex-col items-center rounded-[20px] bg-white px-6 py-12 text-center shadow-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDF6D4] text-[#15532E]">
                <CalendarCheck2 size={26} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[14px] font-extrabold text-[#15532E]">No sessions yet</h3>
              <p className="mx-auto mt-1.5 max-w-[260px] text-[11px] leading-relaxed text-[#6B7B72]">
                Add sessions from the schedule and they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {programs.map((program) => {
                const busy = busyId === program.id;
                return (
                  <article key={program.id} className="rounded-[20px] bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[16px] bg-[#FDF6D4] text-[#15532E]">
                        <span className="text-[14px] font-extrabold leading-none">{program.start}</span>
                        <span className="mt-0.5 text-[9px] font-bold">{program.day}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] font-extrabold leading-snug text-[#15532E]">
                          {program.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF4ED] px-2.5 py-1 text-[10px] font-bold text-[#15532E]">
                            <Clock3 size={12} aria-hidden="true" /> {program.start}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF4ED] px-2.5 py-1 text-[10px] font-bold text-[#15532E]">
                            <MapPin size={12} aria-hidden="true" /> {program.venue}
                          </span>
                          <span className="rounded-full bg-[#FDF6D4] px-2.5 py-1 text-[10px] font-bold text-[#15532E]">
                            {program.day}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => void remove(program)}
                        disabled={busy}
                        aria-label={`Remove ${program.title} from my program`}
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FDECEA] text-[#B64235] transition-colors hover:bg-[#FBD9D5] disabled:opacity-50 ${focusOnLight}`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <Link
            href="/schedule"
            className={`mx-auto mt-5 flex min-h-[44px] w-full max-w-[200px] items-center justify-center rounded-full border border-[#13512C]/10 bg-white px-5 text-[11px] font-bold text-[#15532E] transition-colors hover:bg-[#EAF4ED] ${focusOnLight}`}
          >
            Browse schedule
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
