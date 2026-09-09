'use client';

import React, { useState } from 'react';
import { formatKES } from '@/lib/utils/currency';
import { Store, Upload, CheckCircle2, AlertTriangle, TrendingUp, BarChart3, ShieldCheck, FileSpreadsheet, Eye, MousePointerClick, Tag } from 'lucide-react';

export default function MerchantDashboardPage() {
  const [csvInput, setCsvInput] = useState<string>(
    `SKU,Name,Brand,Price,Stock,URL\n` +
    `PPK-S25U-256,Samsung Galaxy S25 Ultra 256GB,Samsung,119999,IN_STOCK,https://www.phoneplacekenya.com/s25-ultra\n` +
    `PPK-IP16PM-256,Apple iPhone 16 Pro Max 256GB,Apple,176999,IN_STOCK,https://www.phoneplacekenya.com/iphone-16-pro\n` +
    `PPK-INVALID,Malformed Product Without Price,Unknown,,OUT_OF_STOCK,invalid-url`
  );

  const [previewResult, setPreviewResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'import' | 'intelligence'>('overview');

  const parseCsvToObjects = (rawCsv: string) => {
    const lines = rawCsv.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    
    return lines.slice(1).map((line) => {
      const parts = line.split(',').map((p) => p.trim());
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = parts[i] || '';
      });
      return {
        sku: obj.sku || '',
        name: obj.name || '',
        brand: obj.brand || '',
        price: obj.price || '',
        stockStatus: obj.stock || 'IN_STOCK',
        url: obj.url || '',
      };
    });
  };

  const handleValidateCsv = async () => {
    setIsProcessing(true);
    try {
      const rows = parseCsvToObjects(csvInput);
      const res = await fetch('/api/merchant/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'preview', rows }),
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewResult(data);
      }
    } catch (err) {
      console.error('Validation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishImport = async () => {
    if (!previewResult) return;
    setIsProcessing(true);
    try {
      const rows = parseCsvToObjects(csvInput);
      const res = await fetch('/api/merchant/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish', rows }),
      });
      if (res.ok) {
        const data = await res.json();
        alert(`🎉 Successfully published ${data.publishedCount} offers live to search!`);
        setPreviewResult(null);
      }
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Merchant Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-xl">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">PhonePlace Kenya Portal</h1>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED MERCHANT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Bazaar Plaza, 1st Floor, Moi Avenue, Nairobi • Trust Score: <strong className="text-emerald-400">91/100</strong></p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'import' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            CSV Upload
          </button>
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'intelligence' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Market Intelligence
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Active Listed Offers</span>
              <span className="text-2xl font-black text-white mt-1 block">42 Offers</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Product Views (30d)</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">14,250</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Outbound Store Clicks</span>
              <span className="text-2xl font-black text-teal-400 mt-1 block">1,890</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Avg Price Competitiveness</span>
              <span className="text-2xl font-black text-amber-400 mt-1 block">#1 Rank (40%)</span>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT TAB */}
      {activeTab === 'import' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-teal-400" />
              <span>Merchant Product CSV / Feed Ingestion</span>
            </h2>
            <p className="text-xs text-slate-400">Paste or upload product feed containing SKU, Name, Brand, Price (KSh), Stock, and Product URL.</p>
          </div>

          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            rows={6}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 focus:outline-none focus:border-teal-500"
          />

          <div className="flex gap-3">
            <button
              onClick={handleValidateCsv}
              disabled={isProcessing}
              className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700"
            >
              Validate & Preview Feed
            </button>

            {previewResult && previewResult.validRowsCount > 0 && (
              <button
                onClick={handlePublishImport}
                disabled={isProcessing}
                className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/10"
              >
                Publish {previewResult.validRowsCount} Valid Offers Live
              </button>
            )}
          </div>

          {/* Preview Validation Table */}
          {previewResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="text-emerald-400">Valid Rows: {previewResult.validRowsCount}</span>
                <span className="text-rose-400">Invalid Rows: {previewResult.invalidRowsCount}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="p-2">Row</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">SKU</th>
                      <th className="p-2">Product Name</th>
                      <th className="p-2">Parsed Price</th>
                      <th className="p-2">Validation Errors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {previewResult.results?.map((res: any) => (
                      <tr key={res.rowNumber} className={res.isValid ? 'bg-emerald-500/5' : 'bg-rose-500/5'}>
                        <td className="p-2 text-slate-400">{res.rowNumber}</td>
                        <td className="p-2 font-bold">
                          {res.isValid ? <span className="text-emerald-400">VALID</span> : <span className="text-rose-400">INVALID</span>}
                        </td>
                        <td className="p-2 text-slate-300">{res.data.sku}</td>
                        <td className="p-2 text-white font-medium">{res.data.name}</td>
                        <td className="p-2 text-emerald-400 font-bold">{res.parsedPriceKes ? formatKES(res.parsedPriceKes) : '—'}</td>
                        <td className="p-2 text-rose-300">{res.errors?.join(', ') || 'None'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MARKET INTELLIGENCE TAB */}
      {activeTab === 'intelligence' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-400" />
              <span>Market Pricing Intelligence</span>
            </h2>
            <p className="text-xs text-slate-400">Monitor your store's prices against market average prices across Kenya sellers.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-bold block">Samsung Galaxy S25 Ultra 256GB</span>
                <span className="text-xs text-slate-400">Market Average: KSh 124,500 • Lowest Competitor: KSh 119,999</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-emerald-400">Your Price: KSh 119,999</span>
                <span className="text-[11px] text-emerald-300 block font-semibold">Rank #1 (Lowest Price in Kenya)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-cyan-400 font-bold block">Apple iPhone 16 Pro Max 256GB</span>
                <span className="text-xs text-slate-400">Market Average: KSh 185,000 • Lowest Competitor: KSh 178,999</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-amber-400">Your Price: KSh 182,000</span>
                <span className="text-[11px] text-amber-300 block font-semibold">Rank #3 (1.6% Above Lowest)</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
