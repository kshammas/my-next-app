import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api';
import { demoSchedule } from '@/lib/demo-data';
import { getSession } from '@/lib/session';
import type { ScheduleDay } from '@/lib/types';

export async function GET() {
  try {
    const session = await getSession();
    const days = await apiRequest<ScheduleDay[]>('/schedule', { fallback: demoSchedule });
    return NextResponse.json(
      days.map((day) => ({
        ...day,
        events: day.events.map((event) => ({
          ...event,
          registered: event.registered || session.registered.includes(event.id),
        })),
      })),
    );
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
