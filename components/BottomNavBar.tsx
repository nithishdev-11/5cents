'use client';

import { LayoutDashboard, TrendingUp, Brain, PlayCircle, Network, Settings } from 'lucide-react';

export type TabType = 'dashboard' | 'signals' | 'neural' | 'demo' | 'arch' | 'config';

interface BottomNavBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function BottomNavBar({ activeTab, setActiveTab }: BottomNavBarProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'DASH', icon: LayoutDashboard },
    { id: 'signals' as const, label: 'SIGNALS', icon: TrendingUp },
    { id: 'neural' as const, label: 'NEURAL', icon: Brain },
    { id: 'demo' as const, label: 'DEMO', icon: PlayCircle },
    { id: 'arch' as const, label: 'ARCH', icon: Network },
    { id: 'config' as const, label: 'CONFIG', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#151c29]/95 backdrop-blur-2xl rounded-full px-3 py-2 border border-cyan-400/30 shadow-[0_0_25px_rgba(34,211,238,0.25)] flex gap-2 md:gap-6 items-center w-[96%] max-w-lg justify-around">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
              isActive
                ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-105'
                : 'text-slate-400 hover:text-cyan-200 opacity-70 hover:opacity-100'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'fill-cyan-400/20' : ''}`} />
            <span className="font-mono text-[9px] tracking-wider font-semibold">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
