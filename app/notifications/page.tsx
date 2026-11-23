'use client';

import { useState } from 'react';
import { Bell, Check, CheckCheck, ChevronRight, Trash2, X } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { usePrototype } from '@/lib/prototype-store';
import type { AppNotification } from '@/lib/types';

const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#064e24]';

function categoryFor(id: string) {
  if (id === 'n-1') return 'Event';
  if (id === 'n-2') return 'Rewards';
  return 'Account';
}

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } =
    usePrototype();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const unread = notifications.filter((item) => !item.read).length;
  const detail = detailId
    ? notifications.find((item) => item.id === detailId) ?? null
    : null;

  function openDetail(item: AppNotification) {
    setDetailId(item.id);
    if (!item.read) markNotificationRead(item.id);
  }

  return (
    <AppShell>
      <div className="app-content">
        <PageHeader title="Notifications" unread={unread} />

        <div className="mt-5 flex items-center justify-between gap-2">
          <p className="text-[12px] text-slate-500">{unread} unread</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllNotificationsRead}
              disabled={unread === 0}
              className={`flex min-h-[44px] items-center gap-1.5 rounded-full bg-white px-4 text-[11px] font-bold text-[#064e24] disabled:opacity-50 ${focusOnLight}`}
            >
              <CheckCheck size={14} aria-hidden="true" /> Mark all read
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              disabled={notifications.length === 0}
              aria-label="Clear all notifications"
              className={`flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#B64235] disabled:opacity-50 ${focusOnLight}`}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="soft-card mt-3 flex flex-col items-center px-6 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF9F4] text-[#0a7a33]">
              <Bell size={26} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-[14px] font-extrabold text-[#073b1d]">
              You&apos;re all caught up
            </h2>
            <p className="mx-auto mt-2 max-w-[260px] text-[11px] leading-relaxed text-slate-500">
              New updates will appear here as the festival goes on.
            </p>
          </div>
        ) : (
          <div className="grid-list mt-3">
            {notifications.map((item) => (
              <article
                key={item.id}
                className={`soft-card overflow-hidden ${item.read ? 'opacity-70' : 'border-l-4 border-l-[#f7e305]'}`}
              >
                <button
                  type="button"
                  onClick={() => openDetail(item)}
                  className={`flex w-full gap-3 p-4 text-left ${focusOnLight}`}
                  aria-label={`Open notification: ${item.title}`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e7f4ea]">
                    <Bell size={17} className="text-[#0a7a33]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-[13px] font-extrabold text-[#073b1d]">{item.title}</span>
                      <span className="shrink-0 text-[10px] text-slate-400">{item.time}</span>
                    </span>
                    <span className="mt-1 block text-[11.5px] leading-relaxed text-slate-500">
                      {item.body}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#0a7a33]">
                      {categoryFor(item.id)}
                      <ChevronRight size={12} aria-hidden="true" />
                    </span>
                  </span>
                </button>
                {!item.read ? (
                  <div className="flex justify-end border-t border-[#064e24]/10 px-4 py-2">
                    <button
                      type="button"
                      onClick={() => markNotificationRead(item.id)}
                      className={`inline-flex min-h-[32px] items-center gap-1 rounded-full bg-[#e7f4ea] px-3 text-[10px] font-bold text-[#0a7a33] ${focusOnLight}`}
                    >
                      <Check size={12} aria-hidden="true" /> Mark as read
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>

      {detail ? (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Notification details"
        >
          <div className="modal-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-[#e7f4ea] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#0a7a33]">
                  {categoryFor(detail.id)}
                </span>
                <h2 className="mt-3 text-[18px] font-extrabold leading-snug tracking-tight text-[#073b1d]">
                  {detail.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailId(null)}
                className="icon-button"
                aria-label="Close notification details"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-slate-600">{detail.body}</p>
            <p className="mt-4 text-[10px] font-semibold text-slate-400">Received {detail.time}</p>
            <button
              type="button"
              onClick={() => setDetailId(null)}
              className={`mt-5 flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#064e24] text-[12px] font-bold text-white ${focusOnLight}`}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {confirmClear ? (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Clear all notifications"
        >
          <div className="modal-card">
            <h2 className="text-[17px] font-extrabold text-[#073b1d]">
              Clear all notifications?
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
              This removes every update from your notification list.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className={`min-h-[44px] flex-1 rounded-full border border-[#064e24]/15 text-[11px] font-bold text-[#064e24] ${focusOnLight}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearNotifications();
                  setConfirmClear(false);
                  setDetailId(null);
                }}
                className={`min-h-[44px] flex-1 rounded-full bg-[#B64235] text-[11px] font-bold text-white ${focusOnLight}`}
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
