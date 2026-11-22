import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api';
import { demoNotifications } from '@/lib/demo-data';
import { getSession, saveSession } from '@/lib/session';
import type { AppNotification } from '@/lib/types';

export async function GET() {
  try {
    const session = await getSession();
    const items = await apiRequest<AppNotification[]>('/notifications', {
      fallback: demoNotifications,
    });
    return NextResponse.json(
      items.map((item) => ({ ...item, read: item.read || session.readNotifications.includes(item.id) })),
    );
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getSession();
    const items = await apiRequest<AppNotification[]>('/notifications', {
      fallback: demoNotifications,
    });
    const readNotifications = [...new Set([...session.readNotifications, ...items.map((i) => i.id)])];
    await apiRequest('/notifications/read', { method: 'POST', body: {}, fallback: null });
    const updated = { ...session, readNotifications };
    await saveSession(updated);
    return NextResponse.json({ ok: true, readNotifications });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
