'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  ChevronLeft,
  CircleAlert,
  Coins,
  Coffee,
  Cookie,
  Gift,
  QrCode,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { usePrototype } from '@/lib/prototype-store';
import type { TransactionKind } from '@/lib/types';

type Reward = {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: LucideIcon;
  tag?: string;
};

const filters: { label: string; kind: TransactionKind | 'all' }[] = [
  { label: 'All activity', kind: 'all' },
  { label: 'Earned', kind: 'earned' },
  { label: 'Redeemed', kind: 'redeemed' },
  { label: 'Adjustments', kind: 'adjustment' },
];

const rewards: Reward[] = [
  {
    id: 'r-1',
    name: 'Milk Tea',
    cost: 15,
    description: 'Classic tea with creamy milk — the festival favourite.',
    icon: Coffee,
    tag: 'FAVOURITE',
  },
  {
    id: 'r-2',
    name: 'Cafe Snack Combo',
    cost: 30,
    description: 'A savoury snack paired with a refreshing cold drink.',
    icon: Cookie,
    tag: 'POPULAR',
  },
  {
    id: 'r-3',
    name: 'Festival Tee',
    cost: 80,
    description: 'Take home a Rendezvous 26 souvenir tee.',
    icon: ShoppingBag,
  },
];

const focusOnDark =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDF6D4]';
const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15532E]';

const QR_SIZE = 29;
const FINDERS: readonly [number, number][] = [
  [0, 0],
  [0, QR_SIZE - 7],
  [QR_SIZE - 7, 0],
];
const ALIGN = QR_SIZE - 9;

function inFinderZone(row: number, col: number) {
  return FINDERS.some(
    ([finderRow, finderCol]) =>
      row >= finderRow - 1 &&
      row <= finderRow + 7 &&
      col >= finderCol - 1 &&
      col <= finderCol + 7,
  );
}

function inAlignmentZone(row: number, col: number) {
  return row >= ALIGN - 1 && row <= ALIGN + 5 && col >= ALIGN - 1 && col <= ALIGN + 5;
}

function moduleOn(row: number, col: number, seed: number) {
  let hash =
    Math.imul(row + 1, 0x1f123bb5) ^
    Math.imul(col + 1, 0x5bd1e995) ^
    Math.imul(seed + 1, 0x27d4eb2d);
  hash = Math.imul(hash ^ (hash >>> 15), 0x85ebca6b);
  hash ^= hash >>> 13;
  return (hash >>> 0) % 100 < 46;
}

function QrMosaic({ seed }: { seed: number }) {
  const modules = useMemo(() => {
    const cells: { row: number; col: number }[] = [];
    for (let row = 0; row < QR_SIZE; row += 1) {
      for (let col = 0; col < QR_SIZE; col += 1) {
        if (inFinderZone(row, col) || inAlignmentZone(row, col)) continue;

        if (row === 6 && col >= 8 && col <= QR_SIZE - 9) {
          if (col % 2 === 0) cells.push({ row, col });
          continue;
        }
        if (col === 6 && row >= 8 && row <= QR_SIZE - 9) {
          if (row % 2 === 0) cells.push({ row, col });
          continue;
        }
        if (moduleOn(row, col, seed)) cells.push({ row, col });
      }
    }
    return cells;
  }, [seed]);

  return (
    <svg
      viewBox={`0 0 ${QR_SIZE + 4} ${QR_SIZE + 4}`}
      className="h-full w-full"
      role="img"
      aria-label="Redemption QR code — show it to the merchant"
    >
      <rect x="0" y="0" width={QR_SIZE + 4} height={QR_SIZE + 4} fill="#FFFFFF" />
      <g fill="#0B3D22" shapeRendering="crispEdges">
        {modules.map(({ row, col }) => (
          <rect key={`${row}-${col}`} x={col + 2} y={row + 2} width="1" height="1" />
        ))}
        {FINDERS.map(([finderRow, finderCol]) => (
          <g key={`${finderRow}-${finderCol}`}>
            <rect x={finderCol + 2} y={finderRow + 2} width="7" height="7" fill="#0B3D22" />
            <rect x={finderCol + 3} y={finderRow + 3} width="5" height="5" fill="#FFFFFF" />
            <rect x={finderCol + 4} y={finderRow + 4} width="3" height="3" fill="#0B3D22" />
          </g>
        ))}
        <rect x={ALIGN + 2} y={ALIGN + 2} width="5" height="5" fill="#0B3D22" />
        <rect x={ALIGN + 3} y={ALIGN + 3} width="3" height="3" fill="#FFFFFF" />
        <rect x={ALIGN + 4} y={ALIGN + 4} width="1" height="1" fill="#0B3D22" />
      </g>
    </svg>
  );
}

