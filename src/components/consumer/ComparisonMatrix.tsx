'use client';

import React from 'react';
import Link from 'next/link';
import { formatKES } from '@/lib/utils/currency';
import { Check, X, Scale, ExternalLink, ShoppingBag } from 'lucide-react';

export interface ComparisonProduct {
  id: string;
  name: string;
  slug: string;
  brandName: string;
  categoryName: string;
  mainImageUrl: string;
  lowestPriceKes: number;
  sellersCount: number;
  specs: Record<string, string>;
}

export interface ComparisonMatrixProps {
  products: ComparisonProduct[];
  onRemoveProduct?: (id: string) => void;
}

export function ComparisonMatrix({ products, onRemoveProduct }: ComparisonMatrixProps) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <Scale className="w-10 h-10 mx-auto mb-3 text-slate-600" />
        <h3 className="text-lg font-bold text-white mb-1">No Products Selected for Comparison</h3>
        <p className="text-sm max-w-md mx-auto mb-6">Select up to 4 products across smartphones or laptops to compare prices, specifications, and seller availability side-by-side.</p>
        <Link href="/products" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm">
          Browse Catalog & Select Products
        </Link>
      </div>
    );
  }

  // Get all unique spec keys across products
  const specKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs || {})))
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Side-by-Side Product Comparison</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">Comparing {products.length} Products</span>
      </div>

      {/* Responsive Horizontal Scroll Container for Mobile */}
      <div className="overflow-x-auto max-w-full">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900">
              <th className="p-4 w-48 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/90 sticky left-0 z-10 border-r border-slate-800">
                Specification
              </th>
              {products.map((product) => (
                <th key={product.id} className="p-4 w-64 text-center align-top border-r border-slate-800/60 last:border-r-0">
                  <div className="relative flex flex-col items-center">
                    {onRemoveProduct && (
                      <button
                        onClick={() => onRemoveProduct(product.id)}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-rose-500/20"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="w-20 h-20 bg-slate-950 rounded-xl p-2 mb-2 flex items-center justify-center border border-slate-800">
                      <img src={product.mainImageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{product.brandName}</span>
                    <Link href={`/products/${product.slug}`} className="text-xs font-bold text-white hover:text-emerald-400 line-clamp-2 my-1">
                      {product.name}
                    </Link>
                    <span className="text-sm font-extrabold text-emerald-400 mt-1">{formatKES(product.lowestPriceKes)}</span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-2 w-full py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>View Sellers</span>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {/* Price Row */}
            <tr className="bg-slate-950/40">
              <td className="p-4 font-bold text-slate-300 bg-slate-900/90 sticky left-0 z-10 border-r border-slate-800">
                Lowest Market Price
              </td>
              {products.map((p) => (
                <td key={p.id} className="p-4 text-center font-extrabold text-emerald-400 text-sm border-r border-slate-800/60 last:border-r-0">
                  {formatKES(p.lowestPriceKes)}
                </td>
              ))}
            </tr>

            {/* Sellers Availability */}
            <tr>
              <td className="p-4 font-bold text-slate-300 bg-slate-900/90 sticky left-0 z-10 border-r border-slate-800">
                Available Sellers
              </td>
              {products.map((p) => (
                <td key={p.id} className="p-4 text-center text-slate-300 border-r border-slate-800/60 last:border-r-0">
                  {p.sellersCount} verified sellers in Kenya
                </td>
              ))}
            </tr>

            {/* Dynamic Attribute Rows */}
            {specKeys.map((key) => {
              // Check if values differ across compared items
              const values = products.map((p) => p.specs[key] || '—');
              const isDifferent = new Set(values).size > 1;

              return (
                <tr key={key} className={isDifferent ? 'bg-emerald-500/5' : ''}>
                  <td className="p-4 font-semibold text-slate-400 capitalize bg-slate-900/90 sticky left-0 z-10 border-r border-slate-800 flex items-center justify-between">
                    <span>{key.replace(/-/g, ' ')}</span>
                    {isDifferent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Key difference highlighted" />
                    )}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className={`p-4 text-center border-r border-slate-800/60 last:border-r-0 ${isDifferent ? 'font-semibold text-white' : 'text-slate-300'}`}>
                      {p.specs[key] || '—'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
