import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Store, Scale, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-sm">
                PR
              </div>
              <span className="font-bold text-base text-white">PriceRadar Kenya</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              "Find the product. Compare the market. Buy from the seller you trust."
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Nairobi • Mombasa • Kisumu • Nakuru • Eldoret</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Popular Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/products?category=smartphones" className="hover:text-emerald-400 transition-colors">Smartphones & 5G Phones</Link></li>
              <li><Link href="/products?category=laptops" className="hover:text-emerald-400 transition-colors">Programming & Gaming Laptops</Link></li>
              <li><Link href="/products?category=headphones" className="hover:text-emerald-400 transition-colors">Wireless Headphones & Earbuds</Link></li>
              <li><Link href="/products?category=smartwatches" className="hover:text-emerald-400 transition-colors">Smartwatches & Fitness Bands</Link></li>
              <li><Link href="/products?category=monitors" className="hover:text-emerald-400 transition-colors">Gaming Displays & Monitors</Link></li>
            </ul>
          </div>

          {/* Popular Comparisons */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Popular Price Searches</h4>
            <ul className="space-y-2">
              <li><Link href="/products?q=Samsung+Galaxy+S25+Ultra" className="hover:text-emerald-400 transition-colors">Samsung S25 Ultra Price in Kenya</Link></li>
              <li><Link href="/products?q=iPhone+16+Pro+Max" className="hover:text-emerald-400 transition-colors">iPhone 16 Pro Max Price in Kenya</Link></li>
              <li><Link href="/products?q=MacBook+Pro+M3" className="hover:text-emerald-400 transition-colors">Best Laptops Under KSh 100,000</Link></li>
              <li><Link href="/products?maxPrice=30000" className="hover:text-emerald-400 transition-colors">Best Phones Under KSh 30,000</Link></li>
              <li><Link href="/deals" className="hover:text-emerald-400 transition-colors">Today's Price Drops & Discounts</Link></li>
            </ul>
          </div>

          {/* Merchants & Trust */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">For Merchants & Business</h4>
            <ul className="space-y-2">
              <li><Link href="/merchant/dashboard" className="text-teal-400 font-semibold hover:underline flex items-center gap-1"><Store className="w-3.5 h-3.5" /> Merchant Portal</Link></li>
              <li><Link href="/merchant/dashboard" className="hover:text-emerald-400 transition-colors">Import Product Catalog (CSV/JSON)</Link></li>
              <li><Link href="/merchant/dashboard" className="hover:text-emerald-400 transition-colors">Market Pricing Intelligence</Link></li>
              <li><Link href="/admin/matching" className="hover:text-emerald-400 transition-colors">Product Matching Verification</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} PriceRadar Kenya. All rights reserved. Prices & inventory updated continuously.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Transparent Seller Trust Engine</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
