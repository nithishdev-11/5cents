'use client';

export type TabType = 'dashboard' | 'signals' | 'neural' | 'config';

interface BottomNavBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function BottomNavBar({ activeTab, setActiveTab }: BottomNavBarProps) {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'DASHBOARD', icon: 'grid_view' },
    { id: 'signals', label: 'SIGNALS', icon: 'show_chart' },
    { id: 'neural', label: 'NEURAL', icon: 'psychology' },
    { id: 'config', label: 'CONFIG', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#151c29]/90 backdrop-blur-2xl rounded-full px-4 py-2 border border-cyan-400/30 shadow-[0_0_25px_rgba(34,211,238,0.2)] flex gap-4 md:gap-8 items-center w-[92%] max-w-md justify-around">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
              isActive
                ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                : 'text-slate-400 hover:text-cyan-200 opacity-70 hover:opacity-100'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl mb-0.5"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tab.icon}
            </span>
            <span className="font-mono text-[10px] tracking-wider font-semibold">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
