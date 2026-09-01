'use client';

import { getSession, clearSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Fingerprint, RefreshCw, LogOut } from 'lucide-react';

interface TopNavHeaderProps {
  onRefresh?: () => void;
  isSyncing?: boolean;
}

export default function TopNavHeader({ onRefresh, isSyncing }: TopNavHeaderProps) {
  const router = useRouter();
  const [userEmail] = useState<string | null>(() => getSession()?.email || null);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0c1320]/80 backdrop-blur-xl border-b border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] flex justify-between items-center px-4 md:px-8 z-50">
      <div className="flex items-center gap-3">
        <Fingerprint className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        <div className="flex flex-col">
          <span className="font-sora font-bold text-lg text-white tracking-tight leading-none flex items-center gap-1.5">
            5 CENTS
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 font-normal uppercase">
              India
            </span>
          </span>
          <span className="text-[9px] font-mono text-slate-400 tracking-wider">NSE/BSE INTELLIGENCE</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {userEmail && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-slate-900/60 border border-slate-700 text-xs font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate max-w-[140px]">{userEmail}</span>
          </div>
        )}

        <button
          onClick={onRefresh}
          title="Refresh Data"
          className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-900/40 hover:text-white transition-all active:scale-95"
        >
          <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all active:scale-95 flex items-center gap-1 text-xs font-mono"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">EXIT</span>
        </button>
      </div>
    </header>
  );
}
