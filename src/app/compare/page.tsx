'use client';

import React, { useState, useEffect } from 'react';
import { ComparisonMatrix } from '@/components/consumer/ComparisonMatrix';
import { SearchBox } from '@/components/consumer/SearchBox';
import { Scale, Plus, Sparkles } from 'lucide-react';

export default function ComparePage() {
  const [comparedProducts, setComparedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDefaultCompare() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/products?limit=3');
        if (res.ok) {
          const data = await res.json();
          const formatted = (data.items || []).map((item: any) => ({
            id: item.variantId,
            name: item.productName,
            slug: item.slug,
            brandName: item.brandName,
            categoryName: item.categoryName,
            mainImageUrl: item.mainImageUrl,
            lowestPriceKes: item.lowestPriceKes,
            sellersCount: item.sellersCount,
            specs: item.specsMap || {},
          }));
          setComparedProducts(formatted);
        }
      } catch (err) {
        console.error('Error loading compare products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDefaultCompare();
  }, []);

  const handleRemove = (id: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Scale className="w-6 h-6 text-emerald-400" />
            <span>Product & Price Comparison Matrix</span>
          </h1>
          <p className="text-xs text-slate-400">
            Compare specs, RAM, Storage, Battery, Camera, and live KSh merchant prices side-by-side
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
      ) : (
        <ComparisonMatrix products={comparedProducts} onRemoveProduct={handleRemove} />
      )}
    </div>
  );
}
