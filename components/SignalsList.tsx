'use client';

import { StockQuote } from '@/lib/stocks';

interface SignalsListProps {
  quotes?: StockQuote[];
}

export default function SignalsList({ quotes = [] }: SignalsListProps) {
  // Merge static signals with real quotes if present
  const signals = [
    {
      symbol: 'QNTM',
      labelType: 'ASSET',
      changePct: '+14.2%',
      desc: 'Breakout volume confirmed on 1H timeframe. Neural net confidence high.',
      icon: 'rocket_launch'
    },
    {
      symbol: 'NXUS',
      labelType: 'ASSET',
      changePct: '+8.7%',
      desc: 'Accumulation phase terminating. Smart money flow positive.',
      icon: 'memory'
    },
    {
      symbol: 'DEFI',
      labelType: 'SECTOR',
      changePct: '+5.1%',
      desc: 'Macro sector rotation detected. Correlated assets showing strength.',
      icon: 'api'
    }
  ];

  // If we have real positive stock quotes, integrate top bullish performers
  if (quotes.length > 0) {
    const sortedQuotes = [...quotes].sort((a, b) => b.percentChange - a.percentChange);
    sortedQuotes.forEach((q, idx) => {
      if (idx < 2 && q.percentChange > 0) {
        signals[idx] = {
          symbol: q.symbol,
          labelType: 'REAL-TIME STK',
          changePct: `+${q.percentChange.toFixed(2)}%`,
          desc: `Current live price at $${q.currentPrice.toFixed(2)}. High: $${q.high.toFixed(2)}. Finnhub proxy validated.`,
          icon: 'trending_up'
        };
      }
    });
  }

  return (
    <div className="glass-panel-accent rounded-xl p-6 flex flex-col gap-4">
      <div className="flex justify-between items-end border-b border-cyan-400/20 pb-3">
        <h2 className="font-sora text-base font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <span className="material-symbols-outlined text-cyan-400">moving</span>
          Top Bullish Signals
        </h2>
        <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">
          AUTO-REFRESH: ON
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {signals.map((sig, idx) => (
          <div
            key={idx}
            className="bg-[#151c29]/70 border border-cyan-400/15 hover:border-cyan-400/40 rounded-xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-slate-400 tracking-widest">{sig.labelType}</span>
                <span className="font-mono text-lg font-bold text-white">{sig.symbol}</span>
              </div>
              <span className="material-symbols-outlined text-cyan-400/40 text-2xl">
                {sig.icon}
              </span>
            </div>

            <div className="font-mono text-2xl font-extrabold text-cyan-400 tracking-tight my-1">
              {sig.changePct}
            </div>

            <p className="font-sans text-xs text-slate-300 leading-relaxed mt-1">
              {sig.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
