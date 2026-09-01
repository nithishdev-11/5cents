import { NextResponse } from 'next/server';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY || 'daba559r01qlf7h15mc0daba559r01qlf7h15mcg';

// Default mock fallbacks if Finnhub is rate limited or unavailable
const MOCK_QUOTES: Record<string, { c: number; d: number; dp: number; h: number; l: number; o: number; pc: number }> = {
  NVDA: { c: 124.50, d: 4.85, dp: 4.05, h: 126.10, l: 121.20, o: 122.00, pc: 119.65 },
  TSLA: { c: 168.20, d: -6.40, dp: -3.66, h: 174.50, l: 166.80, o: 173.10, pc: 174.60 },
  AAPL: { c: 185.00, d: 2.15, dp: 1.18, h: 186.40, l: 183.90, o: 184.10, pc: 182.85 }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || 'NVDA').toUpperCase();

  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`, {
      next: { revalidate: 15 }
    });

    if (!res.ok) {
      throw new Error(`Finnhub HTTP ${res.status}`);
    }

    const data = await res.json();
    
    // Check if data is valid quote object (c > 0)
    if (data && typeof data.c === 'number' && data.c > 0) {
      return NextResponse.json({
        symbol,
        currentPrice: data.c,
        change: data.d ?? (data.c - (data.pc || data.c)),
        percentChange: data.dp ?? 0,
        high: data.h ?? data.c,
        low: data.l ?? data.c,
        open: data.o ?? data.c,
        previousClose: data.pc ?? data.c,
        timestamp: Date.now()
      });
    }

    // Fallback to mock data if key is invalid or rate limited
    const mock = MOCK_QUOTES[symbol] || { c: 150.00, d: 2.5, dp: 1.69, h: 152.00, l: 148.50, o: 149.00, pc: 147.50 };
    return NextResponse.json({
      symbol,
      currentPrice: mock.c,
      change: mock.d,
      percentChange: mock.dp,
      high: mock.h,
      low: mock.l,
      open: mock.o,
      previousClose: mock.pc,
      timestamp: Date.now(),
      isFallback: true
    });
  } catch (err: any) {
    console.warn(`Quote fetch error for ${symbol}:`, err?.message);
    const mock = MOCK_QUOTES[symbol] || { c: 150.00, d: 2.5, dp: 1.69, h: 152.00, l: 148.50, o: 149.00, pc: 147.50 };
    return NextResponse.json({
      symbol,
      currentPrice: mock.c,
      change: mock.d,
      percentChange: mock.dp,
      high: mock.h,
      low: mock.l,
      open: mock.o,
      previousClose: mock.pc,
      timestamp: Date.now(),
      isFallback: true
    });
  }
}
