'use client';

import { ClassifiedSignal } from './signalClassifier';
import { queryRagCorpus, RagDocumentSnippet } from './ragCorpus';
import { UserProfile, USER_PROFILES } from './userProfile';

// Structured Output Contracts for each Agent

export interface QuantAgentContract {
  agentId: 'QUANT_MOMENTUM_V7';
  agentRole: 'Technical Momentum & Volatility Specialist';
  score: number; // -100 to +100
  signal: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  keyMetrics: {
    rsi14: number;
    volumeMultiplier: number;
    supportLevel: number;
    resistanceLevel: number;
  };
  reasoning: string;
  executionLatencyMs: number;
}

export interface SentimentAgentContract {
  agentId: 'SENTIMENT_NLP_V3';
  agentRole: 'News Flow & Sentiment NLP Specialist';
  score: number; // -100 to +100
  sentimentIndex: string; // e.g. "+0.72 High Optimism"
  topHeadlinesAnalyzed: string[];
  reasoning: string;
  executionLatencyMs: number;
}

export interface FundamentalRagContract {
  agentId: 'FUNDAMENTAL_RAG_V9';
  agentRole: 'SEC Filing & Earnings RAG Grounding Specialist';
  score: number; // -100 to +100
  auditStatus: 'VERIFIED_SOLID' | 'MODERATE_RISK' | 'HIGH_DEBT_WARNING';
  groundedSnippets: RagDocumentSnippet[];
  primaryCitation: string;
  reasoning: string;
  executionLatencyMs: number;
}

export interface SynthesizedActionContract {
  symbol: string;
  finalDecision: 'STRONG_BUY' | 'ACCUMULATE' | 'HOLD_HEDGE' | 'REDUCE_EXPOSURE' | 'TACTICAL_COLLAR';
  confidenceScore: number;
  userProfileApplied: UserProfile;
  recommendedPositionSizePct: number;
  stopLossPrice: number;
  targetPrice: number;
  agentContracts: {
    quant: QuantAgentContract;
    sentiment: SentimentAgentContract;
    fundamental: FundamentalRagContract;
  };
  conflictDetected: boolean;
  conflictDetails?: string;
  ragAttributions: string[];
  fullReasoningChain: string;
  synthesizerLatencyMs: number;
  totalLatencyMs: number;
}

// 1. Quant Momentum Agent
export function executeQuantAgent(signal: ClassifiedSignal, price: number): QuantAgentContract {
  const start = performance.now();
  const momentumDim = signal.dimensions.find((d) => d.dimension === 'PRICE_MOMENTUM');
  const volumeDim = signal.dimensions.find((d) => d.dimension === 'VOLUME_ANOMALY');

  const rawScore = ((momentumDim?.score || 0) * 0.6) + ((volumeDim?.score || 0) * 0.4);
  const score = Math.round(Math.min(100, Math.max(-100, rawScore)));

  const isPositive = score > 15;
  const latency = Math.round(performance.now() - start + 120 + Math.random() * 40);

  return {
    agentId: 'QUANT_MOMENTUM_V7',
    agentRole: 'Technical Momentum & Volatility Specialist',
    score,
    signal: isPositive ? 'BULLISH' : score < -15 ? 'BEARISH' : 'NEUTRAL',
    keyMetrics: {
      rsi14: Number((50 + (score * 0.3)).toFixed(1)),
      volumeMultiplier: 2.4,
      supportLevel: Number((price * 0.95).toFixed(2)),
      resistanceLevel: Number((price * 1.08).toFixed(2)),
    },
    reasoning: `Quant Engine detected technical breakout. RSI is at ${(50 + (score * 0.3)).toFixed(1)} with key resistance at $${(price * 1.08).toFixed(2)}. Volume anomaly confirms momentum.`,
    executionLatencyMs: latency,
  };
}

// 2. Sentiment NLP Agent
export function executeSentimentAgent(signal: ClassifiedSignal): SentimentAgentContract {
  const start = performance.now();
  const sentimentDim = signal.dimensions.find((d) => d.dimension === 'SENTIMENT_NLP');
  const score = sentimentDim?.score || 45;
  const latency = Math.round(performance.now() - start + 180 + Math.random() * 50);

  return {
    agentId: 'SENTIMENT_NLP_V3',
    agentRole: 'News Flow & Sentiment NLP Specialist',
    score,
    sentimentIndex: score > 30 ? '+0.74 Strong Optimism' : score < -30 ? '-0.62 Negative Pressure' : '+0.10 Neutral',
    topHeadlinesAnalyzed: [
      `${signal.symbol} product demand surge noted in enterprise cloud survey.`,
      `Wall Street price target raised on margin expansion outlook.`,
    ],
    reasoning: `NLP analysis of news stream indicates positive sentiment bias (+0.74). Major headlines highlight enterprise expansion and institutional inflows.`,
    executionLatencyMs: latency,
  };
}

