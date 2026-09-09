'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/consumer/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, RefreshCw } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [sortBy, setSortBy] = useState('best_value');

  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (queryParam) params.set('q', queryParam);
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedBrand) params.set('brand', selectedBrand);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sortBy) params.set('sortBy', sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.items || []);
          setTotalCount(data.total || 0);
        }
      } catch (err) {
        console.error('Fetch products error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [queryParam, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy]);

  const toggleCompare = (id: string) => {
    setComparedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('best_value');
    router.push('/products');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {selectedCategory ? `${selectedCategory.toUpperCase()} Catalog` : 'Product Discovery & Price Comparison'}
          </h1>
          <p className="text-xs text-slate-400">
            {totalCount} canonical products found across verified Kenyan sellers
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <ArrowUpDown className="w-4 h-4 text-emerald-400" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-emerald-400 focus:outline-none focus:border-emerald-500"
          >
            <option value="best_value">Best Value Ranking</option>
            <option value="price_asc">Lowest Price (KSh)</option>
            <option value="price_desc">Highest Price (KSh)</option>
            <option value="discount">Biggest Discount (%)</option>
            <option value="newest">Newest Releases</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <aside className="space-y-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-400" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200"
            >
              <option value="">All Categories</option>
              <option value="smartphones">Smartphones</option>
              <option value="laptops">Laptops</option>
              <option value="headphones">Headphones</option>
              <option value="smartwatches">Smartwatches</option>
              <option value="monitors">Monitors</option>
              <option value="cameras">Cameras</option>
            </select>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200"
            >
              <option value="">All Brands</option>
              <option value="samsung">Samsung</option>
              <option value="apple">Apple</option>
              <option value="hp">HP</option>
              <option value="dell">Dell</option>
              <option value="sony">Sony</option>
              <option value="xiaomi">Xiaomi</option>
            </select>
          </div>

          {/* Price Range Filter (KES) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Price Range (KSh)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min KSh"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
              <input
                type="number"
                placeholder="Max KSh"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>
        </aside>

        {/* Product Results Grid */}
        <main className="lg:col-span-3 space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <SlidersHorizontal className="w-10 h-10 mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-white">No Products Found</h3>
              <p className="text-xs max-w-sm mx-auto">Try clearing active filters or searching for alternative product names.</p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.variantId}
                  {...product}
                  isComparing={comparedProductIds.includes(product.variantId)}
                  onToggleCompare={() => toggleCompare(product.variantId)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-2xl bg-slate-900 animate-pulse" />}>
      <ProductsContent />
    </Suspense>
  );
}
