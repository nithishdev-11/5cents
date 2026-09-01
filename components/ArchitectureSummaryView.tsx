'use client';

export default function ArchitectureSummaryView() {
  return (
    <div className="glass-panel-accent rounded-xl p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-cyan-400 text-3xl">account_tree</span>
          <h1 className="font-sora text-2xl font-bold text-white tracking-tight uppercase">
            System Architecture &amp; Decision Logic Summary
          </h1>
        </div>
        <p className="font-sans text-xs text-slate-400">
          Executive summary for competition judges describing the multi-agent design, 3-dimension signal classification engine, RAG SEC citation grounding, and fault tolerance architecture.
        </p>
      </div>

      {/* Section 1: Architecture Overview */}
      <div className="space-y-3">
        <h2 className="font-sora text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 border-b border-cyan-400/20 pb-2">
          <span className="material-symbols-outlined text-base">schema</span>
          1. Multi-Agent Architecture Overview
        </h2>
        <p className="font-sans text-xs text-slate-300 leading-relaxed">
          The <strong>5 Cents — Apex Intelligence</strong> platform implements a decoupled, parallel multi-agent system designed for zero-trust financial analysis. Market inputs are simultaneously evaluated across three specialized autonomous agent micro-services, which output structured JSON contracts to a master Synthesis Layer.
        </p>

        {/* ASCII Flow Diagram */}
        <div className="bg-[#070b13] p-4 rounded-xl border border-cyan-400/30 font-mono text-xs text-cyan-300 overflow-x-auto">
          <pre className="whitespace-pre">
{`+-----------------------------------------------------------------------------------+
|                            RAW DATA INGESTION TAPE                                |
|             (Finnhub Level-1 Quotes, Volume Spikes, SEC 10-K Filings)              |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                   3-DIMENSION SIGNAL CLASSIFICATION MODULE                        |
|  [Price Momentum (RSI/MACD)]  [Volume Anomaly (2.8x)]  [NLP News Sentiment (+0.74)] |
+-----------------------------------------------------------------------------------+
                                          |
      +-----------------------------------+-----------------------------------+
      |                                   |                                   |
      v                                   v                                   v
+-------------------+           +-------------------+           +-------------------+
| AGENT 1: QUANT    |           | AGENT 2: SENTIMENT|           | AGENT 3: FUND     |
| Technical & Volume|           | News NLP Stream   |           | SEC RAG Grounding |
+-------------------+           +-------------------+           +-------------------+
      |                                   |                                   |
      +-----------------------------------+-----------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        SYNTHESIS LAYER & USER PROFILER                            |
|    - Applies User Risk Profile Matrix (Conservative, Balanced, Aggressive)        |
|    - Performs Conflict Detection & Option Collar Auto-Hedging                     |
|    - Binds SEC 10-K RAG Citation [Source: NVDA 10-K Item 7, p. 42]                |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                       UNIFIED ACTION CONTRACT & PORTFOLIO                         |
|   [STRONG_BUY / TACTICAL_COLLAR] • [Position Size: 8.0%] • [Stop Loss: $120.10]    |
+-----------------------------------------------------------------------------------+`}
          </pre>
        </div>
      </div>

      {/* Section 2: 3-Dimension Classification Engine */}
      <div className="space-y-3">
        <h2 className="font-sora text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 border-b border-cyan-400/20 pb-2">
          <span className="material-symbols-outlined text-base">tune</span>
          2. Signal Classification &amp; RAG Citation Grounding
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-[#151c29] p-4 rounded-xl border border-slate-800">
            <h3 className="font-sora font-bold text-white text-xs mb-2">3-Dimension Classification</h3>
            <ul className="space-y-2 text-slate-300 font-sans text-[11px]">
              <li>• <strong>Dimension A (Momentum)</strong>: Evaluates 20D vs 50D EMA crossovers and RSI velocity limits.</li>
              <li>• <strong>Dimension B (Volume Anomaly)</strong>: Detects institutional block trade volume spikes (&gt;2.0x average).</li>
              <li>• <strong>Dimension C (NLP Sentiment)</strong>: Analyzes real-time news headlines using Gemini NLP sentiment scoring.</li>
            </ul>
          </div>

          <div className="bg-[#151c29] p-4 rounded-xl border border-slate-800">
            <h3 className="font-sora font-bold text-white text-xs mb-2">RAG Citation Grounding</h3>
            <p className="font-sans text-[11px] text-slate-300 leading-relaxed">
              Every fundamental output is strictly grounded in SEC Form 10-K / 10-Q disclosures and quarterly earnings transcripts. Every output rendered in the UI contains explicit click-to-verify citations such as <code className="text-cyan-400">[Source: NVDA 10-K Item 7, p. 42]</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: User Profiling Adaptation */}
      <div className="space-y-3">
        <h2 className="font-sora text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 border-b border-cyan-400/20 pb-2">
          <span className="material-symbols-outlined text-base">person</span>
          3. User Profiling &amp; Fault Handling
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-[#151c29] p-4 rounded-xl border border-slate-800">
            <h3 className="font-sora font-bold text-white text-xs mb-2">User Profile Adaptation</h3>
            <p className="font-sans text-[11px] text-slate-300 leading-relaxed">
              Identical market data yields distinct recommendations based on the user&apos;s stored profile. Conservative profiles receive hedged allocations with tight stop-loss parameters, while Aggressive profiles capture maximum momentum position sizing.
            </p>
          </div>

          <div className="bg-[#151c29] p-4 rounded-xl border border-slate-800">
            <h3 className="font-sora font-bold text-white text-xs mb-2">Degraded Scenario Resilience</h3>
            <p className="font-sans text-[11px] text-slate-300 leading-relaxed">
              If an API feed drops or an SEC filing is missing, the platform automatically fails over to IndexedDB vault caching, flags missing disclosures with uncertainty scores, and executes without throwing unhandled exceptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
