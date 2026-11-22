'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, QrCode } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Logo } from '@/components/Logo';
import { QrScanner } from '@/components/QrScanner';
import { apiSend } from '@/lib/use-api';
import type { Session } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [manual, setManual] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function signIn(payload: { code?: string; guest?: boolean }) {
    setBusy(true);
    setError('');
    try {
      await apiSend<Session>('/api/session', 'POST', payload);
      router.push('/home');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell showNav={false}>
      <div className="flex min-h-full flex-col gap-8 bg-white px-6 pb-8 pt-10 sm:px-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-12 lg:py-10">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <Logo className="h-[170px] w-[140px] lg:h-[210px] lg:w-[170px]" />
          <h1 className="mt-6 text-[28px] font-extrabold text-[#0a3d8f] sm:text-[34px]">Welcome</h1>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-slate-500">
            Sign in with your Participant Card or ID Card.
          </p>
        </div>

        <div className="flex w-full flex-col">
          {manual ? (
            <form
              className="w-full"
              onSubmit={(event) => {
                event.preventDefault();
                void signIn({ code });
              }}
            >
              <label className="text-[12px] font-bold text-[#073b1d]" htmlFor="jamia-id">
                Jamia ID / card code
              </label>
              <input
                id="jamia-id"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="e.g. 2020JM010"
                autoComplete="username"
                className="mt-2 min-h-[48px] w-full rounded-2xl border border-emerald-100 bg-[#f6faf7] px-4 text-[14px] outline-none focus:border-[#0a7a33]"
                autoFocus
              />
              <button type="submit" disabled={busy || !code.trim()} className="primary-button mt-3">
                {busy ? 'Signing in…' : 'Continue'}
              </button>
              <button
                type="button"
                onClick={() => setManual(false)}
                className="mt-3 min-h-[44px] w-full text-[12px] font-semibold text-slate-500"
              >
                Use camera instead
              </button>
            </form>
          ) : null}

          {error ? (
            <p role="alert" className="mt-4 text-center text-[12px] text-rose-600 lg:text-left">{error}</p>
          ) : null}

          <div className="mt-auto w-full pt-8 lg:pt-0">
            <button
              onClick={() => setScanning(true)}
              disabled={busy}
              className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-[#0a3d8f] text-[15px] font-bold text-white transition-transform duration-150 active:scale-[0.99]"
            >
              <QrCode size={20} className="text-[#b5e61d]" aria-hidden="true" />
              Scan Participant Card
            </button>

            <button
              onClick={() => {
                if (!manual) setManual(true);
                else void signIn({ guest: true });
              }}
              className="mt-3 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#f5f5f3] text-[14px] font-bold text-[#0a3d8f] transition-transform duration-150 active:scale-[0.99]"
            >
              {manual ? 'Continue as guest' : 'Enter ID manually'}
              <ArrowRight size={16} aria-hidden="true" />
            </button>

            <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-400">
              By continuing you agree to our Terms &amp; Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {scanning ? (
        <QrScanner
          onClose={() => setScanning(false)}
          onResult={(value) => {
            setCode(value);
            void signIn({ code: value });
          }}
        />
      ) : null}
    </AppShell>
  );
}
