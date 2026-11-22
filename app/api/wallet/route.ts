import { NextResponse } from 'next/server';
import { apiRequest, isApiConfigured } from '@/lib/api';
import { demoDashboard } from '@/lib/demo-data';
import { getSession, saveSession } from '@/lib/session';
import type { Session, Transaction } from '@/lib/types';

export type WalletPayload = {
  balance: number;
  earned: number;
  redeemed: number;
  transactions: Transaction[];
};

export async function GET() {
  try {
    const session = await getSession();
    const extraEarned = session.transactions
      .filter((t) => t.id.startsWith('claim-') && t.points > 0)
      .reduce((sum, t) => sum + t.points, 0);
    const extraRedeemed = session.transactions
      .filter((t) => t.id.startsWith('redeem-') && t.points < 0)
      .reduce((sum, t) => sum + Math.abs(t.points), 0);

    const local: WalletPayload = {
      balance: session.points,
      earned: demoDashboard.earned + extraEarned,
      redeemed: demoDashboard.redeemed + extraRedeemed,
      transactions: session.transactions,
    };
    if (isApiConfigured()) {
      const remote: Partial<WalletPayload> | null = await apiRequest('/wallet', {
        fallback: null,
      });
      return NextResponse.json({ ...local, ...(remote ?? {}) });
    }
    return NextResponse.json(local);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    itemId?: string;
    name?: string;
    cost?: number;
  };
  if (!body.itemId || typeof body.cost !== 'number' || body.cost <= 0) {
    return NextResponse.json({ error: 'itemId and a positive cost are required.' }, { status: 400 });
  }

  try {
    let session: Session = await getSession();
    if (session.points < body.cost) {
      return NextResponse.json({ error: 'Not enough Glocal Points.' }, { status: 409 });
    }
    const remote = await apiRequest<{ points?: number } | null>('/wallet/redeem', {
      method: 'POST',
      body: { itemId: body.itemId, cost: body.cost },
      fallback: null,
    });

    session = {
      ...session,
      points: remote?.points ?? session.points - body.cost,
      transactions: [
        {
          id: `redeem-${body.itemId}-${Date.now()}`,
          title: `Redeemed · ${body.name ?? body.itemId}`,
          points: -body.cost,
          date: 'Just now',
          kind: 'redeemed' as const,
        },
        ...session.transactions,
      ],
    };
    await saveSession(session);
    return NextResponse.json({ ok: true, points: session.points, transactions: session.transactions });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