const redeemSteps = [
  {
    title: 'Show your QR',
    body: 'Present the QR code to the Glocal Store merchant.',
    icon: QrCode,
  },
  {
    title: 'Confirm the purchase',
    body: 'The merchant checks your wallet and enters the redemption amount.',
    icon: Ticket,
  },
  {
    title: 'Enjoy your rewards',
    body: 'Your wallet balance updates after a successful redemption.',
    icon: Gift,
  },
];

export default function WalletPage() {
  const { session, redeemReward } = usePrototype();
  const [filter, setFilter] = useState<TransactionKind | 'all'>('all');
  const [showCode, setShowCode] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [qrSeed, setQrSeed] = useState(1);
  const [generatedAt, setGeneratedAt] = useState('');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeemed, setRedeemed] = useState<{ reward: Reward; code: string } | null>(null);

  const earned = session.transactions
    .filter((transaction) => transaction.points > 0)
    .reduce((sum, transaction) => sum + transaction.points, 0);
  const redeemedPoints = session.transactions
    .filter((transaction) => transaction.points < 0)
    .reduce((sum, transaction) => sum + Math.abs(transaction.points), 0);

  const transactions = session.transactions.filter(
    (transaction) => filter === 'all' || transaction.kind === filter,
  );

  useEffect(() => {
    if (!showCode) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [showCode]);

  useEffect(() => {
    document.getElementById('main-content')?.scrollTo({ top: 0 });
  }, [showCode]);

  const regenerateQr = () => {
    setSecondsLeft(60);
    setQrSeed((seed) => seed + 1);
    setGeneratedAt(
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    );
  };

  const openQr = () => {
    regenerateQr();
    setShowCode(true);
  };

  function handleRedeem(reward: Reward) {
    const result = redeemReward(reward.id, reward.cost, reward.name);
    if (!result.ok || !result.code) return;
    setSelectedReward(null);
    setRedeemed({ reward, code: result.code });
  }

  if (showCode) {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');

    return (
      <AppShell>
        <div className="min-h-full bg-[#F5FAF6] pb-8">
          <header className="relative flex items-center bg-[#13512C] px-4 py-4 text-white">
            <button
              type="button"
              onClick={() => setShowCode(false)}
              aria-label="Back to wallet"
              className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25 ${focusOnDark}`}
            >
              <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
            </button>
            <h1 className="pointer-events-none absolute inset-x-0 text-center text-[17px] font-extrabold">
              Redeem Glocal Points
            </h1>
          </header>

          <div className="px-4 pb-6 pt-4">
            <p className="text-[12px] leading-relaxed text-[#15532E]/75">
              Show this QR code to the Glocal Store merchant to redeem your points.
            </p>

            <section className="mt-4 rounded-[24px] bg-white p-5 text-center shadow-sm">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-[#EAF4ED] px-3 py-1.5">
                <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#15532E]">
                  <ShieldCheck size={14} aria-hidden="true" /> Secure QR
                </span>
                <span className="flex items-center gap-1 rounded-full bg-[#15532E] px-2 py-0.5 text-[9px] font-bold text-white">
                  <Check size={11} aria-hidden="true" /> Verified
                </span>
              </div>

              <h2 className="mt-3 text-[16px] font-extrabold text-[#15532E]">Scan to redeem</h2>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-[#6B7B72]">
                <ScanLine size={14} aria-hidden="true" /> Ask the merchant to scan your code
              </p>

              <div className="mx-auto mt-4 w-full max-w-[268px] rounded-[18px] border border-[#DCE9DF] bg-white p-3 shadow-[0_10px_28px_rgba(21,83,46,0.10)]">
                <div className="aspect-square w-full">
                  <QrMosaic seed={qrSeed} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${secondsLeft > 0 ? 'bg-[#2FA36B]' : 'bg-[#D34A3A]'}`}
                  aria-hidden="true"
                />
                <p className="text-[12px] font-semibold text-[#15532E]">
                  QR expires in{' '}
                  <span className="font-extrabold tabular-nums" aria-live="polite">
                    {minutes}:{seconds}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={regenerateQr}
                className={`mx-auto mt-4 flex min-h-[44px] w-full max-w-[240px] items-center justify-center gap-2 rounded-full bg-[#15532E] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#0E3D21] ${focusOnDark}`}
              >
                <RefreshCw size={15} aria-hidden="true" /> Generate new QR
              </button>

              <p className="mt-2 text-[10px] text-[#8A9A90]">Generated at {generatedAt || '--:--:--'}</p>
              <p className="mt-0.5 text-[10px] text-[#8A9A90]">
                Linked to {session.name} · {session.jamiaId}
              </p>
            </section>

            <section className="mt-5 rounded-[20px] bg-white p-4 shadow-sm">
              <h2 className="text-[14px] font-extrabold text-[#15532E]">How to redeem</h2>
              <ol className="mt-3 space-y-3">
                {redeemSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.title} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FDF6D4] text-[12px] font-extrabold text-[#15532E]">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#15532E]">
                          {step.title}
                          <Icon size={13} className="text-[#2FA36B]" aria-hidden="true" />
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-[#6B7B72]">{step.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            <div className="mt-5 rounded-[18px] bg-[#FDF6D4] p-4">
              <p className="flex gap-2 text-[10px] leading-relaxed text-[#5B4E1A]">
                <ShieldCheck size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>Your QR is temporary. Never share screenshots of your QR.</span>
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-full bg-[#F5FAF6] pb-8">
        <header className="relative flex items-center bg-[#13512C] px-4 py-4 text-white">
          <Link
            href="/home"
            aria-label="Go back"
            className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25 ${focusOnDark}`}
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="pointer-events-none absolute inset-x-0 text-center text-[18px] font-extrabold">
            Glocal Wallet
          </h1>
        </header>

        <section className="mx-4 mt-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#15532E] to-[#0A3A20] p-5 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-extrabold tracking-widest text-[#A1C8B3]">AVAILABLE BALANCE</p>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold text-[#CDEBD7]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6BE2A0]" aria-hidden="true" /> Active
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <Coins size={22} className="self-center text-[#EECE2D]" aria-hidden="true" />
            <span className="text-[42px] font-extrabold leading-none">{session.points}</span>
            <span className="text-[16px] font-bold text-[#DCEBDD]">Glocal Coins</span>
          </div>
          <p className="mt-2 text-[12px] text-[#A1C8B3]">Your Glocal Points balance</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[18px] bg-white/10 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDF6D4]/20 text-[#FDF6D4]">
                <ArrowDownLeft size={18} aria-hidden="true" />
              </span>
              <p className="mt-2 text-[10px] text-[#A1C8B3]">Total earned</p>
              <p className="mt-0.5 text-[15px] font-extrabold">{earned} GP</p>
            </div>
            <div className="rounded-[18px] bg-white/10 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDF6D4]/20 text-[#FDF6D4]">
                <ArrowUpRight size={18} aria-hidden="true" />
              </span>
              <p className="mt-2 text-[10px] text-[#A1C8B3]">Total redeemed</p>
              <p className="mt-0.5 text-[15px] font-extrabold">{redeemedPoints} GP</p>
            </div>
          </div>
        </section>

        <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={openQr}
            className={`flex min-h-[112px] flex-col items-start justify-between rounded-[20px] bg-[#FDF6D4] p-4 text-left transition-transform duration-150 active:scale-[0.98] ${focusOnLight}`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#15532E] text-[#FDF6D4]">
              <QrCode size={19} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[14px] font-extrabold text-[#15532E]">Redeem</span>
              <span className="mt-0.5 block text-[10px] text-[#15532E]/70">Show your QR</span>
            </span>
          </button>
          <Link
            href="/points"
            className={`flex min-h-[112px] flex-col items-start justify-between rounded-[20px] bg-white p-4 shadow-sm transition-transform duration-150 active:scale-[0.98] ${focusOnLight}`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#15532E]">
              <Gift size={19} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[14px] font-extrabold text-[#15532E]">Earn points</span>
              <span className="mt-0.5 block text-[10px] text-[#6B7B72]">Explore events</span>
            </span>
          </Link>
        </div>

        <section className="mx-4 mt-6" aria-label="Rewards">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-extrabold text-[#15532E]">Rewards</h2>
              <p className="mt-0.5 text-[11px] text-[#6B7B72]">Treats you can pick up around the fest</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-[11px] font-extrabold text-[#15532E]">
              <Coins size={13} aria-hidden="true" /> {session.points}
            </span>
          </div>

          {session.points === 0 ? (
            <div className="mt-3 flex flex-col items-center rounded-[20px] bg-white px-5 py-7 text-center shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF4ED] text-[#15532E]">
                <Gift size={22} aria-hidden="true" />
              </span>
              <p className="mt-3 text-[14px] font-extrabold text-[#15532E]">No coins yet</p>
              <p className="mx-auto mt-1 max-w-[260px] text-[11px] leading-relaxed text-[#6B7B72]">
                Join festival activities to earn your first Glocal Coins and unlock these rewards.
              </p>
              <Link
                href="/points"
                className={`mt-4 flex min-h-[44px] w-full max-w-[180px] items-center justify-center rounded-full bg-[#15532E] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#0E3D21] ${focusOnDark}`}
              >
                Explore activities
              </Link>
            </div>
          ) : rewards.length === 0 ? (
            <div className="mt-3 flex flex-col items-center rounded-[20px] bg-white px-5 py-9 text-center shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF4ED] text-[#15532E]">
                <Gift size={22} aria-hidden="true" />
              </span>
              <p className="mt-3 text-[14px] font-extrabold text-[#15532E]">No rewards right now</p>
              <p className="mt-1 text-[11px] text-[#6B7B72]">Check back soon for festival treats.</p>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rewards.map((reward) => {
                const Icon = reward.icon;
                const affordable = session.points >= reward.cost;
                return (
                  <button
                    key={reward.id}
                    type="button"
                    onClick={() => setSelectedReward(reward)}
                    className="flex items-start gap-3 rounded-[20px] bg-white p-4 text-left shadow-sm transition-transform duration-150 active:scale-[0.99]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#FDF6D4] text-[#15532E]">
                      <Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="truncate text-[13px] font-extrabold text-[#15532E]">
                          {reward.name}
                        </span>
                        {reward.tag ? (
                          <span className="shrink-0 rounded-full bg-[#EECE2D] px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-[#15532E]">
                            {reward.tag}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1 block text-[11px] leading-snug text-[#6B7B72]">
                        {reward.description}
                      </span>
                      <span className="mt-2 flex items-center gap-1.5 text-[11px] font-extrabold text-[#15532E]">
                        <Coins size={13} className="text-[#B88900]" aria-hidden="true" />
                        {reward.cost} coins
                        {!affordable ? (
                          <span className="ml-1 text-[10px] font-bold text-[#B64235]">
                            · need {reward.cost - session.points} more
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <p className="mt-2 text-center text-[10px] text-[#8A9A90]">
            Redeeming a reward deducts demo coins from your wallet balance.
          </p>
        </section>

        <section className="mx-4 mt-6">
          <h2 className="text-[15px] font-extrabold text-[#15532E]">Transaction history</h2>
          <p className="mt-0.5 text-[11px] text-[#6B7B72]">Track every point you earn and spend</p>

          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2">
            {filters.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setFilter(item.kind)}
                aria-pressed={filter === item.kind}
                className={`min-h-[44px] shrink-0 rounded-full px-4 text-[11px] font-bold transition-colors ${
                  filter === item.kind
                    ? 'bg-[#15532E] text-white'
                    : 'bg-white text-[#6B7B72]'
                } ${focusOnLight}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-3 divide-y divide-[#EDF2EE] overflow-hidden rounded-[20px] bg-white shadow-sm">
            {transactions.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF4ED] text-[#15532E]">
                  <Coins size={22} aria-hidden="true" />
                </span>
                <p className="mt-3 text-[14px] font-extrabold text-[#15532E]">No transactions yet</p>
                <p className="mx-auto mt-1.5 max-w-[260px] text-[11px] leading-relaxed text-[#6B7B72]">
                  Your Glocal Points activity will appear here. Start participating to earn your first
                  points!
                </p>
                <Link
                  href="/points"
                  className={`mx-auto mt-4 flex min-h-[44px] w-full max-w-[180px] items-center justify-center rounded-full bg-[#15532E] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#0E3D21] ${focusOnDark}`}
                >
                  Explore activities
                </Link>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between gap-3 p-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        transaction.points < 0 ? 'bg-[#FDECEA] text-[#B64235]' : 'bg-[#EAF4ED] text-[#15532E]'
                      }`}
                    >
                      {transaction.points < 0 ? (
                        <Ticket size={18} aria-hidden="true" />
                      ) : (
                        <Gift size={18} aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-[#171717]">{transaction.title}</p>
                      <p className="mt-0.5 text-[10px] text-[#8A9A90]">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-[14px] font-extrabold ${
                        transaction.points < 0 ? 'text-[#B64235]' : 'text-[#2FA36B]'
                      }`}
                    >
                      {transaction.points > 0 ? '+' : ''}
                      {transaction.points}
                    </p>
                    <p className="mt-0.5 text-[9px] font-bold tracking-wide text-[#8A9A90]">
                      GLOCAL POINTS
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[10px] text-[#6B7B72]">
            <ShieldCheck size={13} aria-hidden="true" /> Your Glocal Points are recorded in this demo.
          </p>
        </section>
      </div>

      {selectedReward ? (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reward-detail-title"
          onClick={() => setSelectedReward(null)}
        >
          <div
            className="modal-card animate-rise relative"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedReward(null)}
              aria-label="Close reward details"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F5FAF6] text-[#15532E]"
            >
              <X size={17} aria-hidden="true" />
            </button>
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#FDF6D4] text-[#15532E]">
                <selectedReward.icon className="h-9 w-9" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h2 id="reward-detail-title" className="mt-4 text-[19px] font-extrabold text-[#15532E]">
                {selectedReward.name}
              </h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#6B7B72]">
                {selectedReward.description}
              </p>
              <p className="mt-4 flex items-center gap-1.5 text-[16px] font-extrabold text-[#15532E]">
                <Coins className="h-5 w-5 text-[#B88900]" aria-hidden="true" />
                {selectedReward.cost} Glocal Coins
              </p>
              <p className="mt-1 text-[11px] font-semibold text-[#6B7B72]">
                Your balance: {session.points} coins
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedReward(null)}
                className="min-h-[48px] flex-1 rounded-full border border-[#15532E]/15 bg-white px-4 text-[12px] font-bold text-[#15532E]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRedeem(selectedReward)}
                disabled={session.points < selectedReward.cost}
                className={`min-h-[48px] flex-[1.4] rounded-full bg-[#15532E] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#0E3D21] disabled:opacity-40 ${focusOnDark}`}
              >
                {session.points >= selectedReward.cost
                  ? `Redeem · ${selectedReward.cost} coins`
                  : `Need ${selectedReward.cost - session.points} more`}
              </button>
            </div>
            <p className="mt-3 text-center text-[10px] text-[#8A9A90]">
              Demo redemption — deducts {selectedReward.cost} coins and shows a code.
            </p>
          </div>
        </div>
      ) : null}

      {redeemed ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reward-success-title">
          <div className="modal-card animate-rise text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E7F4EA] text-[#0A5C2E]">
              <Check size={30} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <h2 id="reward-success-title" className="mt-4 text-[19px] font-extrabold text-[#15532E]">
              Reward ready!
            </h2>
            <p className="mt-1.5 text-[12px] leading-relaxed text-[#6B7B72]">
              Show this at the counter to collect your {redeemed.reward.name}.
            </p>
            <div className="mt-4 rounded-[18px] bg-[#FDF6D4] p-4">
              <p className="text-[10px] font-extrabold tracking-[0.14em] text-[#8A731A]">DEMO CODE</p>
              <p className="mt-1 font-mono text-[18px] font-black tracking-wide text-[#15532E]">
                {redeemed.code}
              </p>
              <p className="mt-2 text-[11px] font-bold text-[#5B4E1A]">
                −{redeemed.reward.cost} Glocal Coins · balance {session.points}
              </p>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#8A9A90]">
              <CircleAlert size={12} aria-hidden="true" /> Prototype only — coins were deducted from
              your demo balance.
            </p>
            <button
              type="button"
              onClick={() => setRedeemed(null)}
              className={`mt-5 flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#15532E] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#0E3D21] ${focusOnDark}`}
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
