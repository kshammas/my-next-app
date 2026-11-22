import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api';
import { demoStore } from '@/lib/demo-data';
import type { StoreItem } from '@/lib/types';

export async function GET() {
  try {
    const data = await apiRequest<StoreItem[]>('/store', { fallback: demoStore });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
