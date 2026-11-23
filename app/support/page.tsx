'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronLeft, Mail, MessageCircle, Phone } from '@/components/icons';
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
      <div className="ar-page">
        <header className="flex items-center gap-3 px-4 pb-3 pt-[max(17px,env(safe-area-inset-top))]">
          <Link href="/home" className="ar-icon-button" aria-label="Go back">
            <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <h1 className="ar-heading">Help &amp; Support</h1>
        </header>

        <div className="px-4 pb-10 pt-1">
          <section className="rounded-[16px] bg-[linear-gradient(115deg,#15593c,#0c452f)] p-4 shadow-[0_2px_8px_rgba(20,52,37,0.06)]">
            <h2 className="text-[14px] font-bold leading-snug text-white">Need help during Rendezvous?</h2>
            <p className="mt-1.5 text-[10px] leading-snug text-[#c1d8c9]">
              Reach out to our organizing committee or check quick answers below.
            </p>
          </section>

          <h2 className="mb-2.5 mt-5 text-[13px] font-[730] text-[#27563b]">Contact Us</h2>
          <div className="space-y-2">
            {contacts.map(({ label, detail, icon: Icon }) => (
              <article
                key={label}
                className="flex min-h-[62px] items-center gap-3 rounded-[15px] border border-[#dce7e0] bg-white px-3 py-2 shadow-[0_2px_8px_rgba(20,52,37,0.05)]"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[#eaf7ef] text-[#187b4b]">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-[680] text-[#27563d]">{label}</span>
                  <span className="block truncate text-[9px] text-[#83918a]">{detail}</span>
                </span>
                <span className="flex min-h-[30px] shrink-0 items-center rounded-full bg-[#eaf7ef] px-3.5 text-[9px] font-semibold text-[#187b4b]">
                  Connect
                </span>
              </article>
            ))}
          </div>

          <h2 className="mb-2.5 mt-6 text-[13px] font-[730] text-[#27563b]">
            Frequently Asked Questions
          </h2>
          <div className="overflow-hidden rounded-[15px] border border-[#dce7e0] bg-white shadow-[0_2px_8px_rgba(20,52,37,0.05)]">
            {faqs.map(({ question, answer }, index) => {
              const expanded = open === index;
              return (
                <div
                  key={question}
                  className={`${index > 0 ? 'border-t border-[#e5ece7] ' : ''}${expanded ? 'bg-[#eef8f1]' : 'bg-white'}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : index)}
                    aria-expanded={expanded}
                    className="flex min-h-[46px] w-full items-start justify-between gap-2.5 px-3 py-2.5 text-left"
                  >
                    <span className="text-[10px] font-[680] leading-snug text-[#315640]">{question}</span>
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className={`mt-0.5 shrink-0 text-[#187b4b] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expanded ? (
                    <p className="px-3 pb-3 text-[9px] leading-[1.55] text-[#61716a]">{answer}</p>
                  ) : null}
                </div>
              );
            })}
          </div>

          <p className="mt-6 border-t border-[#e5ece7] px-2 pt-4 text-center text-[9px] leading-relaxed text-[#9aa59e]">
            For medical or campus security emergencies, contact the nearest volunteer in a green vest
            immediately.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
