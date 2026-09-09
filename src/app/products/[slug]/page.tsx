'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { formatKES, calculateTrustScoreLabel } from '@/lib/utils/currency';
import { PriceChart } from '@/components/consumer/PriceChart';
import { PriceAlertModal } from '@/components/consumer/PriceAlertModal';
import { ShieldCheck, Bell, ExternalLink, Scale, CheckCircle2, Store, Truck, Clock, AlertTriangle, ChevronRight, Info } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching product slug:', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) fetchProduct();
  }, [slug]);

  const handleOutboundClick = async (offerId: string, fallbackUrl: string) => {
    try {
      const res = await fetch('/api/outbound-clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId }),
      });
      if (res.ok) {
        const result = await res.json();
        window.open(result.redirectUrl || fallbackUrl, '_blank');
      } else {
        window.open(fallbackUrl, '_blank');
      }
    } catch (err) {
      window.open(fallbackUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-8">
        <div className="h-10 bg-slate-900 w-1/3 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-slate-900 rounded-2xl" />
          <div className="h-96 bg-slate-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data || !data.product) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-xs text-slate-400">The requested product page does not exist or has been removed.</p>
      </div>
    );
  }

  const { product, activeVariant, priceSummary = {} } = data;

  // Deduplicate offers from same shop with same price and title
  const offersMap = new Map<string, any>();
  (data.offers || []).forEach((offer: any) => {
    const key = `${offer.merchantId}_${offer.priceKes}_${(offer.title || offer.merchantName || '').trim().toLowerCase()}`;
    if (!offersMap.has(key)) {
      offersMap.set(key, offer);
    }
  });
  const offers = Array.from(offersMap.values());
  const lowestOffer = offers[0];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <span>Products</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span>{product.categoryName}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-semibold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Top Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Product Image */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden">
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="max-h-80 max-w-full object-contain hover:scale-105 transition-transform"
          />
        </div>

        {/* Right Column: Title, Quick Pricing & CTAs */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-emerald-400 border border-slate-700">
                {product.brandName}
              </span>
              <span>Model: {product.modelNumber || 'N/A'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {product.description}
            </p>

            {/* Quick Specs Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(activeVariant.specsMap || {}).map(([key, val]) => (
                <span key={key} className="text-xs px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                  <strong className="capitalize text-slate-400 font-normal">{key.replace('-', ' ')}:</strong> {val as string}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing Highlight Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Lowest Price in Kenya</span>
                <span className="text-3xl font-black text-emerald-400 tracking-tight">
                  {formatKES(priceSummary.lowestPrice)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Available Sellers</span>
                <span className="text-sm font-bold text-white">{offers.length} Verified Merchants</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setAlertModalOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Set Price Alert</span>
              </button>

              {lowestOffer && (
                <button
                  onClick={() => handleOutboundClick(lowestOffer.id, lowestOffer.url)}
                  className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <span>Visit Lowest Seller ({lowestOffer.merchantName})</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* SECTION: PRICE COMPARISON TABLE ACROSS SELLERS */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-400" />
              <span>Seller Price Comparison ({offers.length} Offers)</span>
            </h2>
            <p className="text-xs text-slate-400">Ranked by total cost (Product price + delivery fee) and seller trust score</p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>All Stores Verified in Kenya</span>
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-3">
          {offers.map((offer: any, idx: number) => {
            const trustInfo = calculateTrustScoreLabel(offer.trustScore);
            return (
              <div
                key={offer.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  idx === 0
                    ? 'bg-slate-950/90 border-emerald-500/50 shadow-md shadow-emerald-500/5'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Store Info & Trust */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{offer.merchantName}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${trustInfo.color}`}>
                      Trust Score {offer.trustScore}/100
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                        BEST PRICE
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      {offer.isDeliveryFree ? <strong className="text-emerald-400 font-normal">Free Delivery</strong> : `Delivery: ${formatKES(offer.deliveryFeeKes || 0)}`}
                    </span>
                    <span>•</span>
                    <span>{offer.warrantyText || '12m Warranty'}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{offer.stockStatus.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Price Breakdown & Visit Store CTA */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Total Cost</span>
                    <span className="text-xl font-extrabold text-white">
                      {formatKES(offer.totalCostKes)}
                    </span>
                    {offer.deliveryFeeKes > 0 && (
                      <span className="text-[10px] text-slate-500 block">Product: {formatKES(offer.priceKes)}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOutboundClick(offer.id, offer.url)}
                    className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-colors"
                  >
                    <span>Visit Store</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: PRICE HISTORY CHART */}
      <PriceChart
        history={priceSummary.history || []}
        currentPrice={priceSummary.lowestPrice || 0}
        lowestPrice={priceSummary.lowestPrice || 0}
        highestPrice={priceSummary.highestPrice || 0}
      />

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        variantId={activeVariant.id}
        productName={product.name}
        currentLowestPriceKes={priceSummary.lowestPrice || 0}
      />

    </div>
  );
}
