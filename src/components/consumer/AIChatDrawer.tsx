'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatKES } from '@/lib/utils/currency';
import { Sparkles, X, Send, Bot, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatDrawer({ isOpen, onClose }: AIChatDrawerProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  if (!isOpen) return null;

  const handleQuickPrompt = (text: string) => {
    setPrompt(text);
    executeSearch(text);
  };

  const executeSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText }),
      });
      if (res.ok) {
        const data = await res.json();
        setResponse(data);
      }
    } catch (err) {
      console.error('AI assistant error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>AI Shopping Assistant</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">Live DB</span>
              </h3>
              <p className="text-[11px] text-slate-400">Grounded in real Kenyan merchant prices & specs</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Quick Preset Prompts */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Sample Prompts</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleQuickPrompt('Find me the best phone under KSh 30,000')}
                className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-emerald-300 border border-slate-700 transition-colors text-left"
              >
                📱 Best phone under KSh 30,000
              </button>
              <button
                onClick={() => handleQuickPrompt('I need a laptop for programming under KSh 100,000')}
                className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-teal-300 border border-slate-700 transition-colors text-left"
              >
                💻 Programming laptop under KSh 100,000
              </button>
              <button
                onClick={() => handleQuickPrompt('Compare Samsung Galaxy S25 Ultra and iPhone 16 Pro Max')}
                className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors text-left"
              >
                ⚖️ Compare S25 Ultra vs iPhone 16 Pro
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-slate-800">
              <Sparkles className="w-8 h-8 mx-auto text-emerald-400 animate-spin mb-2" />
              <p className="text-xs text-slate-300 font-semibold">Querying live Kenyan merchant catalog...</p>
            </div>
          )}

          {/* AI Response Output */}
          {response && !isLoading && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{response.querySummary}</p>
                  <p className="text-[11px] text-emerald-300/80 mt-0.5">{response.aiExplanation}</p>
                </div>
              </div>

              {/* Recommended Cards */}
              <div className="space-y-3">
                {response.recommendations?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 hover:border-emerald-500/40 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                          Option #{idx + 1} • {item.brandName}
                        </span>
                        <h4 className="text-sm font-bold text-white">{item.productName}</h4>
                      </div>
                      <span className="text-sm font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        {formatKES(item.lowestPriceKes)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono mb-2">{item.keySpecs}</p>

                    {/* Why Recommended */}
                    <div className="space-y-1 mb-3">
                      {item.whyRecommended?.map((why: string, i: number) => (
                        <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{why}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">{item.sellersCount} verified sellers</span>
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={onClose}
                        className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>View Offers</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Anti-Hallucination Disclaimer */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[10px] text-slate-500 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{response.disclaimer}</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form Footer */}
        <form onSubmit={handleSubmit} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI Assistant e.g. Best phone under KSh 50,000..."
            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
