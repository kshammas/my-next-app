'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, User } from 'lucide-react';

const items = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/results', label: 'results', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} className="bottom-nav-item">
            <span className={`bottom-nav-icon ${active ? 'bottom-nav-icon-active' : ''}`}>
              <Icon size={24} fill={active && label === 'Home' ? 'currentColor' : 'none'} strokeWidth={active ? 2.6 : 2} />
            </span>
            <span className={`bottom-nav-label ${active ? 'bottom-nav-label-active' : ''}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
