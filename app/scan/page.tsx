'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Check, RotateCcw, ScanLine, X } from 'lucide-react';
import { usePrototype } from '@/lib/prototype-store';

type Phase = 'scanning' | 'success' | 'error';

const focusOnDark =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFEA00]';

function ScannerView() {
  const router = useRouter();
  const { setGuestMode } = usePrototype();
  const [phase, setPhase] = useState<Phase>('scanning');
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  function confirmCard() {
    if (phase !== 'scanning') return;
    setPhase('success');
    timer.current = window.setTimeout(() => {
      setGuestMode(false);
      router.push('/onboarding');
    }, 850);
  }

  return (
    <main className="fixed inset-0 z-[90] flex flex-col bg-black text-white">
      <style>{`
        @keyframes hr26-pass-sweep {
          0%   { top: 6%;  opacity: 0; }
          12%  { opacity: 1; }
          88%  { opacity: 1; }
          100% { top: 94%; opacity: 0; }
        }
      `}</style>

      <h1 className="sr-only">Scan your participant card</h1>

      <div className="flex items-center justify-between px-5 pb-2 pt-[max(16px,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={() => router.push('/welcome')}
          aria-label="Close scanner"
          className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ${focusOnDark}`}
        >
          <X size={20} strokeWidth={2.4} aria-hidden="true" />
        </button>
        <p className="text-[16px] font-bold text-[#FFEA00]">Scan event pass</p>
        <span className="h-11 w-11" aria-hidden="true" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-[max(24px,env(safe-area-inset-bottom))]">
        <div className="relative aspect-square w-[59%] max-w-[420px] min-w-[220px]">
          <button
            type="button"
            onClick={confirmCard}
            disabled={phase !== 'scanning'}
            aria-label="Simulate a successful participant card scan"
            className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-[18px] bg-[#041a12] ${focusOnDark} ${
              phase === 'scanning' ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(24,187,70,0.18),transparent_60%)]" aria-hidden="true" />

            {/* Stylised participant card — illustration only. */}
            <div className="relative w-[70%] -rotate-[4deg] rounded-[16px] bg-white p-3 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#0C801D]">
                  Rendezvous 26
                </span>
                <span className="h-2 w-2 rounded-full bg-[#FDE047]" aria-hidden="true" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[9px] bg-[#E6F3EA]">
                  <ScanLine size={22} strokeWidth={2.2} className="text-[#0C801D]" aria-hidden="true" />
                </span>
                <span className="flex-1 space-y-1.5">
                  <span className="block h-1.5 w-4/5 rounded-full bg-[#CFDDD3]" />
                  <span className="block h-1.5 w-3/5 rounded-full bg-[#E1EAE3]" />
                  <span className="block h-1.5 w-2/5 rounded-full bg-[#E1EAE3]" />
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-[#E6F3EA] pt-2">
                <span className="text-[7px] font-bold tracking-wide text-[#6B7B72]">PARTICIPANT CARD</span>
                <span className="text-[7px] font-extrabold text-[#0C801D]">2025JM122</span>
              </div>
            </div>

            <span className="pointer-events-none absolute left-0 top-0 h-[42px] w-[42px] rounded-tl-lg border-l-4 border-t-4 border-[#FFEA00]" aria-hidden="true" />
            <span className="pointer-events-none absolute right-0 top-0 h-[42px] w-[42px] rounded-tr-lg border-r-4 border-t-4 border-[#FFEA00]" aria-hidden="true" />
            <span className="pointer-events-none absolute bottom-0 left-0 h-[42px] w-[42px] rounded-bl-lg border-b-4 border-l-4 border-[#FFEA00]" aria-hidden="true" />
            <span className="pointer-events-none absolute bottom-0 right-0 h-[42px] w-[42px] rounded-br-lg border-b-4 border-r-4 border-[#FFEA00]" aria-hidden="true" />

            {phase === 'scanning' ? (
              <>
                <span
                  className="pointer-events-none absolute left-5 right-5 h-[2px] rounded-full bg-[#FFEA00] shadow-[0_0_16px_4px_rgba(255,234,0,0.4)]"
                  style={{ animation: 'hr26-pass-sweep 2s ease-in-out infinite' }}
                  aria-hidden="true"
                />
                <span className="pointer-events-none absolute bottom-[18px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold text-white/85">
                  Tap frame to simulate scan
                </span>
              </>
            ) : null}

            {phase === 'success' ? (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#041a12]/80">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#18BB46]">
                  <Check size={32} strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-[13px] font-extrabold">Pass verified</span>
                <span className="text-[11px] text-white/70">Opening your festival pass...</span>
              </span>
            ) : null}
          </button>
        </div>

        <div className="mt-7 flex items-center justify-center gap-2" aria-live="polite">
          {phase === 'success' ? (
            <Check size={16} strokeWidth={2.8} className="text-[#6EE787]" aria-hidden="true" />
          ) : phase === 'error' ? (
            <AlertCircle size={16} strokeWidth={2.4} className="text-rose-300" aria-hidden="true" />
          ) : (
            <ScanLine size={16} strokeWidth={2.4} className="text-[#FFEA00]" aria-hidden="true" />
          )}
          <p className="text-[13px] font-bold">
            {phase === 'success'
              ? 'Card recognised'
              : phase === 'error'
                ? 'Card not recognised'
                : 'Scanning...'}
          </p>
        </div>

        <p className="mt-2 max-w-xs text-center text-[12px] leading-relaxed text-[#C3CAD0]">
          {phase === 'success'
            ? 'Your participant pass is ready.'
            : phase === 'error'
              ? 'Hold the card inside the frame and try the demo scan again.'
              : 'Point at the QR code on your participant card'}
        </p>

        <div className="mt-6 flex w-full max-w-xs items-center gap-2">
          {phase === 'error' ? (
            <button
              type="button"
              onClick={() => setPhase('scanning')}
              className={`flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-full bg-[#FFEA00] text-[12px] font-extrabold text-[#082b1a] transition-colors hover:bg-[#F5DF3A] ${focusOnDark}`}
            >
              <RotateCcw size={15} strokeWidth={2.4} aria-hidden="true" /> Retry scan
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setPhase('error')}
                disabled={phase !== 'scanning'}
                className={`flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-full border border-white/25 text-[12px] font-bold text-white/80 transition-colors hover:bg-white/10 disabled:opacity-50 ${focusOnDark}`}
              >
                <AlertCircle size={15} strokeWidth={2.4} aria-hidden="true" /> Simulate error
              </button>
              <button
                type="button"
                onClick={confirmCard}
                disabled={phase !== 'scanning'}
                className={`flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-full bg-[#FFEA00] text-[12px] font-extrabold text-[#082b1a] transition-colors hover:bg-[#F5DF3A] disabled:opacity-60 ${focusOnDark}`}
              >
                <ScanLine size={15} strokeWidth={2.4} aria-hidden="true" /> Simulate scan
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setGuestMode(true);
            router.push('/home');
          }}
          className={`mt-4 rounded-full px-3 py-1 text-[11px] font-semibold text-white/60 underline underline-offset-4 transition-colors hover:text-white ${focusOnDark}`}
        >
          Continue as guest
        </button>
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
