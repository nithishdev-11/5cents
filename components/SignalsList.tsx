'use client';

import { StockQuote } from '@/lib/stocks';
import { evaluateThreeDimensions } from '@/lib/signalClassifier';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';

interface SignalsListProps {
  quotes?: StockQuote[];
}

export default function SignalsList({ quotes = [] }: SignalsListProps) {
  const activeQuotes = quotes.length > 0 ? quotes : [
    { symbol: 'RELIANCE.NS', currentPrice: 2985.40, change: 12.50, percentChange: 0.42, high: 3010.00, low: 2970.00, open: 2980.00, previousClose: 2972.90 },
    { symbol: 'TCS.NS', currentPrice: 4120.15, change: -45.30, percentChange: -1.09, high: 4180.00, low: 4100.00, open: 4175.00, previousClose: 4165.45 },
    { symbol: 'HDFCBANK.NS', currentPrice: 1612.00, change: 8.40, percentChange: 0.52, high: 1625.00, low: 1605.00, open: 1608.00, previousClose: 1603.60 },
  ];

  const classifiedSignals = activeQuotes.map((q) => evaluateThreeDimensions(q.symbol, q));

  return (
    <div className="glass-panel-accent rounded-xl p-6 flex flex-col gap-4">
      <div className="flex justify-between items-end border-b border-cyan-400/20 pb-3">
        <div>
          <h2 className="font-sora text-base font-bold text-white flex items-center gap-2 uppercase tracking-wide">
            <StackedLineChartIcon className="text-cyan-400" />
            3-Dimension Signal Classification Engine
          </h2>
          <p className="font-sans text-xs text-slate-400 mt-0.5">
            Evaluating Price Momentum, Volume Anomaly, and Sentiment NLP across active assets.
          </p>
        </div>
        <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-400/30 uppercase font-bold">
          LIVE CLASSIFIER
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classifiedSignals.map((sig) => (
          <div
            key={sig.symbol}
            className="bg-[#151c29]/80 border border-cyan-400/20 hover:border-cyan-400/50 rounded-xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 space-y-3"
          >
            <div className="flex justify-between items-start border-b border-slate-800 pb-2">
              <div>
                <span className="font-mono text-[10px] text-slate-400 tracking-widest block">ASSET SIGNAL</span>
                <span className="font-mono text-xl font-extrabold text-white">{sig.symbol}</span>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-400/30">
                {sig.classificationLabel}
              </span>
            </div>

            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-400 text-xs">CONFIDENCE LEVEL:</span>
              <span className="text-cyan-400 font-bold text-sm">{sig.confidenceScore}%</span>
            </div>

            {/* 3 Dimensions Pills */}
            <div className="space-y-1.5 font-mono text-[10px] bg-[#0c1320] p-2.5 rounded-lg border border-slate-800">
              {sig.dimensions.map((dim) => (
                <div key={dim.dimension} className="flex justify-between items-center">
                  <span className="text-slate-400">{dim.name}:</span>
                  <span className={`font-bold ${dim.score > 20 ? 'text-emerald-400' : dim.score < -20 ? 'text-red-400' : 'text-slate-300'}`}>
                    {dim.metricValue}
                  </span>
                </div>
              ))}
            </div>

            {/* Reasoning & Source Attributions */}
            <div className="space-y-1.5 text-[11px] font-sans">
              <p className="text-slate-300 line-clamp-2 leading-relaxed">
                {sig.summaryReasoning}
              </p>
              <div className="text-[10px] font-mono text-cyan-400/90 truncate pt-1 border-t border-slate-800">
                {sig.citedSources[0]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
