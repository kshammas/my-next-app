'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronLeft, Mail, MessageCircle, Phone } from 'lucide-react';
import { AppShell } from '@/components/AppShell';

const contacts = [
  {
    label: 'WhatsApp',
    detail: 'Fastest response (10AM–12PM)',
    icon: MessageCircle,
  },
  {
    label: 'Helpline Call',
    detail: '+918592955776',
    icon: Phone,
  },
  {
    label: 'Email Support',
    detail: 'rend26.home@gmail.com',
    icon: Mail,
  },
];

const faqs = [
  {
    question: 'How do I sign in to my student account?',
    answer:
      "Tap 'Sign In' from the top banner and scan your participant ID. If you are a visitor, you can continue browsing schedules and results in Guest Mode.",
  },
  {
    question: 'How are Glocal Points earned and redeemed?',
    answer:
      'Scan QR codes at event stalls and activities to earn Glocal Points, then redeem them for goodies in your Glocal Wallet.',
  },
  {
    question: "Why can't I scan QR codes in Guest Mode?",
    answer: 'Scanning is available to signed-in participants only. Sign in with your participant card to earn points.',
  },
  {
    question: 'When are program results updated?',
    answer: 'Results are updated as events conclude. Open the Results page for the latest standings.',
  },
  {
    question: 'My registered event is missing or has the wrong details.',
    answer: 'Reach out to the organizing committee using any of the contact options above.',
  },
];

export default function SupportPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <AppShell>
      <div className="app-content !px-0 !pt-0">
        <header className="flex items-center gap-3 bg-white px-4 pb-4 pt-4">
          <Link href="/home" className="icon-button" aria-label="Go back">
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="text-[20px] font-extrabold text-[#04251a]">Help &amp; Support</h1>
        </header>

        <div className="bg-[#F3F8F4] px-4 pb-10 pt-5">
          <section className="rounded-[22px] bg-[#09301E] p-4 text-white">
            <h2 className="text-[19px] font-extrabold">Need help during Rendezvous?</h2>
            <p className="mt-1.5 text-[12px] leading-snug text-white/80">
              Reach out to our organizing committee or check quick answers below.
            </p>
          </section>

          <h2 className="mt-4 text-[17px] font-extrabold text-[#1A2E23]">Contact Us</h2>
          <div className="mt-2 space-y-2">
            {contacts.map(({ label, detail, icon: Icon }) => (
              <article
                key={label}
                className="flex min-h-[64px] items-center gap-3 rounded-[18px] bg-white px-4 py-2 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF9F4] text-[#0B3424]">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold text-[#1A2E23]">{label}</span>
                  <span className="block truncate text-[11px] text-slate-500">{detail}</span>
                </span>
                <span className="flex min-h-[36px] shrink-0 items-center rounded-full bg-[#EFF9F4] px-4 text-[12px] font-bold text-[#0B3424]">
                  Connect
                </span>
              </article>
            ))}
          </div>

          <h2 className="mt-5 text-[17px] font-extrabold text-[#1A2E23]">
            Frequently Asked Questions
          </h2>
          <div className="mt-2 space-y-2">
            {faqs.map(({ question, answer }, index) => {
              const expanded = open === index;
              return (
                <div key={question} className="overflow-hidden rounded-[16px] bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : index)}
                    aria-expanded={expanded}
                    className="flex min-h-[42px] w-full items-center justify-between gap-3 px-3 py-2 text-left"
                  >
                    <span className="text-[12px] font-bold text-[#1A2E23]">{question}</span>
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className={`shrink-0 text-[#0B3424] transition-transform ${expanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expanded ? (
                    <p className="px-4 pb-3 text-[10px] leading-snug text-slate-600">{answer}</p>
                  ) : null}
                </div>
              );
            })}
          </div>

          <p className="mt-5 rounded-[14px] bg-[#F7F3F1] p-4 text-center text-[11px] leading-relaxed text-[#6b514a]">
            For medical or campus security emergencies, contact the nearest volunteer in a green vest
            immediately.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
