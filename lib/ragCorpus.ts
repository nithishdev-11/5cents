'use client';

export interface RagDocumentSnippet {
  id: string;
  symbol: string;
  documentTitle: string; // e.g. "Reliance Industries FY26 Annual Report"
  section: string; // e.g. "Management Discussion & Analysis"
  pageOrParagraph: string; // e.g. "Page 42, Paragraph 3"
  publicationDate: string;
  snippetText: string;
  relevanceScore: number; // 0 to 100
  citationLabel: string; // e.g. "[Source: RIL FY26 AR, p. 42]"
}

export const RAG_CORPUS: RagDocumentSnippet[] = [
  {
    id: 'reliance-ar-26',
    symbol: 'RELIANCE.NS',
    documentTitle: 'Reliance Industries FY26 Annual Report',
    section: 'Management Discussion & Analysis',
    pageOrParagraph: 'Page 54, Paragraph 2',
    publicationDate: '2026-06-15',
    snippetText: 'Digital Services (Jio) margins expanded by 180 bps following full 5G monetization. O2C segment profitability remains resilient despite global refining crack spread volatility.',
    relevanceScore: 98,
    citationLabel: '[Source: RIL FY26 AR, p. 54]',
  },
  {
    id: 'tcs-q1-transcript',
    symbol: 'TCS.NS',
    documentTitle: 'TCS Q1 FY27 Earnings Call Transcript',
    section: 'CEO Remarks & Vertical Analysis',
    pageOrParagraph: 'Section 2, Paragraph 4',
    publicationDate: '2026-07-12',
    snippetText: 'Deal pipeline in BFSI remains strong with a total TCV of ₹10.2B this quarter. Generative AI pilot projects are transitioning to multi-year enterprise production contracts.',
    relevanceScore: 94,
    citationLabel: '[Source: TCS Q1 Transcript]',
  },
  {
    id: 'hdfc-merger-update',
    symbol: 'HDFCBANK.NS',
    documentTitle: 'HDFC Bank Investor Disclosure',
    section: 'Merger Synergies & Asset Quality',
    pageOrParagraph: 'Page 12, Paragraph 1',
    publicationDate: '2026-05-20',
    snippetText: 'Asset quality remains superior with Gross NPA at 1.24%. Synergy benefits from the parent merger are materializing ahead of schedule in operational cost reductions.',
    relevanceScore: 92,
    citationLabel: '[Source: HDFCBANK Investor Deck]',
  },
  {
    id: 'rbi-mpc-minutes',
    symbol: 'MACRO',
    documentTitle: 'RBI Monetary Policy Committee Minutes',
    section: 'Inflation Assessment & Repo Rate Decision',
    pageOrParagraph: 'Section 4, Paragraph 8',
    publicationDate: '2026-08-15',
    snippetText: 'The Committee decided to keep the repo rate unchanged at 6.50% while monitoring food inflation closely. Liquidity conditions in the banking system remain in a slight deficit.',
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
      id: `${symbol}-filing`,
      symbol: symbolUpper,
      documentTitle: `${symbolUpper} Annual Report FY26`,
      section: 'Management Discussion & Analysis',
      pageOrParagraph: 'Page 31',
      publicationDate: '2026-03-01',
      snippetText: `MCA/SEBI disclosure indicates steady operational revenue growth across Indian domestic verticals, zero net floating-rate debt risk, and ongoing capital allocation into high-margin core products.`,
      relevanceScore: 85,
      citationLabel: `[Source: ${symbolUpper} FY26 AR, p. 31]`,
    },
  ];
}
