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
    <div className="page-header">
      <Link href={backHref} className="icon-button" aria-label="Go back">
        <ChevronLeft size={22} strokeWidth={2.6} />
      </Link>
      <h1 className="page-header-title">{title}</h1>
      <Link href="/notifications" className="icon-button relative" aria-label="Notifications">
        <Bell size={19} />
        {unread > 0 ? <span className="notification-dot" /> : null}
      </Link>
    </div>
  );
}
