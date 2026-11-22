'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="bottom-nav-item"
            aria-current={active ? 'page' : undefined}
          >
            <span className={`bottom-nav-icon ${active ? 'bottom-nav-icon-active' : ''}`}>
              <Icon
                size={24}
                fill={active && label === 'Home' ? 'currentColor' : 'none'}
                strokeWidth={active ? 2.6 : 2}
                aria-hidden="true"
              />
            </span>
            <span className={`bottom-nav-label ${active ? 'bottom-nav-label-active' : ''}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
