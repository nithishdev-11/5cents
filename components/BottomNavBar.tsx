'use client';

export type TabType = 'dashboard' | 'signals' | 'neural' | 'demo' | 'arch' | 'config';

interface BottomNavBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

import DashboardIcon from '@mui/icons-material/Dashboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';

export default function BottomNavBar({ activeTab, setActiveTab }: BottomNavBarProps) {
  const tabs = [
    { id: 'dashboard', label: 'DASH', icon: <DashboardIcon className="text-lg" /> },
    { id: 'signals', label: 'SIGNALS', icon: <ShowChartIcon className="text-lg" /> },
    { id: 'neural', label: 'NEURAL', icon: <PsychologyIcon className="text-lg" /> },
    { id: 'demo', label: 'DEMO', icon: <PlayCircleIcon className="text-lg" /> },
    { id: 'arch', label: 'ARCH', icon: <AccountTreeIcon className="text-lg" /> },
    { id: 'config', label: 'CONFIG', icon: <SettingsIcon className="text-lg" /> },
  ] as const;

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#151c29]/95 backdrop-blur-2xl rounded-full px-3 py-2 border border-cyan-400/30 shadow-[0_0_25px_rgba(34,211,238,0.25)] flex gap-2 md:gap-6 items-center w-[96%] max-w-lg justify-around">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
              isActive
                ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-105'
                : 'text-slate-400 hover:text-cyan-200 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="mb-0.5">
              {tab.icon}
            </div>
            <span className="font-mono text-[9px] tracking-wider font-semibold">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
