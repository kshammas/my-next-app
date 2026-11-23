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

const monthLabels = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

function dateTile(day: string) {
  const match = day.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return { month: day.slice(0, 3).toUpperCase(), number: day };
  return {
    month: monthLabels[Number(match[2]) - 1] ?? '',
    number: match[1],
  };
}

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
      <div className="ar-page">
        <header className="relative flex min-h-[56px] items-center justify-center bg-[#0b5038] px-14 py-3">
          <Link
            href="/home"
            aria-label="Go back"
            className={`absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 ${focusOnDark}`}
          >
            <ChevronLeft size={20} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="text-[14px] font-bold tracking-[0.01em] text-white">My Program</h1>
        </header>

        <section className="px-4 pt-3">
          <h2 className="text-[20px] font-bold leading-tight tracking-[-0.6px] text-[#0b2118]">
            Your festival, at a glance.
          </h2>
          <p className="mt-1 text-[10px] leading-relaxed text-[#61716a]">
            Your festival schedule at a glance.
          </p>
        </section>

        <section className="mx-4 mt-3" aria-label="Program progress">
          <div className="flex flex-col gap-2.5 rounded-[15px] bg-[#e8f4ec] p-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[12px] bg-white text-[#15804c]">
                <CalendarCheck2 size={22} aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <strong className="text-[11px] font-bold text-[#26573c]">
                  {programs.length} of {target} activities completed
                </strong>
                <small className="text-[9px] uppercase tracking-[0.12em] text-[#829288]">
                  Your progress
                </small>
              </div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#dfeee5]">
              <div
                className="h-full rounded-full bg-[#16824f] transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        {removed ? (
          <div
            role="status"
            className="mx-4 mt-3 flex items-center justify-between gap-3 rounded-[14px] border border-[#cbe6d5] bg-[#edf7f0] px-3 py-2.5"
          >
            <p className="text-[10px] font-semibold leading-snug text-[#15774a]">
              {removed.title} removed from your program.
            </p>
            <button
              type="button"
              onClick={undoRemove}
              className={`inline-flex min-h-[32px] shrink-0 items-center gap-1 rounded-full bg-white px-3 text-[9px] font-bold text-[#166c43] ${focusOnLight}`}
            >
              <RotateCcw size={12} aria-hidden="true" /> Undo
            </button>
          </div>
        ) : null}

        <section className="mt-5 px-4" aria-label="Registered programs">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <h2 className="text-[14px] font-bold text-[#1b5237]">Registered programs</h2>
            <span className="text-[9px] text-[#8a978f]">{programs.length} saved</span>
          </div>

          {programs.length === 0 ? (
            <div className="ar-empty rounded-[16px] border border-[#e3efe8] bg-white px-6 py-10">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e8f5eb] text-[#15804c]">
                <CalendarCheck2 size={24} aria-hidden="true" />
              </span>
              <strong className="mt-3">No sessions yet</strong>
              <p className="mx-auto max-w-[240px]">
                Add sessions from the schedule and they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-[9px]">
              {programs.map((program) => {
                const status = statusById[program.id] ?? 'Confirmed';
                const tile = dateTile(program.day);
                return (
                  <article
                    key={program.id}
                    className="flex items-center gap-2.5 rounded-[16px] border border-[#dce7e0] bg-white p-2.5 transition-[border-color,transform] hover:-translate-y-px hover:border-[#b7d9c3]"
                  >
                    <div className="flex h-[54px] w-[43px] shrink-0 flex-col items-center justify-center rounded-[12px] bg-[#edf7f0]">
                      <span className="text-[8px] font-bold leading-none text-[#71887a]">
                        {tile.month}
                      </span>
                      <span className="mt-1 text-[21px] font-bold leading-none text-[#1b6d43]">
                        {tile.number}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDetailId(program.id)}
                      className={`min-w-0 flex-1 text-left ${focusOnLight}`}
                      aria-label={`View details for ${program.title}`}
                    >
                      <strong className="block text-[11px] font-bold leading-snug text-[#223c2e]">
                        {program.title}
                      </strong>
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <small className="inline-flex items-center gap-1 text-[8.5px] text-[#86948b]">
                          <Clock3 size={11} aria-hidden="true" /> {program.start}
                        </small>
                        <small className="inline-flex items-center gap-1 text-[8.5px] text-[#86948b]">
                          <MapPin size={11} aria-hidden="true" /> {program.venue}
                        </small>
                      </span>
                      <span className="mt-1.5 inline-block self-start rounded-[10px] bg-[#e8f5eb] px-[7px] py-[3px] text-[7px] font-bold text-[#178049]">
                        {status}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(program.id)}
                      aria-label={`Remove ${program.title} from my program`}
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#97a79b] transition-colors hover:bg-[#fdecea] hover:text-[#b64235] ${focusOnLight}`}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
            </div>
          )}

          <Link
            href="/schedule"
            className={`mx-auto mt-3.5 flex min-h-[38px] items-center justify-center p-2 text-[10px] font-bold text-[#16814d] ${focusOnLight}`}
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
                <p className="ar-eyebrow">Registered event</p>
                <h2 className="mt-1 text-[16px] font-bold leading-snug tracking-[-0.4px] text-[#0b2118]">
                  {detail.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailId(null)}
                className="ar-icon-button"
                aria-label="Close event details"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5eb] px-2.5 py-1 text-[9px] font-bold text-[#15774a]">
                <Clock3 size={12} aria-hidden="true" /> {detail.start}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5eb] px-2.5 py-1 text-[9px] font-bold text-[#15774a]">
                <MapPin size={12} aria-hidden="true" /> {detail.venue}
              </span>
              <span className="rounded-full bg-[#edf7f0] px-2.5 py-1 text-[9px] font-bold text-[#15774a]">
                {statusById[detail.id] ?? 'Confirmed'}
              </span>
            </div>

            <p className="mt-4 text-[10px] leading-relaxed text-[#61716a]">
              Saved for {detail.day}. This session is in your program — carry your participant card
              and arrive a few minutes early.
            </p>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setDetailId(null)}
                className={`min-h-[44px] flex-1 rounded-full border border-[#dbe6df] text-[10px] font-bold text-[#166c43] ${focusOnLight}`}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmId(detail.id);
                  setDetailId(null);
                }}
                className={`min-h-[44px] flex-1 rounded-full bg-[#fdecea] text-[10px] font-bold text-[#b64235] ${focusOnLight}`}
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
            <h2 className="text-[16px] font-bold text-[#0b2118]">
              Remove from my program?
            </h2>
            <p className="mt-2 text-[10px] leading-relaxed text-[#61716a]">
              {confirmProgram.title} will be removed from your saved sessions. You can undo this
              right after.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className={`min-h-[44px] flex-1 rounded-full border border-[#dbe6df] text-[10px] font-bold text-[#166c43] ${focusOnLight}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                className={`min-h-[44px] flex-1 rounded-full bg-[#b64235] text-[10px] font-bold text-white ${focusOnLight}`}
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
