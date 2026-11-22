import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api';
import { demoVenues } from '@/lib/demo-data';
import type { Venue } from '@/lib/types';

export async function GET() {
  try {
    const data = await apiRequest<Venue[]>('/map', { fallback: demoVenues });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
