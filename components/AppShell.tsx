'use client';

import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

export function AppShell({
  children,
  showNav = true,
}: {
  children: ReactNode;
  showNav?: boolean;
}) {
  return (
    <main className="app-backdrop">
      <div className="phone-frame">
        <div className="phone-scroll">{children}</div>
        {showNav ? <BottomNav /> : null}
      </div>
    </main>
  );
}
