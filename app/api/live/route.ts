import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api';
import { demoStreams } from '@/lib/demo-data';
import type { StreamItem } from '@/lib/types';

export async function GET() {
  try {
    const data = await apiRequest<StreamItem[]>('/live', { fallback: demoStreams });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
