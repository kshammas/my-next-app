import { NextResponse } from 'next/server';
import { apiRequest, isApiConfigured } from '@/lib/api';
import { getSession, clearSession, saveSession } from '@/lib/session';
import type { Session } from '@/lib/types';

export async function GET() {
  return NextResponse.json(await getSession());
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { code?: string; guest?: boolean };
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  const guest = body.guest === true;

  if (!guest && !code) {
    return NextResponse.json({ error: 'Scan a card or enter your Jamia ID.' }, { status: 400 });
  }

  const current = await getSession();
  let session: Session = current;

  try {
    if (isApiConfigured()) {
      const remote = await apiRequest<Partial<Session> | null>('/auth/login', {
        method: 'POST',
        body: { code, guest },
        fallback: null,
      });
      if (remote) session = { ...session, ...remote };
    } else if (guest) {
      session = {
        id: 'guest',
        name: 'GUEST',
        jamiaId: '—',
        campus: 'guest',
        points: 0,
        claimed: [],
        registered: [],
        readNotifications: [],
        transactions: [],
      };
    } else {
      session = {
        ...current,
        id: `participant-${code}`,
        jamiaId: code.toUpperCase(),
        name: code.toUpperCase(),
      };
    }
    await saveSession(session);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
