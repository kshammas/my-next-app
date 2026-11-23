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
} from '@/components/icons';
import type { AppIcon } from '@/components/icons';
import { AppShell } from '@/components/AppShell';
import { demoStore } from '@/lib/demo-data';
import { usePrototype } from '@/lib/prototype-store';
import type { CartItem, StoreItem } from '@/lib/types';

type Category = 'All' | 'Tea & Coffee' | 'Snacks' | 'Meals' | 'Cold Drinks';

type CafeItem = StoreItem & {
  description: string;
  category: Category;
  label?: string;
  icon: AppIcon;
};

type CheckoutResult = { ok: boolean; message: string; orderId?: string };

const categories: Category[] = ['All', 'Tea & Coffee', 'Snacks', 'Meals', 'Cold Drinks'];

// The prototype catalogue is a small demo feed. Map its entries onto the
// festival cafe menu from the walkthrough, with Heroicons instead of glyphs.
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

function iconFor(name: string): AppIcon {
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

  function iconForCartItem(item: CartItem): AppIcon {
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
      <div className="min-h-full bg-[#f3f8f5] pb-6 text-[#14241d]">
        <header className="grid min-h-[66px] grid-cols-[42px_1fr_42px] items-center gap-1.5 px-4 pt-2">
          <Link
            href="/home"
            aria-label="Go back"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#e9f5ed] text-[#166a48] transition-transform duration-150 hover:bg-[#d9efe1] active:scale-95"
          >
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="text-center text-[21px] font-extrabold leading-tight tracking-[-0.6px] text-[#145b3c]">
            {view === 'cart' ? 'Your Cart' : 'Store'}
          </h1>
          {view === 'menu' ? (
            <button
              type="button"
              onClick={() => setView('cart')}
              aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
              className="relative flex h-[37px] w-[37px] items-center justify-center justify-self-end rounded-full border border-[#d8e8dd] bg-white text-[#1b7045] transition-transform duration-150 hover:bg-[#f3faf5] active:scale-95"
            >
              <ShoppingBag size={19} strokeWidth={2} aria-hidden="true" />
              {cartCount > 0 ? (
                <span className="absolute -right-[3px] -top-[2px] grid h-4 min-w-4 place-items-center rounded-full bg-[#e7c920] px-0.5 text-[8px] font-extrabold text-[#2f4e34]">
                  {cartCount}
                </span>
              ) : null}
            </button>
          ) : null}
        </header>

        {view === 'menu' ? (
          <>
            <section className="px-4 pb-1 pt-0.5">
              <h2 className="text-[15px] font-extrabold leading-[1.15] tracking-[-0.3px] text-[#1b5237]">
                Your points.
                <br />
                Your picks.
              </h2>
              <p className="mt-1 max-w-[320px] text-[10px] leading-relaxed text-[#87948c]">
                Tea, snacks and cafe favourites — pay with Glocal Coins.
              </p>
            </section>

            <section className="mt-3 px-4" aria-label="Your coin balance">
              <div className="relative overflow-hidden rounded-[16px] bg-[linear-gradient(110deg,#e5f3e9,#fff8d9)] p-3.5">
                <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full border border-[#a9d7b9]/60" />
                <div className="pointer-events-none absolute -bottom-16 right-12 h-28 w-28 rounded-full border border-[#a9d7b9]/50" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-[37px] w-[37px] shrink-0 place-items-center rounded-[11px] bg-[#165b3d] text-[#f4dc3a]">
                      <Coins className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[11px] font-bold tracking-[0.04em] text-[#19593b]">
                        YOUR BALANCE
                      </p>
                      <p className="text-[8px] font-medium text-[#7b8e80]">COINS AVAILABLE</p>
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#add5bd] bg-white/70 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wide text-[#267c4f]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#178549]" aria-hidden="true" />
                    Active
                  </span>
                </div>
                <div className="relative mt-3 flex items-center gap-2 border-t border-[#b9d9c3] pt-3">
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-[26px] font-extrabold leading-none text-[#14583a]">
                      {session.points}
                    </span>
                    <span className="text-[10px] font-semibold text-[#4d7a60]">Glocal Coins</span>
                  </p>
                  <Sparkles className="ml-auto h-5 w-5 text-[#1d8651]" aria-hidden="true" />
                </div>
              </div>
            </section>
          </>
        ) : null}

        {notice ? (
          <p
            role="status"
            className="mx-4 mt-3 flex items-center gap-2 rounded-[15px] border border-[#c3e5d0] bg-[#e6f5ea] px-3.5 py-2.5 text-[10px] font-semibold leading-relaxed text-[#157a49]"
          >
            <Check size={14} className="shrink-0" aria-hidden="true" />
            {notice}
          </p>
        ) : null}

        {view === 'menu' ? (
          <>
            <section className="mt-3 px-4">
              <label className="store-search flex min-h-[39px] items-center gap-2.5 rounded-[14px] border border-[#d8e8de] bg-white px-3.5 shadow-[0_2px_5px_rgba(16,57,38,0.08)] focus-within:border-[#16824f] focus-within:ring-2 focus-within:ring-[#16824f]/15">
                <Search className="h-[18px] w-[18px] shrink-0 text-[#8ca197]" aria-hidden="true" />
                <span className="sr-only">Search the store</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search the store..."
                  className="w-full bg-transparent text-[12px] text-[#14241d] outline-none placeholder:text-[#95a49b]"
                />
              </label>

              <div className="-mx-4 mt-[11px] flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((option) => {
                  const active = option === category;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCategory(option)}
                      aria-pressed={active}
                      className={`min-h-[30px] shrink-0 rounded-[20px] border px-3 text-[10px] font-semibold transition-colors ${
                        active
                          ? 'border-[#158452] bg-[#16824f] text-white shadow-[0_2px_5px_rgba(16,90,55,0.16)]'
                          : 'border-[#dce8e0] bg-white text-[#748579] hover:border-[#b7d8c2]'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <div className="mt-[15px] flex items-baseline justify-between gap-3">
                <h2 className="text-[14px] font-bold text-[#1b5237]">Cafe menu</h2>
                <span className="text-[9px] text-[#8a978f]">{visible.length} items available</span>
              </div>

              {visible.length ? (
                <div className="mt-2.5 grid grid-cols-2 gap-[9px]">
                  {visible.map((item) => {
                    const Icon = item.icon;
                    const tile =
                      item.category === 'Snacks'
                        ? 'bg-[#f2eee2] text-[#8a6c43]'
                        : item.category === 'Cold Drinks'
                          ? 'bg-[#fbf2cb] text-[#977728]'
                          : 'bg-[#eaf5ed] text-[#1a7448]';
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelected(item)}
                        aria-label={`View ${item.name}, ${item.cost} Glocal Coins`}
                        className="relative flex w-full flex-col overflow-hidden rounded-[16px] border border-[#dce7df] bg-white text-left transition-[transform,border-color] duration-150 hover:-translate-y-0.5 hover:border-[#b7d8c2] active:scale-[0.99]"
                      >
                        <span
                          className={`relative flex h-[118px] w-full items-center justify-center overflow-hidden ${tile} before:absolute before:-right-6 before:-top-12 before:h-[90px] before:w-[90px] before:rounded-full before:border before:border-[#1e7043]/10 before:content-[''] after:absolute after:-bottom-16 after:-left-5 after:h-[120px] after:w-[120px] after:rounded-full after:border after:border-[#1e7043]/10 after:content-['']`}
                        >
                          <Icon
                            className="relative z-[1] h-16 w-16 drop-shadow-[0_4px_3px_rgba(22,77,45,0.15)]"
                            strokeWidth={1.2}
                            aria-hidden="true"
                          />
                          {item.label ? (
                            <span className="absolute left-2 top-2 z-[2] rounded-full bg-[#f8e34d] px-2 py-0.5 text-[7px] font-extrabold tracking-wide text-[#13512c]">
                              {item.label}
                            </span>
                          ) : null}
                        </span>
                        <span className="flex min-h-[92px] flex-col gap-0.5 px-2.5 pb-3 pt-2">
                          <strong className="truncate text-[10px] font-bold text-[#264c35]">
                            {item.name}
                          </strong>
                          <small className="line-clamp-2 min-h-[20px] text-[8px] leading-[1.3] text-[#8b9890]">
                            {item.description}
                          </small>
                          <b className="mt-0.5 flex items-center gap-1 text-[11px] font-extrabold text-[#14764a]">
                            <Coins className="h-3.5 w-3.5 text-[#b88900]" aria-hidden="true" />
                            {item.cost} Glocal Coins
                          </b>
                        </span>
                        <span className="absolute bottom-2.5 right-2 grid h-[26px] w-[26px] place-items-center rounded-full bg-[#e8f5eb] text-[#17814c]">
                          <Plus size={15} aria-hidden="true" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-2.5 flex flex-col items-center rounded-[16px] border border-[#dce7df] bg-white px-6 py-12 text-center">
                  <span className="grid h-[43px] w-[43px] place-items-center rounded-full border border-[#dce8e1] bg-[#eaf4ee] text-[#84998d]">
                    <Search className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-[13px] font-bold text-[#1b5237]">No items found</p>
                  <p className="mt-1 text-[9px] leading-relaxed text-[#87948c]">
                    Try another search or category.
                  </p>
                </div>
              )}
            </section>

            <footer className="mx-4 mt-6 flex items-start gap-2 border-t border-[#dbe6df] pt-4">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eaf5ed] text-[#639276]">
                <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0 text-left">
                <h2 className="text-[10px] font-bold text-[#256056]">Your festival cafe</h2>
                <p className="mt-1 text-[9px] leading-relaxed text-[#829287]">
                  Grab a tea between events, share a snack with friends, and pay with your Glocal Coins.
                  Menu and prices shown here are demo data
                </p>
              </div>
            </footer>
          </>
        ) : (
          <section className="px-4 pt-1">
            <h2 className="text-[21px] font-extrabold leading-tight tracking-[-0.6px] text-[#145b3c]">
              Your cart.
            </h2>
            <p className="mt-0.5 text-[10px] text-[#87948c]">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} from the festival cafe
            </p>

            {cart.length === 0 ? (
              <div className="cart-empty mt-4 flex min-h-[410px] flex-col items-center justify-center rounded-[16px] border border-[#dce7df] bg-white px-6 py-12 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-[#dce8e1] bg-[#eaf4ee] text-[#84998d]">
                  <ShoppingBag className="h-7 w-7" strokeWidth={1.4} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[14px] font-bold text-[#1b5237]">Your cart is empty</h3>
                <p className="mx-auto mt-1.5 max-w-[260px] text-[9px] leading-relaxed text-[#87948c]">
                  Add a tea or snack from the cafe menu and it will show up here.
                </p>
                <button
                  type="button"
                  onClick={() => setView('menu')}
                  className="mt-4 flex min-h-[42px] w-full max-w-[200px] items-center justify-center rounded-[12px] bg-[linear-gradient(100deg,#22a972,#08764b)] px-5 text-[12px] font-bold text-white shadow-[0_4px_10px_rgba(8,118,75,0.22)] transition-transform duration-150 active:scale-[0.98]"
                >
                  Browse the menu
                </button>
              </div>
            ) : (
              <>
                <div className="mt-2 grid gap-[9px]">
                  {cart.map((item) => {
                    const Icon = iconForCartItem(item);
                    return (
                      <article
                        key={item.id}
                        className="flex items-center gap-2.5 rounded-[15px] border border-[#dce7e0] bg-white p-2"
                      >
                        <span className="grid h-[66px] w-16 shrink-0 place-items-center overflow-hidden rounded-[11px] bg-[#eaf5ed] text-[#1a7448]">
                          <Icon className="h-9 w-9" strokeWidth={1.3} aria-hidden="true" />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <h3 className="truncate text-[10px] font-bold text-[#28563c]">
                            {item.name}
                          </h3>
                          <p className="text-[8px] text-[#87958d]">{item.cost} Glocal Coins each</p>
                          <span className="mt-0.5 text-[10px] font-extrabold text-[#147549]">
                            {item.cost * item.quantity} coins
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5 rounded-[14px] bg-[#edf6ef] p-[3px]">
                          <button
                            type="button"
                            onClick={() => changeQuantity(item, -1)}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="grid h-[22px] w-[22px] place-items-center rounded-full bg-white text-[#237448] transition-colors hover:bg-[#e6f5ea]"
                          >
                            <Minus size={12} aria-hidden="true" />
                          </button>
                          <span
                            className="min-w-[9px] text-center text-[9px] font-bold text-[#26583d]"
                            aria-label={`Quantity ${item.quantity}`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(item, 1)}
                            aria-label={`Increase ${item.name} quantity`}
                            className="grid h-[22px] w-[22px] place-items-center rounded-full bg-white text-[#237448] transition-colors hover:bg-[#e6f5ea]"
                          >
                            <Plus size={12} aria-hidden="true" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#b64235] transition-colors hover:bg-[#fdecea]"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </article>
                    );
                  })}
                </div>

                <section
                  className="mt-[18px] rounded-[15px] border border-[#dce7e0] bg-white p-[14px]"
                  aria-label="Order summary"
                >
                  <h3 className="text-[13px] font-bold text-[#25563b]">Order summary</h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between gap-3 text-[9px] text-[#829187]">
                      <span>Items ({cartCount})</span>
                      <span className="font-semibold text-[#40594a]">{cartTotal} coins</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[9px] text-[#829187]">
                      <span>Available balance</span>
                      <span className="font-semibold text-[#40594a]">{session.points} coins</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-[#e5ece7] pt-3 text-[11px] font-bold text-[#234b34]">
                      <span>Total</span>
                      <span className="flex items-center gap-1.5 text-[13px] font-extrabold text-[#145f3b]">
                        <Coins className="h-4 w-4 text-[#b88900]" aria-hidden="true" />
                        {cartTotal} coins
                      </span>
                    </div>
                  </div>

                  {session.points < cartTotal ? (
                    <p className="mt-3 flex gap-2 rounded-[12px] border border-[#f2e29a] bg-[#fff6d9] px-3 py-2.5 text-[9px] font-semibold leading-relaxed text-[#7a5a12]">
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
                    className="mt-3.5 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(100deg,#22a972,#08764b)] px-5 text-[12px] font-bold text-white shadow-[0_4px_10px_rgba(8,118,75,0.22)] transition-transform duration-150 hover:brightness-105 active:scale-[0.98]"
                  >
                    <Check size={16} aria-hidden="true" /> Checkout · {cartTotal} coins
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setNotice('Your cart has been cleared.');
                    }}
                    className="mx-auto mt-1.5 flex min-h-[36px] items-center justify-center text-[10px] font-semibold text-[#a85245] hover:underline"
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
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf5ed] text-[#166a48]"
              >
                <X size={17} aria-hidden="true" />
              </button>
              <div className="flex flex-col items-center text-center">
                <span className="relative flex h-[130px] w-full items-center justify-center overflow-hidden rounded-[18px] bg-[#eaf5ed] text-[#1a7448] before:absolute before:-right-6 before:-top-12 before:h-[90px] before:w-[90px] before:rounded-full before:border before:border-[#1e7043]/10 before:content-[''] after:absolute after:-bottom-16 after:-left-5 after:h-[120px] after:w-[120px] after:rounded-full after:border after:border-[#1e7043]/10 after:content-['']">
                  <selected.icon
                    className="relative z-[1] h-16 w-16 drop-shadow-[0_4px_3px_rgba(22,77,45,0.15)]"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </span>
                {selected.label ? (
                  <span className="mt-3 rounded-full bg-[#f8e34d] px-3 py-1 text-[8px] font-extrabold tracking-wide text-[#13512c]">
                    {selected.label}
                  </span>
                ) : null}
                <h2 id="store-item-title" className="mt-2 text-[20px] font-bold text-[#185a3b]">
                  {selected.name}
                </h2>
                <p className="mt-1 text-[10px] leading-relaxed text-[#78887e]">
                  {selected.description}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-[15px] font-extrabold text-[#14784a]">
                  <Coins className="h-5 w-5 text-[#b88900]" aria-hidden="true" />
                  {selected.cost} Glocal Coins
                </p>
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="min-h-[42px] flex-1 rounded-[12px] border border-[#dce8e0] bg-white px-4 text-[12px] font-bold text-[#536659]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => addItem(selected)}
                  className="min-h-[42px] flex-[1.4] rounded-[12px] bg-[linear-gradient(100deg,#22a972,#08764b)] px-4 text-[12px] font-bold text-white shadow-[0_4px_10px_rgba(8,118,75,0.22)] transition-transform duration-150 active:scale-[0.98]"
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
                className={`mx-auto grid h-16 w-16 place-items-center rounded-[15px] ${
                  checkoutResult.ok
                    ? 'bg-[#e9f5ed] text-[#177c4a]'
                    : 'bg-[#fdecea] text-[#b64235]'
                }`}
              >
                {checkoutResult.ok ? (
                  <PackageCheck size={30} strokeWidth={1.8} aria-hidden="true" />
                ) : (
                  <CircleAlert size={30} strokeWidth={1.8} aria-hidden="true" />
                )}
              </span>
              <h2 id="checkout-title" className="mt-4 text-[20px] font-bold text-[#185a3b]">
                {checkoutResult.ok ? 'Order placed!' : 'Checkout failed'}
              </h2>
              <p className="mt-1 text-[10px] leading-relaxed text-[#78887e]">
                {checkoutResult.message}
              </p>
              {checkoutResult.ok && checkoutResult.orderId ? (
                <div className="mt-4 rounded-[15px] border border-[#f0e3ae] bg-[#fff9df] p-4">
                  <p className="text-[9px] font-extrabold tracking-[0.14em] text-[#8a731a]">
                    ORDER ID
                  </p>
                  <p className="mt-1 font-mono text-[19px] font-black tracking-wide text-[#14583a]">
                    {checkoutResult.orderId}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-[#5f806e]">
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
                className="mt-5 flex min-h-[42px] w-full items-center justify-center rounded-[12px] bg-[linear-gradient(100deg,#22a972,#08764b)] px-5 text-[12px] font-bold text-white shadow-[0_4px_10px_rgba(8,118,75,0.22)] transition-transform duration-150 active:scale-[0.98]"
              >
                {checkoutResult.ok ? 'Back to menu' : 'Back to cart'}
              </button>
              {checkoutResult.ok ? null : (
                <Link
                  href="/points"
                  className="mt-1 flex min-h-[40px] items-center justify-center text-[11px] font-bold text-[#16824f]"
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