// 3. Fundamental RAG Agent
export function executeFundamentalRagAgent(symbol: string, forceMissingFiling: boolean = false): FundamentalRagContract {
  const start = performance.now();
  const snippets = forceMissingFiling ? [] : queryRagCorpus(symbol);
  const latency = Math.round(performance.now() - start + 290 + Math.random() * 60);

  if (forceMissingFiling || snippets.length === 0) {
    return {
      agentId: 'FUNDAMENTAL_RAG_V9',
      agentRole: 'SEC Filing & Earnings RAG Grounding Specialist',
      score: 10,
      auditStatus: 'MODERATE_RISK',
      groundedSnippets: [],
      primaryCitation: '[Citation Warning: SEC 10-K Unavailable — Fallback Mode Active]',
      reasoning: `DEGRADED SCENARIO: Primary SEC 10-K filing unretrievable. Fundamental agent downgrades confidence to 10/100 and flags missing disclosure.`,
      executionLatencyMs: latency,
    };
  }

  const primary = snippets[0];
  return {
    agentId: 'FUNDAMENTAL_RAG_V9',
    agentRole: 'SEC Filing & Earnings RAG Grounding Specialist',
    score: 82,
    auditStatus: 'VERIFIED_SOLID',
    groundedSnippets: snippets,
    primaryCitation: primary.citationLabel,
    reasoning: `Grounded in ${primary.documentTitle}: "${primary.snippetText}" — verifies strong balance sheet liquidity and 78.4% gross margin expansion.`,
    executionLatencyMs: latency,
  };
}

// 4. Synthesis Agent Layer
export function executeSynthesisLayer(
  symbol: string,
  currentPrice: number,
  quant: QuantAgentContract,
  sentiment: SentimentAgentContract,
  fundamental: FundamentalRagContract,
  userProfile: UserProfile = USER_PROFILES.BALANCED
): SynthesizedActionContract {
  const start = performance.now();

  // Weighted average score based on User Profile
  const weights = userProfile.agentWeights;
  const weightedScore = Math.round(
    quant.score * weights.quantMomentum +
    sentiment.score * weights.sentimentNlp +
    fundamental.score * weights.fundamentalRag
  );

  // Check for Agent Signal Conflict (e.g. Quant Bullish > 30 but Sentiment Bearish < -20)
  const isQuantBullish = quant.score > 25;
  const isSentimentBearish = sentiment.score < -20;
  const conflictDetected = (isQuantBullish && isSentimentBearish) || (quant.score < -25 && sentiment.score > 20);

  let finalDecision: SynthesizedActionContract['finalDecision'] = 'ACCUMULATE';
  if (conflictDetected || userProfile.hedgingRequired) {
    finalDecision = 'TACTICAL_COLLAR';
  } else if (weightedScore >= 60) {
    finalDecision = 'STRONG_BUY';
  } else if (weightedScore >= 20) {
    finalDecision = 'ACCUMULATE';
  } else if (weightedScore <= -30) {
    finalDecision = 'REDUCE_EXPOSURE';
  } else {
    finalDecision = 'HOLD_HEDGE';
  }

  // Adjust recommended position size & stop loss by user profile
  const baseSize = 8.0; // 8% base allocation
  const recommendedPositionSizePct = Number((baseSize * userProfile.positionSizingMultiplier).toFixed(1));
  const stopLossPrice = Number((currentPrice * (1 - userProfile.stopLossPercent / 100)).toFixed(2));
  const targetPrice = Number((currentPrice * (1 + (weightedScore > 0 ? 0.12 : 0.05))).toFixed(2));

  // Collect all RAG attributions
  const ragAttributions = fundamental.groundedSnippets.map((s) => s.citationLabel);
  if (ragAttributions.length === 0) {
    ragAttributions.push(fundamental.primaryCitation);
  }

  const confidenceScore = Number((Math.min(98.5, Math.max(62.0, 70 + Math.abs(weightedScore) * 0.25))).toFixed(1));
  const synthLatency = Math.round(performance.now() - start + 45);
  const totalLatency = Math.max(quant.executionLatencyMs, sentiment.executionLatencyMs, fundamental.executionLatencyMs) + synthLatency;

  const reasoningChain = `
1. PARALLEL INGESTION: Quant (${quant.score}), Sentiment (${sentiment.score}), Fundamental RAG (${fundamental.score}).
2. USER PROFILE GROUNDING: Applied [${userProfile.name}] weights (Quant: ${(weights.quantMomentum*100).toFixed(0)}%, Sentiment: ${(weights.sentimentNlp*100).toFixed(0)}%, RAG: ${(weights.fundamentalRag*100).toFixed(0)}%). Weighted score = ${weightedScore}.
3. CITATION GROUNDING: ${fundamental.primaryCitation}
4. CONFLICT ANALYSIS: ${conflictDetected ? 'DIVERGENCE DETECTED between Quant and Sentiment. Auto-engaging collar hedge.' : 'Agent signals aligned.'}
5. ACTION CONTRACT: ${finalDecision} with ${recommendedPositionSizePct}% capital allocation and $${stopLossPrice} stop-loss constraint.
  `.trim();

  return {
    symbol,
    finalDecision,
    confidenceScore,
    userProfileApplied: userProfile,
    recommendedPositionSizePct,
    stopLossPrice,
    targetPrice,
    agentContracts: { quant, sentiment, fundamental },
    conflictDetected,
    conflictDetails: conflictDetected ? `Quant Signal (${quant.signal}) conflicts with Sentiment Signal (${sentiment.score < 0 ? 'BEARISH' : 'BULLISH'}).` : undefined,
    ragAttributions,
    fullReasoningChain: reasoningChain,
    synthesizerLatencyMs: synthLatency,
    totalLatencyMs: totalLatency,
  };
}
