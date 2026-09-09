'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, GitMerge, Split, CheckCircle2, AlertOctagon, RefreshCw, FileText } from 'lucide-react';

export default function AdminMatchingPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Demo fallback queue items if DB is empty
  const defaultQueue = [
    {
      id: 'match-q-1',
      rawOfferTitle: 'Samsung S25 Ultra 12/256 Titanium Black',
      rawMerchantSku: 'AVECHI-S25-256',
      brandName: 'Samsung',
      candidateVariantId: 'v-1',
      candidateName: 'Samsung Galaxy S25 Ultra (256GB / 12GB RAM)',
      confidenceScore: 0.92,
      matchLevel: 2,
      status: 'PENDING',
      notes: 'Deterministic match on RAM, Storage, and Model',
    },
    {
      id: 'match-q-2',
      rawOfferTitle: 'Galaxy S25 Ultra 512GB (Titanium Gray)',
      rawMerchantSku: 'SALIM-S25-512',
      brandName: 'Samsung',
      candidateVariantId: 'v-2',
      candidateName: 'Samsung Galaxy S25 Ultra (512GB / 12GB RAM)',
      confidenceScore: 0.88,
      matchLevel: 3,
      status: 'PENDING',
      notes: 'Token similarity overlap match',
    },
    {
      id: 'match-q-3',
      rawOfferTitle: 'iPhone 16 Pro 256GB Natural',
      rawMerchantSku: 'JUM-IP16P-256',
      brandName: 'Apple',
      candidateVariantId: 'v-3',
      candidateName: 'Apple iPhone 16 Pro Max (256GB)',
      confidenceScore: 0.68,
      matchLevel: 4,
      status: 'PENDING',
      notes: 'Ambiguous match: Pro vs Pro Max variant distinction required',
    },
  ];

  useEffect(() => {
    async function loadQueue() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/matching');
        if (res.ok) {
          const data = await res.json();
          setQueue(data.items && data.items.length > 0 ? data.items : defaultQueue);
        } else {
          setQueue(defaultQueue);
        }
      } catch (err) {
        setQueue(defaultQueue);
      } finally {
        setIsLoading(false);
      }
    }
    loadQueue();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'split') => {
    try {
      const res = await fetch('/api/admin/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchQueueId: id, action }),
      });

      setQueue((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: action === 'approve' ? 'APPROVED' : 'REJECTED' } : item))
      );
    } catch (err) {
      console.error('Match action error:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Admin Panel Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Product Matching & Moderation Engine</h1>
            <p className="text-xs text-slate-400">Review ambiguous merchant listings, approve canonical product merges, or split distinct variants</p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800">
          5-Level Matching Engine
        </span>
      </div>

      {/* Review Queue Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-emerald-400" />
            <span>Product Match Review Queue</span>
          </h2>
          <span className="text-xs text-slate-400">{queue.filter((q) => q.status === 'PENDING').length} Pending Reviews</span>
        </div>

        {isLoading ? (
          <div className="h-64 bg-slate-950 rounded-2xl animate-pulse" />
        ) : (
          <div className="space-y-3">
            {queue.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  item.status === 'APPROVED'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : item.status === 'REJECTED'
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      Level {item.matchLevel} Match
                    </span>
                    <span className={`text-xs font-bold ${item.confidenceScore >= 0.85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      Confidence: {(item.confidenceScore * 100).toFixed(0)}%
                    </span>
                    {item.status !== 'PENDING' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-white">
                        {item.status}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white">Raw Merchant Title: "{item.rawOfferTitle}"</h3>
                  <p className="text-xs text-slate-400">Candidate Canonical Variant: <strong className="text-emerald-300">{item.candidateName}</strong></p>
                  <p className="text-[11px] text-slate-500 font-mono">{item.notes}</p>
                </div>

                {/* Actions */}
                {item.status === 'PENDING' && (
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => handleAction(item.id, 'split')}
                      className="py-1.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1"
                    >
                      <Split className="w-3.5 h-3.5" />
                      <span>Split (Reject)</span>
                    </button>

                    <button
                      onClick={() => handleAction(item.id, 'approve')}
                      className="py-1.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/10"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Merge</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
