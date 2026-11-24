'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, RotateCcw, ScanLine, Sparkles, X } from '@/components/icons';

const DEFAULT_ACTIVITY_ID = 'welcome-reward';

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFEA00]';

type Phase = 'scanning' | 'success' | 'error';

/**
 * Prototype-only full-screen camera-style QR scanner. There is no real camera
 * and no permission prompt: the viewfinder is a button that simulates reading
 * a QR code and returns a valid demo activity id.
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
    }, 900);
  }

  return (
    <div className="camera-scanner" role="dialog" aria-modal="true" aria-label="Scan participant card">
      <h1 className="sr-only">Scan participant card</h1>

      <div className="camera-scanner-feed" aria-hidden="true">
        <span className="camera-feed-glow camera-feed-glow-a" />
        <span className="camera-feed-glow camera-feed-glow-b" />
      </div>

      <header className="camera-scanner-top">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close scanner"
          className={`camera-control ${focusRing}`}
        >
          <X size={22} strokeWidth={2.4} aria-hidden="true" />
        </button>
        <div className="camera-scanner-heading">
          <p className="camera-scanner-eyebrow">Rendezvous 26</p>
          <h2>Scan QR code</h2>
        </div>
        <span className="camera-control camera-control-ghost" aria-hidden="true">
          <ScanLine size={22} strokeWidth={2.2} />
        </span>
      </header>

      <div className="camera-scanner-body">
        <div className={`camera-viewfinder camera-viewfinder-${phase}`}>
          <button
            type="button"
            onClick={simulateScan}
            disabled={phase !== 'scanning'}
            aria-label="Simulate a successful QR code scan"
            className={`camera-viewfinder-hit ${focusRing} ${
              phase === 'scanning' ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <svg
              viewBox="0 0 120 120"
              className="camera-qr-motif"
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

            <span className="camera-corner camera-corner-tl" aria-hidden="true" />
            <span className="camera-corner camera-corner-tr" aria-hidden="true" />
            <span className="camera-corner camera-corner-bl" aria-hidden="true" />
            <span className="camera-corner camera-corner-br" aria-hidden="true" />

            {phase === 'scanning' ? (
              <span className="camera-scan-line" aria-hidden="true" />
            ) : null}

            {phase === 'success' ? (
              <span className="camera-result-overlay">
                <span className="camera-result-icon">
                  <Check size={34} strokeWidth={3} aria-hidden="true" />
                </span>
                <strong>QR code recognised</strong>
                <small>Adding your reward...</small>
              </span>
            ) : null}

            {phase === 'error' ? (
              <span className="camera-result-overlay camera-result-error">
                <span className="camera-result-icon">
                  <AlertCircle size={34} strokeWidth={2.6} aria-hidden="true" />
                </span>
                <strong>Code not recognised</strong>
                <small>Hold the QR steady and try again</small>
              </span>
            ) : null}
          </button>
        </div>

        <div className="camera-scanner-status" aria-live="polite">
          {phase === 'success' ? (
            <Check size={17} strokeWidth={2.8} className="text-[#6EE787]" aria-hidden="true" />
          ) : phase === 'error' ? (
            <AlertCircle size={17} strokeWidth={2.5} className="text-rose-300" aria-hidden="true" />
          ) : (
            <ScanLine size={17} strokeWidth={2.5} className="text-[#FFEA00]" aria-hidden="true" />
          )}
          <p>
            {phase === 'success'
              ? 'Card recognised'
              : phase === 'error'
                ? 'Card not recognised'
                : 'Scanning for a QR code...'}
          </p>
        </div>

        <p className="camera-scanner-hint">
          {phase === 'success'
            ? 'Your participant pass is ready.'
            : phase === 'error'
              ? 'Hold the QR code inside the frame and retry the demo scan.'
              : 'Point your camera at the QR code on your participant card'}
        </p>
      </div>

      <footer className="camera-scanner-footer">
        {phase === 'error' ? (
          <button
            type="button"
            onClick={() => setPhase('scanning')}
            className={`camera-action camera-action-primary ${focusRing}`}
          >
            <RotateCcw size={17} strokeWidth={2.4} aria-hidden="true" /> Retry scan
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setPhase('error')}
              disabled={phase !== 'scanning'}
              className={`camera-action camera-action-secondary ${focusRing}`}
            >
              <AlertCircle size={17} strokeWidth={2.4} aria-hidden="true" /> Simulate error
            </button>
            <button
              type="button"
              onClick={simulateScan}
              disabled={phase !== 'scanning'}
              className={`camera-action camera-action-primary ${focusRing}`}
            >
              {phase === 'success' ? (
                <Check size={17} strokeWidth={2.8} aria-hidden="true" />
              ) : (
                <Sparkles size={17} strokeWidth={2.2} aria-hidden="true" />
              )}
              {phase === 'success' ? 'Scan complete' : 'Simulate scan'}
            </button>
          </>
        )}
      </footer>
    </div>
  );
}
