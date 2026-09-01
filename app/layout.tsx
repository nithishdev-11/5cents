import type { Metadata, Viewport } from 'next';
import './globals.css';
import PwaRegister from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: '5 Cents - Apex Intelligence',
  description: 'Mobile-first PWA dark-themed financial intelligence dashboard with live Finnhub market data, agent reasoning signals, sentiment topology, and offline caching.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '5 Cents',
  },
  openGraph: {
    title: '5 Cents - Apex Intelligence',
    description: 'Dark-themed financial intelligence PWA dashboard',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Cents - Apex Intelligence',
    description: 'Dark-themed financial intelligence PWA dashboard',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0e14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body suppressHydrationWarning className="bg-[#0a0e14] text-[#dce2f5] antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
