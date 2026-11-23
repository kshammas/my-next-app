'use client';

import { ArrowLeft, ArrowUpRight, ScanLine, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { AppShell } from '@/components/AppShell';
import { usePrototype } from '@/lib/prototype-store';

export default function LoginPage() {
  const router = useRouter();
  const { setGuestMode, updateProfile } = usePrototype();
  const [participantId, setParticipantId] = useState('');
  const [error, setError] = useState('');

  function continueWithId(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = participantId.trim();
    if (!id) {
      setError('Enter your Participant ID to continue.');
      return;
    }
    // Prototype only — no authentication or network request.
    updateProfile({ jamiaId: id.toUpperCase() });
    setGuestMode(false);
    router.push('/onboarding');
  }

  function enterAsGuest() {
    setGuestMode(true);
    router.push('/home');
  }

  return (
    <AppShell showNav={false}>
      <div className="flex min-h-full flex-col bg-white px-6 pb-5 pt-[max(20px,env(safe-area-inset-top))]">
        <div className="flex h-10 shrink-0 items-center">
          <Link
            href="/welcome"
            aria-label="Back to welcome"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#113B61] transition-colors hover:bg-[#F7F9FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#113B61]"
          >
            <ArrowLeft size={20} strokeWidth={2.4} aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Image
            className="h-[120px] w-[100px] object-contain"
            src="/rendezvous-logo.png"
            alt="Rendezvous 26 logo"
            width={100}
            height={120}
            priority
          />
          <h1 className="mt-2 text-[26px] font-extrabold text-[#113B61]">Sign in</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[#8B949B]">
            Enter the Participant ID printed
            <br />
            on your festival card.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md">
          <form onSubmit={continueWithId} noValidate>
            <label htmlFor="participant-id" className="sr-only">
              Participant ID
            </label>
            <div className="flex min-h-[56px] items-center gap-3 rounded-[16px] border border-[#E3EAF0] bg-[#F7F9FB] px-4 transition-colors focus-within:border-[#113B61] focus-within:bg-white">
              <UserRound size={19} strokeWidth={2.2} className="shrink-0 text-[#143A5E]" aria-hidden="true" />
              <input
                id="participant-id"
                name="participantId"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={participantId}
                onChange={(event) => {
                  setParticipantId(event.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. 2025JM122"
                className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold tracking-wide text-[#143A5E] outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-[#9AA7A0]"
              />
            </div>

            {error ? (
              <p role="alert" className="mt-2 text-[11px] font-semibold text-[#BE123C]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="relative mt-3 flex min-h-[56px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#113B61] px-12 text-[14px] font-bold tracking-[-0.01em] text-white shadow-[0_12px_24px_-14px_rgba(17,59,97,0.85)] transition duration-150 hover:bg-[#0E3356] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18BB46]"
            >
              <span className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-[#18BB46]" />
              Continue
              <ArrowUpRight className="absolute right-5 h-[16px] w-[16px] text-white/60" aria-hidden="true" />
            </button>
          </form>

          <Link
            href="/scan"
            className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[14px] text-[12px] font-bold text-[#143A5E] transition-colors hover:bg-[#F7F9FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#113B61]"
          >
            <ScanLine size={16} strokeWidth={2.2} aria-hidden="true" />
            Scan Participant Card instead
          </Link>

          <button
            type="button"
            onClick={enterAsGuest}
            className="mt-1 flex min-h-[44px] w-full items-center justify-center rounded-[14px] border border-[#E3EAF0] bg-[#F7F9FB] text-[12px] font-semibold text-[#143A5E] transition duration-150 hover:bg-[#EEF3F8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#113B61]"
          >
            Continue as guest
          </button>

          <p className="mt-3 text-center text-[10px] leading-relaxed text-[#7C8791]">
            Prototype sign-in · no password or verification needed
          </p>
        </div>
      </div>
    </AppShell>
  );
}
