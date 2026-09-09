import { prisma } from '../db/prisma';

export interface RawMerchantImportRow {
  sku: string;
  name: string;
  brand?: string;
  model?: string;
  category?: string;
  price: string | number;
  originalPrice?: string | number;
  stockStatus?: string;
  url: string;
  warranty?: string;
  gtin?: string;
}

export interface ImportValidationRowResult {
  rowNumber: number;
  isValid: boolean;
  errors: string[];
  data: RawMerchantImportRow;
  parsedPriceKes?: number;
}

export class MerchantImportService {
  /**
   * Parse and validate uploaded raw merchant records before publication.
   */
  static validateImportData(rows: RawMerchantImportRow[]): {
    totalRows: number;
    validRowsCount: number;
    invalidRowsCount: number;
    results: ImportValidationRowResult[];
  } {
    const results: ImportValidationRowResult[] = [];
    let validCount = 0;
    let invalidCount = 0;

    rows.forEach((row, index) => {
      const errors: string[] = [];

      // Validate SKU
      if (!row.sku || row.sku.trim() === '') {
        errors.push('SKU is required');
      }

      // Validate Name
      if (!row.name || row.name.trim() === '') {
        errors.push('Product name is required');
      }

      // Validate Price
      let parsedPrice = 0;
      if (row.price === undefined || row.price === null || String(row.price).trim() === '') {
        errors.push('Price is required');
      } else {
        const num = Number(String(row.price).replace(/[^0-9.]/g, ''));
        if (isNaN(num) || num <= 0) {
          errors.push(`Invalid price value: "${row.price}"`);
        } else {
          parsedPrice = num;
        }
      }

      // Validate URL
      if (!row.url || !row.url.startsWith('http')) {
        errors.push('Valid product URL starting with http/https is required');
      }

      const isValid = errors.length === 0;
      if (isValid) validCount++;
      else invalidCount++;

      results.push({
        rowNumber: index + 1,
        isValid,
        errors,
        data: row,
        parsedPriceKes: parsedPrice,
      });
    });

    return {
      totalRows: rows.length,
      validRowsCount: validCount,
      invalidRowsCount: invalidCount,
      results,
    };
  }

  /**
   * Publish validated records to merchant offers
   */
  static async publishImport(merchantId: string, validRows: ImportValidationRowResult[]) {
    let publishedCount = 0;

    for (const rowRes of validRows) {
      if (!rowRes.isValid || !rowRes.parsedPriceKes) continue;

      const d = rowRes.data;

      // Find or associate default variant
      const defaultVariant = await prisma.variant.findFirst({
        where: {
          product: {
            name: { contains: d.name.slice(0, 10), mode: 'insensitive' },
          },
        },
      });

      if (!defaultVariant) continue;

      // Upsert offer
      await prisma.offer.upsert({
        where: {
          id: `merchant-${merchantId}-sku-${d.sku}`,
        },
        update: {
          priceKes: rowRes.parsedPriceKes,
          totalCostKes: rowRes.parsedPriceKes,
          url: d.url,
          lastCheckedAt: new Date(),
        },
        create: {
          id: `merchant-${merchantId}-sku-${d.sku}`,
          merchantId,
          variantId: defaultVariant.id,
          merchantSku: d.sku,
          title: d.name,
          url: d.url,
          priceKes: rowRes.parsedPriceKes,
          totalCostKes: rowRes.parsedPriceKes,
          isDeliveryFree: true,
          stockStatus: 'IN_STOCK',
          condition: 'NEW',
          lastCheckedAt: new Date(),
        },
      });

      publishedCount++;
    }

    return { publishedCount };
  }
}
