'use client';

import Link from 'next/link';

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0e14] text-[#dce2f5] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Hologram scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,180,171,0.15) 0%, transparent 60%), repeating-linear-gradient(0deg, rgba(255,180,171,0.05), rgba(255,180,171,0.05) 1px, transparent 1px, transparent 4px)',
        }}
      />

      <div className="max-w-md glass-panel rounded-2xl p-8 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative z-10">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-4 pulse-critical">
          <span className="material-symbols-outlined text-3xl">wifi_off</span>
        </div>

        <h1 className="font-sora text-2xl font-bold text-white mb-2">OFFLINE MODE</h1>
        <p className="font-mono text-amber-400 text-xs tracking-wider uppercase mb-4">
          NETWORK CONNECTION SEVERED
        </p>
        
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          You&apos;re offline — showing last synced financial intelligence data from your IndexedDB vault.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-sora font-semibold py-2.5 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            RETRY CONNECTION
          </button>
          
          <Link
            href="/dashboard"
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-sora font-medium py-2.5 px-4 rounded-lg border border-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            VAULT DATA
          </Link>
        </div>
      </div>
    </main>
  );
}
