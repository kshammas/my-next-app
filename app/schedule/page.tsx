'use client';

import { useState } from 'react';
import { CalendarDays, Check, Clock, MapPin, Plus } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { demoSchedule } from '@/lib/demo-data';
import { apiSend, useApi } from '@/lib/use-api';
import type { ScheduleDay, ScheduleEvent } from '@/lib/types';

export default function SchedulePage() {
  const { data: days, setData } = useApi<ScheduleDay[]>('/api/schedule', demoSchedule);
  const [activeDay, setActiveDay] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const day = days[activeDay] ?? days[0];

  async function toggle(event: ScheduleEvent) {
    setBusyId(event.id);
    setMessage('');
    const add = !event.registered;
    setData((previous) =>
      previous.map((entry) => ({
        ...entry,
        events: entry.events.map((item) =>
          item.id === event.id ? { ...item, registered: add } : item,
        ),
      })),
    );
    try {
      await apiSend('/api/programs', 'POST', { eventId: event.id, add });
      setMessage(add ? `${event.title} added to My Program.` : `${event.title} removed.`);
    } catch (cause) {
      setData((previous) =>
        previous.map((entry) => ({
          ...entry,
          events: entry.events.map((item) =>
            item.id === event.id ? { ...item, registered: !add } : item,
          ),
        })),
      );
      setMessage(cause instanceof Error ? cause.message : 'Could not update your program.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AppShell>
      <div className="app-content">
        <PageHeader title="Schedule" />

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {days.map((entry, index) => (
            <button
              key={entry.id}
              onClick={() => setActiveDay(index)}
              aria-pressed={index === activeDay}
              className={`min-h-[44px] shrink-0 rounded-full px-4 text-[12px] font-bold ${
                index === activeDay ? 'bg-[#064e24] text-white' : 'bg-white text-slate-500'
              }`}
            >
              {entry.label} <span className="font-medium opacity-70">· {entry.date}</span>
            </button>
          ))}
        </div>

        {message ? <p role="status" className="mt-3 text-[12px] font-semibold text-[#0a7a33]">{message}</p> : null}

        <div className="grid-list mt-4">
          {day?.events.map((event) => (
            <article key={event.id} className="soft-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="chip bg-[#e7f4ea] text-[#0a7a33]">{event.category}</span>
                  <h2 className="mt-2 text-[15px] font-extrabold text-[#073b1d]">{event.title}</h2>
                  {event.speaker ? <p className="mt-0.5 text-[11px] text-slate-500">{event.speaker}</p> : null}
                </div>
                <button
                  onClick={() => void toggle(event)}
                  disabled={busyId === event.id}
                  aria-label={event.registered ? 'Remove from my program' : 'Add to my program'}
                  aria-pressed={event.registered}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                    event.registered ? 'bg-[#064e24] text-white' : 'bg-[#f1f6f2] text-[#0a7a33]'
                  }`}
                >
                  {event.registered ? <Check size={18} /> : <Plus size={18} />}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><Clock size={13} /> {event.start} – {event.end}</span>
                <span className="flex items-center gap-1"><MapPin size={13} /> {event.venue}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-[#e9f3ec] p-4 text-[12px] text-[#0a5c2e]">
          <CalendarDays size={18} /> Tap + to add a session to My Program.
        </div>
      </div>
    </AppShell>
  );
}
