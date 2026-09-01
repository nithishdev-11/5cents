'use client';

export type UserProfileType = 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE' | 'INSTITUTIONAL_HEDGER';

export interface UserProfile {
  id: UserProfileType;
  name: string;
  description: string;
  riskTolerance: number; // 0.0 (low) to 1.0 (high)
  maxDrawdownTarget: string;
  agentWeights: {
    quantMomentum: number;
    sentimentNlp: number;
    fundamentalRag: number;
  };
  hedgingRequired: boolean;
  positionSizingMultiplier: number;
  stopLossPercent: number;
  badgeColor: string;
}

export const USER_PROFILES: Record<UserProfileType, UserProfile> = {
  CONSERVATIVE: {
    id: 'CONSERVATIVE',
    name: 'Capital Preservation / Conservative',
    description: 'Prioritizes downside protection and SEC filing balance sheet strength. Avoids chasing high-volatility spikes.',
    riskTolerance: 0.25,
    maxDrawdownTarget: '5.0%',
    agentWeights: {
      quantMomentum: 0.20,
      sentimentNlp: 0.20,
      fundamentalRag: 0.60,
    },
    hedgingRequired: true,
    positionSizingMultiplier: 0.5,
    stopLossPercent: 3.5,
    badgeColor: 'emerald',
  },
  BALANCED: {
    id: 'BALANCED',
    name: 'Balanced Growth Operative',
    description: 'Equal weighting across technical momentum, news sentiment, and SEC fundamental RAG citations.',
    riskTolerance: 0.50,
    maxDrawdownTarget: '12.0%',
    agentWeights: {
      quantMomentum: 0.35,
      sentimentNlp: 0.30,
      fundamentalRag: 0.35,
    },
    hedgingRequired: false,
    positionSizingMultiplier: 1.0,
    stopLossPercent: 7.0,
    badgeColor: 'cyan',
  },
  AGGRESSIVE: {
    id: 'AGGRESSIVE',
    name: 'Alpha Seeking / Aggressive Growth',
    description: 'Emphasizes technical price momentum, volume anomaly spikes, and sentiment breakouts for high return potential.',
    riskTolerance: 0.85,
    maxDrawdownTarget: '25.0%',
    agentWeights: {
      quantMomentum: 0.60,
      sentimentNlp: 0.30,
      fundamentalRag: 0.10,
    },
    hedgingRequired: false,
    positionSizingMultiplier: 1.75,
    stopLossPercent: 12.0,
    badgeColor: 'amber',
  },
  INSTITUTIONAL_HEDGER: {
    id: 'INSTITUTIONAL_HEDGER',
    name: 'Institutional Delta-Neutral Hedger',
    description: 'Mandates tail-risk hedging options collars, options gamma analysis, and zero-trust SEC filing audit.',
    riskTolerance: 0.35,
    maxDrawdownTarget: '4.0%',
    agentWeights: {
      quantMomentum: 0.25,
      sentimentNlp: 0.25,
      fundamentalRag: 0.50,
    },
    hedgingRequired: true,
    positionSizingMultiplier: 0.8,
    stopLossPercent: 4.0,
    badgeColor: 'purple',
  },
};

const STORAGE_KEY = '5cents_user_profile';

export function getStoredUserProfile(): UserProfile {
  if (typeof window === 'undefined') return USER_PROFILES.BALANCED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && USER_PROFILES[raw as UserProfileType]) {
      return USER_PROFILES[raw as UserProfileType];
    }
  } catch {
    // fallback
  }
  return USER_PROFILES.BALANCED;
}

export function setStoredUserProfile(type: UserProfileType): UserProfile {
  const profile = USER_PROFILES[type] || USER_PROFILES.BALANCED;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, type);
    } catch {
      // fallback
    }
  }
  return profile;
}
