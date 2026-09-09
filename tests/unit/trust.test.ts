import { calculateSellerTrustScore } from '../../src/lib/services/trust.service';

describe('TRUST-003: Seller Trust Score Unit Tests', () => {
  test('Verified merchant with address, warranty, and return policy achieves high trust score (>= 80)', () => {
    const breakdown = calculateSellerTrustScore({
      verificationStatus: 'VERIFIED',
      physicalAddress: 'Bazaar Plaza, Moi Avenue, Nairobi',
      county: 'Nairobi',
      warrantyPolicy: '1 Year Store Warranty',
      returnPolicy: '7 Days Return',
      avgRating: 4.8,
    });

    expect(breakdown.score).toBeGreaterThanOrEqual(80);
    expect(breakdown.badges).toContain('Verified Business');
    expect(breakdown.badges).toContain('Verified Store Location');
  });

  test('TRUST-002: Unverified merchant does not receive verified badge and gets lower score', () => {
    const breakdown = calculateSellerTrustScore({
      verificationStatus: 'UNVERIFIED',
      physicalAddress: null,
      warrantyPolicy: null,
      returnPolicy: null,
    });

    expect(breakdown.badges).not.toContain('Verified Business');
    expect(breakdown.score).toBeLessThan(50);
  });
});
