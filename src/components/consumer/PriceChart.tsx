'use client';

import React from 'react';
import { formatKES } from '@/lib/utils/currency';
import { TrendingDown, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export interface PricePoint {
  date: string;
  priceKes: number;
}

export interface PriceChartProps {
  history: PricePoint[];
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  change30DayPercent?: number;
}

export function PriceChart({
  history,
  currentPrice,
  lowestPrice,
  highestPrice,
  change30DayPercent = -4.5,
}: PriceChartProps) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-500" />
        <p className="text-sm">No historical price points recorded yet for this product.</p>
      </div>
    );
  }

  // Calculate coordinates for lightweight SVG line chart
  const prices = history.map((h) => h.priceKes);
  const minP = Math.min(...prices) * 0.95;
  const maxP = Math.max(...prices) * 1.05;
  const range = maxP - minP || 1;

  const chartWidth = 500;
  const chartHeight = 150;

  const points = history
    .map((item, index) => {
      const x = (index / (history.length - 1 || 1)) * chartWidth;
      const y = chartHeight - ((item.priceKes - minP) / range) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  const isPriceGood = currentPrice <= lowestPrice * 1.02;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>90-Day Price History</span>
          </h3>
          <p className="text-xs text-slate-400">Track price movements across verified Kenyan merchants</p>
        </div>

        {/* Good Price Indicator */}
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
          isPriceGood
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        }`}>
          {isPriceGood ? <TrendingDown className="w-4 h-4 text-emerald-400" /> : <TrendingUp className="w-4 h-4 text-amber-400" />}
          <span>{isPriceGood ? "Excellent Price Today!" : "Normal Market Price"}</span>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
          <span className="text-[11px] text-slate-400 block font-medium">Current Price</span>
          <span className="text-base font-bold text-white">{formatKES(currentPrice)}</span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
          <span className="text-[11px] text-slate-400 block font-medium">Lowest Recorded</span>
          <span className="text-base font-bold text-emerald-400">{formatKES(lowestPrice)}</span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
          <span className="text-[11px] text-slate-400 block font-medium">Highest Recorded</span>
          <span className="text-base font-bold text-slate-300">{formatKES(highestPrice)}</span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
          <span className="text-[11px] text-slate-400 block font-medium">30-Day Change</span>
          <span className={`text-base font-bold flex items-center gap-1 ${change30DayPercent <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {change30DayPercent <= 0 ? `${change30DayPercent}%` : `+${change30DayPercent}%`}
          </span>
        </div>
      </div>

      {/* SVG Chart Graphic */}
      <div className="relative w-full overflow-hidden bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-36 overflow-visible">
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <polygon
            points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
            fill="url(#priceGrad)"
          />

          {/* Line Path */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Data Points */}
          {history.map((item, index) => {
            const x = (index / (history.length - 1 || 1)) * chartWidth;
            const y = chartHeight - ((item.priceKes - minP) / range) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                className="fill-slate-950 stroke-emerald-400 stroke-2 hover:r-6 transition-all cursor-pointer"
              />
            );
          })}
        </svg>

        {/* Date Labels below chart */}
        <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
          <span>{history[0]?.date || '90 days ago'}</span>
          <span>{history[history.length - 1]?.date || 'Today'}</span>
        </div>
      </div>
    </div>
  );
}
