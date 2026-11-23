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
} from '@/components/icons';
import type { AppIcon } from '@/components/icons';
import { AppShell } from '@/components/AppShell';
import { usePrototype } from '@/lib/prototype-store';
import type { TransactionKind } from '@/lib/types';

type Reward = {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: AppIcon;
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
        <div className="ar-page px-[13px] pt-2">
          <header className="flex min-h-[58px] items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCode(false)}
              aria-label="Back to wallet"
              className={`grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border border-[#e3efe8] bg-white text-[#103c2a] ${focusOnLight}`}
            >
              <ChevronLeft size={21} strokeWidth={2} aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <h1 className="text-[17px] font-[750] tracking-[-0.4px] text-[#145b3c]">
                Redeem Glocal Points
              </h1>
              <p className="mt-[2px] text-[10px] text-[#87948c]">Your secure redemption code</p>
            </div>
          </header>

          <p className="mt-2 text-[10px] leading-relaxed text-[#7c8b82]">
            Show this QR code to the Glocal Store merchant to redeem your points.
          </p>

          <section className="mt-3 rounded-[22px] border border-[#e0ebe3] bg-white p-[18px] text-center shadow-[0_2px_8px_rgba(20,52,37,0.06)]">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-[#eaf7ef] px-3 py-1.5">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-[750] uppercase tracking-wide text-[#187b4b]">
                <ShieldCheck size={14} aria-hidden="true" /> Secure QR
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#15814b] px-2 py-[2px] text-[8px] font-[750] text-white">
                <Check size={11} aria-hidden="true" /> Verified
              </span>
            </div>

            <h2 className="mt-3 text-[16px] font-[750] text-[#1b593b]">Scan to redeem</h2>
            <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-[10px] text-[#89968f]">
              <ScanLine size={14} aria-hidden="true" /> Ask the merchant to scan your code
            </p>

            <div className="mx-auto mt-4 w-full max-w-[254px] rounded-[18px] border border-[#e0e9e3] bg-white p-[10px] shadow-[0_10px_28px_rgba(21,83,46,0.10)]">
              <div className="aspect-square w-full">
                <QrMosaic seed={qrSeed} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${secondsLeft > 0 ? 'bg-[#18bb46]' : 'bg-[#d94539]'}`}
                aria-hidden="true"
              />
              <p className="text-[11px] font-[700] text-[#286b48]">
                QR expires in{' '}
                <span className="font-[750] tabular-nums" aria-live="polite">
                  {minutes}:{seconds}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={regenerateQr}
              className={`mx-auto mt-4 flex min-h-[39px] w-full max-w-[240px] items-center justify-center gap-2 rounded-[13px] bg-[linear-gradient(105deg,#25ae72,#087749)] px-5 text-[10px] font-[750] text-white ${focusOnDark}`}
            >
              <RefreshCw size={15} aria-hidden="true" /> Generate new QR
            </button>

            <p className="mt-2 text-[9px] text-[#93a098]">Generated at {generatedAt || '--:--:--'}</p>
            <p className="mt-0.5 text-[9px] text-[#93a098]">
              Linked to {session.name} · {session.jamiaId}
            </p>
          </section>

          <section className="mt-4 rounded-[18px] border border-[#e0ebe3] bg-white p-4">
            <h2 className="text-[14px] font-[740] text-[#1b5037]">How to redeem</h2>
            <ol className="mt-3 space-y-3">
              {redeemSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="flex gap-3">
                    <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full bg-[#eaf7ef] text-[10px] font-[750] text-[#187b4b]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-[10px] font-[750] text-[#205c3c]">
                        {step.title}
                        <Icon size={13} className="text-[#18bb46]" aria-hidden="true" />
                      </p>
                      <p className="mt-[2px] text-[9px] leading-relaxed text-[#89968f]">{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="mt-4 flex gap-2 rounded-[15px] border border-[#f0e6a8] bg-[#fffbe6] p-3">
            <ShieldCheck size={14} className="mt-[1px] shrink-0 text-[#a48613]" aria-hidden="true" />
            <p className="text-[9px] leading-relaxed text-[#7a6a1f]">
              Your QR is temporary. Never share screenshots of your QR.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="ar-page px-[13px] pt-2">
        <header className="flex min-h-[66px] items-center gap-[6px]">
          <Link
            href="/home"
            aria-label="Go back"
            className={`grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border border-[#e3efe8] bg-white text-[#103c2a] ${focusOnLight}`}
          >
            <ChevronLeft size={21} strokeWidth={2} aria-hidden="true" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[21px] font-[750] tracking-[-0.6px] text-[#145b3c]">
              Glocal Wallet
            </h1>
            <p className="mt-[3px] text-[10px] text-[#87948c]">Your points and rewards</p>
          </div>
          <button
            type="button"
            onClick={openQr}
            className={`inline-flex min-h-[31px] shrink-0 items-center gap-1 rounded-[10px] bg-[#e8f4ec] px-[10px] text-[9px] font-[700] text-[#147748] ${focusOnLight}`}
          >
            <QrCode size={16} aria-hidden="true" /> Redeem
          </button>
        </header>

        <section className="relative mt-[9px] min-h-[174px] overflow-hidden rounded-[22px] bg-[linear-gradient(125deg,#13593d,#063e2c_77%)] p-[17px] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[18px] -top-[40px] h-[128px] w-[128px] rounded-full border border-white/10 shadow-[0_0_0_21px_rgba(255,255,255,0.024),0_0_0_41px_rgba(255,255,255,0.024)]"
          />
          <div className="relative z-[1]">
            <p className="flex items-center gap-[7px] text-[9px] font-[700] tracking-[1.5px] text-[#d9eadf]">
              <Coins size={19} aria-hidden="true" /> GLOCAL WALLET
            </p>
            <p className="mb-[1px] mt-[19px] text-[10px] text-[#bbd0c3]">Your balance</p>
            <div className="flex items-baseline gap-[6px] text-[39px] font-[750] leading-none tracking-[-1.7px]">
              {session.points}
              <span className="text-[12px] font-[700] tracking-normal text-[#dce88b]">GP</span>
            </div>
          </div>
          <div className="absolute bottom-[13px] left-[17px] right-[17px] z-[1] flex justify-between text-[9px] text-[#bbd0c3]">
            <span>Rendezvous &apos;26</span>
            <span>{session.jamiaId}</span>
          </div>
        </section>

        <div className="mt-3 flex items-center justify-between text-[9px] text-[#7c8b82]">
          <span className="inline-flex items-center gap-1">
            <ArrowDownLeft size={12} className="text-[#157b49]" aria-hidden="true" /> Earned{' '}
            <b className="font-[750] text-[#157b49]">{earned} GP</b>
          </span>
          <span className="inline-flex items-center gap-1">
            <ArrowUpRight size={12} className="text-[#687b70]" aria-hidden="true" /> Redeemed{' '}
            <b className="font-[750] text-[#687b70]">{redeemedPoints} GP</b>
          </span>
        </div>

        <Link
          href="/points"
          className={`mt-[12px] flex w-full items-center gap-[10px] rounded-[15px] border border-[#cfe5d6] bg-white p-[10px] text-left ${focusOnLight}`}
        >
          <span className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-[12px] bg-[#eaf7ef] text-[#187b4b]">
            <Gift size={19} aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <strong className="text-[11px] font-[750] text-[#205c3c]">Earn more Glocal Points</strong>
            <small className="text-[9px] text-[#89968f]">Complete your festival activities</small>
          </span>
          <ChevronLeft size={18} className="-rotate-180 shrink-0 text-[#85948b]" aria-hidden="true" />
        </Link>

        <section className="mt-5">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="ar-eyebrow">YOUR ACTIVITY</p>
              <h2 className="mt-[2px] text-[17px] font-[740] tracking-[-0.35px] text-[#1b5037]">
                Transactions
              </h2>
            </div>
            <span className="text-[9px] font-[700] text-[#147748]">All points</span>
          </div>

          <div className="ar-chip-row -mx-[13px] mt-[9px] px-[13px] pb-1">
            {filters.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setFilter(item.kind)}
                aria-pressed={filter === item.kind}
                data-active={filter === item.kind}
                className={`ar-chip ${focusOnLight}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-[9px] overflow-hidden rounded-[15px] border border-[#e0e9e3] bg-white">
            {transactions.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <span className="mx-auto grid h-[40px] w-[40px] place-items-center rounded-[12px] bg-[#eaf7ef] text-[#187b4b]">
                  <Coins size={20} aria-hidden="true" />
                </span>
                <p className="mt-3 text-[12px] font-[750] text-[#1b5037]">No transactions yet</p>
                <p className="mx-auto mt-1.5 max-w-[260px] text-[9px] leading-relaxed text-[#89968f]">
                  Your Glocal Points activity will appear here. Start participating to earn your first
                  points!
                </p>
                <Link
                  href="/points"
                  className={`mx-auto mt-4 flex min-h-[39px] w-full max-w-[180px] items-center justify-center rounded-[13px] bg-[linear-gradient(105deg,#25ae72,#087749)] px-5 text-[10px] font-[700] text-white ${focusOnDark}`}
                >
                  Explore activities
                </Link>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex min-h-[59px] items-center gap-[9px] border-b border-[#e8eee9] px-[11px] py-2 last:border-b-0"
                >
                  <span
                    className={`grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[11px] ${
                      transaction.points < 0
                        ? 'bg-[#f5f2e9] text-[#937b36]'
                        : 'bg-[#eaf5ed] text-[#12814b]'
                    }`}
                  >
                    {transaction.points < 0 ? (
                      <Ticket size={18} aria-hidden="true" />
                    ) : (
                      <Gift size={18} aria-hidden="true" />
                    )}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <strong className="truncate text-[10px] font-[700] text-[#335a43]">
                      {transaction.title}
                    </strong>
                    <small className="text-[8px] text-[#8a9890]">{transaction.date}</small>
                  </span>
                  <b
                    className={`shrink-0 text-[10px] font-[750] ${
                      transaction.points < 0 ? 'text-[#687b70]' : 'text-[#157b49]'
                    }`}
                  >
                    {transaction.points > 0 ? '+' : ''}
                    {transaction.points} GP
                  </b>
                </div>
              ))
            )}
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[9px] text-[#7c8b82]">
            <ShieldCheck size={13} aria-hidden="true" /> Your Glocal Points are recorded in this demo.
          </p>
        </section>

        <section className="mt-[21px]" aria-label="Rewards">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="ar-eyebrow">USE YOUR POINTS</p>
              <h2 className="mt-[2px] text-[17px] font-[740] tracking-[-0.35px] text-[#1b5037]">
                Rewards
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-[750] text-[#157b49]">
              <Coins size={13} aria-hidden="true" /> {session.points}
            </span>
          </div>

          {session.points === 0 ? (
            <div className="mt-[9px] flex flex-col items-center rounded-[15px] border border-[#e0e9e3] bg-white px-5 py-7 text-center">
              <span className="grid h-[40px] w-[40px] place-items-center rounded-[12px] bg-[#eaf7ef] text-[#187b4b]">
                <Gift size={20} aria-hidden="true" />
              </span>
              <p className="mt-3 text-[12px] font-[750] text-[#1b5037]">No coins yet</p>
              <p className="mx-auto mt-1 max-w-[260px] text-[9px] leading-relaxed text-[#89968f]">
                Join festival activities to earn your first Glocal Coins and unlock these rewards.
              </p>
              <Link
                href="/points"
                className={`mt-4 flex min-h-[39px] w-full max-w-[180px] items-center justify-center rounded-[13px] bg-[linear-gradient(105deg,#25ae72,#087749)] px-5 text-[10px] font-[700] text-white ${focusOnDark}`}
              >
                Explore activities
              </Link>
            </div>
          ) : rewards.length === 0 ? (
            <div className="mt-[9px] flex flex-col items-center rounded-[15px] border border-[#e0e9e3] bg-white px-5 py-9 text-center">
              <span className="grid h-[40px] w-[40px] place-items-center rounded-[12px] bg-[#eaf7ef] text-[#187b4b]">
                <Gift size={20} aria-hidden="true" />
              </span>
              <p className="mt-3 text-[12px] font-[750] text-[#1b5037]">No rewards right now</p>
              <p className="mt-1 text-[9px] text-[#89968f]">Check back soon for festival treats.</p>
            </div>
          ) : (
            <div className="mt-[9px] flex flex-col gap-[9px]">
              {rewards.map((reward) => {
                const Icon = reward.icon;
                const affordable = session.points >= reward.cost;
                return (
                  <button
                    key={reward.id}
                    type="button"
                    onClick={() => setSelectedReward(reward)}
                    className="flex w-full items-center gap-[9px] rounded-[15px] border border-[#e0e9e3] bg-white p-[10px] text-left transition-transform duration-150 active:scale-[0.99]"
                  >
                    <span className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-[11px] bg-[#fff6cc] text-[#a48613]">
                      <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <strong className="truncate text-[10px] font-[700] text-[#335840]">
                          {reward.name}
                        </strong>
                        {reward.tag ? (
                          <span className="shrink-0 rounded-full bg-[#fff6cc] px-1.5 py-[1px] text-[8px] font-[750] text-[#a48613]">
                            {reward.tag}
                          </span>
                        ) : null}
                      </span>
                      <small className="text-[8px] leading-snug text-[#8b9890]">
                        {reward.description}
                      </small>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-[9px] font-[750] text-[#16804c]">
                        {reward.cost} GP
                      </span>
                      {!affordable ? (
                        <span className="block text-[8px] font-[700] text-[#b64235]">
                          need {reward.cost - session.points}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <p className="mt-2 text-center text-[9px] text-[#93a098]">
            Redeeming a reward deducts demo coins from your wallet balance.
          </p>
        </section>
      </div>

      {selectedReward ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(7,33,21,0.42)] p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reward-detail-title"
          onClick={() => setSelectedReward(null)}
        >
          <div
            className="animate-rise relative w-full max-w-[365px] rounded-[22px] border border-[#e0ebe3] bg-white p-[22px_18px_17px] text-center shadow-[0_16px_50px_rgba(3,38,21,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedReward(null)}
              aria-label="Close reward details"
              className="absolute right-[10px] top-[10px] grid h-[30px] w-[30px] place-items-center rounded-full bg-[#f0f6f2] text-[#72847a]"
            >
              <X size={16} aria-hidden="true" />
            </button>
            <div className="flex flex-col items-center text-center">
              <span className="grid h-[64px] w-[64px] place-items-center rounded-[20px] bg-[#fff6cc] text-[#a48613]">
                <selectedReward.icon className="h-8 w-8" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <h2 id="reward-detail-title" className="mt-3 text-[16px] font-[750] text-[#1b593b]">
                {selectedReward.name}
              </h2>
              <p className="mx-auto mt-2 max-w-[290px] text-[10px] leading-[1.55] text-[#819087]">
                {selectedReward.description}
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-[14px] font-[750] text-[#157b49]">
                <Coins className="h-[18px] w-[18px] text-[#a48613]" aria-hidden="true" />
                {selectedReward.cost} Glocal Coins
              </p>
              <p className="mt-1 text-[9px] font-[650] text-[#89968f]">
                Your balance: {session.points} coins
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedReward(null)}
                className="min-h-[37px] flex-1 rounded-full border border-[#dce8e0] bg-white px-3 text-[10px] font-[700] text-[#286b48]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRedeem(selectedReward)}
                disabled={session.points < selectedReward.cost}
                className={`min-h-[37px] flex-[1.4] rounded-full bg-[linear-gradient(105deg,#25ae72,#087749)] px-3 text-[10px] font-[700] text-white disabled:opacity-40 ${focusOnDark}`}
              >
                {session.points >= selectedReward.cost
                  ? `Redeem · ${selectedReward.cost} coins`
                  : `Need ${selectedReward.cost - session.points} more`}
              </button>
            </div>
            <p className="mt-3 text-center text-[9px] text-[#93a098]">
              Demo redemption — deducts {selectedReward.cost} coins and shows a code.
            </p>
          </div>
        </div>
      ) : null}

      {redeemed ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(7,33,21,0.42)] p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reward-success-title"
        >
          <div className="animate-rise w-full max-w-[365px] rounded-[22px] border border-[#e0ebe3] bg-white p-[22px_18px_17px] text-center shadow-[0_16px_50px_rgba(3,38,21,0.24)]">
            <span className="mx-auto grid h-[45px] w-[45px] place-items-center rounded-[15px] bg-[#e9f5ed] text-[#177c4a]">
              <Check size={26} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <h2 id="reward-success-title" className="mt-3 text-[16px] font-[750] text-[#1b593b]">
              Reward ready!
            </h2>
            <p className="mx-auto mt-2 max-w-[290px] text-[10px] leading-[1.55] text-[#819087]">
              Show this at the counter to collect your {redeemed.reward.name}.
            </p>
            <div className="mt-4 rounded-[15px] bg-[#fff6cc] p-4">
              <p className="text-[9px] font-[750] tracking-[0.14em] text-[#a48613]">DEMO CODE</p>
              <p className="mt-1 font-mono text-[18px] font-black tracking-wide text-[#1b593b]">
                {redeemed.code}
              </p>
              <p className="mt-2 text-[9px] font-[700] text-[#7a6a1f]">
                −{redeemed.reward.cost} Glocal Coins · balance {session.points}
              </p>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[9px] text-[#93a098]">
              <CircleAlert size={12} aria-hidden="true" /> Prototype only — coins were deducted from
              your demo balance.
            </p>
            <button
              type="button"
              onClick={() => setRedeemed(null)}
              className={`mt-4 flex min-h-[37px] w-full items-center justify-center rounded-full bg-[linear-gradient(105deg,#25ae72,#087749)] px-5 text-[10px] font-[700] text-white ${focusOnDark}`}
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
