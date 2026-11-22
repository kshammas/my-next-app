'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';

export default function WelcomePage() {
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
            className="flex min-h-[54px] w-full items-center justify-center rounded-[14px] bg-[#113B61] text-[14px] font-bold text-white transition-transform duration-150 active:scale-[0.99]"
          >
            Scan Participant Card
          </Link>
          <Link
            href="/home"
            className="mt-0 flex min-h-[54px] w-full items-center justify-center rounded-[14px] bg-[#F6F7FB] text-[14px] font-bold text-[#143A5E] transition-transform duration-150 active:scale-[0.99]"
          >
            Continue as guest
          </Link>
          <p className="mt-2 text-center text-[10px] leading-relaxed text-[#8B949B]">
            By continuing you agree to our Terms &amp; Privacy Policy
          </p>
        </div>
      </div>
    </AppShell>
  );
}
