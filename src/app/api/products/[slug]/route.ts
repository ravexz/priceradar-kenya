import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { calculateSellerTrustScore } from '@/lib/services/trust.service';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        variants: {
          include: {
            identifiers: true,
            attributes: {
              include: {
                attribute: true,
              },
            },
            offers: {
              include: {
                merchant: {
                  include: {
                    offers: { select: { lastCheckedAt: true } },
                  },
                },
                priceHistory: {
                  orderBy: { recordedAt: 'asc' },
                },
              },
              orderBy: {
                totalCostKes: 'asc', // Sort offers by intelligent total cost
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: { code: 'PRODUCT_NOT_FOUND', message: 'Requested product could not be found' } },
        { status: 404 }
      );
    }

    // Default variant
    const activeVariant = product.variants[0];
    if (!activeVariant) {
      return NextResponse.json(
        { error: { code: 'NO_VARIANTS', message: 'Product contains no active variants' } },
        { status: 404 }
      );
    }

    // Format offers with Seller Trust Scores & Total Cost calculations
    const rawOffers = activeVariant.offers.map((offer) => {
      const trustBreakdown = calculateSellerTrustScore(offer.merchant);
      return {
        id: offer.id,
        merchantId: offer.merchant.id,
        merchantName: offer.merchant.name,
        merchantSlug: offer.merchant.slug,
        merchantLogo: null,
        title: offer.title,
        trustScore: trustBreakdown.score,
        trustBadges: trustBreakdown.badges,
        priceKes: offer.priceKes,
        originalPriceKes: offer.originalPriceKes,
        deliveryFeeKes: offer.deliveryFeeKes,
        totalCostKes: offer.totalCostKes,
        isDeliveryFree: offer.isDeliveryFree,
        stockStatus: offer.stockStatus,
        condition: offer.condition,
        warrantyMonths: offer.warrantyMonths,
        warrantyText: offer.warrantyText,
        url: offer.url,
        lastCheckedAt: offer.lastCheckedAt,
        freshnessState: offer.freshnessState,
      };
    });

    // Deduplicate duplicate items from same shop with same price & title
    const uniqueOffersMap = new Map<string, typeof rawOffers[0]>();
    for (const offer of rawOffers) {
      const key = `${offer.merchantId}_${offer.priceKes}_${(offer.title || '').trim().toLowerCase()}`;
      if (!uniqueOffersMap.has(key)) {
        uniqueOffersMap.set(key, offer);
      }
    }
    const formattedOffers = Array.from(uniqueOffersMap.values());

    // Sort offers considering price + trust + delivery
    formattedOffers.sort((a, b) => {
      // Primary: In Stock first
      if (a.stockStatus === 'IN_STOCK' && b.stockStatus !== 'IN_STOCK') return -1;
      if (a.stockStatus !== 'IN_STOCK' && b.stockStatus === 'IN_STOCK') return 1;
      // Secondary: Total cost
      return a.totalCostKes - b.totalCostKes;
    });

    // Spec Map
    const specsMap: Record<string, string> = {};
    activeVariant.attributes.forEach((attr) => {
      const val = attr.valueString || (attr.valueNumber !== null ? String(attr.valueNumber) : '') || (attr.valueBoolean !== null ? String(attr.valueBoolean) : '');
      if (val) specsMap[attr.attribute.slug] = `${val} ${attr.attribute.unit || ''}`.trim();
    });

    // Price History trend points
    const defaultOffer = activeVariant.offers[0];
    const priceHistoryPoints = defaultOffer?.priceHistory.map((ph) => ({
      date: new Date(ph.recordedAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' }),
      priceKes: ph.priceKes,
    })) || [];

    const lowestPrice = formattedOffers[0]?.priceKes || 0;
    const highestPrice = Math.max(...formattedOffers.map((o) => o.priceKes), lowestPrice);

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brandName: product.brand.name,
        categoryName: product.category.name,
        categorySlug: product.category.slug,
        modelNumber: product.modelNumber,
        description: product.description,
        mainImageUrl: product.mainImageUrl,
        images: product.images,
      },
      activeVariant: {
        id: activeVariant.id,
        name: activeVariant.name,
        slug: activeVariant.slug,
        identifiers: activeVariant.identifiers,
        specsMap,
      },
      offers: formattedOffers,
      priceSummary: {
        lowestPrice,
        highestPrice,
        history: priceHistoryPoints,
      },
    });
  } catch (error: any) {
    console.error('API Product Slug GET Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message || 'Failed to load product details' } },
      { status: 500 }
    );
  }
}
