'use client';

export interface PerformanceMetricRecord {
  id: string;
  timestamp: string;
  symbol: string;
  signalAccuracy30d: number; // e.g. 88.4%
  agentResponseLatencyMs: {
    quant: number;
    sentiment: number;
    fundamentalRag: number;
    synthesis: number;
    total: number;
  };
  portfolioRiskConcentrationScore: number; // e.g. 0.32 HHI / 1.18 Beta
  ragGroundingPrecisionPct: number; // e.g. 96.5%
  decisionMade: string;
  userProfileName: string;
}

const STORAGE_KEY = '5cents_perf_logs';

export function getPerformanceLogs(): PerformanceMetricRecord[] {
  if (typeof window === 'undefined') return getDefaultLogs();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return getDefaultLogs();
}

export function recordPerformanceEntry(entry: Omit<PerformanceMetricRecord, 'id' | 'timestamp'>): PerformanceMetricRecord[] {
  const logs = getPerformanceLogs();
  const newRecord: PerformanceMetricRecord = {
    ...entry,
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
  };
  const updated = [newRecord, ...logs].slice(0, 20); // keep last 20

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // fallback
    }
  }
  return updated;
}

function getDefaultLogs(): PerformanceMetricRecord[] {
  return [
    {
      id: 'log-1',
      timestamp: '09:42:15 AM',
      symbol: 'NVDA',
      signalAccuracy30d: 91.2,
      agentResponseLatencyMs: { quant: 135, sentiment: 190, fundamentalRag: 340, synthesis: 42, total: 382 },
      portfolioRiskConcentrationScore: 0.28,
      ragGroundingPrecisionPct: 98.4,
      decisionMade: 'STRONG_BUY',
      userProfileName: 'Balanced Growth Operative',
    },
    {
      id: 'log-2',
      timestamp: '09:30:04 AM',
      symbol: 'TSLA',
      signalAccuracy30d: 86.5,
      agentResponseLatencyMs: { quant: 142, sentiment: 215, fundamentalRag: 380, synthesis: 50, total: 430 },
      portfolioRiskConcentrationScore: 0.34,
      ragGroundingPrecisionPct: 95.0,
      decisionMade: 'TACTICAL_COLLAR',
      userProfileName: 'Capital Preservation / Conservative',
    },
    {
      id: 'log-3',
      timestamp: '09:15:30 AM',
      symbol: 'AAPL',
      signalAccuracy30d: 89.8,
      agentResponseLatencyMs: { quant: 110, sentiment: 165, fundamentalRag: 310, synthesis: 38, total: 348 },
      portfolioRiskConcentrationScore: 0.29,
      ragGroundingPrecisionPct: 97.2,
      decisionMade: 'ACCUMULATE',
      userProfileName: 'Alpha Seeking / Aggressive Growth',
    },
  ];
}
