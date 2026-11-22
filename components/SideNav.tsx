'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="side-nav" aria-label="Primary navigation">
      <div className="side-nav-brand">
        <span className="side-nav-brand-mark" aria-hidden="true">R</span>
        <div>
          <p className="side-nav-brand-name">Rendezvous 26</p>
          <p className="side-nav-brand-sub">Life Fest · Jamia</p>
        </div>
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
