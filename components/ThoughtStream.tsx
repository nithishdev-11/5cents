'use client';

import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface ThoughtNode {
  id: string;
  time: string;
  text: string;
  isWarning?: boolean;
  tags?: string[];
}

const INITIAL_NODES: ThoughtNode[] = [
  {
    id: '1',
    time: 'T-0.01ms',
    text: 'Initial query parsed. Intent classification: HIGH_PRIORITY market scan.',
  },
  {
    id: '2',
    time: 'T-0.05ms',
    text: 'Accessing historical vector databases for pattern matching.',
  },
  {
    id: '3',
    time: 'T-0.12ms',
    text: 'Evaluating alternative hypothesis paths (3 generated).',
    tags: ['PATH A (92%)', 'PATH B (4%)'],
  },
  {
    id: '4',
    time: 'T-0.24ms',
    text: 'Conflict detected in source data. Initiating secondary verification protocol.',
    isWarning: true,
  },
];

const TOPOLOGY_DATA = [
  { time: 'T-0', lineA: 40, lineB: 30 },
  { time: 'T-1', lineA: 35, lineB: 40 },
  { time: 'T-2', lineA: 45, lineB: 25 },
  { time: 'T-3', lineA: 20, lineB: 35 },
  { time: 'T-4', lineA: 30, lineB: 20 },
  { time: 'T-5', lineA: 15, lineB: 35 },
  { time: 'T-6', lineA: 25, lineB: 20 },
  { time: 'T-7', lineA: 10, lineB: 25 },
  { time: 'NOW', lineA: 5, lineB: 15 },
];

