'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { demoSession } from '@/lib/demo-data';
import type { Session } from '@/lib/types';
import { useApi } from '@/lib/use-api';

const STORAGE_KEY = 'hr26_onboarded';

type Slide = {
  image: string;
  alt: string;
  title: (name: string) => string;
  subtitle?: string;
  body: string[];
  cta: string;
};

const slides: Slide[] = [
  {
    image: '/onboarding-1.png',
    alt: 'Personalised Rendezvous welcome illustration',
    title: (name) => `Hi, ${name}!`,
    subtitle: 'Welcome to Rendezvous!',
    body: [
      'Your festival journey, made personal. Explore, participate,',
      'compete and make every moment count.',
    ],
    cta: "Let's Begin",
  },
  {
    image: '/onboarding-2.png',
    alt: 'Programs and participation illustration',
    title: () => 'Your Space. Your Journey.',
    body: [
      'Discover programs, track your participation and stay',
      'connected with everything happening around you.',
    ],
    cta: 'Continue',
  },
  {
    image: '/onboarding-3.png',
    alt: 'Earning Glocal Coins illustration',
    title: () => 'Participate. Earn. Collect.',
    body: [
      'Earn Glocal Coins through eligible programs and activities.',
      'Every participation brings new rewards!',
    ],
    cta: 'Continue',
  },
  {
    image: '/onboarding-4.png',
    alt: 'Glocal Store rewards illustration',
    title: () => 'Your Coins. Your Rewards.',
    body: [
      'Explore the Glocal Store and redeem your Glocal Coins for',
      'exciting rewards.',
    ],
    cta: 'Get Started',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useApi<Session>('/api/session', demoSession);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        if (window.localStorage.getItem(STORAGE_KEY) === '1') {
          router.replace('/home');
          return;
        }
      } catch {
        // Storage may be unavailable in private browsing; onboarding still works.
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  const finish = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Ignore storage failures; navigation must still continue.
    }
    router.replace('/home');
  }, [router]);

  const goBack = useCallback(() => {
    if (index === 0) {
      router.push('/welcome');
      return;
    }
    setIndex((current) => current - 1);
  }, [index, router]);

  const goNext = useCallback(() => {
    if (index === slides.length - 1) {
      finish();
      return;
    }
    setIndex((current) => current + 1);
  }, [finish, index]);

  if (!ready) {
    return (
      <main className="fixed inset-0 z-[100] bg-white" aria-label="Loading Rendezvous onboarding" />
    );
  }

  const slide = slides[index];

  return (
    <AppShell showNav={false}>
      <div className="flex min-h-full flex-col bg-white px-6 pb-6 pt-[max(48px,env(safe-area-inset-top))]">
        <div className="flex h-9 shrink-0 items-center justify-end">
          <button
            type="button"
            onClick={finish}
            className="rounded-full px-2 py-1 text-[13px] font-semibold text-[#747474] transition-colors hover:text-[#0C801D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C801D]"
          >
            Skip
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-7 pb-10 text-center">
          <Image
            key={slide.image}
            className="h-auto w-[220px] max-w-[78vw] object-contain"
            src={slide.image}
            alt={slide.alt}
            width={400}
            height={450}
            priority={index === 0}
          />

          <div aria-live="polite">
            <h1 className="text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-[#0C3523]">
              {slide.title(session.name)}
            </h1>
            {slide.subtitle ? (
              <p className="mt-1 text-[19px] font-bold text-[#0C801D]">{slide.subtitle}</p>
            ) : null}
            <div className="mx-auto mt-4 max-w-[320px]">
              {slide.body.map((line) => (
                <p key={line} className="text-[13px] leading-relaxed text-[#5B6B61]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={goBack}
            className="min-h-[48px] rounded-full px-3 text-[13px] font-bold text-[#747474] transition-colors hover:text-[#0C801D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C801D]"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            className="flex min-h-[48px] min-w-[150px] items-center justify-center rounded-full bg-[#0C801D] px-8 text-[14px] font-extrabold text-white shadow-[0_10px_22px_-12px_rgba(12,128,29,0.9)] transition-colors hover:bg-[#0A6E19] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C801D]"
          >
            {slide.cta}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
