'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, Gift, QrCode, ScanLine, Ticket, TrendingUp } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { demoSession } from '@/lib/demo-data';
import { useApi } from '@/lib/use-api';
import type { Session, Transaction, TransactionKind } from '@/lib/types';

type WalletPayload = {
  balance: number;
  earned: number;
  redeemed: number;
  transactions: Transaction[];
};

const fallback: WalletPayload = {
  balance: 92,
  earned: 140,
  redeemed: 58,
  transactions: [],
};

const filters: { label: string; kind: TransactionKind | 'all' }[] = [
  { label: 'All activity', kind: 'all' },
  { label: 'Earned', kind: 'earned' },
  { label: 'Redeemed', kind: 'redeemed' },
  { label: 'Adjustments', kind: 'adjustment' },
];

export default function WalletPage() {
  const { data: wallet } = useApi<WalletPayload>('/api/wallet', fallback);
  const { data: session } = useApi<Session>('/api/session', demoSession);
  const [filter, setFilter] = useState<TransactionKind | 'all'>('all');
  const [showCode, setShowCode] = useState(false);

  const transactions = wallet.transactions.filter(
    (transaction) => filter === 'all' || transaction.kind === filter,
  );

  return (
    <AppShell>
      <div className="app-content">
        <PageHeader title="Glocal Wallet" />

        <div className="mt-4 rounded-[24px] bg-gradient-to-br from-[#0a5c2e] to-[#06451f] p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest text-emerald-100/80">AVAILABLE BALANCE</span>
            <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-[10px] font-bold text-emerald-200">
              ● Active
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[40px] font-extrabold leading-none">{wallet.balance}</span>
            <span className="rounded-full bg-[#f5d90a] px-2.5 py-1 text-[11px] font-bold text-[#06451f]">GP</span>
          </div>
          <p className="mt-1 text-[12px] text-emerald-200/75">Your Glocal Points balance</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f5d90a]/20 text-[#f5d90a]">
                <ArrowDownLeft size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[10px] text-emerald-200/70">Total earned</p>
                <p className="text-[14px] font-bold">{wallet.earned} GP</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <ArrowUpRight size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[10px] text-emerald-200/70">Total redeemed</p>
                <p className="text-[14px] font-bold">{wallet.redeemed} GP</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowCode(true)}
            className="flex min-h-[68px] items-center gap-3 rounded-2xl bg-[#d7e86b] p-4 text-left transition-transform duration-150 active:scale-[0.98]"
          >
            <span className="text-xl"><QrCode size={22} /></span>
            <div>
              <p className="text-[14px] font-extrabold text-[#073b1d]">Redeem ›</p>
              <p className="text-[10px] text-[#073b1d]/60">Show your QR</p>
            </div>
          </button>
          <Link href="/points" className="flex min-h-[68px] items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-transform duration-150 active:scale-[0.98]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f4ea] text-[#0a7a33]">
              <TrendingUp size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[14px] font-extrabold text-[#073b1d]">Earn points ›</p>
              <p className="text-[10px] text-slate-400">Explore events</p>
            </div>
          </Link>
        </div>

        <h2 className="section-title mt-6">Transaction history</h2>
        <p className="section-subtitle mt-0.5">Track every point you earn and spend</p>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item.label}
              onClick={() => setFilter(item.kind)}
              aria-pressed={filter === item.kind}
              className={`min-h-[44px] shrink-0 rounded-full px-4 text-[11px] font-bold ${
                filter === item.kind ? 'bg-[#06451f] text-white' : 'bg-white text-slate-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4 divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
          {transactions.length === 0 ? (
            <p className="p-5 text-center text-[12px] text-slate-400">No transactions in this view.</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      transaction.points < 0 ? 'bg-rose-50' : 'bg-emerald-50'
                    }`}
                  >
                    {transaction.points < 0 ? (
                      <Ticket size={18} aria-hidden="true" />
                    ) : (
                      <Gift size={18} aria-hidden="true" />
                    )}
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-[#111]">{transaction.title}</p>
                    <p className="text-[10px] text-slate-400">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[14px] font-extrabold ${transaction.points < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {transaction.points > 0 ? '+' : ''}{transaction.points}
                  </p>
                  <p className="text-[9px] text-slate-400">GLOCAL POINTS</p>
                </div>
              </div>
            ))
          )}
        </div>

        {showCode ? (
          <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Redeem code">
            <div className="modal-card text-center">
              <ScanLine className="mx-auto h-7 w-7 text-[#0a7a33]" />
              <h2 className="mt-2 text-[17px] font-extrabold text-[#073b1d]">Show at the counter</h2>
              <p className="mt-1 text-[12px] text-slate-500">Your participant ID for redemption</p>
              <div className="mt-4 rounded-2xl border border-dashed border-[#0a7a33]/40 bg-[#f4f8f5] p-5">
                <p className="text-[22px] font-black tracking-widest text-[#06451f]">{session.jamiaId}</p>
                <p className="mt-1 text-[11px] text-slate-400">{session.name}</p>
              </div>
              <button onClick={() => setShowCode(false)} className="primary-button mt-5">
                Done
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
