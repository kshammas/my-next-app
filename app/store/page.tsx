'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Coffee,
  Coins,
  Cookie,
  CupSoda,
  Search,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { demoStore } from '@/lib/demo-data';
import { apiSend, useApi } from '@/lib/use-api';
import type { StoreItem } from '@/lib/types';

type Category = 'All' | 'Tea & Coffee' | 'Snacks' | 'Meals' | 'Cold Drinks';

type CafeItem = StoreItem & {
  description: string;
  category: Category;
  label?: string;
  icon: LucideIcon;
};

const categories: Category[] = ['All', 'Tea & Coffee', 'Snacks', 'Meals', 'Cold Drinks'];

// The store feed is a generic catalogue. Map its demo entries onto the festival
// cafe menu from the walkthrough; anything coming back from a real API still
// renders with sensible category, description and icon fallbacks.
const cafeMenu: Record<string, Omit<CafeItem, 'id' | 'cost'>> = {
  's-1': {
    name: 'Milk Tea',
    description: 'Classic tea with creamy milk',
    category: 'Tea & Coffee',
    label: 'FAVOURITE',
    emoji: '☕',
    icon: Coffee,
  },
  's-2': {
    name: 'Sulaimani Tea',
    description: 'Freshly brewed, warm and refreshing',
    category: 'Tea & Coffee',
    label: 'POPULAR',
    emoji: '🍵',
    icon: Coffee,
  },
  's-3': {
    name: 'Cappuccino',
    description: 'Rich espresso with a velvety foam finish',
    category: 'Tea & Coffee',
    label: 'POPULAR',
    emoji: '☕',
    icon: Coffee,
  },
  's-4': {
    name: 'Samosa',
    description: 'Crispy pastry with savoury filling',
    category: 'Snacks',
    label: 'FAVOURITE',
    emoji: '🥟',
    icon: Cookie,
  },
};

const cafeCosts: Record<string, number> = {
  's-1': 15,
  's-2': 20,
  's-3': 50,
  's-4': 15,
};

function iconFor(name: string): LucideIcon {
  const value = name.toLowerCase();
  if (/cold|soda|juice|drink|lemonade|shake/.test(value)) return CupSoda;
  if (/snack|samosa|cookie|biscuit|cake|pastry|chip/.test(value)) return Cookie;
  if (/meal|rice|food|plate|biriyani/.test(value)) return ShoppingBag;
  return Sparkles;
}

function categoryFor(name: string): Category {
  const value = name.toLowerCase();
  if (/cold|soda|juice|drink|lemonade|shake/.test(value)) return 'Cold Drinks';
  if (/snack|samosa|cookie|biscuit|cake|pastry|chip/.test(value)) return 'Snacks';
  if (/meal|rice|food|plate|biriyani/.test(value)) return 'Meals';
  return 'Tea & Coffee';
}

function normalise(items: StoreItem[]): CafeItem[] {
  return items.map((item) => {
    const known = cafeMenu[item.id];
    if (known) {
      return {
        ...item,
        name: known.name,
        cost: cafeCosts[item.id] ?? item.cost,
        description: known.description,
        category: known.category,
        label: known.label,
        icon: known.icon,
      };
    }
    return {
      ...item,
      description: 'A festival cafe favourite — pick it up at the counter.',
      category: categoryFor(item.name),
      label: item.tag?.toUpperCase(),
      icon: iconFor(item.name),
    };
  });
}

