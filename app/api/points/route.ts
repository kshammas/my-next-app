import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api';
import { demoActivities } from '@/lib/demo-data';
import { getSession, saveSession } from '@/lib/session';
import type { PointActivity } from '@/lib/types';

export async function GET() {
  try {
    const session = await getSession();
    const activities = await apiRequest<PointActivity[]>('/points', { fallback: demoActivities });
    return NextResponse.json(
      activities.map((activity) => ({
        ...activity,
        claimed: activity.claimed || session.claimed.includes(activity.id),
      })),
    );
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    activityId?: string;
    reward?: number;
    code?: string;
  };
  if (!body.activityId) {
    return NextResponse.json({ error: 'activityId is required.' }, { status: 400 });
  }

  try {
    const session = await getSession();
    if (session.claimed.includes(body.activityId)) {
      return NextResponse.json({ error: 'This activity was already claimed.' }, { status: 409 });
    }

    const activities = await apiRequest<PointActivity[]>('/points', { fallback: demoActivities });
    const reward = body.reward ?? activities.find((a) => a.id === body.activityId)?.reward ?? 0;
    const title = activities.find((a) => a.id === body.activityId)?.title ?? body.activityId;

    const remote = await apiRequest<{ claimed?: boolean; points?: number } | null>(
      '/points/claim',
      { method: 'POST', body: { activityId: body.activityId, code: body.code }, fallback: null },
    );

    const updated = {
      ...session,
      claimed: [...session.claimed, body.activityId],
      points: remote?.points ?? session.points + reward,
      transactions: [
        {
          id: `claim-${body.activityId}`,
          title,
          points: reward,
          date: 'Just now',
          kind: 'earned' as const,
        },
        ...session.transactions.filter((t) => t.id !== `claim-${body.activityId}`),
      ],
    };
    await saveSession(updated);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
