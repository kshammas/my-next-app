'use client';

import { useState } from 'react';
import { CalendarCheck2, Trash2 } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { apiSend, useApi } from '@/lib/use-api';
import type { Program } from '@/lib/types';

const initial: Program[] = [];

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

  return (
    <AppShell>
      <div className="app-content">
        <PageHeader title="My Program" />

        <p className="mt-4 text-[12px] text-slate-500">
          Everything you have saved, in one place.
        </p>

        {programs.length === 0 ? (
          <div className="soft-card mt-6 flex flex-col items-center px-6 py-12 text-center">
            <CalendarCheck2 className="h-10 w-10 text-[#0a7a33]" />
            <h2 className="mt-3 text-[15px] font-extrabold text-[#073b1d]">No sessions yet</h2>
            <p className="mt-1 text-[12px] text-slate-500">
              Add sessions from the schedule and they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid-list mt-5">
            {programs.map((program) => (
              <article key={program.id} className="soft-card flex items-center gap-3 p-4">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-[#e7f4ea] text-[#064e24]">
                  <span className="text-[15px] font-extrabold leading-none">{program.start}</span>
                  <span className="mt-0.5 text-[9px] font-semibold">{program.day}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-[14px] font-extrabold text-[#073b1d]">{program.title}</h2>
                  <p className="text-[11px] text-slate-500">{program.venue}</p>
                </div>
                <button
                  onClick={() => void remove(program)}
                  disabled={busyId === program.id}
                  aria-label={`Remove ${program.title}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500"
                >
                  <Trash2 size={16} />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
