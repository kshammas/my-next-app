'use client';
import Link from 'next/link';

export default function PointsPage() {
  return (
    <main className="min-h-screen bg-[#efeeec] flex items-center justify-center sm:py-6">
      <div className="w-full h-[100dvh] sm:w-[392px] sm:h-[820px] bg-gradient-to-b from-[#f4faf5] to-[#f9fbe7] sm:rounded-[48px] sm:border-[10px] sm:border-[#2a3530] shadow-2xl flex flex-col justify-between overflow-hidden">
        <div className="px-5 pt-6">
          <div className="flex items-center justify-between">
            <Link href="/home" className="w-10 h-10 rounded-full bg-[#e6f3ea] flex items-center justify-center font-bold text-[#073b1d]">←</Link>
            <div className="flex gap-2">
              <Link href="/wallet" className="px-3.5 py-2 rounded-full bg-[#f7e305] text-[#073b1d] font-bold text-[12px]">Redeem</Link>
              <Link href="/wallet" className="px-3.5 py-2 rounded-full bg-[#064e24] text-white font-bold text-[12px]">92 GP</Link>
            </div>
          </div>
          <h1 className="text-[21px] font-extrabold text-[#074d24] mt-3">Glocal Points</h1>
          <p className="text-[12px] text-slate-500">0 of 5 activities completed</p>
        </div>

        <div className="px-6 space-y-6 my-auto">
          <div className="flex items-center justify-end gap-3">
            <div className="text-right"><p className="font-bold text-[#073b1d] text-[13px]">Expert Covos (01)</p><p className="text-[11px] font-semibold text-[#0b7a3a]">+30 Coins</p></div>
            <div className="w-16 h-16 rounded-full bg-[#064e24] text-white font-extrabold flex items-center justify-center">2</div>
          </div>
          <div className="flex items-center justify-start gap-3">
            <div className="w-16 h-16 rounded-full bg-[#064e24] text-white font-extrabold flex items-center justify-center ring-4 ring-[#f7e305]">3</div>
            <div><p className="font-bold text-[#073b1d] text-[13px]">Glocal VR</p><p className="text-[11px] font-semibold text-[#0b7a3a]">+12 Coins</p></div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <div className="text-right"><p className="font-bold text-slate-400 text-[13px]">Visit Expo</p><p className="text-[11px] font-semibold text-[#0b7a3a]">+50 Coins</p></div>
            <div className="w-16 h-16 rounded-full bg-[#e6f0e9] text-slate-500 flex items-center justify-center">🔒</div>
          </div>
        </div>

        <div className="bg-white rounded-t-[28px] p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-[17px] font-extrabold text-[#073b1d]">Glocal VR</h2>
            <span className="text-[15px] font-extrabold text-[#0b7a3a]">+12</span>
          </div>
          <p className="text-[12.5px] text-slate-500 mt-1.5">Dive into the Glocal VR showcase! Visit the booth, try the experience, and unlock your Glocal Coin reward.</p>
          <Link href="/wallet" className="mt-4 block w-full py-3.5 rounded-2xl bg-[#064e24] text-white font-bold text-center text-[13.5px]">
            Scan to Claim 12 points
          </Link>
        </div>
      </div>
    </main>
  );
}