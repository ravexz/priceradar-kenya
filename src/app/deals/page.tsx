'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/components/consumer/ProductCard';
import { TrendingDown, Flame, ShieldCheck, Tag } from 'lucide-react';

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [activeBucket, setActiveBucket] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      setIsLoading(true);
      try {
        let url = '/api/products?sortBy=discount&limit=12';
        if (activeBucket === 'under-30k') url += '&maxPrice=30000';
        if (activeBucket === 'under-50k') url += '&maxPrice=50000';
        if (activeBucket === 'under-100k') url += '&maxPrice=100000';

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setDeals(data.items || []);
        }
      } catch (err) {
        console.error('Error loading deals:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDeals();
  }, [activeBucket]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Deals Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-950 border border-rose-500/30 p-8 text-slate-100 relative overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 w-fit mb-3">
          <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Hot Price Drops in Kenya</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Today's Deals & Verified Price Drops
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
          Save big on electronics across verified stores in Nairobi. Discounts calculated strictly from verified reference prices.
        </p>

        {/* Price Buckets */}
        <div className="flex flex-wrap gap-2 pt-6">
          {[
            { id: 'all', label: 'All Deals' },
            { id: 'under-30k', label: 'Under KSh 30,000' },
            { id: 'under-50k', label: 'Under KSh 50,000' },
            { id: 'under-100k', label: 'Under KSh 100,000' },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBucket(b.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                activeBucket === b.id
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((product) => (
            <ProductCard key={product.variantId} {...product} />
          ))}
        </div>
      )}

    </div>
  );
}
