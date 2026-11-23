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
  RotateCcw,
  SlidersHorizontal,
  Volume2,
} from '@/components/icons';
import type { AppIcon } from '@/components/icons';
import { AppShell } from '@/components/AppShell';
import { usePrototype } from '@/lib/prototype-store';

type InstallPrompt = Event & { prompt: () => Promise<void> };
type ConfirmAction = 'signout' | 'reset';
type ToggleKey = 'notifications' | 'sound' | 'compact';

const focusOnLight =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15532E]';

const groupCard = 'overflow-hidden rounded-[15px] border border-[#dce7e0] bg-white';
const rowBase =
  'flex min-h-[48px] w-full items-center gap-[9px] px-[12px] py-[9px] text-left';
const rowLabel = 'text-[11px] font-[650] leading-tight text-[#275b3f]';
const rowHint = 'text-[8px] leading-tight text-[#87948d]';
const rowIcon =
  'grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[11px] bg-[#eaf7ef] text-[#187b4b]';
const rowChevron = 'shrink-0 text-[#84918b]';

const settingsRows: { key: ToggleKey; label: string; hint: string; icon: AppIcon }[] = [
  { key: 'notifications', label: 'Notifications', hint: 'Festival updates & alerts', icon: Bell },
  { key: 'sound', label: 'Sound alerts', hint: 'Play a tone for new activity', icon: Volume2 },
  { key: 'compact', label: 'Compact layout', hint: 'Show more on each screen', icon: SlidersHorizontal },
];

