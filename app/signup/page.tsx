'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setSession } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSession(email);
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-[#0a0e14] text-[#dce2f5] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Hologram grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(34,211,238,0.15) 0%, transparent 60%), linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 24px 24px, 24px 24px'
        }}
      />

      <div className="w-full max-w-md glass-panel-accent rounded-2xl p-6 md:p-8 relative z-10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        {/* Header Icon */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 rounded-full bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <span className="material-symbols-outlined text-3xl">shield_person</span>
          </div>
          <h1 className="font-sora text-2xl font-bold tracking-tight text-white mb-1">
            5 CENTS <span className="text-cyan-400 text-xs font-mono tracking-widest block font-normal">OPERATIVE REGISTRATION</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wider">CREATE INTELLIGENCE CREDENTIALS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-cyan-300 uppercase tracking-wider mb-1.5">
              OPERATIVE EMAIL
            </label>
            <input
              type="email"
              required
              placeholder="operator@apex.intel"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#151c29] border border-cyan-400/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono placeholder-slate-600 transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-cyan-300 uppercase tracking-wider mb-1.5">
              SECURITY KEY / PASSWORD
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#151c29] border border-cyan-400/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono placeholder-slate-600 transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-cyan-300 uppercase tracking-wider mb-1.5">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#151c29] border border-cyan-400/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono placeholder-slate-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-sora font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>REGISTER TERMINAL</span>
            <span className="material-symbols-outlined text-sm">how_to_reg</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-cyan-400/10 text-center">
          <p className="text-xs text-slate-400 font-mono">
            EXISTING OPERATIVE?{' '}
            <Link href="/login" className="text-cyan-400 hover:underline font-semibold ml-1">
              LOG IN
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
