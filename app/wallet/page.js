'use client';
import Link from 'next/link';

export default function WalletPage() {
  const transactions = [
    { name: 'Expert Talk 01', pts: '+50', date: 'Date unavailable', color: 'text-emerald-600' },
    { name: 'Urse Ajmer', pts: '+20', date: 'Date unavailable', color: 'text-emerald-600' },
    { name: 'Glocal Store redemption', pts: '-50', date: 'Date unavailable', color: 'text-rose-500' },
    { name: 'Koomu Talks', pts: '+20', date: 'Date unavailable', color: 'text-emerald-600' },
  ];

  return (
    <main className="min-h-screen bg-[#efeeec] flex items-center justify-center">
      <div className="w-full h-[100dvh] sm:w-[392px] sm:h-[852px] sm:rounded-[40px] bg-[#f5f5f3] overflow-y-auto px-5 pt-6 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/home" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">←</Link>
          <h1 className="text-[19px] font-bold text-[#073b1d]">Glocal Wallet</h1>
        </div>

        {/* Balance card */}
        <div className="rounded-[24px] bg-gradient-to-br from-[#0a5c2e] to-[#06451f] p-5 mt-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest text-emerald-100/80">AVAILABLE BALANCE</span>
            <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold">● Active</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[40px] font-extrabold leading-none">92</span>
            <span className="px-2.5 py-1 rounded-full bg-[#f5d90a] text-[#06451f] text-[11px] font-bold">GP</span>
          </div>
          <p className="text-[12px] text-emerald-200/75 mt-1">Your Glocal Points balance</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl bg-white/5 p-3 flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-[#f5d90a]/20 flex items-center justify-center">↙</span>
              <div><p className="text-[10px] text-emerald-200/70">Total earned</p><p className="font-bold text-[14px]">140 GP</p></div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">↗</span>
              <div><p className="text-[10px] text-emerald-200/70">Total redeemed</p><p className="font-bold text-[14px]">58 GP</p></div>
            </div>
          </div>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="rounded-2xl bg-[#d7e86b] p-4 flex items-center gap-3">
            <span className="text-xl">▦</span>
            <div><p className="font-extrabold text-[14px] text-[#073b1d]">Redeem ›</p><p className="text-[10px] text-[#073b1d]/60">Show your QR</p></div>
          </div>
          <Link href="/points" className="rounded-2xl bg-white p-4 flex items-center gap-3 shadow-sm">
            <span className="text-xl">📈</span>
            <div><p className="font-extrabold text-[14px] text-[#073b1d]">Earn points ›</p><p className="text-[10px] text-slate-400">Explore events</p></div>
          </Link>
        </div>

        {/* Transaction history */}
        <h2 className="text-[17px] font-extrabold text-[#073b1d] mt-6">Transaction history</h2>
        <p className="text-[11px] text-slate-400">Track every point you earn and spend</p>
        <div className="flex gap-2 mt-3">
          {['All activity', 'Earned', 'Redeemed', 'Adjustments'].map((f, i) => (
            <button key={f} className={`px-4 py-1.5 rounded-full text-[11px] font-bold ${i === 0 ? 'bg-[#06451f] text-white' : 'bg-white text-slate-500'}`}>{f}</button>
          ))}
        </div>

        <div className="bg-white rounded-2xl mt-4 divide-y divide-slate-100 shadow-sm">
          {transactions.map((t) => (
            <div key={t.name} className="p-3.5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center ${t.pts.startsWith('-') ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                  {t.pts.startsWith('-') ? '🎟️' : '🎁'}
                </span>
                <div>
                  <p className="font-bold text-[13px] text-[#111]">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-extrabold text-[14px] ${t.color}`}>{t.pts}</p>
                <p className="text-[9px] text-slate-400">GLOCAL POINTS</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}