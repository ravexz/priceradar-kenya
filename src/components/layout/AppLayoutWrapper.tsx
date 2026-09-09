'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { AIChatDrawer } from '@/components/consumer/AIChatDrawer';

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  return (
    <>
      <Navbar onOpenAIChat={() => setAiDrawerOpen(true)} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Footer />
      <AIChatDrawer isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
    </>
  );
}
