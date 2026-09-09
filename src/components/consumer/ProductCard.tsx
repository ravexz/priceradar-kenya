'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatKES } from '@/lib/utils/currency';
import { Scale, ShoppingBag, Store, TrendingDown, Star, CheckCircle } from 'lucide-react';

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  brandName: string;
  categoryName: string;
  mainImageUrl: string;
  lowestPriceKes: number;
  originalPriceKes?: number | null;
  discountPercent?: number;
  sellersCount: number;
  specsMap?: Record<string, string>;
  isComparing?: boolean;
  onToggleCompare?: () => void;
}

export function ProductCard({
  id,
  slug,
  name,
  brandName,
  categoryName,
  mainImageUrl,
  lowestPriceKes,
  originalPriceKes,
  discountPercent = 0,
  sellersCount,
  specsMap = {},
  isComparing = false,
  onToggleCompare,
}: ProductCardProps) {
  // Extract key specs line
  const specsList = Object.values(specsMap).slice(0, 3);
  const specsText = specsList.length > 0 ? specsList.join(' • ') : 'Official Kenyan Warranty';

  return (
    <div className="group relative bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-emerald-500/40 p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/5">
      
      {/* Image & Badges Container */}
      <div className="relative aspect-square w-full bg-slate-950/60 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-4">
        <img
          src={mainImageUrl}
          alt={name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>-{discountPercent}%</span>
          </div>
        )}

        {/* Sellers Count Badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-slate-300 text-[11px] font-medium backdrop-blur-sm flex items-center gap-1">
          <Store className="w-3 h-3 text-emerald-400" />
          <span>{sellersCount} {sellersCount === 1 ? 'seller' : 'sellers'}</span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span>{brandName}</span>
            <span className="text-slate-500">{categoryName}</span>
          </div>

          {/* Product Name */}
          <Link href={`/products/${slug}`} className="block">
            <h3 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2 mb-1.5 leading-snug">
              {name}
            </h3>
          </Link>

          {/* Key Specs Pills */}
          <p className="text-[11px] text-slate-400 line-clamp-1 mb-3 bg-slate-950/50 px-2 py-1 rounded border border-slate-800/80 font-mono">
            {specsText}
          </p>
        </div>

        {/* Pricing & CTA Section */}
        <div className="pt-2 border-t border-slate-800/60">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Lowest Price</span>
              <span className="text-base font-bold text-emerald-400 tracking-tight">
                {formatKES(lowestPriceKes)}
              </span>
            </div>

            {originalPriceKes && originalPriceKes > lowestPriceKes && (
              <span className="text-xs text-slate-500 line-through">
                {formatKES(originalPriceKes)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleCompare}
              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                isComparing
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isComparing ? 'Comparing' : 'Compare'}</span>
            </button>

            <Link
              href={`/products/${slug}`}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/10 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>View Offers</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
