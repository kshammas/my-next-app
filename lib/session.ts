import 'server-only';
import { cookies } from 'next/headers';
import { demoSession, demoTransactions } from './demo-data';
import type { Session } from './types';

const COOKIE_NAME = 'hr26_session';

function defaultSession(): Session {
  return { ...demoSession, transactions: [...demoTransactions] };
}

export async function getSession(): Promise<Session> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) {
    return defaultSession();
  }
  try {
    return { ...defaultSession(), ...(JSON.parse(value) as Partial<Session>) };
  } catch {
    return defaultSession();
  }
}

export async function saveSession(session: Session): Promise<void> {
  (await cookies()).set(COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
