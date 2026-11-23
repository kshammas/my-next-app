'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronLeft,
  CircleAlert,
  Coins,
  Coffee,
  Cookie,
  CupSoda,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { demoStore } from '@/lib/demo-data';
import { usePrototype } from '@/lib/prototype-store';
import type { CartItem, StoreItem } from '@/lib/types';

type Category = 'All' | 'Tea & Coffee' | 'Snacks' | 'Meals' | 'Cold Drinks';

type CafeItem = StoreItem & {
  description: string;
  category: Category;
  label?: string;
  icon: LucideIcon;
};

type CheckoutResult = { ok: boolean; message: string; orderId?: string };

const categories: Category[] = ['All', 'Tea & Coffee', 'Snacks', 'Meals', 'Cold Drinks'];

// The prototype catalogue is a small demo feed. Map its entries onto the
// festival cafe menu from the walkthrough, with lucide icons instead of glyphs.
type CafeMeta = Pick<CafeItem, 'name' | 'description' | 'category' | 'label' | 'icon'>;

const cafeMenu: Record<string, CafeMeta> = {
  's-1': {
    name: 'Milk Tea',
    description: 'Classic tea with creamy milk',
    category: 'Tea & Coffee',
    label: 'FAVOURITE',
    icon: Coffee,
  },
  's-2': {
    name: 'Sulaimani Tea',
    description: 'Freshly brewed, warm and refreshing',
    category: 'Tea & Coffee',
    label: 'POPULAR',
    icon: Coffee,
  },
  's-3': {
    name: 'Cappuccino',
    description: 'Rich espresso with a velvety foam finish',
    category: 'Tea & Coffee',
    label: 'POPULAR',
    icon: Coffee,
  },
  's-4': {
    name: 'Samosa',
    description: 'Crispy pastry with savoury filling',
    category: 'Snacks',
    label: 'FAVOURITE',
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
  const { session, cart, addToCart, removeFromCart, clearCart, checkout } = usePrototype();
  const [view, setView] = useState<'menu' | 'cart'>('menu');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [selected, setSelected] = useState<CafeItem | null>(null);
  const [notice, setNotice] = useState('');
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResult | null>(null);

  const menu = useMemo(() => normalise(demoStore), []);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return menu.filter(
      (item) =>
        (category === 'All' || item.category === category) &&
        (!term || `${item.name} ${item.description}`.toLowerCase().includes(term)),
    );
  }, [menu, category, query]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.cost * item.quantity, 0);

  function iconForCartItem(item: CartItem): LucideIcon {
    return cafeMenu[item.id]?.icon ?? iconFor(item.name);
  }

  function addItem(item: CafeItem) {
    addToCart({ ...item, quantity: 1 });
    setSelected(null);
    setNotice(`${item.name} added to your cart.`);
  }

  function changeQuantity(item: CartItem, delta: number) {
    if (delta > 0) {
      addToCart(item);
      return;
    }
    if (item.quantity <= 1) {
      removeFromCart(item.id);
      return;
    }
    // The prototype store has no decrement action: drop the line and add it
    // back with one fewer item. React batches both updates in order.
    removeFromCart(item.id);
    addToCart({ ...item, quantity: item.quantity - 1 });
  }

  function placeOrder() {
    setNotice('');
    setCheckoutResult(checkout());
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
          <h1 className="text-[18px] font-extrabold tracking-tight">
            {view === 'cart' ? 'Your Cart' : 'Store'}
          </h1>
          {view === 'menu' ? (
            <button
              type="button"
              onClick={() => setView('cart')}
              aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
            >
              <ShoppingBag size={20} strokeWidth={2} aria-hidden="true" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EECE2D] px-1 text-[10px] font-extrabold text-[#13512C]">
                  {cartCount}
                </span>
              ) : null}
            </button>
          ) : null}
        </header>

        {view === 'menu' ? (
          <>
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
                      <span className="text-[30px] font-black leading-none">{session.points}</span>
                      <span className="text-[13px] font-bold text-white/85">Glocal Coins</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : null}

        {notice ? (
          <p
            role="status"
            className="mx-4 mt-4 rounded-[14px] bg-[#E7F4EA] px-4 py-3 text-[11px] font-semibold leading-relaxed text-[#0A5C2E]"
          >
            {notice}
          </p>
        ) : null}

        {view === 'menu' ? (
          <>
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
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelected(item)}
                        aria-label={`View ${item.name}, ${item.cost} Glocal Coins`}
                        className="flex w-full flex-col rounded-[20px] bg-white p-4 text-left shadow-sm transition-transform duration-150 active:scale-[0.99]"
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
                          <span className="flex min-h-[44px] min-w-[92px] items-center justify-center rounded-full bg-[#13512C] px-4 text-[11px] font-bold text-white">
                            View
                          </span>
                        </div>
                      </button>
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
          </>
        ) : (
          <section className="px-4 pt-5">
            <h2 className="text-[24px] font-black leading-tight tracking-tight text-[#13512C]">
              Your cart.
            </h2>
            <p className="mt-1 text-[12px] text-[#13512C]/60">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} from the festival cafe
            </p>

            {cart.length === 0 ? (
              <div className="mt-5 flex flex-col items-center rounded-[20px] bg-white px-6 py-12 text-center shadow-sm">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF6D4] text-[#13512C]">
                  <ShoppingBag className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[14px] font-extrabold text-[#13512C]">
                  Your cart is empty
                </h3>
                <p className="mx-auto mt-1.5 max-w-[260px] text-[11px] leading-relaxed text-[#13512C]/60">
                  Add a tea or snack from the cafe menu and it will show up here.
                </p>
                <button
                  type="button"
                  onClick={() => setView('menu')}
                  className="mt-5 flex min-h-[44px] w-full max-w-[200px] items-center justify-center rounded-full bg-[#13512C] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#0C3B20]"
                >
                  Browse the menu
                </button>
              </div>
            ) : (
              <>
                <div className="mt-4 space-y-3">
                  {cart.map((item) => {
                    const Icon = iconForCartItem(item);
                    return (
                      <article key={item.id} className="rounded-[20px] bg-white p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#FDF6D4] text-[#13512C]">
                            <Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-[14px] font-extrabold text-[#13512C]">
                              {item.name}
                            </h3>
                            <p className="mt-0.5 text-[11px] text-[#13512C]/60">
                              {item.cost} Glocal Coins each
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.name} from cart`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDECEA] text-[#B64235] transition-colors hover:bg-[#FBD9D5]"
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#13512C]/10 pt-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => changeQuantity(item, -1)}
                              aria-label={`Decrease ${item.name} quantity`}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#13512C]/15 bg-white text-[#13512C] transition-colors hover:bg-[#EAF4ED]"
                            >
                              <Minus size={16} aria-hidden="true" />
                            </button>
                            <span
                              className="w-7 text-center text-[14px] font-extrabold text-[#13512C]"
                              aria-label={`Quantity ${item.quantity}`}
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeQuantity(item, 1)}
                              aria-label={`Increase ${item.name} quantity`}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#13512C]/15 bg-white text-[#13512C] transition-colors hover:bg-[#EAF4ED]"
                            >
                              <Plus size={16} aria-hidden="true" />
                            </button>
                          </div>
                          <span className="text-[13px] font-extrabold text-[#13512C]">
                            {item.cost * item.quantity} coins
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <section
                  className="mt-5 rounded-[20px] bg-white p-4 shadow-sm"
                  aria-label="Order summary"
                >
                  <h3 className="text-[14px] font-extrabold text-[#13512C]">Order summary</h3>
                  <div className="mt-3 space-y-2 text-[12px]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#13512C]/60">Items ({cartCount})</span>
                      <span className="font-bold text-[#13512C]">{cartTotal} coins</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[#13512C]/60">Available balance</span>
                      <span className="font-bold text-[#13512C]">{session.points} coins</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-[#13512C]/10 pt-2">
                      <span className="font-extrabold text-[#13512C]">Total</span>
                      <span className="flex items-center gap-1.5 text-[14px] font-extrabold text-[#13512C]">
                        <Coins className="h-4 w-4 text-[#B88900]" aria-hidden="true" />
                        {cartTotal} coins
                      </span>
                    </div>
                  </div>

                  {session.points < cartTotal ? (
                    <p className="mt-3 flex gap-2 rounded-[14px] bg-[#FFF6E8] px-3 py-2.5 text-[11px] font-semibold leading-relaxed text-[#7A5A12]">
                      <CircleAlert size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                      <span>
                        You need {cartTotal - session.points} more Glocal Coins for this order. Earn
                        points from festival activities.
                      </span>
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={placeOrder}
                    className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#13512C] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#0C3B20]"
                  >
                    <Check size={16} aria-hidden="true" /> Checkout · {cartTotal} coins
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setNotice('Your cart has been cleared.');
                    }}
                    className="mx-auto mt-2 flex min-h-[40px] items-center justify-center text-[11px] font-bold text-[#B64235]"
                  >
                    Clear cart
                  </button>
                </section>
              </>
            )}
          </section>
        )}

        {selected ? (
          <div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="store-item-title"
            onClick={() => setSelected(null)}
          >
            <div
              className="modal-card animate-rise relative"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close item details"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F5FAF6] text-[#13512C]"
              >
                <X size={17} aria-hidden="true" />
              </button>
              <div className="flex flex-col items-center text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#FDF6D4] text-[#13512C]">
                  <selected.icon className="h-9 w-9" strokeWidth={1.6} aria-hidden="true" />
                </span>
                {selected.label ? (
                  <span className="mt-4 rounded-full bg-[#EECE2D] px-3 py-1 text-[9px] font-extrabold tracking-wide text-[#13512C]">
                    {selected.label}
                  </span>
                ) : null}
                <h2 id="store-item-title" className="mt-2 text-[19px] font-extrabold text-[#13512C]">
                  {selected.name}
                </h2>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#13512C]/65">
                  {selected.description}
                </p>
                <p className="mt-4 flex items-center gap-1.5 text-[16px] font-extrabold text-[#13512C]">
                  <Coins className="h-5 w-5 text-[#B88900]" aria-hidden="true" />
                  {selected.cost} Glocal Coins
                </p>
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="min-h-[48px] flex-1 rounded-full border border-[#13512C]/15 bg-white px-4 text-[12px] font-bold text-[#13512C]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => addItem(selected)}
                  className="min-h-[48px] flex-[1.4] rounded-full bg-[#13512C] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#0C3B20]"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {checkoutResult ? (
          <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <div className="modal-card animate-rise text-center">
              <span
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  checkoutResult.ok
                    ? 'bg-[#E7F4EA] text-[#0A5C2E]'
                    : 'bg-[#FDECEA] text-[#B64235]'
                }`}
              >
                {checkoutResult.ok ? (
                  <PackageCheck size={30} strokeWidth={1.8} aria-hidden="true" />
                ) : (
                  <CircleAlert size={30} strokeWidth={1.8} aria-hidden="true" />
                )}
              </span>
              <h2 id="checkout-title" className="mt-4 text-[19px] font-extrabold text-[#13512C]">
                {checkoutResult.ok ? 'Order placed!' : 'Checkout failed'}
              </h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#13512C]/65">
                {checkoutResult.message}
              </p>
              {checkoutResult.ok && checkoutResult.orderId ? (
                <div className="mt-4 rounded-[18px] bg-[#FDF6D4] p-4">
                  <p className="text-[10px] font-extrabold tracking-[0.14em] text-[#8A731A]">
                    ORDER ID
                  </p>
                  <p className="mt-1 font-mono text-[19px] font-black tracking-wide text-[#13512C]">
                    {checkoutResult.orderId}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#13512C]/70">
                    Show this at the counter to collect your order.
                  </p>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setCheckoutResult(null);
                  if (checkoutResult.ok) setView('menu');
                }}
                className="mt-5 flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#13512C] px-5 text-[12px] font-bold text-white transition-colors hover:bg-[#0C3B20]"
              >
                {checkoutResult.ok ? 'Back to menu' : 'Back to cart'}
              </button>
              {checkoutResult.ok ? null : (
                <Link
                  href="/points"
                  className="mt-2 flex min-h-[40px] items-center justify-center text-[11px] font-bold text-[#13512C]"
                >
                  Earn more coins
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
