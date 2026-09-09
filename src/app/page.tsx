'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchBox } from '@/components/consumer/SearchBox';
import { ProductCard } from '@/components/consumer/ProductCard';
import { Sparkles, ArrowRight, ShieldCheck, Scale, TrendingDown, Store, Smartphone, Laptop, Headphones, Watch, Monitor, Camera, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [dealsProducts, setDealsProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const res = await fetch('/api/products?limit=8');
        if (res.ok) {
          const data = await res.json();
          setTrendingProducts(data.items || []);
          
          // Filter deals with discounts
          const deals = (data.items || []).filter((item: any) => item.discountPercent > 0 || item.lowestPriceKes < 150000);
          setDealsProducts(deals.slice(0, 4));
        }
      } catch (err) {
        console.error('Home page load error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const categories = [
    { name: 'Smartphones', slug: 'smartphones', icon: Smartphone, count: '120+ Products', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30' },
    { name: 'Laptops', slug: 'laptops', icon: Laptop, count: '85+ Products', color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { name: 'Headphones', slug: 'headphones', icon: Headphones, count: '45+ Products', color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30' },
    { name: 'Smartwatches', slug: 'smartwatches', icon: Watch, count: '30+ Products', color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30' },
    { name: 'Monitors', slug: 'monitors', icon: Monitor, count: '25+ Products', color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30' },
    { name: 'Cameras', slug: 'cameras', icon: Camera, count: '15+ Products', color: 'from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30' },
  ];

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Search Section */}
      <section className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Kenya's #1 Product Discovery & Price Comparison Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Find the product. Compare the market. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Buy from the seller you trust.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Compare prices across Jumia, PhonePlace, Avechi, Hotpoint, and 10+ verified Kenyan electronics retailers on one page.
          </p>

          {/* Hero Search Input */}
          <div className="max-w-2xl mx-auto pt-2">
            <SearchBox />
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <span className="font-semibold text-slate-500">Popular:</span>
            <Link href="/products?q=Samsung+Galaxy+S25+Ultra" className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700">Samsung S25 Ultra</Link>
            <Link href="/products?q=iPhone+16+Pro+Max" className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700">iPhone 16 Pro Max</Link>
            <Link href="/products?q=MacBook+Pro" className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700">MacBook Pro M3</Link>
            <Link href="/products?maxPrice=30000" className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-emerald-400 border border-slate-700">Under KSh 30,000</Link>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Browse Electronics Categories</h2>
            <p className="text-xs text-slate-400">Explore standardized specs and multi-seller price comparisons</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className={`p-4 rounded-2xl bg-gradient-to-b ${cat.color} border hover:scale-105 transition-all duration-200 flex flex-col items-center text-center group`}
              >
                <div className="p-3 rounded-xl bg-slate-950/60 mb-2 border border-slate-800 group-hover:border-emerald-500/40">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-white mb-0.5">{cat.name}</h3>
                <span className="text-[10px] text-slate-400 font-medium">{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Trending Electronics in Kenya</h2>
            <p className="text-xs text-slate-400">Live price comparison across verified merchants</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
            <span>View All ({trendingProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id || product.productId || product.slug} {...product} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Side-by-Side Comparisons */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Popular Product Comparisons</h2>
              <p className="text-xs text-slate-400">Compare flagship models side-by-side on RAM, Battery, Camera & KSh Price</p>
            </div>
          </div>
          <Link href="/compare" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
            <span>Open Compare Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 hover:border-emerald-500/40 transition-colors">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Flagship Smartphones</span>
              <h3 className="text-sm font-bold text-white">Samsung Galaxy S25 Ultra vs Apple iPhone 16 Pro Max</h3>
              <p className="text-xs text-slate-400">200MP vs 48MP • Snapdragon 8 Gen 4 vs A18 Pro • 5000mAh vs 4685mAh</p>
            </div>
            <Link href="/compare" className="px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold text-xs hover:bg-emerald-500 hover:text-slate-950 transition-all flex-shrink-0">
              Compare
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 hover:border-emerald-500/40 transition-colors">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Premium Laptops</span>
              <h3 className="text-sm font-bold text-white">HP Spectre x360 14 vs Dell XPS 15 9530</h3>
              <p className="text-xs text-slate-400">Core Ultra 7 vs Core i7-13700H • Intel Arc vs RTX 4060 • 2.8K vs 3.5K OLED</p>
            </div>
            <Link href="/compare" className="px-3 py-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold text-xs hover:bg-cyan-500 hover:text-slate-950 transition-all flex-shrink-0">
              Compare
            </Link>
          </div>

        </div>
      </section>

      {/* Verified Merchants Trust Bar */}
      <section className="space-y-4">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-white">Verified Kenyan Merchants</h2>
          <p className="text-xs text-slate-400">All prices and stock availability are directly cross-referenced from verified stores in Nairobi and across Kenya.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {['Jumia Kenya', 'PhonePlace KE', 'Avechi Kenya', 'Hotpoint', 'Salim Hub', 'Kilimall KE', 'Anker Store'].map((name, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <Store className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
              <span className="text-xs font-bold text-slate-200 block">{name}</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center justify-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
