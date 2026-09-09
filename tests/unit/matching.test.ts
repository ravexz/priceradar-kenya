import { ProductMatchingEngine } from '../../src/lib/services/matching.service';

describe('5-Level Product Matching Engine Tests', () => {
  const sampleVariants = [
    {
      id: 'var-s25u-256',
      productName: 'Samsung Galaxy S25 Ultra',
      brandName: 'Samsung',
      variantName: '256GB / 12GB RAM (Titanium Black)',
      gtin: '880609500001',
      mpn: 'SMS938BZKD',
      ram: '12GB',
      storage: '256GB',
    },
    {
      id: 'var-s25u-512',
      productName: 'Samsung Galaxy S25 Ultra',
      brandName: 'Samsung',
      variantName: '512GB / 12GB RAM (Titanium Gray)',
      gtin: '880609500002',
      mpn: 'SMS938BZGD',
      ram: '12GB',
      storage: '512GB',
    },
  ];

  test('MATCH-001: Level 1 Exact GTIN match returns confidence score 1.0', () => {
    const result = ProductMatchingEngine.matchListing(
      {
        title: 'Samsung S25 Ultra Listing',
        gtin: '880609500001',
      },
      sampleVariants
    );

    expect(result.matchedVariantId).toBe('var-s25u-256');
    expect(result.confidenceScore).toBe(1.0);
    expect(result.matchLevel).toBe(1);
    expect(result.requiresReview).toBe(false);
  });

  test('MATCH-002: Level 2 Deterministic match on brand, storage, RAM, and model', () => {
    const result = ProductMatchingEngine.matchListing(
      {
        title: 'Samsung S25 Ultra 256GB 12GB RAM Black',
        brand: 'Samsung',
      },
      sampleVariants
    );

    expect(result.matchedVariantId).toBe('var-s25u-256');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.90);
    expect(result.matchLevel).toBe(2);
  });

  test('MATCH-003: Different storage variants (256GB vs 512GB) do NOT merge incorrectly', () => {
    const result256 = ProductMatchingEngine.matchListing(
      { title: 'Samsung S25 Ultra 256GB', brand: 'Samsung' },
      sampleVariants
    );
    const result512 = ProductMatchingEngine.matchListing(
      { title: 'Samsung S25 Ultra 512GB', brand: 'Samsung' },
      sampleVariants
    );

    expect(result256.matchedVariantId).toBe('var-s25u-256');
    expect(result512.matchedVariantId).toBe('var-s25u-512');
    expect(result256.matchedVariantId).not.toBe(result512.matchedVariantId);
  });

  test('MATCH-005: Low confidence match flags item for Admin Review Queue', () => {
    const result = ProductMatchingEngine.matchListing(
      { title: 'Random Phone Accessory 123' },
      sampleVariants
    );

    expect(result.requiresReview).toBe(true);
  });
});
