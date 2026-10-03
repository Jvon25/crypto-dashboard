'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplitScreenCryptoTerminal from '@/app/page';

export default function RiskRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return <SplitScreenCryptoTerminal />;
}
