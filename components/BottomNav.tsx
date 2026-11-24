'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const label = 'mobileLabel' in item ? item.mobileLabel : item.label;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${active ? 'bottom-nav-item-active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span className={`bottom-nav-icon ${active ? 'bottom-nav-icon-active' : ''}`}>
              <Icon
                size={20}
                fill={active && item.href === '/home' ? 'currentColor' : 'none'}
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
