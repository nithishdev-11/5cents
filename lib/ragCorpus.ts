'use client';

export interface RagDocumentSnippet {
  id: string;
  symbol: string;
  documentTitle: string; // e.g. "NVIDIA Corp SEC Form 10-K (Annual Report)"
  section: string; // e.g. "Item 7: Management's Discussion and Analysis (MD&A)"
  pageOrParagraph: string; // e.g. "Page 42, Paragraph 3"
  publicationDate: string;
  snippetText: string;
  relevanceScore: number; // 0 to 100
  citationLabel: string; // e.g. "[Source: NVDA 10-K Item 7, p. 42]"
}

export const RAG_CORPUS: RagDocumentSnippet[] = [
  {
    id: 'reliance-annual-report',
    symbol: 'RELIANCE.NS',
    documentTitle: 'Reliance Industries Ltd Annual Report FY26',
    section: 'MD&A: Digital Services & O2C Segment',
    pageOrParagraph: 'Page 54, Paragraph 2',
    publicationDate: '2026-06-15',
    snippetText: 'Jio platforms observed a 15% ARPU growth following 5G monetization efforts. O2C margins remain resilient at 12.4% despite global crude volatility, supported by high-complexity refining capabilities.',
    relevanceScore: 98,
    citationLabel: '[Source: RELIANCE FY26 AR, p. 54]',
  },
  {
    id: 'tcs-q1-results',
    symbol: 'TCS.NS',
    documentTitle: 'TCS Q1 FY27 Earnings Release',
    section: 'Operational Performance & Guidance',
    pageOrParagraph: 'Press Release, p. 2',
    publicationDate: '2026-07-10',
    snippetText: 'TCS reported a strong TCV of $10.2B in Q1, driven by generative AI enterprise transformation deals in the BFSI sector. Operating margins expanded to 24.8% due to efficient resource utilization.',
    relevanceScore: 94,
    citationLabel: '[Source: TCS Q1 FY27 Press Release]',
  },
  {
    id: 'hdfc-sebi-filing',
    symbol: 'HDFCBANK.NS',
    documentTitle: 'HDFC Bank SEBI Disclosure: Merger Integration Update',
    section: 'Note 4: Asset Quality & NPA Assessment',
    pageOrParagraph: 'Page 12, Paragraph 1',
    publicationDate: '2026-05-22',
    snippetText: 'Gross NPA stabilized at 1.24% following successful integration of parent assets. Net interest margin (NIM) guidance remains in the 3.8-4.1% range for the next 4 quarters.',
    relevanceScore: 92,
    citationLabel: '[Source: HDFCBANK SEBI Disclosure, p. 12]',
  },
  {
    id: 'rbp-policy-minutes',
    symbol: 'MACRO',
    documentTitle: 'RBI Monetary Policy Committee Minutes',
    section: 'Inflation Assessment & Repo Rate Decision',
    pageOrParagraph: 'Section 2, Paragraph 5',
    publicationDate: '2026-08-15',
    snippetText: 'The MPC decided to keep the repo rate unchanged at 6.50% while maintaining a focus on withdrawal of accommodation. CPI inflation is projected to average 4.5% for FY27.',
    relevanceScore: 88,
    citationLabel: '[Source: RBI MPC Minutes Aug 2026]',
  },
];

export function queryRagCorpus(symbol: string, queryTerm?: string): RagDocumentSnippet[] {
  const symbolUpper = symbol.toUpperCase();
  const matched = RAG_CORPUS.filter(
    (doc) => doc.symbol === symbolUpper || doc.symbol === 'MACRO'
  );

  if (matched.length > 0) {
    return matched;
  }

  // Fallback default citation if symbol is not directly in predefined static index
  return [
    {
      id: `${symbol}-sebi-filing`,
      symbol: symbolUpper,
      documentTitle: `${symbolUpper} SEBI Filing / Annual Report`,
      section: 'Director\'s Report & MD&A',
      pageOrParagraph: 'Financial Highlights',
      publicationDate: '2026-05-01',
      snippetText: `Company reporting indicates steady growth in Indian operations, stable debt-to-equity ratios, and strategic expansion into Tier-2 and Tier-3 markets.`,
      relevanceScore: 85,
      citationLabel: `[Source: ${symbolUpper} SEBI Disclosure]`,
    },
  ];
}
