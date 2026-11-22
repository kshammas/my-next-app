'use client';

import { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { demoNotifications } from '@/lib/demo-data';
import { apiSend, useApi } from '@/lib/use-api';
import type { AppNotification } from '@/lib/types';

export default function NotificationsPage() {
  const { data: notifications, setData } = useApi<AppNotification[]>(
    '/api/notifications',
    demoNotifications,
  );
  const [busy, setBusy] = useState(false);

  async function markAllRead() {
    setBusy(true);
    setData((previous) => previous.map((item) => ({ ...item, read: true })));
    try {
      await apiSend('/api/notifications', 'POST', {});
    } catch {
      // Keep the optimistic state and let the next load reconcile it.
    } finally {
      setBusy(false);
    }
  }

  const unread = notifications.filter((item) => !item.read).length;

  return (
    <AppShell>
      <div className="app-content">
        <PageHeader title="Notifications" unread={unread} />

        <div className="mt-5 flex items-center justify-between">
          <p className="text-[12px] text-slate-500">{unread} unread</p>
          <button
            onClick={() => void markAllRead()}
            disabled={busy || unread === 0}
            className="flex min-h-[44px] items-center gap-1.5 rounded-full bg-white px-4 text-[11px] font-bold text-[#064e24] disabled:opacity-50"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        </div>

        <div className="grid-list mt-3">
          {notifications.map((item) => (
            <article
              key={item.id}
              className={`soft-card flex gap-3 p-4 ${item.read ? 'opacity-70' : 'border-l-4 border-l-[#f7e305]'}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e7f4ea]">
                <Bell size={17} className="text-[#0a7a33]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-extrabold text-[#073b1d]">{item.title}</p>
                  <span className="shrink-0 text-[10px] text-slate-400">{item.time}</span>
                </div>
                <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
