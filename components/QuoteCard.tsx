'use client';

import { StockQuote } from '@/lib/stocks';
import { useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Bot } from 'lucide-react';

interface QuoteCardProps {
  quote: StockQuote;
  companyName?: string;
  confidence?: number;
  entryTarget?: number;
  horizon?: string;
  agentName?: string;
  signalType?: 'BULLISH' | 'BEARISH';
}

// Pseudo-random helper function to keep component pure
function pseudoNoise(seed: number, index: number): number {
  const x = Math.sin(seed * 9999 + index * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) - 0.48;
}

export default function QuoteCard({
  quote,
  companyName = 'Technology Corp',
  confidence = 92.4,
  entryTarget,
  horizon = '3-5 Days',
  agentName = 'AGENT: OMEGA-7',
  signalType = 'BULLISH',
}: QuoteCardProps) {
  const isPositive = quote.change >= 0;
  const targetVal = entryTarget || Number((quote.currentPrice * (isPositive ? 0.98 : 1.02)).toFixed(2));

  // Generate 20-point sparkline walk deterministically
  const sparklinePoints = useMemo(() => {
    const points: number[] = [];
    let current = quote.previousClose || quote.currentPrice * 0.98;
    const step = (quote.currentPrice - current) / 19;
    const seed = quote.symbol.charCodeAt(0) + quote.currentPrice;
    
    for (let i = 0; i < 20; i++) {
      if (i === 19) {
        points.push(quote.currentPrice);
      } else {
        const noise = pseudoNoise(seed, i) * (quote.currentPrice * 0.008);
        current += step + noise;
        points.push(current);
      }
    }
    return points;
  }, [quote.currentPrice, quote.previousClose, quote.symbol]);

  // Convert points into SVG path string
  const svgPath = useMemo(() => {
    if (sparklinePoints.length === 0) return '';
    const min = Math.min(...sparklinePoints);
    const max = Math.max(...sparklinePoints);
    const range = max - min || 1;
    const width = 100;
    const height = 30;

    return sparklinePoints
      .map((val, idx) => {
        const x = (idx / (sparklinePoints.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [sparklinePoints]);

  return (
    <article className="glass-panel rounded-xl relative overflow-hidden group hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all duration-300 border border-cyan-400/20">
      {/* Top light indicator line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${isPositive ? 'bg-cyan-400' : 'bg-red-400'}`} />

      <div className="p-5">
        {/* Offline Badge if cached */}
        {quote.isOffline && (
          <div className="mb-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Offline · synced {quote.syncedTimeAgo || 'recently'}</span>
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-sora text-2xl font-bold text-white tracking-tight">{quote.symbol}</h2>
              <div className="flex items-center gap-1">
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded flex items-center gap-1 font-semibold ${
                    signalType === 'BULLISH'
                      ? 'bg-cyan-500/10 border border-cyan-400 text-cyan-400'
                      : 'bg-red-500/10 border border-red-400 text-red-400 pulse-critical'
                  }`}
                >
                  {signalType === 'BULLISH' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {signalType}
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold uppercase">
                  AAA
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-sans">{companyName}</p>
          </div>

          <div className="text-right">
            <div className="font-mono text-xl font-bold text-white">
              ₹{quote.currentPrice.toFixed(2)}
            </div>
            <div
              className={`font-mono text-xs font-semibold flex items-center justify-end gap-0.5 ${
                isPositive ? 'text-cyan-400' : 'text-red-400'
              }`}
            >
              <span>{isPositive ? '+' : ''}{quote.change.toFixed(2)}</span>
              <span>({isPositive ? '+' : ''}{quote.percentChange.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Sparkline Graph */}
        <div className="w-full h-10 mb-4 relative flex items-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path
              d={svgPath}
              fill="none"
              stroke={isPositive ? '#22d3ee' : '#ffb4ab'}
              strokeWidth="1.8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Entry target and Horizon */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-[#151c29] p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-slate-400 tracking-wider block mb-0.5">ENTRY TRGT</span>
            <span className="font-mono text-sm font-semibold text-white">₹{targetVal.toFixed(2)}</span>
          </div>
          <div className="bg-[#151c29] p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
            <span className="font-mono text-[10px] text-slate-400 tracking-wider block mb-0.5">HORIZON</span>
            <span className="font-mono text-sm font-semibold text-white">{horizon}</span>
          </div>
        </div>

        {/* Footer Agent info */}
        <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] tracking-wider">{agentName}</span>
          </div>
          <div className="text-[11px] text-cyan-400 font-semibold">{confidence}% CONFIDENCE</div>
        </div>
      </div>
    </article>
  );
}
