import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface CachedQuote {
  symbol: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

interface QuotesDBSchema extends DBSchema {
  'quotes-cache': {
    key: string;
    value: CachedQuote;
  };
}

let dbPromise: Promise<IDBPDatabase<QuotesDBSchema>> | null = null;

function getDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<QuotesDBSchema>('5cents-quotes-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('quotes-cache')) {
          db.createObjectStore('quotes-cache', { keyPath: 'symbol' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveCachedQuote(quote: CachedQuote): Promise<void> {
  const db = await getDB();
  if (!db) return;
  try {
    await db.put('quotes-cache', quote);
  } catch (err) {
    console.error('Failed to save quote to IndexedDB:', err);
  }
}

export async function getCachedQuote(symbol: string): Promise<CachedQuote | null> {
  const db = await getDB();
  if (!db) return null;
  try {
    const cached = await db.get('quotes-cache', symbol.toUpperCase());
    return cached || null;
  } catch (err) {
    console.error('Failed to read quote from IndexedDB:', err);
    return null;
  }
}

export async function getAllCachedQuotes(): Promise<CachedQuote[]> {
  const db = await getDB();
  if (!db) return [];
  try {
    return await db.getAll('quotes-cache');
  } catch (err) {
    console.error('Failed to read all quotes from IndexedDB:', err);
    return [];
  }
}
