'use client';

import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ShieldCheck, Activity, Cpu, Microscope, Sun } from 'lucide-react';

const NAV_HISTORIES = {
  '1D': [
    { time: '09:30', value: 2.31 },
    { time: '11:00', value: 2.34 },
    { time: '13:00', value: 2.38 },
    { time: '15:00', value: 2.40 },
    { time: '16:00', value: 2.42 },
  ],
  '1W': [
    { time: 'Mon', value: 2.15 },
    { time: 'Tue', value: 2.22 },
    { time: 'Wed', value: 2.28 },
    { time: 'Thu', value: 2.35 },
    { time: 'Fri', value: 2.42 },
  ],
  '1M': [
    { time: 'W1', value: 1.95 },
    { time: 'W2', value: 2.08 },
    { time: 'W3', value: 2.25 },
    { time: 'W4', value: 2.42 },
  ],
};

export default function PortfolioCard() {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1D');
  const navData = NAV_HISTORIES[timeframe];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="font-sora text-2xl font-bold text-white tracking-tight">Portfolio Insights</h2>
        <p className="font-sans text-xs text-slate-400 mt-1">
          Tactical overview of Indian equity holdings and structural integrity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Vanguard Class Hexagon Clearance Card */}
        <div className="glass-panel-accent rounded-xl p-6 md:col-span-4 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[11px] text-slate-400 tracking-wider">CLEARANCE LEVEL</span>
              <ShieldCheck className="w-5 h-5 text-cyan-400 neon-glow" />
            </div>

            <div className="text-center my-4">
              <div className="relative inline-block my-2">
                <svg className="w-28 h-28 mx-auto neon-glow" viewBox="0 0 100 100" fill="none">
                  <path
                    d="M50 5L90 27.5V72.5L50 95L10 72.5V27.5L50 5Z"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M50 15L80 32V68L50 85L20 68V32L50 15Z"
                    fill="rgba(34,211,238,0.1)"
                  />
                </svg>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sora font-extrabold text-3xl text-cyan-400">
                  V
                </span>
              </div>
              <h3 className="font-sora font-bold text-lg text-white tracking-wide">VANGUARD CLASS</h3>
              <p className="font-sans text-xs text-slate-400 mt-0.5">Top 4% Indian HNIs</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 mt-2 font-mono text-xs">
            <div>
              <span className="block text-[10px] text-slate-400 mb-0.5">WIN RATE</span>
              <span className="font-bold text-cyan-400 text-sm">68.4%</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 mb-0.5">RISK EXPOSURE</span>
              <span className="font-bold text-cyan-400 text-sm">MODERATE</span>
            </div>
          </div>
        </div>

        {/* Net Asset Value Performance Chart */}
        <div className="glass-panel-accent rounded-xl p-6 md:col-span-8 flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.4)] min-h-[300px]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="font-mono text-[11px] text-slate-400 tracking-wider">NET ASSET VALUE</span>
              <div className="flex items-baseline gap-3 mt-1">
                <h3 className="font-sora font-bold text-3xl text-white tracking-tight">₹2.42Cr</h3>
                <span className="font-mono text-sm font-bold text-cyan-400">+14.2%</span>
              </div>
            </div>

            <div className="flex gap-1.5 bg-[#070b13] p-1 rounded-lg border border-slate-800">
              {(['1D', '1W', '1M'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                    timeframe === t
                      ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Area Chart */}
          <div className="flex-1 w-full h-[180px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={navData}>
                <defs>
                  <linearGradient id="navGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis hide domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c1320',
                    borderColor: '#22d3ee',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`₹${val ?? 0}Cr`, 'NAV']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#navGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Connectivity Score */}
        <div className="glass-panel-accent rounded-xl p-5 md:col-span-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-[11px] text-slate-400 tracking-wider">CONNECTIVITY SCORE</span>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>

          <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-2">
            <svg className="w-full h-full text-slate-700" viewBox="0 0 100 100">
              <polygon fill="none" stroke="currentColor" strokeWidth="0.5" points="50,10 90,30 90,70 50,90 10,70 10,30" />
              <polygon fill="none" stroke="currentColor" strokeWidth="0.5" points="50,25 75,40 75,60 50,75 25,60 25,40" />
              <polygon className="neon-glow" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth="1.5" points="50,20 75,35 60,65 50,85 30,55 20,40" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-sora text-3xl font-extrabold text-white">84</span>
              <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30 font-semibold mt-0.5">
                OPTIMAL
              </span>
            </div>
          </div>

          <div className="flex justify-between mt-2 px-6 font-mono text-[11px] text-slate-400">
            <span>TECH</span>
            <span>ENERGY</span>
            <span>BIO</span>
          </div>
        </div>

        {/* Node Allocations List */}
        <div className="glass-panel-accent rounded-xl p-5 md:col-span-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono text-[11px] text-slate-400 tracking-wider">NODE ALLOCATIONS</span>
            <span className="font-mono text-[10px] text-cyan-400 tracking-wider">ACTIVE</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 bg-[#151c29] border border-slate-800 rounded-lg hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sora text-sm font-semibold text-white leading-none">Nifty Bluechip Assets</h4>
                  <span className="font-mono text-xs text-slate-400 mt-1 block">NIFTY-50</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-sm font-semibold text-white">42.5%</div>
                <div className="text-xs text-cyan-400 font-medium">+2.4%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#151c29] border border-slate-800 rounded-lg hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <Microscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sora text-sm font-semibold text-white leading-none">Reliance Ecosystem</h4>
                  <span className="font-mono text-xs text-slate-400 mt-1 block">RIL-CORP</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-sm font-semibold text-white">28.1%</div>
                <div className="text-xs text-cyan-400 font-medium">+0.8%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#151c29] border border-slate-800 rounded-lg hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-red-500/10 border border-red-400/30 flex items-center justify-center text-red-400">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sora text-sm font-semibold text-white leading-none">Tata Strategic Growth</h4>
                  <span className="font-mono text-xs text-slate-400 mt-1 block">TATA-GRW</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-sm font-semibold text-white">15.0%</div>
                <div className="text-xs text-red-400 font-medium">-1.2%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
