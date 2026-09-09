/**
 * PriceRadar Kenya - Currency & Pricing Utilities
 */

export function formatKES(amount: number): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'KSh --';
  return `KSh ${new Intl.NumberFormat('en-KE', {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

export function calculateDiscountPercent(originalPrice: number | null, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
}

export function calculateTrustScoreLabel(score: number): { text: string; color: string } {
  if (score >= 90) return { text: 'Excellent Trust', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  if (score >= 75) return { text: 'High Trust', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
  if (score >= 60) return { text: 'Moderate Trust', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
  return { text: 'Unverified Seller', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
}
