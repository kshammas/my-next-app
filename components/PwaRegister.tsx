'use client';

import { useEffect } from 'react';

type InstallPrompt = Event & { prompt: () => Promise<void> };

export function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      void navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }

    const capture = (event: Event) => {
      event.preventDefault();
      (window as unknown as { hr26InstallPrompt?: InstallPrompt }).hr26InstallPrompt =
        event as InstallPrompt;
    };
    window.addEventListener('beforeinstallprompt', capture);
    return () => window.removeEventListener('beforeinstallprompt', capture);
  }, []);

  return null;
}
