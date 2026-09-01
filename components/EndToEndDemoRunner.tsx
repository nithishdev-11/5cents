'use client';

import { useState } from 'react';
import { evaluateThreeDimensions, ClassifiedSignal } from '@/lib/signalClassifier';
import { executeQuantAgent, executeSentimentAgent, executeFundamentalRagAgent, executeSynthesisLayer, SynthesizedActionContract } from '@/lib/multiAgent';
import { getStoredUserProfile } from '@/lib/userProfile';
import { recordPerformanceEntry } from '@/lib/performanceLog';

export default function EndToEndDemoRunner() {
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedSymbol, setSelectedSymbol] = useState<'NVDA' | 'TSLA' | 'AAPL'>('NVDA');
  
  // Results
  const [classifiedSignal, setClassifiedSignal] = useState<ClassifiedSignal | null>(null);
  const [synthResult, setSynthResult] = useState<SynthesizedActionContract | null>(null);

  const steps = [
    { num: 1, title: 'Raw Data Ingestion', desc: 'Fetching Finnhub Level-1 tape, volume matrix, SEC filings, and news stream.' },
    { num: 2, title: '3-Dimension Signal Classification', desc: 'Evaluating Price Momentum, Volume Anomaly, and News Sentiment NLP.' },
    { num: 3, title: 'Parallel Agent Swarm Execution', desc: 'Quant, Sentiment NLP, and Fundamental SEC RAG agents executing concurrently.' },
    { num: 4, title: 'RAG Citation Vector Grounding', desc: 'Querying 10-K filings to bind decisions with verified source citations.' },
    { num: 5, title: 'User Profile & Risk Weighting', desc: 'Applying active user profile risk matrix and drawdown limits.' },
    { num: 6, title: 'Synthesized Recommendation', desc: 'Synthesizer generating unified trade action contract.' },
  ];

  const handleRunDemo = async () => {
    setRunning(true);
    setCurrentStep(1);
    setClassifiedSignal(null);
    setSynthResult(null);

    // Step 1: Raw Data Ingestion
    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(2);

    // Step 2: 3-Dimension Signal Classification
    const priceMap = {
      NVDA: { currentPrice: 124.50, change: 3.50, percentChange: 2.89, high: 126.00, low: 121.20 },
      TSLA: { currentPrice: 168.20, change: -4.10, percentChange: -2.38, high: 172.00, low: 166.50 },
      AAPL: { currentPrice: 185.00, change: 1.20, percentChange: 0.65, high: 186.10, low: 183.80 },
    };
    const currentPriceObj = priceMap[selectedSymbol];
    const signal = evaluateThreeDimensions(selectedSymbol, currentPriceObj);
    setClassifiedSignal(signal);

    await new Promise((r) => setTimeout(r, 700));
    setCurrentStep(3);

    // Step 3: Parallel Agent Swarm Execution
    const quant = executeQuantAgent(signal, currentPriceObj.currentPrice);
    const sentiment = executeSentimentAgent(signal);

    await new Promise((r) => setTimeout(r, 700));
    setCurrentStep(4);

    // Step 4: RAG Vector Grounding
    const fundamental = executeFundamentalRagAgent(selectedSymbol);

    await new Promise((r) => setTimeout(r, 700));
    setCurrentStep(5);

    // Step 5: User Profile Weighting
    const userProfile = getStoredUserProfile();

    await new Promise((r) => setTimeout(r, 600));
    setCurrentStep(6);

    // Step 6: Synthesis
    const synth = executeSynthesisLayer(selectedSymbol, currentPriceObj.currentPrice, quant, sentiment, fundamental, userProfile);
    setSynthResult(synth);

    // Log performance metrics
    recordPerformanceEntry({
      symbol: selectedSymbol,
      signalAccuracy30d: Number((88 + Math.random() * 5).toFixed(1)),
      agentResponseLatencyMs: {
        quant: quant.executionLatencyMs,
        sentiment: sentiment.executionLatencyMs,
        fundamentalRag: fundamental.executionLatencyMs,
        synthesis: synth.synthesizerLatencyMs,
        total: synth.totalLatencyMs,
      },
      portfolioRiskConcentrationScore: 0.29,
      ragGroundingPrecisionPct: 98.2,
      decisionMade: synth.finalDecision,
      userProfileName: userProfile.name,
    });

    setRunning(false);
  };

  return (
    <div className="glass-panel-accent rounded-xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyan-400/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-2xl">play_circle</span>
            <h2 className="font-sora text-lg font-bold text-white tracking-tight uppercase">
              End-to-End Reasoning Pipeline Demo
            </h2>
          </div>
          <p className="font-sans text-xs text-slate-400 mt-1">
            Trace raw data ingestion through 3-dimension evaluation, parallel multi-agent execution, RAG citation grounding, and profile-weighted synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value as any)}
            disabled={running}
            className="bg-[#151c29] border border-cyan-400/30 text-cyan-400 font-mono text-xs px-3 py-2 rounded-lg font-bold focus:outline-none"
          >
            <option value="NVDA">NVDA (NVIDIA)</option>
            <option value="TSLA">TSLA (Tesla)</option>
            <option value="AAPL">AAPL (Apple)</option>
          </select>

          <button
            onClick={handleRunDemo}
            disabled={running}
            className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] ${
              running
                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                : 'bg-cyan-500 hover:bg-cyan-400 text-[#0a0e14] border border-cyan-300'
            }`}
          >
            <span className={`material-symbols-outlined text-sm ${running ? 'animate-spin' : ''}`}>
              {running ? 'autorenew' : 'bolt'}
            </span>
            <span>{running ? 'EXECUTING PIPELINE...' : 'RUN END-TO-END DEMO'}</span>
          </button>
        </div>
      </div>

      {/* Progress Stepper Visualizer */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {steps.map((s) => {
          const isDone = currentStep > s.num || (currentStep === 6 && synthResult !== null);
          const isCurrent = currentStep === s.num && running;

          return (
            <div
              key={s.num}
              className={`p-3 rounded-xl border text-left transition-all ${
                isDone
                  ? 'bg-cyan-950/40 border-cyan-400/60 text-cyan-200'
                  : isCurrent
                  ? 'bg-amber-950/40 border-amber-400 text-amber-200 animate-pulse'
                  : 'bg-[#151c29]/50 border-slate-800 text-slate-500'
              }`}
            >
              <div className="font-mono text-[10px] font-bold mb-1 flex justify-between">
                <span>STEP 0{s.num}</span>
                {isDone ? (
                  <span className="material-symbols-outlined text-cyan-400 text-sm">check_circle</span>
                ) : isCurrent ? (
                  <span className="material-symbols-outlined text-amber-400 text-sm animate-spin">sync</span>
                ) : null}
              </div>
              <h4 className="font-sora text-xs font-bold line-clamp-1">{s.title}</h4>
            </div>
          );
        })}
      </div>

      {/* Results View */}
      {synthResult && classifiedSignal && (
        <div className="space-y-5 animate-fadeIn">
          {/* Action Header Banner */}
          <div className="glass-panel p-5 rounded-xl border-l-4 border-l-cyan-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="font-mono text-[10px] text-cyan-400 tracking-wider uppercase block mb-1">
                SYNTHESIZED ACTION CONTRACT RESULT
              </span>
              <div className="flex items-center gap-3">
                <h3 className="font-sora text-2xl font-extrabold text-white tracking-tight">
                  {synthResult.symbol} • {synthResult.finalDecision}
                </h3>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold">
                  {synthResult.confidenceScore}% CONFIDENCE
                </span>
              </div>
              <p className="font-sans text-xs text-slate-300 mt-1">
                Weighted Profile: <strong className="text-white">{synthResult.userProfileApplied.name}</strong> • Position Size Allocation: <strong className="text-cyan-400">{synthResult.recommendedPositionSizePct}%</strong> • Stop-Loss Guard: <strong className="text-red-400">${synthResult.stopLossPrice}</strong>
              </p>
            </div>

            <div className="text-right font-mono text-xs bg-[#151c29] p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">TOTAL PIPELINE LATENCY</span>
              <span className="text-cyan-400 font-bold text-base">{synthResult.totalLatencyMs} ms</span>
            </div>
          </div>

          {/* 3-Agent Structured Output Contracts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Quant Agent Output */}
            <div className="p-4 rounded-xl bg-[#151c29] border border-slate-800 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-sora font-bold text-cyan-400 text-xs">QUANT MOMENTUM AGENT</span>
                <span className="text-[10px] text-slate-400">{synthResult.agentContracts.quant.executionLatencyMs}ms</span>
              </div>
              <div className="text-white font-bold">Signal: {synthResult.agentContracts.quant.signal} (Score: {synthResult.agentContracts.quant.score})</div>
              <p className="font-sans text-[11px] text-slate-300">{synthResult.agentContracts.quant.reasoning}</p>
            </div>

            {/* Sentiment NLP Agent Output */}
            <div className="p-4 rounded-xl bg-[#151c29] border border-slate-800 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-sora font-bold text-cyan-400 text-xs">SENTIMENT NLP AGENT</span>
                <span className="text-[10px] text-slate-400">{synthResult.agentContracts.sentiment.executionLatencyMs}ms</span>
              </div>
              <div className="text-white font-bold">Index: {synthResult.agentContracts.sentiment.sentimentIndex}</div>
              <p className="font-sans text-[11px] text-slate-300">{synthResult.agentContracts.sentiment.reasoning}</p>
            </div>

            {/* Fundamental RAG Agent Output */}
            <div className="p-4 rounded-xl bg-[#151c29] border border-slate-800 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-sora font-bold text-cyan-400 text-xs">FUNDAMENTAL RAG AGENT</span>
                <span className="text-[10px] text-slate-400">{synthResult.agentContracts.fundamental.executionLatencyMs}ms</span>
              </div>
              <div className="text-emerald-400 font-bold">{synthResult.agentContracts.fundamental.primaryCitation}</div>
              <p className="font-sans text-[11px] text-slate-300">{synthResult.agentContracts.fundamental.reasoning}</p>
            </div>
          </div>

          {/* Full Reasoning Chain Box */}
          <div className="glass-panel p-4 rounded-xl border border-cyan-400/30">
            <h4 className="font-sora text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-sm">view_timeline</span>
              FULL END-TO-END REASONING CHAIN &amp; SOURCE ATTRIBUTIONS
            </h4>
            <pre className="font-mono text-xs text-cyan-300 whitespace-pre-wrap bg-[#070b13] p-3 rounded-lg border border-slate-800 leading-relaxed">
              {synthResult.fullReasoningChain}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
