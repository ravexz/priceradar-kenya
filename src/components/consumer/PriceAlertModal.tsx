'use client';

import React, { useState } from 'react';
import { formatKES } from '@/lib/utils/currency';
import { Bell, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  variantId: string;
  productName: string;
  currentLowestPriceKes: number;
}

export function PriceAlertModal({
  isOpen,
  onClose,
  variantId,
  productName,
  currentLowestPriceKes,
}: PriceAlertModalProps) {
  const [targetPrice, setTargetPrice] = useState<number>(Math.round(currentLowestPriceKes * 0.95));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/price-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          targetPriceKes: targetPrice,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 1800);
      }
    } catch (err) {
      console.error('Price alert error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Create Price Alert</h3>
            <p className="text-xs text-slate-400">Get notified when price drops in Kenya</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
            <h4 className="text-sm font-bold text-white mb-1">Price Alert Created!</h4>
            <p className="text-xs text-emerald-300">We will notify you as soon as {productName} drops below {formatKES(targetPrice)}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block mb-0.5">Target Product</span>
              <span className="text-white font-semibold line-clamp-1">{productName}</span>
              <span className="text-slate-400 block mt-2 text-[11px]">Current Lowest Price: <strong className="text-emerald-400">{formatKES(currentLowestPriceKes)}</strong></span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Notify me when price drops below:
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  step="500"
                  min="1000"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute left-3 top-3 text-xs font-bold text-slate-400">KSh</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Recommended target: {formatKES(Math.round(currentLowestPriceKes * 0.90))} (-10%)</p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || targetPrice >= currentLowestPriceKes}
                className="w-1/2 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-500/10"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Save Alert</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
