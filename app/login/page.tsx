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
      <div className="flex min-h-full flex-col items-center bg-white px-8 pt-14">
        <Logo className="h-[190px] w-[150px]" />

        <h1 className="mt-8 text-[28px] font-extrabold text-[#0a3d8f]">Welcome</h1>
        <p className="mt-2 text-center text-[14px] leading-relaxed text-slate-500">
          Sign in with your<br />
          Participant Card or ID Card.
        </p>

        {manual ? (
          <form
            className="mt-8 w-full"
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
              className="mt-2 w-full rounded-2xl border border-emerald-100 bg-[#f6faf7] px-4 py-3.5 text-[14px] outline-none focus:border-[#0a7a33]"
              autoFocus
            />
            <button type="submit" disabled={busy || !code.trim()} className="primary-button mt-3">
              {busy ? 'Signing in…' : 'Continue'}
            </button>
            <button
              type="button"
              onClick={() => setManual(false)}
              className="mt-3 w-full text-[12px] font-semibold text-slate-500"
            >
              Use camera instead
            </button>
          </form>
        ) : null}

        {error ? <p className="mt-4 text-center text-[12px] text-rose-600">{error}</p> : null}

        <div className="mt-auto w-full pb-8">
          <button
            onClick={() => setScanning(true)}
            disabled={busy}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0a3d8f] py-4 text-[15px] font-bold text-white"
          >
            <QrCode size={20} className="text-[#b5e61d]" />
            Scan Participant Card
          </button>

          <button
            onClick={() => {
              if (!manual) setManual(true);
              else void signIn({ guest: true });
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f5f5f3] py-4 text-[14px] font-bold text-[#0a3d8f]"
          >
            {manual ? 'Continue as guest' : 'Enter ID manually'}
            <ArrowRight size={16} />
          </button>

          <p className="mt-6 text-center text-[11px] text-slate-400">
            By continuing you agree to our Terms &amp; Privacy Policy
          </p>
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
