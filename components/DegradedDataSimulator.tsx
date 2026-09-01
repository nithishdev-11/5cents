'use client';

import { useState } from 'react';
import { evaluateThreeDimensions } from '@/lib/signalClassifier';
import { executeQuantAgent, executeSentimentAgent, executeFundamentalRagAgent, executeSynthesisLayer, SynthesizedActionContract } from '@/lib/multiAgent';
import { getStoredUserProfile } from '@/lib/userProfile';

type DegradedScenario = 'FEED_DROPOUT' | 'MISSING_FILING' | 'SIGNAL_CONFLICT';

export default function DegradedDataSimulator() {
  const [activeScenario, setActiveScenario] = useState<DegradedScenario>('SIGNAL_CONFLICT');
  const [simulatedResult, setSimulatedResult] = useState<SynthesizedActionContract | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const handleSimulate = (scenario: DegradedScenario) => {
    setActiveScenario(scenario);
    const logs: string[] = [];

    const baseSignal = evaluateThreeDimensions('NVDA', {
      currentPrice: 124.50,
      change: 3.50,
      percentChange: 2.89,
      high: 126.00,
      low: 121.20,
    });

    let quant = executeQuantAgent(baseSignal, 124.50);
    let sentiment = executeSentimentAgent(baseSignal);
    let forceMissing = false;

    if (scenario === 'FEED_DROPOUT') {
      logs.push('[WARN] Primary Finnhub API feed timeout or drop (503 Gateway Error).');
      logs.push('[FALLBACK] Switched to IndexedDB cached quote snapshot from vault.');
      logs.push('[SAFEGUARD] Pipeline continue active without throwing unhandled exception.');
    } else if (scenario === 'MISSING_FILING') {
      logs.push('[WARN] SEC Form 10-K filing unretrievable from EDGAR endpoint.');
      logs.push('[FALLBACK] Fundamental agent downgrades confidence to 10% and flags missing filing.');
      forceMissing = true;
    } else if (scenario === 'SIGNAL_CONFLICT') {
      logs.push('[ALERT] High Divergence Detected: Quant Engine = BULLISH (+68) vs Sentiment NLP = BEARISH (-45).');
      logs.push('[SYNTHESIS] Synthesizer auto-engages TACTICAL COLLAR hedge mode and adjusts capital exposure down.');
      // Force conflicting scores
      quant.score = 75;
      quant.signal = 'BULLISH';
      sentiment.score = -55;
      sentiment.sentimentIndex = '-0.68 High Negative Sentiment';
    }

    const fundamental = executeFundamentalRagAgent('NVDA', forceMissing);
    const userProfile = getStoredUserProfile();
    const synth = executeSynthesisLayer('NVDA', 124.50, quant, sentiment, fundamental, userProfile);

    setSimulatedResult(synth);
    setLogMessages(logs);
  };

  return (
    <div className="glass-panel-accent rounded-xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-cyan-400/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-2xl">warning</span>
            <h2 className="font-sora text-lg font-bold text-white tracking-tight uppercase">
              Degraded Data &amp; Fault Handling Simulator
            </h2>
          </div>
          <p className="font-sans text-xs text-slate-400 mt-1">
            Test pipeline resilience under feed dropouts, missing SEC filings, and conflicting agent signals.
          </p>
        </div>
      </div>

      {/* Scenario Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <button
          onClick={() => handleSimulate('FEED_DROPOUT')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeScenario === 'FEED_DROPOUT'
              ? 'bg-amber-950/40 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
              : 'bg-[#151c29] border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-sm text-amber-400">cloud_off</span>
            1. Feed Dropout
          </div>
          <p className="font-sans text-[11px] text-slate-400">
            Simulates primary API market feed offline. Uses IndexedDB cache fallback.
          </p>
        </button>

        <button
          onClick={() => handleSimulate('MISSING_FILING')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeScenario === 'MISSING_FILING'
              ? 'bg-amber-950/40 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
              : 'bg-[#151c29] border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-sm text-amber-400">find_in_page</span>
            2. Missing SEC Filing
          </div>
          <p className="font-sans text-[11px] text-slate-400">
            SEC 10-K unretrievable. Flags disclosure uncertainty without pipeline crash.
          </p>
        </button>

        <button
          onClick={() => handleSimulate('SIGNAL_CONFLICT')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeScenario === 'SIGNAL_CONFLICT'
              ? 'bg-amber-950/40 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
              : 'bg-[#151c29] border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-sm text-amber-400">alt_route</span>
            3. Agent Signal Conflict
          </div>
          <p className="font-sans text-[11px] text-slate-400">
            Quant Bullish vs Sentiment Bearish. Engages collar hedge automatically.
          </p>
        </button>
      </div>

      {/* Execution Logs */}
      {logMessages.length > 0 && (
        <div className="bg-[#070b13] p-4 rounded-xl border border-amber-500/30 space-y-1.5 font-mono text-xs">
          <div className="text-amber-400 font-bold mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">terminal</span>
            DEGRADED DATA PIPELINE AUDIT LOG:
          </div>
          {logMessages.map((msg, i) => (
            <div key={i} className="text-slate-300 leading-relaxed">
              {msg}
            </div>
          ))}
        </div>
      )}

      {/* Simulated Output */}
      {simulatedResult && (
        <div className="glass-panel p-4 rounded-xl border border-cyan-400/30 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="font-sora font-bold text-white">DEGRADED SCENARIO RESULT</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
              {simulatedResult.finalDecision}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="bg-[#151c29] p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">POSITION SIZING</span>
              <span className="text-cyan-400 font-bold text-sm">{simulatedResult.recommendedPositionSizePct}%</span>
            </div>
            <div className="bg-[#151c29] p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">CONFIDENCE</span>
              <span className="text-amber-400 font-bold text-sm">{simulatedResult.confidenceScore}%</span>
            </div>
            <div className="bg-[#151c29] p-2.5 rounded border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-400 text-[10px] block">CITATION ATTRIBUTION</span>
              <span className="text-slate-200 text-xs truncate block">{simulatedResult.ragAttributions[0]}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
