'use client';

import type { ReactNode } from 'react';
import { SideNav } from './SideNav';

export function AppShell({
  children,
  showNav = true,
}: {
  children: ReactNode;
  showNav?: boolean;
}) {
  return (
    <main className="app-backdrop">
      <div className="app-shell">
        {showNav ? <SideNav /> : null}
        <div className="phone-frame">
          <div className="phone-scroll" id="main-content">{children}</div>
        </div>
      </div>
    </main>
  );
}