export default function ThoughtStream() {
  const [nodes, setNodes] = useState<ThoughtNode[]>(INITIAL_NODES);
  const [isPaused, setIsPaused] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAskAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    const userText = customPrompt.trim();
    setCustomPrompt('');
    setIsAnalyzing(true);

    const newNode: ThoughtNode = {
      id: String(Date.now()),
      time: `T-${(Math.random() * 0.5).toFixed(2)}ms`,
      text: `User query injected: "${userText}". Processing live neural net inference...`,
    };

    setNodes((prev) => [newNode, ...prev]);

    try {
      // Simulate or call Gemini server-side if key available
      setTimeout(() => {
        const responseNode: ThoughtNode = {
          id: String(Date.now() + 1),
          time: `T-${(Math.random() * 0.9).toFixed(2)}ms`,
          text: `Neural response evaluated: High correlation detected with market volume indicators for "${userText}".`,
          tags: ['CONFIDENCE 96.5%'],
        };
        setNodes((prev) => [responseNode, ...prev]);
        setIsAnalyzing(false);
      }, 1000);
    } catch {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-cyan-400/20 pb-4">
        <div>
          <h1 className="font-sora text-3xl font-extrabold text-cyan-400 uppercase tracking-tight neon-text mb-1">
            Agent Reasoning
          </h1>
          <p className="font-mono text-xs text-cyan-300/70 flex items-center gap-2">
            ID: N-TRACE-7829-XR // STATUS:{' '}
            <span className="text-cyan-400 border border-cyan-400/40 px-2 py-0.5 rounded text-[10px] animate-pulse">
              {isPaused ? 'HALTED' : 'ACTIVE_ANALYSIS'}
            </span>
          </p>
        </div>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`border font-mono text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            isPaused
              ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10'
              : 'border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {isPaused ? 'play_circle' : 'pause_circle'}
          </span>
          {isPaused ? 'RESUME PROCESS' : 'HALT PROCESS'}
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Thought Stream Timeline (Left 5 cols) */}
        <div className="lg:col-span-5 glass-panel-accent rounded-xl p-5 flex flex-col h-[560px]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-cyan-400/20">
            <h2 className="font-sora text-base font-bold text-cyan-400 tracking-wide">THOUGHT STREAM</h2>
            <span className="material-symbols-outlined text-cyan-400/60 text-lg">account_tree</span>
          </div>

          {/* Interactive Agent Input */}
          <form onSubmit={handleAskAgent} className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Inject query into Neural Agent..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="flex-1 bg-[#0c1320] border border-cyan-400/20 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isAnalyzing}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 shrink-0"
            >
              {isAnalyzing ? (
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined text-sm">send</span>
              )}
            </button>
          </form>

          {/* Vertical Timeline */}
          <div className="flex-1 overflow-y-auto pr-1 relative space-y-4">
            <div className="absolute left-3.5 top-2 bottom-2 w-[1px] bg-cyan-400/20" />

            {nodes.map((node) => (
              <div key={node.id} className="flex gap-3 items-start relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                    node.isWarning
                      ? 'bg-red-950 border-2 border-red-400 text-red-400 shadow-[0_0_10px_rgba(255,180,171,0.4)]'
                      : 'bg-[#0c1320] border-2 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                  }`}
                >
                  {node.isWarning ? '!' : '•'}
                </div>

                <div
                  className={`flex-1 p-3 rounded-lg border text-xs font-sans ${
                    node.isWarning
                      ? 'bg-red-500/10 border-red-500/30 text-red-300'
                      : 'bg-[#151c29]/60 border-cyan-400/20 text-slate-200'
                  }`}
                >
                  <p className="font-mono text-[10px] text-cyan-400/70 mb-1">{node.time}</p>
                  <p className="leading-relaxed">{node.text}</p>
                  {node.tags && (
                    <div className="mt-2 flex gap-1.5 flex-wrap">
                      {node.tags.map((tg, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 border border-cyan-400/30 text-[9px] font-mono text-cyan-300 rounded"
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 7 Cols: Sentiment Topology & Risk Biometrics */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Sentiment Topology Line Chart */}
          <div className="glass-panel-accent rounded-xl p-5 flex-1 flex flex-col min-h-[260px]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-sora text-base font-bold text-cyan-400 tracking-wide">SENTIMENT TOPOLOGY</h2>
              <span className="font-mono text-[10px] px-2 py-0.5 bg-cyan-500/10 border border-cyan-400/30 rounded text-cyan-400">
                REALTIME
              </span>
            </div>

            <div className="flex-1 w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TOPOLOGY_DATA}>
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} fontFamily="JetBrains Mono" />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1320',
                      borderColor: '#22d3ee',
                      borderRadius: '8px',
                      color: '#fff',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '11px',
                    }}
                  />
                  <Line type="monotone" dataKey="lineA" stroke="#22d3ee" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="lineB" stroke="#ffb4ab" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Biometrics Gauges */}
          <div className="glass-panel-accent rounded-xl p-5">
            <h2 className="font-sora text-base font-bold text-cyan-400 tracking-wide mb-4">RISK BIOMETRICS</h2>

            <div className="grid grid-cols-3 gap-3">
              {/* Gauge 1: Certainty */}
              <div className="flex flex-col items-center justify-center border border-cyan-400/20 bg-[#151c29]/50 rounded-xl p-3 relative">
                <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-400/60">SYS</div>
                <div className="w-14 h-14 rounded-full border-2 border-cyan-400/30 flex items-center justify-center relative my-1">
                  <span className="font-mono text-sm font-bold text-cyan-400 neon-text">68%</span>
                </div>
                <span className="font-mono text-[10px] text-cyan-300/80 font-bold mt-1">CERTAINTY</span>
              </div>

              {/* Gauge 2: Anomaly */}
              <div className="flex flex-col items-center justify-center border border-red-500/30 bg-red-500/10 rounded-xl p-3 relative">
                <div className="absolute top-2 right-2 text-[10px] font-mono text-red-400/60">DEV</div>
                <div className="w-14 h-14 rounded-full border-2 border-red-500/40 flex items-center justify-center relative my-1">
                  <span className="font-mono text-sm font-bold text-red-400">12%</span>
                </div>
                <span className="font-mono text-[10px] text-red-400 font-bold mt-1">ANOMALY</span>
              </div>

              {/* Gauge 3: Alignment */}
              <div className="flex flex-col items-center justify-center border border-cyan-400/20 bg-[#151c29]/50 rounded-xl p-3 relative">
                <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-400/60">ETH</div>
                <div className="w-14 h-14 rounded-full border-2 border-cyan-400/30 flex items-center justify-center relative my-1">
                  <span className="font-mono text-sm font-bold text-cyan-400">94%</span>
                </div>
                <span className="font-mono text-[10px] text-cyan-300/80 font-bold mt-1">ALIGNMENT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
