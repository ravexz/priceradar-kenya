/**
 * 5-Level Product Matching Engine
 * Compares raw merchant listings against canonical products & variants.
 */

export interface RawOfferData {
  title: string;
  brand?: string;
  model?: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  ram?: string;
  storage?: string;
  color?: string;
}

export interface MatchResult {
  matchedVariantId: string | null;
  confidenceScore: number; // 0.0 to 1.0
  matchLevel: number; // 1 to 5
  reason: string;
  requiresReview: boolean;
}

export class ProductMatchingEngine {
  /**
   * Main matching logic evaluating Levels 1 through 5
   */
  static matchListing(
    raw: RawOfferData,
    canonicalVariants: Array<{
      id: string;
      productName: string;
      brandName: string;
      variantName: string;
      gtin?: string | null;
      mpn?: string | null;
      ram?: string | null;
      storage?: string | null;
    }>
  ): MatchResult {
    const rawTitleNorm = this.normalizeText(raw.title);

    // LEVEL 1: Exact Identifier Match (GTIN / MPN)
    if (raw.gtin || raw.mpn) {
      for (const target of canonicalVariants) {
        if (raw.gtin && target.gtin && raw.gtin.trim() === target.gtin.trim()) {
          return {
            matchedVariantId: target.id,
            confidenceScore: 1.0,
            matchLevel: 1,
            reason: `Exact GTIN match (${raw.gtin})`,
            requiresReview: false,
          };
        }
        if (raw.mpn && target.mpn && raw.mpn.trim().toLowerCase() === target.mpn.trim().toLowerCase()) {
          return {
            matchedVariantId: target.id,
            confidenceScore: 0.98,
            matchLevel: 1,
            reason: `Exact MPN match (${raw.mpn})`,
            requiresReview: false,
          };
        }
      }
    }

    // LEVEL 2: Deterministic Attribute Matching (Brand + Storage + RAM + Model)
    for (const target of canonicalVariants) {
      const brandMatch = raw.brand ? this.normalizeText(raw.brand) === this.normalizeText(target.brandName) : rawTitleNorm.includes(this.normalizeText(target.brandName));
      
      let storageMatch = true;
      if (target.storage) {
        const targetStorageNorm = target.storage.toLowerCase().replace('gb', '').trim();
        storageMatch = rawTitleNorm.includes(targetStorageNorm);
      }

      let ramMatch = true;
      if (target.ram) {
        const targetRamNorm = target.ram.toLowerCase().replace('gb', '').trim();
        ramMatch = rawTitleNorm.includes(targetRamNorm);
      }

      const modelTokens = this.normalizeText(target.productName).split(' ');
      const coreModelTokens = modelTokens.filter(t => t !== this.normalizeText(target.brandName) && t !== 'galaxy');
      const modelMatch = coreModelTokens.every(token => rawTitleNorm.includes(token));

      if (brandMatch && storageMatch && ramMatch && modelMatch) {
        return {
          matchedVariantId: target.id,
          confidenceScore: 0.92,
          matchLevel: 2,
          reason: 'Deterministic match on Brand, Model, Storage, and RAM',
          requiresReview: false,
        };
      }
    }

    // LEVEL 3: Normalized String Trigram Similarity
    let bestVariant: string | null = null;
    let highestScore = 0;

    for (const target of canonicalVariants) {
      const fullTargetName = this.normalizeText(`${target.brandName} ${target.productName} ${target.variantName}`);
      const score = this.tokenOverlapRatio(rawTitleNorm, fullTargetName);

      if (score > highestScore) {
        highestScore = score;
        bestVariant = target.id;
      }
    }

    if (highestScore >= 0.82 && bestVariant) {
      return {
        matchedVariantId: bestVariant,
        confidenceScore: Number(highestScore.toFixed(2)),
        matchLevel: 3,
        reason: 'Normalized token overlap similarity threshold passed',
        requiresReview: false,
      };
    }

    // LEVEL 4 / 5: Ambiguous Match -> Queue for Admin Review
    if (highestScore >= 0.60 && bestVariant) {
      return {
        matchedVariantId: bestVariant,
        confidenceScore: Number(highestScore.toFixed(2)),
        matchLevel: 4,
        reason: 'Medium confidence match — flagged for Admin Review Queue',
        requiresReview: true,
      };
    }

    return {
      matchedVariantId: null,
      confidenceScore: Number(highestScore.toFixed(2)),
      matchLevel: 5,
      reason: 'Low confidence score — sent to Admin Review Queue',
      requiresReview: true,
    };
  }

  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static tokenOverlapRatio(strA: string, strB: string): number {
    const tokensA = new Set(strA.split(' '));
    const tokensB = new Set(strB.split(' '));
    if (tokensA.size === 0 || tokensB.size === 0) return 0;

    let overlap = 0;
    tokensA.forEach((token) => {
      if (tokensB.has(token)) overlap++;
    });

    return (2 * overlap) / (tokensA.size + tokensB.size);
  }
}
