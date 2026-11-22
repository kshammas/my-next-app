'use client';

import Link from 'next/link';
import { Bell, ChevronLeft } from 'lucide-react';

export function PageHeader({
  title,
  backHref = '/home',
  unread = 0,
}: {
  title: string;
  backHref?: string;
  unread?: number;
}) {
  return (
    <header className="page-header">
      <Link href={backHref} className="icon-button" aria-label="Go back">
        <ChevronLeft size={22} strokeWidth={2.6} aria-hidden="true" />
      </Link>
      <h1 className="page-header-title">{title}</h1>
      <Link
        href="/notifications"
        className="icon-button relative"
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
      >
        <Bell size={19} aria-hidden="true" />
        {unread > 0 ? <span className="notification-dot" aria-hidden="true" /> : null}
      </Link>
    </header>
  );
}
