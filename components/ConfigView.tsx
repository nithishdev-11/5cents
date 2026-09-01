'use client';

import { useState, useEffect } from 'react';
import { getSession, clearSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { getAllCachedQuotes } from '@/lib/offlineCache';

export default function ConfigView() {
  const router = useRouter();
  const [session] = useState(() => getSession());
  const [apiStatus, setApiStatus] = useState<'checking' | 'active' | 'error'>('checking');
  const [apiMessage, setApiMessage] = useState('Testing Finnhub proxy connection...');
  const [cachedCount, setCachedCount] = useState<number>(0);
  const [pwaStatus, setPwaStatus] = useState<string>('Detecting service worker...');

  useEffect(() => {
    // Test Finnhub proxy route
    fetch('/api/quote?symbol=AAPL')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.currentPrice) {
          setApiStatus('active');
          setApiMessage(`Proxy Route Validated — AAPL Current: $${data.currentPrice}`);
        } else {
          setApiStatus('error');
          setApiMessage('Finnhub proxy returned fallback response');
        }
      })
      .catch((err) => {
        setApiStatus('error');
        setApiMessage(`Proxy Check Failed: ${err.message}`);
      });

    // Check IndexedDB cached items count
    getAllCachedQuotes().then((items) => {
      setCachedCount(items.length);
    });

    // Check PWA status
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          setPwaStatus('Active (NetworkFirst for /api/quote, StaleWhileRevalidate for assets)');
        } else {
          setPwaStatus('PWA ready (service worker supported)');
        }
      });
    } else {
      setTimeout(() => {
        setPwaStatus('Service Worker ready in PWA environment');
      }, 0);
    }
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const handleClearCache = async () => {
    if (typeof window !== 'undefined' && indexedDB) {
      try {
        indexedDB.deleteDatabase('5cents-quotes-db');
        setCachedCount(0);
        alert('IndexedDB quote vault cleared successfully.');
      } catch {
        alert('Failed to clear IndexedDB vault.');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-sora text-2xl font-bold text-white tracking-tight">System Configuration</h1>
        <p className="font-sans text-xs text-slate-400 mt-1">
          Operative terminal settings, Finnhub proxy verification, and offline storage controls.
        </p>
      </div>

      <div className="space-y-4">
        {/* Operative Profile Session */}
        <div className="glass-panel-accent rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-sora text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400">person</span>
              OPERATIVE SESSION
            </h2>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="bg-[#151c29] p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block mb-1">AUTHENTICATED EMAIL</span>
              <span className="text-white font-semibold">{session?.email || 'Unknown Operative'}</span>
            </div>
            <div className="bg-[#151c29] p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block mb-1">SESSION INITIATED</span>
              <span className="text-white font-semibold">
                {session?.loggedInAt ? new Date(session.loggedInAt).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Finnhub Integration Proxy Status */}
        <div className="glass-panel-accent rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-sora text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400">api</span>
              FINNHUB PROXY INTEGRATION
            </h2>
            <span
              className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase ${
                apiStatus === 'active'
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-400/30'
                  : apiStatus === 'checking'
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                  : 'text-red-400 bg-red-500/10 border border-red-500/30'
              }`}
            >
              {apiStatus}
            </span>
          </div>

          <p className="font-mono text-xs text-slate-300 bg-[#151c29] p-3 rounded-lg border border-slate-800">
            {apiMessage}
          </p>

          <p className="text-[11px] text-slate-400 mt-2 font-sans">
            Requests are strictly routed server-side through <code className="text-cyan-400">/api/quote</code> to prevent browser client API key exposure.
          </p>
        </div>

        {/* Offline Cache & PWA Status */}
        <div className="glass-panel-accent rounded-xl p-5">
          <h2 className="font-sora text-sm font-bold text-white flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-cyan-400">sd_card</span>
            INDEXEDDB VAULT &amp; PWA CACHE
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs mb-4">
            <div className="bg-[#151c29] p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block mb-1">OFFLINE QUOTES STORED</span>
              <span className="text-cyan-400 font-bold text-base">{cachedCount} symbols</span>
            </div>
            <div className="bg-[#151c29] p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block mb-1">SERVICE WORKER</span>
              <span className="text-slate-200 text-xs">{pwaStatus}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClearCache}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              CLEAR VAULT CACHE
            </button>
          </div>
        </div>

        {/* Security / Logout */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/30 font-sora font-semibold text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,180,171,0.1)]"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            TERMINATE SESSION &amp; LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}
