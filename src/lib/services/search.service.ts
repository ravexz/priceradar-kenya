import { prisma } from '../db/prisma';

export interface SearchOptions {
  query?: string;
  categorySlug?: string;
  brandSlug?: string;
  minPriceKes?: number;
  maxPriceKes?: number;
  ram?: string;
  storage?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'best_value' | 'discount' | 'newest';
  page?: number;
  limit?: number;
}

export class SearchService {
  /**
   * Search canonical products & variants with dynamic filtering and sorting.
   */
  static async searchProducts(options: SearchOptions) {
    try {
      const {
      query = '',
      categorySlug,
      brandSlug,
      minPriceKes,
      maxPriceKes,
      sortBy = 'best_value',
      page = 1,
      limit = 12,
    } = options;

    const skip = (page - 1) * limit;

    // Build Prisma query conditions
    const where: any = {};

    if (categorySlug) {
      where.product = {
        ...where.product,
        category: { slug: categorySlug },
      };
    }

    if (brandSlug) {
      where.product = {
        ...where.product,
        brand: { slug: brandSlug },
      };
    }

    if (query && query.trim() !== '') {
      const q = query.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { product: { name: { contains: q, mode: 'insensitive' } } },
        { product: { brand: { name: { contains: q, mode: 'insensitive' } } } },
        { product: { modelNumber: { contains: q, mode: 'insensitive' } } },
        { identifiers: { some: { value: { contains: q, mode: 'insensitive' } } } },
      ];
    }

    // Query matching variants
    const variants = await prisma.variant.findMany({
      where,
      include: {
        product: {
          include: {
            brand: true,
            category: true,
          },
        },
        offers: {
          include: {
            merchant: true,
          },
          orderBy: {
            totalCostKes: 'asc',
          },
        },
        attributes: {
          include: {
            attribute: true,
          },
        },
      },
    });

    // Process offers, price filter & sorting
    let results = variants.map((v) => {
      const activeOffers = v.offers.filter((o) => o.stockStatus !== 'OUT_OF_STOCK');
      const lowestOffer = activeOffers[0] || v.offers[0];
      const lowestPrice = lowestOffer ? lowestOffer.priceKes : 0;
      const sellersCount = v.offers.length;

      // Extract specs
      const specsMap: Record<string, string> = {};
      v.attributes.forEach((attr) => {
        const val = attr.valueString || (attr.valueNumber !== null ? String(attr.valueNumber) : '') || (attr.valueBoolean !== null ? String(attr.valueBoolean) : '');
        if (val) specsMap[attr.attribute.slug] = `${val} ${attr.attribute.unit || ''}`.trim();
      });

      return {
        variantId: v.id,
        productId: v.product.id,
        productName: v.product.name,
        variantName: v.name,
        slug: v.product.slug,
        brandName: v.product.brand.name,
        categoryName: v.product.category.name,
        categorySlug: v.product.category.slug,
        mainImageUrl: v.product.mainImageUrl,
        lowestPriceKes: lowestPrice,
        originalPriceKes: lowestOffer?.originalPriceKes || null,
        discountPercent: lowestOffer?.originalPriceKes ? Math.round(((lowestOffer.originalPriceKes - lowestPrice) / lowestOffer.originalPriceKes) * 100) : 0,
        sellersCount,
        lowestOffer,
        specsMap,
        createdAt: v.createdAt,
      };
    });

    // Apply price filter
    if (minPriceKes !== undefined) {
      results = results.filter((r) => r.lowestPriceKes >= minPriceKes);
    }
    if (maxPriceKes !== undefined) {
      results = results.filter((r) => r.lowestPriceKes <= maxPriceKes);
    }

    // Apply sorting
    if (sortBy === 'price_asc') {
      results.sort((a, b) => a.lowestPriceKes - b.lowestPriceKes);
    } else if (sortBy === 'price_desc') {
      results.sort((a, b) => b.lowestPriceKes - a.lowestPriceKes);
    } else if (sortBy === 'discount') {
      results.sort((a, b) => b.discountPercent - a.discountPercent);
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = results.length;
    const paginated = results.slice(skip, skip + limit);

    } catch (err: any) {
      console.warn('SearchService DB Query Fallback:', err.message);
      return {
        items: [],
        total: 0,
        page: options.page || 1,
        limit: options.limit || 12,
        totalPages: 0,
      };
    }
  }

  /**
   * Fast autocomplete suggestions for search input.
   */
  static async getAutocomplete(term: string) {
    if (!term || term.trim().length < 2) return [];

    const q = term.trim();
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { brand: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      select: {
        name: true,
        slug: true,
        brand: { select: { name: true } },
        category: { select: { name: true } },
      },
      take: 6,
    });

    return products.map((p) => ({
      label: `${p.brand.name} ${p.name}`,
      category: p.category.name,
      slug: p.slug,
    }));
  }
}
