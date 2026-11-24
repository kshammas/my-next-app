'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { AlertCircle, Check, RotateCcw, ScanLine, Sparkles, X } from '@/components/icons';
import { demoActivities } from '@/lib/demo-data';

const DEFAULT_ACTIVITY_ID = 'welcome-reward';
const KNOWN_ACTIVITY_IDS = new Set(demoActivities.map((item) => item.id));

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFEA00]';

type Phase = 'scanning' | 'success' | 'error';
type CameraStatus = 'starting' | 'live' | 'unavailable';

/**
 * Map a decoded QR payload to one of the demo activity ids so a real scan
 * updates the same prototype state as the "Scan to claim" buttons.
 */
function resolveActivityId(raw: string, fallback: string) {
  const value = raw.trim();
  if (!value) return fallback;
  if (KNOWN_ACTIVITY_IDS.has(value)) return value;

  const prefixed = value.match(/(?:hr26|rendezvous)[:/-]([a-z0-9-]+)/i)?.[1];
  if (prefixed && KNOWN_ACTIVITY_IDS.has(prefixed)) return prefixed;

  try {
    const url = new URL(value);
    const candidate =
      url.searchParams.get('activity') ??
      url.searchParams.get('id') ??
      url.searchParams.get('qr');
    if (candidate && KNOWN_ACTIVITY_IDS.has(candidate)) return candidate;

    for (const part of url.pathname.split('/').filter(Boolean)) {
      if (KNOWN_ACTIVITY_IDS.has(part)) return part;
    }
  } catch {
    // Plain text QR values are handled above.
  }

  return fallback;
}

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
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('starting');
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const phaseRef = useRef<Phase>('scanning');
  const scanLoopRef = useRef(false);
  const latest = useRef({ onResult, onClose, activityId });

  useEffect(() => {
    latest.current = { onResult, onClose, activityId };
  }, [onResult, onClose, activityId]);

  const stopCamera = useCallback(() => {
    scanLoopRef.current = false;
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const finishScan = useCallback(
    (rawValue: string) => {
      if (phaseRef.current !== 'scanning') return;

      phaseRef.current = 'success';
      setPhase('success');
      stopCamera();

      timerRef.current = window.setTimeout(() => {
        const { onResult: result, activityId: fallback } = latest.current;
        result(resolveActivityId(rawValue, fallback));
      }, 900);
    },
    [stopCamera],
  );

  const startCamera = useCallback(async () => {
    // Defer state updates so mounting the scanner does not set state inside an effect.
    await Promise.resolve();
    if (streamRef.current) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('unavailable');
      setCameraError('This browser cannot open the camera here. Use the demo scan below.');
      return;
    }

    setCameraStatus('starting');
    setCameraError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        stopCamera();
        setCameraStatus('unavailable');
        setCameraError('The camera view could not be displayed. Use the demo scan below.');
        return;
      }

      video.srcObject = stream;
      await video.play().catch(() => undefined);
      setCameraStatus('live');

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequently: true });
      let lastDecode = 0;

      const detect = (now: number) => {
        if (!scanLoopRef.current) return;

        const currentVideo = videoRef.current;
        if (
          currentVideo &&
          currentVideo.readyState >= 2 &&
          currentVideo.videoWidth > 0 &&
          phaseRef.current === 'scanning' &&
          now - lastDecode > 120
        ) {
          lastDecode = now;

          const scale = Math.min(1, 640 / currentVideo.videoWidth);
          const width = Math.max(1, Math.floor(currentVideo.videoWidth * scale));
          const height = Math.max(1, Math.floor(currentVideo.videoHeight * scale));

          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }

          if (context) {
            context.drawImage(currentVideo, 0, 0, width, height);
            const image = context.getImageData(0, 0, width, height);
            const code = jsQR(image.data, width, height, { inversionAttempts: 'attemptBoth' });
            if (code?.data) {
              finishScan(code.data);
              return;
            }
          }
        }

        frameRef.current = window.requestAnimationFrame(detect);
      };

      scanLoopRef.current = true;
      frameRef.current = window.requestAnimationFrame(detect);
    } catch (error) {
      stopCamera();
      setCameraStatus('unavailable');
      const name = error instanceof DOMException ? error.name : '';
      setCameraError(
        name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow camera access or use the demo scan below.'
          : 'The camera could not start. Use the demo scan below.',
      );
    }
  }, [finishScan, stopCamera]);

  useEffect(() => {
    // Opening the camera is an external side effect and its status updates are asynchronous.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void startCamera();
  }, [startCamera]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      stopCamera();
    },
    [stopCamera],
  );

  function simulateScan() {
    finishScan(latest.current.activityId);
  }

  function retryScan() {
    phaseRef.current = 'scanning';
    setPhase('scanning');
  }

  return (
    <div className="camera-scanner" role="dialog" aria-modal="true" aria-label="Scan participant card">
      <h1 className="sr-only">Scan participant card</h1>

      <div className="camera-scanner-feed" aria-hidden="true">
        <span className="camera-feed-glow camera-feed-glow-a" />
        <span className="camera-feed-glow camera-feed-glow-b" />
        <video
          ref={videoRef}
          className={`camera-feed-video${cameraStatus === 'live' ? ' camera-feed-video-live' : ''}`}
          autoPlay
          playsInline
          muted
        />
        <span className="camera-feed-vignette" />
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
        {cameraStatus !== 'live' ? (
          <div className="camera-notice" role="status">
            <ScanLine size={15} strokeWidth={2.4} aria-hidden="true" />
            <span>{cameraStatus === 'starting' ? 'Opening camera...' : cameraError}</span>
            {cameraStatus === 'unavailable' ? (
              <button
                type="button"
                onClick={() => void startCamera()}
                className={`camera-notice-retry ${focusRing}`}
              >
                Try again
              </button>
            ) : null}
          </div>
        ) : null}

        <div className={`camera-viewfinder camera-viewfinder-${phase}`}>
          <button
            type="button"
            onClick={phase === 'scanning' ? simulateScan : undefined}
            disabled={phase !== 'scanning'}
            aria-label={cameraStatus === 'live' ? 'QR code is scanned automatically' : 'Simulate a successful QR code scan'}
            className={`camera-viewfinder-hit ${focusRing} ${
              phase === 'scanning' && cameraStatus !== 'live' ? 'cursor-pointer' : 'cursor-default'
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
                <small>Opening your festival pass...</small>
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
                : cameraStatus === 'live'
                  ? 'Scanning for a QR code...'
                  : 'Camera preview'}
          </p>
        </div>

        <p className="camera-scanner-hint">
          {phase === 'success'
            ? 'Your participant pass is ready.'
            : phase === 'error'
              ? 'Hold the QR code inside the frame and retry the demo scan.'
              : cameraStatus === 'live'
                ? 'Point your camera at the QR code on your participant card'
                : 'Camera preview is unavailable — you can still try the demo scan below'}
        </p>
      </div>

      <footer className="camera-scanner-footer">
        {phase === 'error' ? (
          <button
            type="button"
            onClick={retryScan}
            className={`camera-action camera-action-primary ${focusRing}`}
          >
            <RotateCcw size={17} strokeWidth={2.4} aria-hidden="true" /> Retry scan
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                phaseRef.current = 'error';
                setPhase('error');
              }}
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
              {phase === 'success' ? 'Scan complete' : 'Demo scan'}
            </button>
          </>
        )}
      </footer>
    </div>
  );
}
