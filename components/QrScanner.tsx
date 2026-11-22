'use client';

import { useEffect, useRef, useState } from 'react';
import type { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

export function QrScanner({
  onResult,
  onClose,
}: {
  onResult: (value: string) => void;
  onClose: () => void;
}) {
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
        scanner = new Scanner('hr26-qr-reader', { verbose: false });
        started = true;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (value) => {
            onResult(value);
            onClose();
          },
          () => undefined,
        );
      } catch {
        if (!cancelled) setError('Camera unavailable. Check permission or enter the ID manually.');
      }
    }

    void begin();

    return () => {
      cancelled = true;
      if (scanner && started) {
        void scanner.stop().then(() => scanner?.clear()).catch(() => undefined);
      }
    };
  }, [onClose, onResult]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Scan card">
      <div className="modal-card">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-extrabold text-[#073b1d]">Scan participant card</h2>
          <button onClick={onClose} className="icon-button" aria-label="Close scanner">
            <X size={18} />
          </button>
        </div>
        <div id="hr26-qr-reader" ref={holderRef} className="mt-4 min-h-[240px] overflow-hidden rounded-2xl bg-[#0b2a18]" />
        {error ? <p className="mt-3 text-[12px] text-rose-600">{error}</p> : null}
        <p className="mt-3 text-[12px] text-slate-500">Point your camera at the QR or barcode on your card.</p>
      </div>
    </div>
  );
}
