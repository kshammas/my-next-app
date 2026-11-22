import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api';
import { demoDashboard } from '@/lib/demo-data';
import type { Dashboard } from '@/lib/types';

export async function GET() {
  try {
    const data = await apiRequest<Dashboard>('/dashboard', { fallback: demoDashboard });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
