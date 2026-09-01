'use client';

import { useState } from 'react';
import { UserProfile, UserProfileType, USER_PROFILES, getStoredUserProfile, setStoredUserProfile } from '@/lib/userProfile';
import { evaluateThreeDimensions } from '@/lib/signalClassifier';
import { executeQuantAgent, executeSentimentAgent, executeFundamentalRagAgent, executeSynthesisLayer } from '@/lib/multiAgent';
import { BadgeCheck, ArrowLeftRight, Beaker, X } from 'lucide-react';

interface UserProfileSelectorProps {
  onProfileChange?: (profile: UserProfile) => void;
}

export default function UserProfileSelector({ onProfileChange }: UserProfileSelectorProps) {
  const [activeProfile, setActiveProfile] = useState<UserProfile>(() => getStoredUserProfile());
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  const handleSelect = (id: UserProfileType) => {
    const updated = setStoredUserProfile(id);
    setActiveProfile(updated);
    if (onProfileChange) onProfileChange(updated);
  };

  // Sample identical stock input (e.g. RELIANCE at ₹2985.40) to demonstrate profile impact
  const sampleSignal = evaluateThreeDimensions('RELIANCE.NS', {
    currentPrice: 2985.40,
    change: 12.50,
    percentChange: 0.42,
    high: 3010.00,
    low: 2970.00,
  });

  const quant = executeQuantAgent(sampleSignal, 2985.40);
  const sentiment = executeSentimentAgent(sampleSignal);
  const fundamental = executeFundamentalRagAgent('RELIANCE.NS');

  return (
    <div className="glass-panel-accent rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-cyan-400/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="font-sora text-sm font-bold text-white uppercase tracking-wide">
              Active User Profile &amp; Risk Parameters
            </h2>
          </div>
          <p className="font-sans text-xs text-slate-400 mt-0.5">
            Agent decisions automatically adapt to your stored risk parameters.
          </p>
        </div>

        <button
          onClick={() => setShowComparisonModal(true)}
          className="bg-[#151c29] hover:bg-cyan-950/40 border border-cyan-400/30 text-cyan-400 font-mono text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>COMPARE PROFILES ON RELIANCE</span>
        </button>
      </div>

      {/* Profile Selector Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {(Object.values(USER_PROFILES) as UserProfile[]).map((p) => {
          const isSelected = activeProfile.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`p-3.5 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                  : 'bg-[#151c29]/70 border-slate-800 hover:border-slate-700 hover:bg-[#151c29]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-sora text-xs font-bold text-white">{p.name}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
                <p className="font-sans text-[11px] text-slate-400 line-clamp-2 mb-3">
                  {p.description}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">MAX DRAWDOWN:</span>
                  <span className="text-cyan-400 font-bold">{p.maxDrawdownTarget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">POSITION SIZING:</span>
                  <span className="text-white font-bold">{p.positionSizingMultiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">HEDGING MANDATE:</span>
                  <span className={p.hedgingRequired ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {p.hedgingRequired ? 'REQUIRED' : 'OPTIONAL'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Profile Demonstration Impact Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-accent max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-5 border border-cyan-400/40">
            <div className="flex justify-between items-center border-b border-cyan-400/30 pb-3">
              <div>
                <h3 className="font-sora text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-cyan-400" />
                  IDENTICAL INPUT PROFILING DEMONSTRATION
                </h3>
                <p className="font-mono text-xs text-slate-400 mt-0.5">
                  Input Stock: RELIANCE @ ₹2985.40 (+0.42%) • Quant: +62 | Sentiment: +68 | RAG 10-K: +82
                </p>
              </div>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {(Object.values(USER_PROFILES) as UserProfile[]).map((prof) => {
                const synth = executeSynthesisLayer('RELIANCE.NS', 2985.40, quant, sentiment, fundamental, prof);
                return (
                  <div key={prof.id} className="p-4 rounded-xl bg-[#151c29] border border-slate-800 space-y-2.5">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="font-sora font-bold text-white text-xs">{prof.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-400/30 font-bold">
                        {synth.finalDecision}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-[#0c1320] p-2 rounded border border-slate-800">
                        <span className="text-slate-400 block text-[9px]">CAPITAL ALLOCATION</span>
                        <span className="text-cyan-400 font-bold text-sm">{synth.recommendedPositionSizePct}%</span>
                      </div>
                      <div className="bg-[#0c1320] p-2 rounded border border-slate-800">
                        <span className="text-slate-400 block text-[9px]">STOP-LOSS GUARD</span>
                        <span className="text-red-400 font-bold text-sm">₹{synth.stopLossPrice}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-300 bg-[#070b13] p-2 rounded border border-slate-800/80">
                      <span className="text-slate-400 block text-[9px] font-bold mb-1">RAG CITATION &amp; REASONING</span>
                      {fundamental.primaryCitation} — {synth.fullReasoningChain.split('\n')[1]}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-400 font-mono text-xs px-5 py-2 rounded-lg font-bold"
              >
                CLOSE DEMONSTRATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
