'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck2,
  ChevronLeft,
  Clock3,
  MapPin,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { usePrototype } from '@/lib/prototype-store';
import type { Program } from '@/lib/types';

const focusOnDark =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF6D4]';
const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15532E]';

const statusById: Record<string, string> = {
  'p-2': 'Upcoming',
};

export default function ProgramsPage() {
  const { programs, removeProgram, toggleProgram } = usePrototype();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [removed, setRemoved] = useState<Program | null>(null);

  useEffect(() => {
    if (!removed) return;
    const timer = window.setTimeout(() => setRemoved(null), 6000);
    return () => window.clearTimeout(timer);
  }, [removed]);

  const detail = detailId ? programs.find((item) => item.id === detailId) ?? null : null;
  const confirmProgram = confirmId
    ? programs.find((item) => item.id === confirmId) ?? null
    : null;

  const target = Math.max(5, programs.length);
  const progress = (programs.length / target) * 100;

  function confirmRemove() {
    if (!confirmProgram) return;
    removeProgram(confirmProgram.id);
    setRemoved(confirmProgram);
    if (detailId === confirmProgram.id) setDetailId(null);
    setConfirmId(null);
  }

  function undoRemove() {
    if (!removed) return;
    toggleProgram(removed);
    setRemoved(null);
  }

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

        {removed ? (
          <div
            role="status"
            className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-[14px] bg-[#ECFDF3] px-4 py-3"
          >
            <p className="text-[11px] font-semibold leading-snug text-[#0C801D]">
              {removed.title} removed from your program.
            </p>
            <button
              type="button"
              onClick={undoRemove}
              className={`inline-flex min-h-[36px] shrink-0 items-center gap-1 rounded-full bg-white px-3 text-[10px] font-bold text-[#15532E] ${focusOnLight}`}
            >
              <RotateCcw size={12} aria-hidden="true" /> Undo
            </button>
          </div>
        ) : null}

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
                const status = statusById[program.id] ?? 'Confirmed';
                return (
                  <article key={program.id} className="rounded-[20px] bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[16px] bg-[#FDF6D4] text-[#15532E]">
                        <span className="text-[14px] font-extrabold leading-none">{program.start}</span>
                        <span className="mt-0.5 text-[9px] font-bold">{program.day}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDetailId(program.id)}
                        className={`min-w-0 flex-1 text-left ${focusOnLight}`}
                        aria-label={`View details for ${program.title}`}
                      >
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
                            {status}
                          </span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(program.id)}
                        aria-label={`Remove ${program.title} from my program`}
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FDECEA] text-[#B64235] transition-colors hover:bg-[#FBD9D5] ${focusOnLight}`}
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

      {detail ? (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${detail.title} details`}
        >
          <div className="modal-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8FA79A]">
                  Registered event
                </p>
                <h2 className="mt-1 text-[18px] font-extrabold leading-snug tracking-tight text-[#15532E]">
                  {detail.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailId(null)}
                className="icon-button"
                aria-label="Close event details"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF4ED] px-2.5 py-1 text-[10px] font-bold text-[#15532E]">
                <Clock3 size={12} aria-hidden="true" /> {detail.start}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF4ED] px-2.5 py-1 text-[10px] font-bold text-[#15532E]">
                <MapPin size={12} aria-hidden="true" /> {detail.venue}
              </span>
              <span className="rounded-full bg-[#FDF6D4] px-2.5 py-1 text-[10px] font-bold text-[#15532E]">
                {statusById[detail.id] ?? 'Confirmed'}
              </span>
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-[#6B7B72]">
              Saved for {detail.day}. This session is in your program — carry your participant card
              and arrive a few minutes early.
            </p>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setDetailId(null)}
                className={`min-h-[44px] flex-1 rounded-full border border-[#15532E]/15 text-[11px] font-bold text-[#15532E] ${focusOnLight}`}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmId(detail.id);
                  setDetailId(null);
                }}
                className={`min-h-[44px] flex-1 rounded-full bg-[#FDECEA] text-[11px] font-bold text-[#B64235] ${focusOnLight}`}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmProgram ? (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Remove registered event"
        >
          <div className="modal-card">
            <h2 className="text-[17px] font-extrabold text-[#15532E]">
              Remove from my program?
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[#6B7B72]">
              {confirmProgram.title} will be removed from your saved sessions. You can undo this
              right after.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className={`min-h-[44px] flex-1 rounded-full border border-[#15532E]/15 text-[11px] font-bold text-[#15532E] ${focusOnLight}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                className={`min-h-[44px] flex-1 rounded-full bg-[#B64235] text-[11px] font-bold text-white ${focusOnLight}`}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
