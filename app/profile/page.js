'use client';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#efeeec] flex items-center justify-center sm:py-6">
      <div className="w-full h-[100dvh] sm:w-[392px] sm:h-[820px] bg-[#f4f8f5] sm:rounded-[48px]  shadow-2xl flex flex-col justify-between overflow-hidden">
        <div className="overflow-y-auto">
          <div className="bg-gradient-to-br from-[#e3f3e8] to-[#f9f9e4] pt-8 pb-6 px-5 rounded-b-[32px] flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#064e24] border-4 border-white flex items-center justify-center text-[24px] font-extrabold text-[#f7e305]">AK</div>
            <h1 className="text-[19px] font-extrabold text-[#073b1d] mt-3">ANAS KABEER</h1>
            <span className="mt-1.5 px-3.5 py-1 rounded-full bg-[#d3eedb] text-[#085c2b] font-semibold text-[11px]">Jamia No. 2020JM010</span>
          </div>

          <div className="px-5 mt-4 space-y-3">
            <div className="bg-white rounded-[22px] p-4 space-y-3">
              <div className="flex justify-between text-[13.5px]"><span className="font-semibold text-[#073b1d]">Jamia ID</span><span className="text-slate-500">2020JM010</span></div>
              <div className="flex justify-between text-[13.5px]"><span className="font-semibold text-[#073b1d]">Campus</span><span className="text-slate-500">senior</span></div>
            </div>

            <div className="bg-white rounded-[22px] p-4 space-y-3">
              <Link href="/points" className="flex justify-between text-[13.5px] font-semibold text-[#073b1d]"><span>Glocal Points</span><span>92 GP &gt;</span></Link>
              <Link href="/wallet" className="flex justify-between text-[13.5px] font-semibold text-[#073b1d]"><span>Glocal Wallet</span><span>&gt;</span></Link>
            </div>

            <Link href="/login" className="block w-full bg-white rounded-[20px] p-4 text-red-600 font-semibold text-[13.5px]">
              Sign out
            </Link>
          </div>
        </div>

        <nav className="bg-white border-t border-slate-100 px-6 py-3 flex justify-around text-[11px] font-bold">
          <Link href="/home" className="text-slate-500 px-4 py-1.5">Home</Link>
          <Link href="/points" className="text-slate-500 px-4 py-1.5">Points</Link>
          <Link href="/profile" className="text-[#052e16] bg-[#e5f3e9] px-4 py-1.5 rounded-full">Profile</Link>
        </nav>
      </div>
    </main>
  );
}