import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api';
import { demoSchedule } from '@/lib/demo-data';
import { getSession, saveSession } from '@/lib/session';
import type { Program, ScheduleDay } from '@/lib/types';

function allEvents(days: ScheduleDay[]) {
  return days.flatMap((day) => day.events.map((event) => ({ ...event, day: day.label })));
}

export async function GET() {
  try {
    const session = await getSession();
    const days = await apiRequest<ScheduleDay[]>('/schedule', { fallback: demoSchedule });
    const programs: Program[] = allEvents(days)
      .filter((event) => session.registered.includes(event.id))
      .map((event) => ({
        id: event.id,
        title: event.title,
        venue: event.venue,
        start: event.start,
        day: event.day,
      }));
    return NextResponse.json(programs);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { eventId?: string; add?: boolean };
  if (!body.eventId) {
    return NextResponse.json({ error: 'eventId is required.' }, { status: 400 });
  }
  try {
    const session = await getSession();
    const registered = new Set(session.registered);
    if (body.add === false) registered.delete(body.eventId);
    else registered.add(body.eventId);

    await apiRequest('/programs', {
      method: 'POST',
      body: { eventId: body.eventId, add: body.add !== false },
      fallback: null,
    });

    const updated = { ...session, registered: [...registered] };
    await saveSession(updated);
    return NextResponse.json({ registered: updated.registered });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
