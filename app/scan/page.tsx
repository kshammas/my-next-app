'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import type { Html5Qrcode } from 'html5-qrcode';
import { apiSend } from '@/lib/use-api';
import type { Session } from '@/lib/types';

function ScannerView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isClaim = searchParams.get('mode') === 'claim';
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
            const destination = isClaim ? '/points' : '/onboarding';
            void apiSend<Session>('/api/session', 'POST', { code: value })
              .catch(() => undefined)
              .finally(() => {
                if (!cancelled) router.push(destination);
              });
          },
          () => undefined,
        );
      } catch {
        if (!cancelled) setError('Camera unavailable. Please check your camera permission and try again.');
      }
    }

    void begin();

    return () => {
      cancelled = true;
      if (scanner && started) {
        void scanner.stop().then(() => scanner?.clear()).catch(() => undefined);
      }
    };
  }, [router, isClaim]);

  return (
    <main className="fixed inset-0 z-[90] flex flex-col bg-black text-white">
      <h1 className="sr-only">
        {isClaim ? 'Scan to claim Glocal coin' : 'Scan event pass'}
      </h1>

      <div className="flex items-center justify-between px-5 pb-2 pt-[max(16px,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={() => router.push(isClaim ? '/points' : '/welcome')}
          aria-label="Close scanner"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
        >
          <X size={20} />
        </button>
        <p className="text-[16px] font-bold text-[#FFEA00]">
          {isClaim ? 'Scan to claim Glocal coin' : 'Scan event pass'}
        </p>
        <span className="h-11 w-11" aria-hidden="true" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-[max(28px,env(safe-area-inset-bottom))]">
        <div className="relative aspect-square w-[59%] max-w-[420px] min-w-[220px]">
          <div
            id="hr26-scan-reader"
            ref={holderRef}
            className="absolute inset-0 overflow-hidden rounded-lg"
          />
          <span className="pointer-events-none absolute left-0 top-0 h-[42px] w-[42px] rounded-tl-lg border-l-4 border-t-4 border-[#FFEA00]" aria-hidden="true" />
          <span className="pointer-events-none absolute right-0 top-0 h-[42px] w-[42px] rounded-tr-lg border-r-4 border-t-4 border-[#FFEA00]" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-[42px] w-[42px] rounded-bl-lg border-b-4 border-l-4 border-[#FFEA00]" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-[42px] w-[42px] rounded-br-lg border-b-4 border-r-4 border-[#FFEA00]" aria-hidden="true" />
        </div>

        <p className="mt-8 max-w-xs text-center text-[13px] leading-relaxed text-[#C3CAD0]">
          {isClaim ? 'Place the Event QR inside this frame' : 'Point at the QR code on your participant card'}
        </p>

        {error ? (
          <p role="alert" className="mt-4 max-w-xs text-center text-[12px] text-rose-300">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black text-white" role="status">
          <p className="text-[14px] font-bold text-[#FFEA00]">Opening scanner…</p>
        </div>
      }
    >
      <ScannerView />
    </Suspense>
  );
}