export default function ProfilePage() {
  const router = useRouter();
  const { session, guestMode, resetPrototype, setGuestMode } = usePrototype();
  const [message, setMessage] = useState('');
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
      <div className="min-h-full bg-[#f3f8f5] px-[15px] pb-[35px] pt-[8px]">
        <section
          className="-mx-[15px] -mt-px mb-[9px] flex min-h-[181px] flex-col items-center justify-center rounded-b-[30px] px-[10px] pb-[17px] pt-[22px]"
          style={{ background: 'linear-gradient(112deg,#eff9f2,#fffced)' }}
        >
          <h1 className="sr-only">Profile</h1>
          <div className="grid h-[72px] w-[72px] place-items-center rounded-full border-4 border-white bg-[#155d3d] text-[23px] font-[760] leading-none text-[#f2d633] shadow-[0_1px_2px_rgba(20,90,54,0.1)]">
            {initials || 'G'}
          </div>
          <h2 className="mb-[8px] mt-[12px] text-center text-[19px] font-[750] tracking-[-0.5px] text-[#14583a]">
            {session.name}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-[7px]">
            <span className="rounded-[20px] border border-[#c9e3d2] bg-[#e3f3e8] px-[12px] py-[6px] text-[9px] font-[650] leading-none text-[#247747]">
              Jamia No. {session.jamiaId}
            </span>
            {guestMode ? (
              <span className="rounded-[20px] border border-[#c9e3d2] bg-white px-[12px] py-[6px] text-[9px] font-[650] leading-none text-[#6b7b72]">
                Guest preview
              </span>
            ) : null}
          </div>
        </section>

        <div className="mb-[7px] mt-[12px] flex items-center justify-between gap-[9px] px-[2px]">
          <h3 className="text-[8px] font-[740] tracking-[1.4px] text-[#82938a]">YOUR DETAILS</h3>
        </div>

        <section className={groupCard} aria-label="Your details">
          <div className={`${rowBase} text-[11px]`}>
            <span className="font-[650] text-[#275b3f]">Jamia ID</span>
            <span className="ml-auto min-w-0 truncate text-[#83918a]">{session.jamiaId}</span>
          </div>
          <div className={`${rowBase} border-t border-[#e4ece7] text-[11px]`}>
            <span className="font-[650] text-[#275b3f]">Campus</span>
            <span className="ml-auto min-w-0 truncate capitalize text-[#83918a]">{session.campus}</span>
          </div>
        </section>

        <section className={`${groupCard} mt-[12px]`} aria-label="Account menu">
          <Link
            href="/wallet"
            className={`${rowBase} border-b border-[#e4ece7] transition-colors hover:bg-[#f7faf8] ${focusOnLight}`}
          >
            <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[11px] bg-[#fdf6d4] text-[#1c7447]">
              <Coins size={18} aria-hidden="true" />
            </span>
            <span className={`${rowLabel} min-w-0 flex-1`}>Glocal Points</span>
            <span className="shrink-0 text-[11px] font-[700] text-[#247747]">{session.points} GP</span>
            <ChevronRight size={16} className={rowChevron} aria-hidden="true" />
          </Link>

          <Link
            href="/notifications"
            className={`${rowBase} border-b border-[#e4ece7] transition-colors hover:bg-[#f7faf8] ${focusOnLight}`}
          >
            <span className={rowIcon}>
              <Bell size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-[650] leading-tight text-[#275b3f]">Notifications</span>
              <span className={`mt-[3px] block ${rowHint}`}>Push notifications</span>
            </span>
            <ChevronRight size={16} className={rowChevron} aria-hidden="true" />
          </Link>

          <Link
            href="/support"
            className={`${rowBase} border-b border-[#e4ece7] transition-colors hover:bg-[#f7faf8] ${focusOnLight}`}
          >
            <span className={rowIcon}>
              <LifeBuoy size={18} aria-hidden="true" />
            </span>
            <span className={`${rowLabel} min-w-0 flex-1`}>Help &amp; support</span>
            <ChevronRight size={16} className={rowChevron} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => void install()}
            className={`${rowBase} transition-colors hover:bg-[#f7faf8] ${focusOnLight}`}
          >
            <span className={rowIcon}>
              <Download size={18} aria-hidden="true" />
            </span>
            <span className={`${rowLabel} min-w-0 flex-1`}>Install app</span>
            <ChevronRight size={16} className={rowChevron} aria-hidden="true" />
          </button>
        </section>

        <section className={`${groupCard} mt-[12px]`} aria-label="Settings">
          <h3 className="border-b border-[#e4ece7] px-[12px] pb-[7px] pt-[12px] text-[8px] font-[740] tracking-[1.4px] text-[#82938a]">
            SETTINGS
          </h3>
          {settingsRows.map((row, index) => {
            const Icon = row.icon;
            const on = settings[row.key];
            return (
              <div
                key={row.key}
                className={`${rowBase} ${
                  index < settingsRows.length - 1 ? 'border-b border-[#e4ece7]' : ''
                }`}
              >
                <span className={rowIcon}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-[650] leading-tight text-[#275b3f]">{row.label}</span>
                  <span className={`mt-[3px] block ${rowHint}`}>{row.hint}</span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={row.label}
                  onClick={() => toggleSetting(row.key)}
                  className={`relative ml-auto inline-flex h-[18px] w-[32px] shrink-0 items-center rounded-[12px] transition-colors duration-[180ms] ${focusOnLight} ${
                    on ? 'bg-[#16824c]' : 'bg-[#c7d1ca]'
                  }`}
                >
                  <span
                    className={`absolute left-[1px] h-[16px] w-[16px] rounded-full bg-white shadow-[0_1px_3px_rgba(25,42,31,0.25)] transition-transform duration-[180ms] ${
                      on ? 'translate-x-[14px]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            );
          })}
        </section>

        <section className={`${groupCard} mt-[12px]`} aria-label="Demo controls">
          <button
            type="button"
            onClick={() => setConfirm('reset')}
            className={`${rowBase} transition-colors hover:bg-[#fff0ef]`}
          >
            <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[11px] bg-[#fff0ef] text-[#c44a4a]">
              <RotateCcw size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-[650] leading-tight text-[#c34c4c]">Reset demo data</span>
              <span className={`mt-[3px] block ${rowHint}`}>
                Restore points, cart, program and notifications
              </span>
            </span>
            <ChevronRight size={16} className={rowChevron} aria-hidden="true" />
          </button>
        </section>

        {message ? (
          <p
            role="status"
            className="mt-[12px] rounded-[12px] border border-[#c9e3d2] bg-[#e3f3e8] px-[12px] py-[10px] text-[10px] font-[650] leading-relaxed text-[#247747]"
          >
            {message}
          </p>
        ) : null}

        <div className="mt-[2px]">
          <button
            type="button"
            onClick={() => setConfirm('signout')}
            className={`${rowBase} rounded-[15px] border border-[#dce7e0] bg-white text-[#c34c4c] transition-colors hover:bg-[#fff0ef] ${focusOnLight}`}
          >
            <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[11px] bg-[#fff0ef] text-[#c44a4a]">
              <LogOut size={17} aria-hidden="true" />
            </span>
            <span className="text-[11px] font-[650] leading-tight text-[#c34c4c]">Sign out</span>
            <ChevronRight size={16} className={`${rowChevron} ml-auto`} aria-hidden="true" />
          </button>
        </div>

        <footer className="mb-0 mt-[18px] text-center text-[10px] text-[#98a29c]">
          Rendezvous 26
        </footer>
      </div>

      {confirm ? (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          style={{ background: 'rgba(7, 33, 21, 0.42)' }}
        >
          <div
            className="modal-card animate-rise text-center"
            style={{
              width: 'min(100%, 365px)',
              maxWidth: '365px',
              borderRadius: '22px',
              border: '1px solid #e0ebe3',
              background: '#fff',
              padding: '22px 18px 17px',
              boxShadow: '0 16px 50px rgba(3, 38, 21, 0.24)',
            }}
          >
            <span className="mx-auto grid h-[45px] w-[45px] place-items-center rounded-[15px] bg-[#e9f5ed] text-[#177c4a]">
              <CircleAlert size={26} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <h2 id="confirm-title" className="mt-[10px] text-[16px] font-[750] text-[#1b593b]">
              {confirm === 'signout' ? 'Sign out of Rendezvous?' : 'Reset demo data?'}
            </h2>
            <p className="mx-auto mb-[15px] mt-[8px] max-w-[290px] text-[10px] leading-relaxed text-[#819087]">
              {confirm === 'signout'
                ? 'You will be returned to the welcome screen. Your profile stays on this device in the demo.'
                : 'Your points, cart, program and notifications will return to their starting state.'}
            </p>
            <div className="flex justify-center gap-[8px]">
              <button
                type="button"
                onClick={() => setConfirm(null)}
                className={`min-h-[37px] flex-1 rounded-[12px] border border-[#dce8e0] bg-white px-4 text-[10px] font-[700] text-[#31583f] ${focusOnLight}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={runConfirmedAction}
                className={`min-h-[37px] flex-[1.2] rounded-[12px] px-4 text-[10px] font-[700] text-white transition-colors ${focusOnLight} ${
                  confirm === 'signout'
                    ? 'bg-[#c34c4c] hover:bg-[#a83c3c]'
                    : 'bg-[#16824c] hover:bg-[#0f6a3e]'
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
