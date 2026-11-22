'use client';

import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';

export function AppShell({
  children,
  showNav = true,
  showBottomNav = false,
}: {
  children: ReactNode;
  showNav?: boolean;
  showBottomNav?: boolean;
}) {
  return (
    <main className="app-backdrop">
      <div className="app-shell">
        {showNav ? <SideNav /> : null}
        <div className="phone-frame">
          <div className="phone-scroll" id="main-content">{children}</div>
          {showBottomNav ? <BottomNav /> : null}
        </div>
      </div>
    </main>
  );
}
