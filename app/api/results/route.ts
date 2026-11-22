import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api';
import { demoResults } from '@/lib/demo-data';
import type { Results } from '@/lib/types';

export async function GET() {
  try {
    const data = await apiRequest<Results>('/results', { fallback: demoResults });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
