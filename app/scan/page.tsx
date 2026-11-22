'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import type { Html5Qrcode } from 'html5-qrcode';
import { apiSend } from '@/lib/use-api';
import type { Session } from '@/lib/types';

export default function ScanPage() {
  const router = useRouter();
  const holderRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    let scanner: Html5Qrcode | undefined;
    let started = false;

    async function begin() {
      try {
        const { Html5Qrcode: Scanner } = await import('html5-qrcode');
        if (cancelled || !holderRef.current) return;
        scanner = new Scanner('hr26-scan-reader', { verbose: false });
        started = true;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 160, height: 160 } },
          (value) => {
            if (cancelled) return;
            void apiSend<Session>('/api/session', 'POST', { code: value })
              .catch(() => undefined)
              .finally(() => {
                if (!cancelled) router.push('/home');
              });
          },
          () => undefined,
        );
      } catch {
        if (!cancelled) setError('Camera unavailable. Please check permission or enter your ID manually.');
      }
    }

    void begin();

    return () => {
      cancelled = true;
      if (scanner && started) {
        void scanner.stop().then(() => scanner?.clear()).catch(() => undefined);
      }
    };
  }, [router]);

  return (
    <main className="fixed inset-0 z-[90] flex flex-col bg-black text-white">
      <h1 className="sr-only">Scan event pass</h1>

      <div className="flex items-center justify-between px-5 pb-2 pt-[max(16px,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={() => router.push('/welcome')}
          aria-label="Close scanner"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
        >
          <X size={20} />
        </button>
        <p className="text-[16px] font-bold text-[#FFEA04]">Scan event pass</p>
        <span className="h-11 w-11" aria-hidden="true" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-[max(28px,env(safe-area-inset-bottom))]">
        <div className="relative aspect-square w-[59%] max-w-[420px] min-w-[220px]">
          <div
            id="hr26-scan-reader"
            ref={holderRef}
            className="absolute inset-0 overflow-hidden rounded-lg"
          />
          <span className="scanner-corner left-0 top-0 rounded-tl-lg border-l-4 border-t-4" />
          <span className="scanner-corner right-0 top-0 rounded-tr-lg border-r-4 border-t-4" />
          <span className="scanner-corner bottom-0 left-0 rounded-bl-lg border-b-4 border-l-4" />
          <span className="scanner-corner bottom-0 right-0 rounded-br-lg border-b-4 border-r-4" />
        </div>

        <p className="mt-8 max-w-xs text-center text-[13px] leading-relaxed text-[#C3CAD0]">
          Point at the QR code on your participant card
        </p>

        {error ? (
          <p role="alert" className="mt-4 max-w-xs text-center text-[12px] text-rose-300">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-6 min-h-[44px] px-4 text-[12px] font-semibold text-white/60 underline underline-offset-4"
        >
          Enter ID manually
        </button>
      </div>
    </main>
  );
}
