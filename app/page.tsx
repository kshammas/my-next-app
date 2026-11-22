'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';

export default function RootPage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fade = window.setTimeout(() => setLeaving(true), 1500);
    const go = window.setTimeout(() => router.replace('/welcome'), 2100);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(go);
    };
  }, [router]);

  return (
    <main className="fixed inset-0 z-[100] flex items-center justify-center bg-[#032211]">
      <div
        className={`flex flex-col items-center gap-6 px-8 text-center ${
          leaving ? 'splash-out' : 'splash-in'
        }`}
      >
        <Logo className="h-[190px] w-[156px] sm:h-[230px] sm:w-[190px]" />
        <div>
          <p className="text-[26px] font-black tracking-tight text-[#f7e305] sm:text-[32px]">
            Rendezvous 26
          </p>
          <p className="mt-1 text-[12px] font-semibold tracking-[0.22em] text-white/60">
            JAMIA MADEENATHUNOOR
          </p>
        </div>
        <span className="mt-2 h-1 w-16 overflow-hidden rounded-full bg-white/15">
          <span className="block h-full w-full origin-left animate-[splash-bar_1.5s_ease-out_both] rounded-full bg-[#f7e305]" />
        </span>
      </div>
      <h1 className="sr-only">Loading Rendezvous 26</h1>
    </main>
  );
}
