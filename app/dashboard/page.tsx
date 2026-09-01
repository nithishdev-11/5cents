'use client';

import { useState, useEffect, useCallback } from 'react';
import AuthGuard from '@/components/AuthGuard';
import TopNavHeader from '@/components/TopNavHeader';
import BottomNavBar, { TabType } from '@/components/BottomNavBar';
import QuoteCard from '@/components/QuoteCard';
import SentimentRadar from '@/components/SentimentRadar';
import PortfolioCard from '@/components/PortfolioCard';
import SignalsList from '@/components/SignalsList';
import ThoughtStream from '@/components/ThoughtStream';
import ConfigView from '@/components/ConfigView';
import { getQuote, StockQuote } from '@/lib/stocks';

const WATCHLIST = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', confidence: 94.2, target: 124.50, horizon: '3-5 Days', agent: 'AGENT: OMEGA-7', signal: 'BULLISH' as const },
  { symbol: 'TSLA', name: 'Tesla, Inc.', confidence: 88.5, target: 168.20, horizon: 'Intraday', agent: 'AGENT: VORTEX-3', signal: 'BEARISH' as const },
  { symbol: 'AAPL', name: 'Apple Inc.', confidence: 76.8, target: 185.00, horizon: '1-2 Wks', agent: 'AGENT: QUANT-9', signal: 'BULLISH' as const },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  const fetchAllQuotes = useCallback(async () => {
    setIsSyncing(true);
    const results: Record<string, StockQuote> = {};

    for (const item of WATCHLIST) {
      const q = await getQuote(item.symbol);
      results[item.symbol] = q;
    }

    setQuotes(results);
    setIsSyncing(false);
    setLastSyncTime(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    let active = true;

    async function initialLoad() {
      if (active) {
        await fetchAllQuotes();
      }
    }
    initialLoad();

    // Refresh every 30 seconds if online
    const interval = setInterval(() => {
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        fetchAllQuotes();
      }
    }, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [fetchAllQuotes]);

  const quotesList = Object.values(quotes);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0a0e14] text-[#dce2f5] flex flex-col pt-20 pb-28 md:pb-12">
        {/* Top App Bar */}
        <TopNavHeader onRefresh={fetchAllQuotes} isSyncing={isSyncing} />

        {/* Main Workspace Canvas */}
        <main className="flex-1 w-full px-4 md:px-8 max-w-[1600px] mx-auto z-10">
          {/* TAB 1: DASHBOARD (Market Sentiment Matrix, Telemetry, Swarm, Portfolio Insights, Bullish Signals) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-cyan-400/20 pb-4">
                <div>
                  <h1 className="font-sora text-3xl font-extrabold text-white tracking-tight uppercase">
                    HERO COMMAND <span className="text-cyan-400 text-sm font-mono tracking-widest font-normal">APEX DASHBOARD</span>
                  </h1>
                  <p className="font-sans text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Live Signal Stream Active {lastSyncTime && `• Synced ${lastSyncTime}`}
                  </p>
                </div>
              </div>

              {/* Grid Layout: Sentiment Matrix & Agent Swarm Telemetry */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Left 8 Cols: Market Sentiment Matrix & Signals */}
                <div className="xl:col-span-8 space-y-6">
                  <SentimentRadar />
                  <SignalsList quotes={quotesList} />
                </div>

                {/* Right 4 Cols: Agent Swarm & System Telemetry */}
                <aside className="xl:col-span-4 space-y-6">
                  {/* Agent Swarm Card */}
                  <div className="glass-panel-accent rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-cyan-400/20">
                      <h2 className="font-sora text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                        <span className="material-symbols-outlined text-cyan-400">support_agent</span>
                        Agent Swarm
                      </h2>
                      <span className="font-mono text-[10px] text-slate-400">3 ACTIVE</span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Agent Peter */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-[#151c29]/70 border border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded bg-cyan-950/60 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                            <span className="material-symbols-outlined text-lg">tune</span>
                          </div>
                          <div>
                            <div className="font-mono text-sm font-bold text-white">Peter_PRM</div>
                            <div className="font-mono text-[10px] text-slate-400">MARKET MAKER</div>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-sm font-bold text-cyan-400">98%</div>
                          <div className="text-[9px] text-slate-400">UPTIME</div>
                        </div>
                      </div>

                      {/* Agent Gwen */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-[#151c29]/70 border border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded bg-cyan-950/60 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                            <span className="material-symbols-outlined text-lg">blur_on</span>
                          </div>
                          <div>
                            <div className="font-mono text-sm font-bold text-white">Gwen_GHT</div>
                            <div className="font-mono text-[10px] text-slate-400">ARBITRAGE</div>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-sm font-bold text-cyan-400">99.5%</div>
                          <div className="text-[9px] text-slate-400">UPTIME</div>
                        </div>
                      </div>

                      {/* Agent Miles */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-red-950/20 border border-red-500/30">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
                            <span className="material-symbols-outlined text-lg">bolt</span>
                          </div>
                          <div>
                            <div className="font-mono text-sm font-bold text-red-400">Miles_VOL</div>
                            <div className="font-mono text-[10px] text-red-400/70">FLASH LOAN EXEC</div>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-xs font-bold text-red-400">ENGAGED</div>
                          <div className="text-[9px] text-red-400/70">STATUS</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Telemetry Card */}
                  <div className="glass-panel-accent rounded-xl p-5">
                    <h3 className="font-mono text-xs text-slate-400 tracking-widest uppercase border-b border-cyan-400/20 pb-2 mb-3">
                      SYSTEM TELEMETRY
                    </h3>
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">NET LIQUIDITY</span>
                        <span className="text-cyan-400 font-bold text-sm">$4.2M</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">24H VOL</span>
                        <span className="text-cyan-400 font-bold text-sm">$18.7M</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                        <span className="text-slate-400">RISK EXPOSURE</span>
                        <span className="text-red-400 font-bold flex items-center gap-1.5 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                          HIGH (0.84)
                        </span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Portfolio Insights Section */}
              <PortfolioCard />
            </div>
          )}

          {/* TAB 2: SIGNALS (Market Sense - NVDA, TSLA, AAPL cards matching Image 1.png) */}
          {activeTab === 'signals' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyan-400/20 pb-4">
                <div>
                  <h1 className="font-sora text-3xl font-extrabold text-white tracking-tight uppercase">
                    MARKET SENSE
                  </h1>
                  <p className="font-sans text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Live Signal Stream Active
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={fetchAllQuotes}
                    className="bg-[#151c29] border border-cyan-400/30 text-cyan-400 font-mono text-xs px-4 py-2 rounded-lg hover:bg-cyan-500/10 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    REFRESH SIGNALS
                  </button>
                </div>
              </div>

              {/* Signals Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {WATCHLIST.map((item) => {
                  const fetched = quotes[item.symbol] || {
                    symbol: item.symbol,
                    currentPrice: item.target,
                    change: 3.5,
                    percentChange: 2.1,
                    high: item.target * 1.02,
                    low: item.target * 0.98,
                    open: item.target * 0.99,
                    previousClose: item.target - 3.5,
                    timestamp: 0,
                  };

                  return (
                    <QuoteCard
                      key={item.symbol}
                      quote={fetched}
                      companyName={item.name}
                      confidence={item.confidence}
                      entryTarget={item.target}
                      horizon={item.horizon}
                      agentName={item.agent}
                      signalType={item.signal}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: NEURAL (Agent Reasoning / Thought Stream matching Image 3.png) */}
          {activeTab === 'neural' && (
            <div className="animate-fadeIn">
              <ThoughtStream />
            </div>
          )}

          {/* TAB 4: CONFIG (System configuration & logout) */}
          {activeTab === 'config' && (
            <div className="animate-fadeIn">
              <ConfigView />
            </div>
          )}
        </main>

        {/* Bottom Tab Navigation Bar */}
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </AuthGuard>
  );
}
