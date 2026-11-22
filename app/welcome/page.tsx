'use client';

import Link from 'next/link';
import { ArrowRight, ScanLine } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Logo } from '@/components/Logo';

export default function WelcomePage() {
  return (
    <AppShell showNav={false}>
      <div className="flex min-h-full flex-col items-center justify-center bg-white px-6 pb-10 pt-12 sm:px-10 lg:flex-row lg:gap-16 lg:px-12">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <Logo className="h-[180px] w-[148px] lg:h-[230px] lg:w-[190px]" />
          <h1 className="mt-6 text-[30px] font-extrabold text-[#0a3d8f] sm:text-[36px]">Welcome</h1>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-slate-500">
            Your gateway to Rendezvous 26 — scan your participant card or explore as a guest.
          </p>
        </div>

        <div className="mt-10 w-full max-w-md lg:mt-0">
          <Link
            href="/scan"
            className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl bg-[#0a3d8f] text-[15px] font-bold text-white transition-transform duration-150 active:scale-[0.99]"
          >
            <ScanLine size={20} className="text-[#b5e61d]" aria-hidden="true" />
            Scan Participant Card
          </Link>

          <Link
            href="/home"
            className="mt-3 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#f5f5f3] text-[14px] font-bold text-[#0a3d8f] transition-transform duration-150 active:scale-[0.99]"
          >
            Continue as Guest
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-400">
            By continuing you agree to our Terms &amp; Privacy Policy
          </p>
        </div>
      </div>
    </AppShell>
  );
}
