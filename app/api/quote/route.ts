import { NextResponse } from 'next/server';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY || 'daba559r01qlf7h15mc0daba559r01qlf7h15mcg';

// Default mock fallbacks if Finnhub is rate limited or unavailable
const MOCK_QUOTES: Record<string, { c: number; d: number; dp: number; h: number; l: number; o: number; pc: number }> = {
  'RELIANCE.NS': { c: 2985.40, d: 12.50, dp: 0.42, h: 3010.00, l: 2970.00, o: 2980.00, pc: 2972.90 },
  'TCS.NS': { c: 4120.15, d: -45.30, dp: -1.09, h: 4180.00, l: 4100.00, o: 4175.00, pc: 4165.45 },
  'HDFCBANK.NS': { c: 1612.00, d: 8.40, dp: 0.52, h: 1625.00, l: 1605.00, o: 1608.00, pc: 1603.60 },
  'INFY.NS': { c: 1540.50, d: 15.20, dp: 1.00, h: 1555.00, l: 1520.00, o: 1525.00, pc: 1525.30 },
  'ICICIBANK.NS': { c: 1120.30, d: 5.75, dp: 0.51, h: 1130.00, l: 1112.00, o: 1115.00, pc: 1114.55 }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || 'RELIANCE.NS').toUpperCase();

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
