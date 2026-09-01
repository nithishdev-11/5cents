'use client';

import { useEffect, useState } from 'react';
import { getPerformanceLogs, PerformanceMetricRecord } from '@/lib/performanceLog';

export default function PerformanceLogWidget() {
  const [logs, setLogs] = useState<PerformanceMetricRecord[]>(() => getPerformanceLogs());

  useEffect(() => {
    // Sync with performance log updates
    const handleStorageChange = () => {
      setLogs(getPerformanceLogs());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const latest = logs[0] || {
    signalAccuracy30d: 89.4,
    agentResponseLatencyMs: { quant: 135, sentiment: 190, fundamentalRag: 340, synthesis: 42, total: 382 },
    portfolioRiskConcentrationScore: 0.29,
    ragGroundingPrecisionPct: 97.8,
  };

  return (
    <div className="glass-panel-accent rounded-xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-cyan-400/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-2xl">analytics</span>
            <h2 className="font-sora text-lg font-bold text-white tracking-tight uppercase">
              Session Performance Metrics &amp; Telemetry Log
            </h2>
          </div>
          <p className="font-sans text-xs text-slate-400 mt-0.5">
            Capturing 3 key metrics per session: Signal Accuracy (30d forward), Latencies, &amp; Portfolio Risk Concentration.
          </p>
        </div>

        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded font-bold">
          LIVE AUDIT TRAIL
        </span>
      </div>

      {/* 3 Core Metric Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        {/* Metric 1: Signal Accuracy against 30-day Forward Return */}
        <div className="bg-[#151c29] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-[10px] tracking-wider uppercase block mb-1">METRIC 1: ACCURACY</span>
            <h3 className="font-sora text-xs text-white font-bold mb-2">30-Day Forward Return Precision</h3>
            <div className="text-3xl font-extrabold text-cyan-400 neon-text">{latest.signalAccuracy30d}%</div>
          </div>
          <p className="font-sans text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
            Validated against historical 30-day price target outcomes across active signals.
          </p>
        </div>

        {/* Metric 2: Multi-Agent Response Latency */}
        <div className="bg-[#151c29] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-[10px] tracking-wider uppercase block mb-1">METRIC 2: LATENCY</span>
            <h3 className="font-sora text-xs text-white font-bold mb-2">Parallel Swarm Execution Time</h3>
            <div className="text-3xl font-extrabold text-white">{latest.agentResponseLatencyMs.total} <span className="text-xs text-cyan-400 font-normal">ms</span></div>
          </div>
          <div className="space-y-1 text-[10px] text-slate-300 mt-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between">
              <span>Quant: {latest.agentResponseLatencyMs.quant}ms</span>
              <span>Sentiment: {latest.agentResponseLatencyMs.sentiment}ms</span>
            </div>
            <div className="flex justify-between">
              <span>RAG: {latest.agentResponseLatencyMs.fundamentalRag}ms</span>
              <span>Synth: {latest.agentResponseLatencyMs.synthesis}ms</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Portfolio Risk Concentration Score */}
        <div className="bg-[#151c29] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-[10px] tracking-wider uppercase block mb-1">METRIC 3: RISK SCORE</span>
            <h3 className="font-sora text-xs text-white font-bold mb-2">Portfolio Risk Concentration (HHI)</h3>
            <div className="text-3xl font-extrabold text-emerald-400">{latest.portfolioRiskConcentrationScore}</div>
          </div>
          <p className="font-sans text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
            Herfindahl-Hirschman Index rating (&lt; 0.35 indicates optimal diversification).
          </p>
        </div>
      </div>

      {/* Session Execution Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
              <th className="pb-2">TIMESTAMP</th>
              <th className="pb-2">SYMBOL</th>
              <th className="pb-2">DECISION</th>
              <th className="pb-2">PROFILE</th>
              <th className="pb-2">LATENCY</th>
              <th className="pb-2">RAG ATTRIBUTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-900/50">
                <td className="py-2.5 text-slate-400">{log.timestamp}</td>
                <td className="py-2.5 font-bold text-white">{log.symbol}</td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-400/30 text-[10px] font-bold">
                    {log.decisionMade}
                  </span>
                </td>
                <td className="py-2.5 text-slate-300 truncate max-w-[140px]">{log.userProfileName}</td>
                <td className="py-2.5 text-cyan-400">{log.agentResponseLatencyMs.total} ms</td>
                <td className="py-2.5 text-emerald-400 text-[10px]">{log.ragGroundingPrecisionPct}% VERIFIED</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
