'use client';
import Link from 'next/link';
import {
  Bell, ScanLine, Calendar, Radio, Clock,
  Map, ShoppingCart, Wallet, Home, Trophy, User, ArrowUpRight, ChevronRight
} from 'lucide-react';

const menu = [
  { label: 'My Program', href: '#', icon: <Calendar className="w-7 h-7 text-[#0a7a33]" fill="currentColor" /> },
  { label: 'Live', href: '#', icon: <Radio className="w-7 h-7 text-[#0a7a33]" strokeWidth={2.5} /> },
  {
    label: 'Schedule',
    href: '#',
    icon: (
      <span className="w-7 h-7 rounded-full bg-[#0a7a33] flex items-center justify-center">
        <Clock className="w-4 h-4 text-white" strokeWidth={3} />
      </span>
    ),
  },
  { label: 'Map', href: '#', icon: <Map className="w-7 h-7 text-[#0a7a33]" fill="currentColor" /> },
  { label: 'Store', href: '#', icon: <ShoppingCart className="w-7 h-7 text-[#0a7a33]" fill="currentColor" /> },
  { label: 'Glocal Wallet', href: '/wallet', icon: <Wallet className="w-7 h-7 text-[#0a7a33]" fill="currentColor" /> },
];

function GoldCoin({ className = '' }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-black text-[#b85a00] ${className}`}
      style={{
        background: 'radial-gradient(circle at 30% 30%, #ffe066, #f5a800 60%, #d98200)',
        border: '4px solid #f7b52a',
        boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.25), 0 4px 10px rgba(0,0,0,0.35)',
      }}
    >
      <span className="text-[38px] leading-none">G</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#e9edea] flex items-center justify-center">
      {/* Phone frame: column = scrollable content + nav pinned at the bottom */}
      <div className="flex flex-col w-full h-[100dvh] sm:w-[392px] sm:h-[min(852px,100dvh)] sm:rounded-[40px] bg-[#f4f8f6] overflow-hidden">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            {/* Put the logo in /public/rendezvous-logo.png */}
            <img
              src="/rend-logo-mobilesrc.png"
              alt="Rendezvous 26 - Jamia Madeenathunnor Life Festival"
              className="h-[50px] w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextSibling.style.display = 'block';
              }}
            />
            {/* Fallback text, shown only if the logo file is missing */}
            <div style={{ display: 'none' }}>
              <h1 className="text-[26px] font-black text-[#111] leading-none tracking-tight">RENDEZVOUS 26</h1>
              <p className="text-[8.5px] font-bold tracking-[0.18em] text-[#111]">JAMIA MADEENATHUNNOR LIFE FESTIVAL</p>
            </div>
            <Link
              href="/profile"
              className="relative w-11 h-11 rounded-full bg-white border border-emerald-100 flex items-center justify-center shadow-sm"
            >
              <Bell className="w-5 h-5 text-[#111]" />
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500" />
            </Link>
          </div>

          {/* GP Card */}
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#064a27] to-[#03301a] p-5 mt-6 text-white">
            <div className="absolute -top-16 right-0 w-56 h-56 rounded-full border border-white/5" />
            <div className="absolute -top-8 right-8 w-40 h-40 rounded-full border border-white/5" />

            <p className="relative text-[12px] font-bold tracking-[0.2em] text-emerald-100/70">ANAS KABEER</p>
            <p className="relative text-[12px] text-emerald-100/70">ID: 2020JM010</p>

            <div className="relative mt-3 flex items-end gap-1.5">
              <span className="text-[56px] font-extrabold leading-none">10</span>
              <span className="text-[13px] font-bold text-[#c8f06a] mb-2">GP</span>
              <div className="ml-auto relative w-[100px] h-[80px] -mt-6">
                <GoldCoin className="absolute left-0 top-3 w-[62px] h-[62px]" />
                <GoldCoin className="absolute left-8 top-0 w-[68px] h-[68px]" />
              </div>
            </div>

            <div className="relative grid grid-cols-2 gap-3 mt-5">
              <Link
                href="/wallet"
                className="py-3 px-2 rounded-2xl bg-[#ffe500] text-[#06451f] font-bold text-[13px] whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <ScanLine className="w-4 h-4 shrink-0" /> Scan to redeem
              </Link>
              <Link
                href="/points"
                className="py-3 px-2 rounded-2xl bg-white/10 border border-white/20 font-bold text-[13px] whitespace-nowrap flex items-center justify-center gap-1"
              >
                Earn points <ChevronRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Menu grid */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {menu.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="bg-white rounded-3xl border border-emerald-100 py-5 flex flex-col items-center gap-3"
              >
                {item.icon}
                <span className="text-[12px] font-semibold text-slate-700">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Watch Live banner: put the banner image in /public/live-banner.jpg */}
          <div
            className="relative overflow-hidden rounded-[24px] mt-4 h-[150px] shadow-md bg-gradient-to-r from-[#8a4b12] to-[#5c2e0a]"
            style={{ backgroundImage: "url('/live-banner.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute left-4 bottom-3">
              <p className="font-extrabold text-[18px] text-white leading-tight">Watch Live</p>
              <p className="text-[12px] text-white/90">Catch every moment, live</p>
            </div>
            <button className="absolute right-3 bottom-3 px-4 py-2.5 rounded-2xl bg-[#1a5cf0] text-white font-bold text-[13px] flex items-center gap-1.5">
              Watch Live <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom nav (stays inside the frame) */}
        <nav className="bg-white px-8 pt-3 pb-4 flex justify-between items-start shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
          <Link href="/home" className="flex flex-col items-center gap-1">
            <span className="px-5 py-1.5 rounded-full bg-[#e1efe4]">
              <Home className="w-6 h-6 text-black" fill="currentColor" />
            </span>
            <span className="text-[13px] text-black">Home</span>
          </Link>
          <Link href="#" className="flex flex-col items-center gap-1 pt-1.5">
            <Trophy className="w-6 h-6 text-slate-400" />
            <span className="text-[13px] text-slate-400">results</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 pt-1.5">
            <User className="w-6 h-6 text-slate-400" />
            <span className="text-[13px] text-slate-400">Profile</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}