export default function StorePage() {
  const { data: items } = useApi<StoreItem[]>('/api/store', demoStore);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [balance, setBalance] = useState(0);

  const menu = useMemo(() => normalise(items), [items]);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return menu.filter(
      (item) =>
        (category === 'All' || item.category === category) &&
        (!term || `${item.name} ${item.description}`.toLowerCase().includes(term)),
    );
  }, [menu, category, query]);

  async function redeem(item: CafeItem) {
    setBusyId(item.id);
    setNotice('');
    try {
      const result = await apiSend<{ points: number }>('/api/wallet', 'POST', {
        itemId: item.id,
        name: item.name,
        cost: item.cost,
      });
      setBalance(result.points);
      setNotice(
        `Redeemed ${item.name} · ${result.points} Glocal Coins left. Show this at the counter.`,
      );
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Could not redeem this item.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AppShell>
      <div className="min-h-full bg-[#F5FAF6] pb-6">
        <header className="relative flex min-h-[64px] items-center justify-center bg-[#13512C] px-14 py-4 text-white">
          <Link
            href="/home"
            aria-label="Go back"
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="text-[18px] font-extrabold tracking-tight">Store</h1>
        </header>

        <section className="px-4 pb-4 pt-5">
          <h2 className="text-[26px] font-black leading-[1.08] tracking-[-0.02em] text-[#13512C] sm:text-[30px]">
            Your points.
            <br />
            Your picks.
          </h2>
          <p className="mt-2 max-w-[300px] text-[12px] leading-relaxed text-[#13512C]/60">
            Tea, snacks and cafe favourites — pay with Glocal Coins.
          </p>
        </section>

        <section className="px-4" aria-label="Your coin balance">
          <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#15532E] to-[#0C3520] p-5 text-white shadow-sm">
            <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-16 right-16 h-36 w-36 rounded-full border border-white/10" />
            <div className="relative flex items-start justify-between gap-3">
              <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#A1C8B3]">
                YOUR BALANCE
              </p>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#D6EADB]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EECE2D]" aria-hidden="true" />
                Active
              </span>
            </div>
            <div className="relative mt-5 flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#FDF6D4] text-[#13512C]">
                <Coins className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#A1C8B3]/80">
                  COINS AVAILABLE
                </p>
                <p className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-[30px] font-black leading-none">{balance}</span>
                  <span className="text-[13px] font-bold text-white/85">Glocal Coins</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {notice ? (
          <p
            role="status"
            className="mx-4 mt-4 rounded-[14px] bg-[#E7F4EA] px-4 py-3 text-[11px] font-semibold leading-relaxed text-[#0A5C2E]"
          >
            {notice}
          </p>
        ) : null}

        <section className="mt-5 px-4">
          <label className="flex min-h-[48px] items-center gap-2.5 rounded-[16px] bg-white px-4 shadow-sm focus-within:ring-2 focus-within:ring-[#13512C]/30">
            <Search className="h-[18px] w-[18px] shrink-0 text-[#8FA79A]" aria-hidden="true" />
            <span className="sr-only">Search the store</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the store..."
              className="w-full bg-transparent text-[12px] text-[#13512C] outline-none placeholder:text-[#9AAEA3]"
            />
          </label>

          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
            {categories.map((option) => {
              const active = option === category;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  aria-pressed={active}
                  className={`min-h-[44px] shrink-0 rounded-full px-4 text-[11px] font-bold transition-colors ${
                    active
                      ? 'bg-[#13512C] text-white shadow-sm'
                      : 'border border-[#13512C]/10 bg-white text-[#13512C]/70'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <h2 className="text-[16px] font-extrabold text-[#13512C]">Cafe menu</h2>
            <span className="text-[11px] text-[#13512C]/60">
              {visible.length} items available
            </span>
          </div>

          {visible.length ? (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visible.map((item) => {
                const Icon = item.icon;
                const busy = busyId === item.id;
                return (
                  <article
                    key={item.id}
                    className="flex flex-col rounded-[20px] bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-[#FDF6D4] text-[#13512C]">
                        <Icon className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-[14px] font-extrabold text-[#13512C]">
                            {item.name}
                          </h3>
                          {item.label ? (
                            <span className="shrink-0 rounded-full bg-[#EECE2D] px-2.5 py-1 text-[9px] font-extrabold tracking-wide text-[#13512C]">
                              {item.label}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-[11px] leading-snug text-[#13512C]/60">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#13512C]/10 pt-3">
                      <span className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#13512C]">
                        <Coins className="h-4 w-4 text-[#B88900]" aria-hidden="true" />
                        {item.cost} Glocal Coins
                      </span>
                      <button
                        type="button"
                        onClick={() => void redeem(item)}
                        disabled={busy}
                        aria-label={`Redeem ${item.name} for ${item.cost} Glocal Coins`}
                        className="flex min-h-[44px] min-w-[92px] items-center justify-center rounded-full bg-[#13512C] px-4 text-[11px] font-bold text-white transition-colors hover:bg-[#0C3B20] disabled:opacity-50"
                      >
                        {busy ? 'Redeeming…' : 'Redeem'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 flex flex-col items-center rounded-[20px] bg-white px-6 py-12 text-center shadow-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDF6D4] text-[#13512C]">
                <Search className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-4 text-[14px] font-extrabold text-[#13512C]">No items found</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#13512C]/60">
                Try another search or category.
              </p>
            </div>
          )}
        </section>

        <footer className="mx-4 mt-8 border-t border-[#13512C]/10 pt-5 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF6D4] text-[#13512C]">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="mt-3 text-[12px] font-extrabold text-[#13512C]">Your festival cafe</h2>
          <p className="mx-auto mt-2 max-w-[320px] text-[11px] leading-relaxed text-[#13512C]/55">
            Grab a tea between events, share a snack with friends, and pay with your Glocal Coins.
            Menu and prices shown here are demo data
          </p>
        </footer>
      </div>
    </AppShell>
  );
}
