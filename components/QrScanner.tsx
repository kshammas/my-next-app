'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, RotateCcw, ScanLine, X } from '@/components/icons';

const DEFAULT_ACTIVITY_ID = 'welcome-reward';

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C801D]';

type Phase = 'scanning' | 'success' | 'error';

/**
 * Prototype-only scanner. There is no camera and no permission prompt: the
 * frame is a button that simulates a successful participant-card read and
 * returns a valid demo activity id.
 */
export function QrScanner({
  onResult,
  onClose,
  activityId = DEFAULT_ACTIVITY_ID,
}: {
  onResult: (value: string) => void;
  onClose: () => void;
  activityId?: string;
}) {
  const [phase, setPhase] = useState<Phase>('scanning');
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  function simulateScan() {
    if (phase !== 'scanning') return;
    setPhase('success');
    timer.current = window.setTimeout(() => {
      onResult(activityId);
      onClose();
    }, 700);
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Scan participant card">
      <style>{`
        @keyframes hr26-qr-sweep {
          0%   { top: 8%;  opacity: 0; }
          12%  { opacity: 1; }
          88%  { opacity: 1; }
          100% { top: 92%; opacity: 0; }
        }
      `}</style>

      <div className="modal-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-extrabold text-[#073b1d]">Scan participant card</h2>
            <p className="mt-0.5 text-[11px] font-semibold text-[#6B7B72]">
              Prototype scanner · no camera needed
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close scanner"
            className={`icon-button ${focusRing}`}
          >
            <X size={18} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={simulateScan}
          disabled={phase !== 'scanning'}
          aria-label="Simulate a successful card scan"
          className={`relative mt-4 block aspect-square w-full overflow-hidden rounded-[18px] bg-[#062017] shadow-inner ${focusRing} ${
            phase === 'scanning' ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(24,187,70,0.16),transparent_58%)]" aria-hidden="true" />

          {/* Faint, decorative QR motif — purely visual. */}
          <svg
            viewBox="0 0 120 120"
            className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 text-[#A1C8B3]/25"
            aria-hidden="true"
          >
            <rect x="4" y="4" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
            <rect x="14" y="14" width="8" height="8" fill="currentColor" />
            <rect x="88" y="4" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
            <rect x="98" y="14" width="8" height="8" fill="currentColor" />
            <rect x="4" y="88" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
            <rect x="14" y="98" width="8" height="8" fill="currentColor" />
            <rect x="42" y="10" width="8" height="8" fill="currentColor" />
            <rect x="58" y="10" width="8" height="8" fill="currentColor" />
            <rect x="42" y="26" width="8" height="8" fill="currentColor" />
            <rect x="70" y="26" width="8" height="8" fill="currentColor" />
            <rect x="10" y="42" width="8" height="8" fill="currentColor" />
            <rect x="26" y="58" width="8" height="8" fill="currentColor" />
            <rect x="42" y="42" width="20" height="20" fill="currentColor" />
            <rect x="72" y="42" width="8" height="8" fill="currentColor" />
            <rect x="88" y="58" width="8" height="8" fill="currentColor" />
            <rect x="42" y="72" width="8" height="8" fill="currentColor" />
            <rect x="58" y="88" width="8" height="8" fill="currentColor" />
            <rect x="72" y="72" width="20" height="20" fill="currentColor" />
            <rect x="98" y="88" width="8" height="8" fill="currentColor" />
          </svg>

          <span className="pointer-events-none absolute left-3 top-3 h-9 w-9 rounded-tl-[10px] border-l-4 border-t-4 border-[#FFEA00]" aria-hidden="true" />
          <span className="pointer-events-none absolute right-3 top-3 h-9 w-9 rounded-tr-[10px] border-r-4 border-t-4 border-[#FFEA00]" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-3 left-3 h-9 w-9 rounded-bl-[10px] border-b-4 border-l-4 border-[#FFEA00]" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-3 right-3 h-9 w-9 rounded-br-[10px] border-b-4 border-r-4 border-[#FFEA00]" aria-hidden="true" />

          {phase === 'scanning' ? (
            <>
              <span
                className="pointer-events-none absolute left-6 right-6 h-[2px] rounded-full bg-[#FFEA00] shadow-[0_0_14px_3px_rgba(255,234,0,0.45)]"
                style={{ animation: 'hr26-qr-sweep 1.9s ease-in-out infinite' }}
                aria-hidden="true"
              />
              <span className="pointer-events-none absolute bottom-[18px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold text-white/85">
                Tap frame to simulate scan
              </span>
            </>
          ) : null}

          {phase === 'success' ? (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#062017]/75 text-white">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#18BB46]">
                <Check size={28} strokeWidth={3} aria-hidden="true" />
              </span>
              <span className="text-[12px] font-bold">Card recognised</span>
            </span>
          ) : null}
        </button>

        <div className="mt-4 flex items-start gap-2" aria-live="polite">
          {phase === 'success' ? (
            <Check size={16} strokeWidth={2.6} className="mt-0.5 shrink-0 text-[#0C801D]" aria-hidden="true" />
          ) : phase === 'error' ? (
            <AlertCircle size={16} strokeWidth={2.4} className="mt-0.5 shrink-0 text-[#BE123C]" aria-hidden="true" />
          ) : (
            <ScanLine size={16} strokeWidth={2.4} className="mt-0.5 shrink-0 text-[#0C801D]" aria-hidden="true" />
          )}
          <p className="text-[12px] font-semibold leading-relaxed text-[#5B6B61]">
            {phase === 'success'
              ? 'Card recognised. Adding your reward...'
              : phase === 'error'
                ? "We couldn't read that card. Retry the demo scan below."
                : 'Scanning for a participant card...'}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {phase === 'error' ? (
            <button
              type="button"
              onClick={() => setPhase('scanning')}
              className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-[#0C801D] text-[12px] font-extrabold text-white transition-colors hover:bg-[#0A6E19] ${focusRing}`}
            >
              <RotateCcw size={14} strokeWidth={2.4} aria-hidden="true" /> Retry scan
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setPhase('error')}
                disabled={phase !== 'scanning'}
                className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-[#E3EAF0] bg-white text-[12px] font-bold text-[#5B6B61] transition-colors hover:bg-[#F7F9FB] disabled:opacity-50 ${focusRing}`}
              >
                <AlertCircle size={14} strokeWidth={2.4} aria-hidden="true" /> Simulate error
              </button>
              <button
                type="button"
                onClick={simulateScan}
                disabled={phase !== 'scanning'}
                className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-[#FDE047] text-[12px] font-extrabold text-[#0C3523] transition-colors hover:bg-[#F7DF5B] disabled:opacity-60 ${focusRing}`}
              >
                <ScanLine size={14} strokeWidth={2.4} aria-hidden="true" /> Simulate scan
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
