'use client';

import React, { useState } from 'react';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { AIChatDrawer } from '@/components/consumer/AIChatDrawer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <head>
        <title>PriceRadar Kenya — Product Discovery & Price Comparison Platform</title>
        <meta name="description" content="Find the product. Compare the market. Buy from the seller you trust. Kenya's premier product discovery and market pricing intelligence platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased">
        <Navbar onOpenAIChat={() => setAiDrawerOpen(true)} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
        <AIChatDrawer isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
      </body>
    </html>
  );
}
