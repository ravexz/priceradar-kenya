import React from 'react';
import './globals.css';
import { AppLayoutWrapper } from '@/components/layout/AppLayoutWrapper';

export const metadata = {
  title: 'PriceRadar Kenya — Product Discovery & Price Comparison Platform',
  description: "Find the product. Compare the market. Buy from the seller you trust. Kenya's premier product discovery and market pricing intelligence platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased">
        <AppLayoutWrapper>{children}</AppLayoutWrapper>
      </body>
    </html>
  );
}

