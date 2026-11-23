'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronRight,
  CircleAlert,
  Coins,
  Download,
  LifeBuoy,
  LogOut,
  PencilLine,
  RotateCcw,
  SlidersHorizontal,
  Volume2,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { usePrototype } from '@/lib/prototype-store';

type InstallPrompt = Event & { prompt: () => Promise<void> };
type ConfirmAction = 'signout' | 'reset';
type ToggleKey = 'notifications' | 'sound' | 'compact';

const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15532E]';

const settingsRows: { key: ToggleKey; label: string; hint: string; icon: LucideIcon }[] = [
  { key: 'notifications', label: 'Notifications', hint: 'Festival updates & alerts', icon: Bell },
  { key: 'sound', label: 'Sound alerts', hint: 'Play a tone for new activity', icon: Volume2 },
  { key: 'compact', label: 'Compact layout', hint: 'Show more on each screen', icon: SlidersHorizontal },
];

export default function ProfilePage() {
  const router = useRouter();
  const { session, guestMode, updateProfile, resetPrototype, setGuestMode } = usePrototype();
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: '', jamiaId: '', campus: '' });
  const [settings, setSettings] = useState<Record<ToggleKey, boolean>>({
    notifications: true,
    sound: true,
    compact: false,
  });
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);

  async function install() {
    const prompt = (window as unknown as { hr26InstallPrompt?: InstallPrompt }).hr26InstallPrompt;
    if (prompt) {
      await prompt.prompt();
      (window as unknown as { hr26InstallPrompt?: InstallPrompt }).hr26InstallPrompt = undefined;
      return;
    }
    setMessage('Use your browser menu → “Install app” / “Add to Home Screen”.');
  }

  function openEdit() {
    setDraft({ name: session.name, jamiaId: session.jamiaId, campus: session.campus });
    setEditing(true);
  }

  function saveEdit() {
    updateProfile({
      name: draft.name.trim() || session.name,
      jamiaId: draft.jamiaId.trim() || session.jamiaId,
      campus: draft.campus.trim() || session.campus,
    });
    setEditing(false);
    setMessage('Your profile has been updated.');
  }

  function toggleSetting(key: ToggleKey) {
    setSettings((previous) => ({ ...previous, [key]: !previous[key] }));
  }

  function runConfirmedAction() {
    if (confirm === 'signout') {
      setGuestMode(true);
      setConfirm(null);
      router.push('/welcome');
      return;
    }
    if (confirm === 'reset') {
      resetPrototype();
      setSettings({ notifications: true, sound: true, compact: false });
      setConfirm(null);
      setMessage('Demo data has been reset.');
    }
  }

  const initials = session.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <AppShell showBottomNav>
      <div className="min-h-full bg-[#F5FAF6] pb-6 pt-[max(32px,env(safe-area-inset-top))]">
        <section className="px-4 pb-1 text-center">
          <h1 className="sr-only">Profile</h1>
          <div className="relative mx-auto w-fit">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#FDF6D4] bg-[#15532E] text-[24px] font-extrabold text-[#EECE2D] shadow-sm">
              {initials || 'G'}
            </div>
            <button
              type="button"
              onClick={openEdit}
              aria-label="Edit profile"
              className={`absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#FDF6D4] text-[#15532E] shadow-sm transition-colors hover:bg-[#F3E6A8] ${focusOnLight}`}
            >
              <PencilLine size={16} aria-hidden="true" />
            </button>
          </div>
          <h2 className="mt-3 text-[19px] font-extrabold text-[#15532E]">{session.name}</h2>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-block rounded-full bg-[#FDF6D4] px-3.5 py-1 text-[11px] font-bold text-[#15532E]">
              Jamia No. {session.jamiaId}
            </span>
            {guestMode ? (
              <span className="inline-block rounded-full bg-white px-3.5 py-1 text-[10px] font-bold text-[#6B7B72] shadow-sm">
                Guest preview
              </span>
            ) : null}
          </div>
        </section>

        <section className="mx-4 mt-5 rounded-[22px] bg-white p-4 shadow-sm" aria-label="Your details">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[10px] font-extrabold tracking-[0.14em] text-[#8FA79A]">
              YOUR DETAILS
            </h3>
            <button
              type="button"
              onClick={openEdit}
              className={`flex min-h-[36px] items-center gap-1.5 rounded-full bg-[#EAF4ED] px-3 text-[10px] font-extrabold text-[#15532E] ${focusOnLight}`}
            >
              <PencilLine size={13} aria-hidden="true" /> Edit
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-b border-[#13512C]/10 pb-3 text-[13px]">
            <span className="font-bold text-[#15532E]">Jamia ID</span>
            <span className="text-[#6B7B72]">{session.jamiaId}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-[13px]">
            <span className="font-bold text-[#15532E]">Campus</span>
            <span className="capitalize text-[#6B7B72]">{session.campus}</span>
          </div>
        </section>

        <section className="mx-4 mt-4 overflow-hidden rounded-[22px] bg-white shadow-sm" aria-label="Account menu">
          <Link
            href="/wallet"
            className={`flex min-h-[56px] items-center gap-3 border-b border-[#13512C]/10 px-4 py-3 transition-colors hover:bg-[#F5FAF6] ${focusOnLight}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FDF6D4] text-[#15532E]">
              <Coins size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-[13px] font-bold text-[#15532E]">
              Glocal Points
            </span>
            <span className="text-[12px] font-extrabold text-[#15532E]">{session.points} GP</span>
            <ChevronRight size={16} className="shrink-0 text-[#8FA79A]" aria-hidden="true" />
          </Link>

          <Link
            href="/notifications"
            className={`flex min-h-[56px] items-center gap-3 border-b border-[#13512C]/10 px-4 py-3 transition-colors hover:bg-[#F5FAF6] ${focusOnLight}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#15532E]">
              <Bell size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-bold text-[#15532E]">Notifications</span>
              <span className="mt-0.5 block text-[11px] text-[#6B7B72]">Push notifications</span>
            </span>
            <ChevronRight size={16} className="shrink-0 text-[#8FA79A]" aria-hidden="true" />
          </Link>

          <Link
            href="/support"
            className={`flex min-h-[56px] items-center gap-3 border-b border-[#13512C]/10 px-4 py-3 transition-colors hover:bg-[#F5FAF6] ${focusOnLight}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#15532E]">
              <LifeBuoy size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-[13px] font-bold text-[#15532E]">
              Help &amp; support
            </span>
            <ChevronRight size={16} className="shrink-0 text-[#8FA79A]" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => void install()}
            className={`flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F5FAF6] ${focusOnLight}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#15532E]">
              <Download size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-[13px] font-bold text-[#15532E]">Install app</span>
            <ChevronRight size={16} className="shrink-0 text-[#8FA79A]" aria-hidden="true" />
          </button>
        </section>

        <section className="mx-4 mt-4 overflow-hidden rounded-[22px] bg-white shadow-sm" aria-label="Settings">
          <h3 className="border-b border-[#13512C]/10 px-4 pb-3 pt-4 text-[10px] font-extrabold tracking-[0.14em] text-[#8FA79A]">
            SETTINGS
          </h3>
          {settingsRows.map((row, index) => {
            const Icon = row.icon;
            const on = settings[row.key];
            return (
              <div
                key={row.key}
                className={`flex min-h-[64px] items-center gap-3 px-4 py-3 ${
                  index < settingsRows.length - 1 ? 'border-b border-[#13512C]/10' : ''
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#15532E]">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold text-[#15532E]">{row.label}</span>
                  <span className="mt-0.5 block text-[10px] text-[#6B7B72]">{row.hint}</span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={row.label}
                  onClick={() => toggleSetting(row.key)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${focusOnLight} ${
                    on ? 'bg-[#15532E]' : 'bg-[#D5E1D8]'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-[left] duration-200 ${
                      on ? 'left-6' : 'left-1'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            );
          })}
        </section>

        <section className="mx-4 mt-4 overflow-hidden rounded-[22px] bg-white shadow-sm" aria-label="Demo controls">
          <button
            type="button"
            onClick={() => setConfirm('reset')}
            className={`flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F5FAF6] ${focusOnLight}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FDF6D4] text-[#15532E]">
              <RotateCcw size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-bold text-[#15532E]">Reset demo data</span>
              <span className="mt-0.5 block text-[10px] text-[#6B7B72]">
                Restore points, cart, program and notifications
              </span>
            </span>
            <ChevronRight size={16} className="shrink-0 text-[#8FA79A]" aria-hidden="true" />
          </button>
        </section>

        {message ? (
          <p
            role="status"
            className="mx-4 mt-4 rounded-[14px] bg-[#E7F4EA] px-4 py-3 text-[11px] font-semibold leading-relaxed text-[#0A5C2E]"
          >
            {message}
          </p>
        ) : null}

        <div className="mx-4 mt-4">
          <button
            type="button"
            onClick={() => setConfirm('signout')}
            className={`flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[18px] bg-white p-4 text-[13px] font-bold text-[#B64235] shadow-sm transition-colors hover:bg-[#FDECEA] ${focusOnLight}`}
          >
            <LogOut size={17} aria-hidden="true" /> Sign out
          </button>
        </div>

        <footer className="pb-6 pt-8 text-center text-[11px] font-semibold text-[#15532E]/60">
          Rendezvous 26
        </footer>
      </div>

      {editing ? (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          onClick={() => setEditing(false)}
        >
          <div
            className="modal-card animate-rise relative"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setEditing(false)}
              aria-label="Close profile editor"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F5FAF6] text-[#15532E]"
            >
              <X size={17} aria-hidden="true" />
            </button>
            <h2 id="edit-profile-title" className="text-[18px] font-extrabold text-[#15532E]">
              Edit profile
            </h2>
            <p className="mt-1 text-[11px] text-[#6B7B72]">
              Update how your name and campus appear in the app.
            </p>
            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                saveEdit();
              }}
            >
              <label className="block">
                <span className="text-[10px] font-extrabold tracking-wide text-[#8FA79A]">NAME</span>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(event) => setDraft((previous) => ({ ...previous, name: event.target.value }))}
                  className={`mt-1 min-h-[46px] w-full rounded-[14px] border border-[#13512C]/15 bg-white px-3.5 text-[13px] font-semibold text-[#15532E] outline-none focus:border-[#15532E] ${focusOnLight}`}
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-extrabold tracking-wide text-[#8FA79A]">
                  JAMIA NUMBER
                </span>
                <input
                  type="text"
                  value={draft.jamiaId}
                  onChange={(event) => setDraft((previous) => ({ ...previous, jamiaId: event.target.value }))}
                  className={`mt-1 min-h-[46px] w-full rounded-[14px] border border-[#13512C]/15 bg-white px-3.5 text-[13px] font-semibold text-[#15532E] outline-none focus:border-[#15532E] ${focusOnLight}`}
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-extrabold tracking-wide text-[#8FA79A]">CAMPUS</span>
                <input
                  type="text"
                  value={draft.campus}
                  onChange={(event) => setDraft((previous) => ({ ...previous, campus: event.target.value }))}
                  className={`mt-1 min-h-[46px] w-full rounded-[14px] border border-[#13512C]/15 bg-white px-3.5 text-[13px] font-semibold text-[#15532E] outline-none focus:border-[#15532E] ${focusOnLight}`}
                />
              </label>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="min-h-[48px] flex-1 rounded-full border border-[#15532E]/15 bg-white px-4 text-[12px] font-bold text-[#15532E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`min-h-[48px] flex-[1.4] rounded-full bg-[#15532E] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#0E3D21] ${focusOnLight}`}
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {confirm ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="modal-card animate-rise text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FDF6D4] text-[#15532E]">
              <CircleAlert size={26} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <h2 id="confirm-title" className="mt-4 text-[18px] font-extrabold text-[#15532E]">
              {confirm === 'signout' ? 'Sign out of Rendezvous?' : 'Reset demo data?'}
            </h2>
            <p className="mt-1.5 text-[12px] leading-relaxed text-[#6B7B72]">
              {confirm === 'signout'
                ? 'You will be returned to the welcome screen. Your profile stays on this device in the demo.'
                : 'Your points, cart, program and notifications will return to their starting state.'}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirm(null)}
                className={`min-h-[48px] flex-1 rounded-full border border-[#15532E]/15 bg-white px-4 text-[12px] font-bold text-[#15532E] ${focusOnLight}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={runConfirmedAction}
                className={`min-h-[48px] flex-[1.2] rounded-full px-4 text-[12px] font-bold text-white transition-colors ${focusOnLight} ${
                  confirm === 'signout'
                    ? 'bg-[#B64235] hover:bg-[#9C352A]'
                    : 'bg-[#15532E] hover:bg-[#0E3D21]'
                }`}
              >
                {confirm === 'signout' ? 'Sign out' : 'Reset demo'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
