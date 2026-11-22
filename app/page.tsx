'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fade = window.setTimeout(() => setLeaving(true), 1600);
    const go = window.setTimeout(() => router.replace('/welcome'), 2200);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(go);
    };
  }, [router]);

  return (
    <main className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F2FEF0]">
      <div className={`flex flex-col items-center ${leaving ? 'splash-out' : 'splash-in'}`}>
        <Image
          className="h-[170px] w-[140px] object-contain sm:h-[220px] sm:w-[180px]"
          src="/rendezvous-logo.png"
          alt="Rendezvous 26 logo"
          width={140}
          height={170}
          priority
        />
      </div>
      <h1 className="sr-only">Loading Rendezvous 26</h1>
    </main>
  );
}
