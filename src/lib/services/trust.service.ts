/**
 * Seller Trust Engine
 * Calculates deterministic 0-100 trust scores for merchants based on verified metrics.
 */

export interface TrustScoreBreakdown {
  score: number;
  verificationPts: number;
  physicalLocationPts: number;
  warrantyPts: number;
  returnPolicyPts: number;
  dataFreshnessPts: number;
  ratingPts: number;
  badges: string[];
}

export function calculateSellerTrustScore(merchant: {
  verificationStatus: string;
  physicalAddress?: string | null;
  county?: string | null;
  warrantyPolicy?: string | null;
  returnPolicy?: string | null;
  trustScore?: number;
  offers?: Array<{ lastCheckedAt: Date }>;
  avgRating?: number;
}): TrustScoreBreakdown {
  let score = 0;
  const badges: string[] = [];

  // 1. Business Verification (Max 35 pts)
  let verificationPts = 0;
  if (merchant.verificationStatus === 'VERIFIED') {
    verificationPts = 35;
    badges.push('Verified Business');
  } else if (merchant.verificationStatus === 'PENDING_REVIEW') {
    verificationPts = 10;
  }

  // 2. Physical Location in Kenya (Max 15 pts)
  let physicalLocationPts = 0;
  if (merchant.physicalAddress && merchant.physicalAddress.length > 5) {
    physicalLocationPts = 15;
    badges.push('Verified Store Location');
  }

  // 3. Warranty Policy (Max 15 pts)
  let warrantyPts = 0;
  if (merchant.warrantyPolicy && merchant.warrantyPolicy.length > 3) {
    warrantyPts = 15;
    badges.push('Clear Warranty Terms');
  }

  // 4. Return Policy (Max 15 pts)
  let returnPolicyPts = 0;
  if (merchant.returnPolicy && merchant.returnPolicy.length > 3) {
    returnPolicyPts = 15;
    badges.push('Clear Return Policy');
  }

  // 5. Data Freshness (Max 10 pts)
  let dataFreshnessPts = 10; // Default fresh
  if (merchant.offers && merchant.offers.length > 0) {
    const oldest = new Date(Math.min(...merchant.offers.map(o => new Date(o.lastCheckedAt).getTime())));
    const hoursAgo = (Date.now() - oldest.getTime()) / (1000 * 3600);
    if (hoursAgo > 72) {
      dataFreshnessPts = 2;
    } else if (hoursAgo > 24) {
      dataFreshnessPts = 6;
    } else {
      badges.push('Active Live Inventory');
    }
  }

  // 6. Rating (Max 10 pts)
  const rating = merchant.avgRating || 4.2;
  const ratingPts = Math.round((rating / 5.0) * 10);
  if (rating >= 4.5) {
    badges.push('Highly Rated');
  }

  score = verificationPts + physicalLocationPts + warrantyPts + returnPolicyPts + dataFreshnessPts + ratingPts;

  return {
    score: Math.min(100, Math.max(0, score)),
    verificationPts,
    physicalLocationPts,
    warrantyPts,
    returnPolicyPts,
    dataFreshnessPts,
    ratingPts,
    badges,
  };
}
