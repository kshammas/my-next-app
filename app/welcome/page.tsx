'use client';

import { ArrowUpRight, ScanLine, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { usePrototype } from '@/lib/prototype-store';

export default function WelcomePage() {
  const router = useRouter();
  const { setGuestMode } = usePrototype();

  function enterAsGuest() {
    setGuestMode(true);
    router.push('/home');
  }

  return (
    <AppShell showNav={false}>
      <div className="flex min-h-full flex-col bg-white px-6 pb-5 pt-14">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Image
            className="h-[150px] w-[124px] object-contain"
            src="/rendezvous-logo.png"
            alt="Rendezvous 26 logo"
            width={124}
            height={150}
            priority
          />
          <h1 className="mt-1 text-[28px] font-extrabold text-[#113B61]">Welcome</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-[#8B949B]">
            Sign in with your
            <br />
            Participant Card or ID Card.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Link
            href="/scan"
            className="relative flex min-h-[56px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#113B61] px-12 text-[14px] font-bold tracking-[-0.01em] text-white shadow-[0_12px_24px_-14px_rgba(17,59,97,0.85)] transition duration-150 hover:bg-[#0E3356] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18BB46]"
          >
            <span className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-[#18BB46]" />
            <ScanLine className="absolute left-5 h-[18px] w-[18px] text-white/85" aria-hidden="true" />
            Scan Participant Card
            <ArrowUpRight className="absolute right-5 h-[16px] w-[16px] text-white/60" aria-hidden="true" />
          </Link>

          <Link
            href="/login"
            className="mt-3 flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-[12px] text-[11px] font-bold text-[#143A5E] transition duration-150 hover:bg-[#F7F9FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#113B61]"
          >
            <UserRound size={14} strokeWidth={2.2} aria-hidden="true" />
            Enter Participant ID instead
          </Link>

          <button
            type="button"
            onClick={enterAsGuest}
            className="mt-2 flex min-h-[52px] w-full items-center justify-center rounded-[16px] border border-[#E3EAF0] bg-[#F7F9FB] text-[13px] font-semibold text-[#143A5E] transition duration-150 hover:border-[#CBD6E1] hover:bg-[#EEF3F8] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#113B61]"
          >
            Continue as guest
          </button>

          <p className="mt-3 text-center text-[10px] leading-relaxed text-[#7C8791]">
            By continuing you agree to our Terms &amp; Privacy Policy
          </p>
        </div>
      </div>
    </AppShell>
  );
}
