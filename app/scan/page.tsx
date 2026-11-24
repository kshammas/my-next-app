'use client';

import { useRouter } from 'next/navigation';
import { QrScanner } from '@/components/QrScanner';
import { usePrototype } from '@/lib/prototype-store';

export default function ScanPage() {
  const router = useRouter();
  const { setGuestMode } = usePrototype();

  return (
    <QrScanner
      onClose={() => router.push('/welcome')}
      onResult={() => {
        setGuestMode(false);
        router.push('/onboarding');
      }}
    />
  );
}
