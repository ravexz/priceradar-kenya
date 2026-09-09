'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Scale, Store, ShieldCheck, User, Menu, X, ArrowRight } from 'lucide-react';
import { SearchBox } from '../consumer/SearchBox';

interface NavbarProps {
  onOpenAIChat?: () => void;
  compareCount?: number;
}

export function Navbar({ onOpenAIChat, compareCount = 0 }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              PR
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight flex items-center gap-1 text-white">
                PriceRadar <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">KE</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Kenya's Product & Price Engine</span>
            </div>
          </Link>

          {/* Search Box - Desktop & Tablet */}
          <div className="hidden md:block flex-1 max-w-xl">
            <SearchBox />
          </div>

          {/* Quick Actions & Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAIChat}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>AI Assistant</span>
            </button>

            {/* Compare Drawer Link */}
            <Link
              href="/compare"
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Scale className="w-4 h-4 text-slate-400" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Deals */}
            <Link
              href="/deals"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              Today's Deals
            </Link>

            {/* Merchant Portal */}
            <Link
              href="/merchant/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-teal-400 hover:bg-teal-500/10 text-xs font-semibold border border-teal-500/30 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Merchants</span>
            </Link>

            {/* Admin Link */}
            <Link
              href="/admin/matching"
              className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAIChat}
              className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              aria-label="Open AI Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <SearchBox />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/deals"
            className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
            onClick={() => setMobileMenuOpen(false)}
          >
            🔥 Today's Deals
          </Link>
          <Link
            href="/compare"
            className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 flex justify-between"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>⚖️ Compare Products</span>
            {compareCount > 0 && <span className="bg-emerald-500 text-slate-950 font-bold px-2 rounded-full text-xs">{compareCount}</span>}
          </Link>
          <Link
            href="/merchant/dashboard"
            className="block px-3 py-2 rounded-lg text-sm text-teal-300 bg-teal-500/10 border border-teal-500/20"
            onClick={() => setMobileMenuOpen(false)}
          >
            🏪 Merchant Portal & Product Upload
          </Link>
          <Link
            href="/admin/matching"
            className="block px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800"
            onClick={() => setMobileMenuOpen(false)}
          >
            🛡️ Admin Control Panel
          </Link>
        </div>
      )}
    </header>
  );
}
