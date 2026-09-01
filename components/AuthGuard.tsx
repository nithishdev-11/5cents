'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isPublic = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/offline');
    if (isPublic) {
      const timer = setTimeout(() => setChecking(false), 0);
      return () => clearTimeout(timer);
    }

    const session = getSession();
    if (!session) {
      router.replace('/login');
    } else {
      const timer = setTimeout(() => setChecking(false), 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0e14] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-4 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
        <p className="font-mono text-cyan-400 text-xs tracking-widest uppercase animate-pulse">
          INITIALIZING SECURE SESSION...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
