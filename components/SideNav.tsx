'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="side-nav" aria-label="Primary navigation">
      <div className="side-nav-brand">
        <Image
          className="side-nav-brand-mark"
          src="/rendezvous-logo.png"
          alt="Rendezvous 26 logo"
          width={42}
          height={42}
        />
        <Image
          className="side-nav-brand-wordmark"
          src="/rend-logo-mobilesrc.png"
          alt="Rendezvous 26 — Jamia Madeenathunoor Life Festival"
          width={128}
          height={26}
        />
      </div>

      <div>
        <p className="side-nav-section">Explore</p>
        <nav className="side-nav-links">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`side-nav-link ${active ? 'side-nav-link-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <p className="side-nav-footer">Your fest, in your pocket.</p>
    </aside>
  );
}
