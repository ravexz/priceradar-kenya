import { formatKES, calculateDiscountPercent } from '../../src/lib/utils/currency';

describe('Currency and Pricing Utility Tests', () => {
  test('formatKES formats numeric values into standard KSh currency string', () => {
    expect(formatKES(124999)).toBe('KSh 124,999');
    expect(formatKES(500)).toBe('KSh 500');
  });

  test('calculateDiscountPercent correctly calculates discount percentage', () => {
    expect(calculateDiscountPercent(150000, 120000)).toBe(20);
    expect(calculateDiscountPercent(100000, 100000)).toBe(0);
    expect(calculateDiscountPercent(null, 100000)).toBe(0);
  });
});
