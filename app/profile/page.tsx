'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronRight,
  CircleAlert,
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

const settingsRows: { key: ToggleKey; label: string; hint: string; icon: AppIcon }[] = [
  { key: 'notifications', label: 'Notifications', hint: 'Festival updates and alerts', icon: Bell },
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

  return (
    <AppShell showBottomNav>
      <div className="profile-page min-h-full px-[15px] pb-[34px] pt-[8px]">
        <h1 className="sr-only">Profile</h1>

        <section className="profile-identity" aria-label="Your profile">
          <div className="profile-identity-inner">
            <span className="profile-avatar">
              <Image src="/rendezvous-logo.png" alt="Rendezvous 26" width={64} height={64} priority />
            </span>
            <div className="min-w-0">
              <p className="profile-eyebrow">Participant</p>
              <p className="profile-name">{session.name}</p>
              <p className="profile-id">Jamia No. {session.jamiaId}</p>
            </div>
          </div>
          {guestMode ? <span className="profile-guest-badge">Guest preview</span> : null}
        </section>

        <Link href="/wallet" className={`profile-points-card ${focusOnLight}`}>
          <span>
            <span className="profile-points-label">Glocal Points</span>
            <span className="profile-points-value">
              {session.points}
              <span>GP</span>
            </span>
            <span className="profile-points-note">Redeem for festival treats</span>
          </span>
          <span className="profile-points-action">
            Open wallet <ChevronRight size={14} aria-hidden="true" />
          </span>
        </Link>

        <div className="profile-grid">
          <div>
            <section aria-label="Your details">
              <h2 className="profile-section-title">Your details</h2>
              <div className="profile-card">
                <div className="profile-row profile-detail">
                  <span className="profile-detail-label">Jamia ID</span>
                  <span className="profile-detail-value">{session.jamiaId}</span>
                </div>
                <div className="profile-row profile-detail">
                  <span className="profile-detail-label">Campus</span>
                  <span className="profile-detail-value capitalize">{session.campus}</span>
                </div>
              </div>
            </section>

            <section className="mt-[20px]" aria-label="Account">
              <h2 className="profile-section-title">Account</h2>
              <div className="profile-card">
                <Link href="/notifications" className={`profile-row ${focusOnLight}`}>
                  <span className="profile-row-tile">
                    <Bell size={20} aria-hidden="true" />
                  </span>
                  <span className="profile-row-copy">
                    <span className="profile-row-label">Notifications</span>
                    <span className="profile-row-hint">Festival updates and alerts</span>
                  </span>
                  <ChevronRight size={17} className="profile-chevron" aria-hidden="true" />
                </Link>

                <Link href="/support" className={`profile-row ${focusOnLight}`}>
                  <span className="profile-row-tile">
                    <LifeBuoy size={20} aria-hidden="true" />
                  </span>
                  <span className="profile-row-copy">
                    <span className="profile-row-label">Help and support</span>
                    <span className="profile-row-hint">Get help during the fest</span>
                  </span>
                  <ChevronRight size={17} className="profile-chevron" aria-hidden="true" />
                </Link>

                <button type="button" onClick={() => void install()} className={`profile-row ${focusOnLight}`}>
                  <span className="profile-row-tile">
                    <Download size={20} aria-hidden="true" />
                  </span>
                  <span className="profile-row-copy">
                    <span className="profile-row-label">Install app</span>
                    <span className="profile-row-hint">Add Rendezvous to your home screen</span>
                  </span>
                  <ChevronRight size={17} className="profile-chevron" aria-hidden="true" />
                </button>
              </div>
            </section>
          </div>

          <div>
            <section aria-label="Preferences">
              <h2 className="profile-section-title">Preferences</h2>
              <div className="profile-card">
                {settingsRows.map((row) => {
                  const Icon = row.icon;
                  const on = settings[row.key];
                  return (
                    <div
                      key={row.key}
                      className="profile-row"
                    >
                      <span className="profile-row-tile">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <span className="profile-row-copy">
                        <span className="profile-row-label">{row.label}</span>
                        <span className="profile-row-hint">{row.hint}</span>
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        aria-label={row.label}
                        onClick={() => toggleSetting(row.key)}
                        className={`profile-toggle ${focusOnLight}`}
                      >
                        <span aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-[20px]" aria-label="Demo controls">
              <h2 className="profile-section-title">Demo controls</h2>
              <div className="profile-card">
                <button type="button" onClick={() => setConfirm('reset')} className={`profile-row ${focusOnLight}`}>
                  <span className="profile-row-tile profile-row-tile-yellow">
                    <RotateCcw size={20} aria-hidden="true" />
                  </span>
                  <span className="profile-row-copy">
                    <span className="profile-row-label">Reset demo data</span>
                    <span className="profile-row-hint">Restore points, cart, programs and alerts</span>
                  </span>
                  <ChevronRight size={17} className="profile-chevron" aria-hidden="true" />
                </button>

                <button type="button" onClick={() => setConfirm('signout')} className={`profile-row ${focusOnLight}`}>
                  <span className="profile-row-tile profile-row-tile-red">
                    <LogOut size={19} aria-hidden="true" />
                  </span>
                  <span className="profile-row-copy">
                    <span className="profile-row-label">Sign out</span>
                    <span className="profile-row-hint">Return to the welcome screen</span>
                  </span>
                  <ChevronRight size={17} className="profile-chevron" aria-hidden="true" />
                </button>
              </div>
            </section>
          </div>
        </div>

        {message ? (
          <p role="status" className="profile-note">
            {message}
          </p>
        ) : null}

        <footer className="profile-footer">Rendezvous 26</footer>
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
