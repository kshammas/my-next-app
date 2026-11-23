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

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="ar-muted-caption">{unread} unread</p>
          <div className="flex items-center gap-[6px]">
            <button
              type="button"
              onClick={markAllNotificationsRead}
              disabled={unread === 0}
              className={`flex min-h-[29px] items-center gap-[6px] rounded-full border border-[#DCE8E0] bg-white px-3 text-[9px] font-[650] text-[#1A7447] disabled:opacity-50 ${focusOnLight}`}
            >
              <CheckCheck size={13} aria-hidden="true" /> Mark all read
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              disabled={notifications.length === 0}
              aria-label="Clear all notifications"
              className={`grid h-9 w-9 place-items-center rounded-full border border-[#DCE8E0] bg-white text-[#B64235] disabled:opacity-50 ${focusOnLight}`}
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="my-3 flex gap-[6px] overflow-x-auto pb-1" aria-hidden="true">
          {['All', 'Important', 'Schedule', 'Live update'].map((chip, index) => (
            <span
              key={chip}
              className={`shrink-0 rounded-full border px-3 py-[6px] text-[9px] font-[650] ${
                index === 0
                  ? 'border-[#158452] bg-[#16824F] text-white'
                  : 'border-[#DCE8E0] bg-white text-[#74857A]'
              }`}
            >
              {chip}
            </span>
          ))}
        </div>

        {notifications.length === 0 ? (
          <div className="ar-card mt-3 flex flex-col items-center px-6 py-12 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF7EF] text-[#187B4B]">
              <Bell size={22} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-[12px] font-[730] text-[#14241D]">
              You&apos;re all caught up
            </h2>
            <p className="mx-auto mt-[6px] max-w-[260px] text-[10px] leading-[1.6] text-[#85928B]">
              New updates will appear here as the festival goes on.
            </p>
          </div>
        ) : (
          <div className="mt-2 grid gap-[8px]">
            {notifications.map((item) => (
              <article
                key={item.id}
                className={`overflow-hidden rounded-[15px] border ${
                  item.read ? 'border-[#E0E9E3] bg-white' : 'border-[#CCE2D3] bg-[#F8FCF9]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => openDetail(item)}
                  className={`relative flex w-full items-start gap-[9px] p-[11px] text-left ${focusOnLight}`}
                  aria-label={`Open notification: ${item.title}`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-[#EAF5ED] text-[#187D4A]">
                    <Bell size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold leading-[1.35] text-[#2A4634]">
                        {item.title}
                      </span>
                      <span className="shrink-0 text-[8px] text-[#9AA49E]">{item.time}</span>
                    </span>
                    <span className="mt-[5px] block text-[8.5px] leading-[1.5] text-[#849188]">
                      {item.body}
                    </span>
                    <span className="mt-[5px] inline-flex items-center gap-1 text-[8px] font-bold text-[#18804C]">
                      {categoryFor(item.id)}
                      <ChevronRight size={11} aria-hidden="true" />
                    </span>
                  </span>
                  {!item.read ? (
                    <i
                      aria-hidden="true"
                      className="pointer-events-none absolute right-[12px] top-[9px] h-[7px] w-[7px] rounded-full border border-white bg-[#D94539]"
                    />
                  ) : null}
                </button>
                {!item.read ? (
                  <div className="flex justify-end border-t border-[#E1EBE4] px-[11px] py-2">
                    <button
                      type="button"
                      onClick={() => markNotificationRead(item.id)}
                      className={`inline-flex min-h-[28px] items-center gap-1 rounded-full bg-[#EAF7EF] px-3 text-[8px] font-bold text-[#18804C] ${focusOnLight}`}
                    >
                      <Check size={11} aria-hidden="true" /> Mark as read
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
                <span className="inline-flex rounded-full bg-[#EAF7EF] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#187B4B]">
                  {categoryFor(detail.id)}
                </span>
                <h2 className="mt-3 text-[18px] font-extrabold leading-snug tracking-tight text-[#14241D]">
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
            <p className="mt-4 text-[12px] leading-relaxed text-[#61716A]">{detail.body}</p>
            <p className="mt-4 text-[10px] font-semibold text-[#93A098]">Received {detail.time}</p>
            <button
              type="button"
              onClick={() => setDetailId(null)}
              className={`mt-5 flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#16824F] text-[12px] font-bold text-white ${focusOnLight}`}
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
            <h2 className="text-[17px] font-extrabold text-[#14241D]">
              Clear all notifications?
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[#61716A]">
              This removes every update from your notification list.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className={`min-h-[44px] flex-1 rounded-full border border-[#DCE8E0] text-[11px] font-bold text-[#286B48] ${focusOnLight}`}
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
