'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';

interface SentimentRadarProps {
  dataOverride?: { subject: string; value: number }[];
}

export default function SentimentRadar({ dataOverride }: SentimentRadarProps) {
  const radarData = useMemo(() => {
    if (dataOverride && dataOverride.length > 0) return dataOverride;
    return [
      { subject: 'MOMENTUM', value: 88, fullMark: 100 },
      { subject: 'LIQUIDITY', value: 72, fullMark: 100 },
      { subject: 'VOLUME', value: 94, fullMark: 100 },
      { subject: 'VOLATILITY', value: 65, fullMark: 100 },
      { subject: 'SOCIAL', value: 81, fullMark: 100 },
      { subject: 'SENTIMENT', value: 90, fullMark: 100 },
    ];
  }, [dataOverride]);

  return (
    <div className="glass-panel-accent rounded-xl p-5 relative overflow-hidden flex flex-col h-full min-h-[380px]">
      <div className="hologram-scanline" />

      <div className="flex justify-between items-center mb-2 pb-3 border-b border-cyan-400/20">
        <h2 className="font-sora text-base font-bold text-white flex items-center gap-2 tracking-wide uppercase">
          <span className="material-symbols-outlined text-cyan-400 text-xl">hub</span>
          Market Sentiment Matrix
        </h2>
        <div className="flex items-center gap-1.5 bg-[#070b13] px-2.5 py-1 rounded border border-cyan-400/30">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[11px] text-cyan-400 font-medium">LIVE STREAM</span>
        </div>
      </div>

      <div className="flex-1 w-full relative min-h-[280px]">
        {/* Background Grid Accent */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(34,211,238,0.4) 0%, transparent 70%)',
          }}
        />

        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="rgba(164, 230, 255, 0.2)" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#a4e6ff', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 600 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Sentiment Matrix"
              dataKey="value"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="#00d1ff"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
