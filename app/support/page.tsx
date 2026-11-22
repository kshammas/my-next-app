'use client';

import { LifeBuoy, Mail, MessageCircle, Phone } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';

const contacts = [
  { label: 'Chat on WhatsApp', detail: 'Fastest response during the fest', icon: MessageCircle, href: 'https://wa.me/919947021164' },
  { label: 'Email the team', detail: 'rendezvous@jamiamadeenathunoor.edu', icon: Mail, href: 'mailto:rendezvous@jamiamadeenathunoor.edu' },
  { label: 'Call the helpdesk', detail: 'On-site assistance', icon: Phone, href: 'tel:+919947021164' },
];

export default function SupportPage() {
  return (
    <AppShell>
      <div className="app-content">
        <PageHeader title="Support" />

        <div className="mt-5 flex items-center gap-3 rounded-[24px] bg-[#064e24] p-5 text-white">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <LifeBuoy size={24} />
          </div>
          <div>
            <h2 className="text-[17px] font-extrabold">Need help?</h2>
            <p className="text-[12px] text-white/75">We&apos;re here for you throughout Rendezvous 26.</p>
          </div>
        </div>

        <h2 className="section-title mt-6">Reach us</h2>
        <div className="grid-list mt-3">
          {contacts.map(({ label, detail, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="soft-card flex min-h-[64px] items-center gap-3 p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7f4ea] text-[#0a7a33]">
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-extrabold text-[#073b1d]">{label}</span>
                <span className="block truncate text-[11px] text-slate-500">{detail}</span>
              </span>
            </a>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-400">
          Rendezvous 26 · Jamia Madeenathunoor Life Festival
        </p>
      </div>
    </AppShell>
  );
}
