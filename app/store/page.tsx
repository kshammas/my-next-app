'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { demoStore } from '@/lib/demo-data';
import { apiSend, useApi } from '@/lib/use-api';
import type { StoreItem } from '@/lib/types';

export default function StorePage() {
  const { data: items } = useApi<StoreItem[]>('/api/store', demoStore);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  async function redeem(item: StoreItem) {
    setBusyId(item.id);
    setNotice('');
    try {
      const result = await apiSend<{ points: number }>('/api/wallet', 'POST', {
        itemId: item.id,
        name: item.name,
        cost: item.cost,
      });
      setNotice(`Redeemed ${item.name} · ${result.points} GP left. Show this at the counter.`);
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Could not redeem this item.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AppShell>
      <div className="px-4 pt-6 pb-10">
        <PageHeader title="Glocal Store" />

        <div className="mt-4 rounded-[24px] bg-gradient-to-br from-[#d7e86b] to-[#b6d34a] p-5">
          <ShoppingBag className="h-6 w-6 text-[#06451f]" />
          <h2 className="mt-2 text-[18px] font-extrabold text-[#073b1d]">Spend your GP</h2>
          <p className="mt-1 text-[12px] text-[#073b1d]/70">
            Earn points at events, then redeem them here.
          </p>
        </div>

        {notice ? (
          <p className="mt-4 rounded-2xl bg-[#e7f4ea] p-3 text-[12px] font-semibold text-[#0a5c2e]">{notice}</p>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3">
          {items.map((item) => (
            <article key={item.id} className="soft-card relative flex flex-col p-4">
              {item.tag ? (
                <span className="chip absolute right-3 top-3 bg-[#f7e305] text-[#06451f]">{item.tag}</span>
              ) : null}
              <div className="flex h-20 items-center justify-center rounded-2xl bg-[#f4f8f5] text-[38px]">
                {item.emoji}
              </div>
              <h3 className="mt-3 text-[13px] font-extrabold text-[#073b1d]">{item.name}</h3>
              <p className="mt-0.5 text-[11px] font-bold text-[#0a7a33]">{item.cost} GP</p>
              <button
                onClick={() => void redeem(item)}
                disabled={busyId === item.id}
                className="mt-3 rounded-xl bg-[#064e24] py-2.5 text-[12px] font-bold text-white disabled:opacity-50"
              >
                {busyId === item.id ? 'Redeeming…' : 'Redeem'}
              </button>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
