import express, { Request, Response } from 'express';
import cors from 'cors';
import { prisma } from './lib/db/prisma';
import { SearchService } from './lib/services/search.service';
import { AIShoppingAssistantService } from './lib/services/ai-assistant.service';
import { MerchantImportService } from './lib/services/import.service';
import { calculateSellerTrustScore } from './lib/services/trust.service';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Healthcheck endpoints
app.get('/health', async (req: Request, res: Response) => {
  res.json({ status: 'UP', service: 'PriceRadar Kenya Backend API', timestamp: new Date() });
});

app.get('/readiness', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'READY', database: 'CONNECTED' });
  } catch (err: any) {
    res.status(500).json({ status: 'NOT_READY', database: err.message });
  }
});

// GET /api/v1/products - Search & Catalog
app.get('/api/v1/products', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    const categorySlug = (req.query.category as string) || undefined;
    const brandSlug = (req.query.brand as string) || undefined;
    const minPriceKes = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPriceKes = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const sortBy = (req.query.sortBy as any) || 'best_value';
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);

    const result = await SearchService.searchProducts({
      query,
      categorySlug,
      brandSlug,
      minPriceKes,
      maxPriceKes,
      sortBy,
      page,
      limit,
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: { code: 'PRODUCTS_ERROR', message: err.message } });
  }
});

// GET /api/v1/products/:slug - Product Overview & Seller Comparison
app.get('/api/v1/products/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        variants: {
          include: {
            identifiers: true,
            attributes: { include: { attribute: true } },
            offers: {
              include: { merchant: true, priceHistory: true },
              orderBy: { totalCostKes: 'asc' },
            },
          },
        },
      },
    });

    if (!product || !product.variants[0]) {
      return res.status(404).json({ error: { message: 'Product not found' } });
    }

    const activeVariant = product.variants[0];
    const formattedOffers = activeVariant.offers.map((offer) => {
      const trustBreakdown = calculateSellerTrustScore(offer.merchant);
      return {
        id: offer.id,
        merchantName: offer.merchant.name,
        merchantSlug: offer.merchant.slug,
        trustScore: trustBreakdown.score,
        trustBadges: trustBreakdown.badges,
        priceKes: offer.priceKes,
        totalCostKes: offer.totalCostKes,
        isDeliveryFree: offer.isDeliveryFree,
        stockStatus: offer.stockStatus,
        url: offer.url,
      };
    });

    res.json({
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brandName: product.brand.name,
        categoryName: product.category.name,
        description: product.description,
        mainImageUrl: product.mainImageUrl,
      },
      offers: formattedOffers,
    });
  } catch (err: any) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// POST /api/v1/ai-assistant - Grounded AI Assistant Query
app.post('/api/v1/ai-assistant', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: { message: 'Prompt required' } });
    const result = await AIShoppingAssistantService.queryAssistant(prompt);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// POST /api/v1/merchants/import - CSV Ingestion
app.post('/api/v1/merchants/import', async (req: Request, res: Response) => {
  try {
    const { action, rows, merchantId } = req.body;
    if (!rows || !Array.isArray(rows)) {
      return res.status(400).json({ error: { message: 'Rows array required' } });
    }

    const validationResult = MerchantImportService.validateImportData(rows);

    if (action === 'publish') {
      const defaultMerchant = await prisma.merchant.findFirst();
      const targetId = merchantId || defaultMerchant?.id || 'demo-merchant';
      const validRows = validationResult.results.filter((r) => r.isValid);
      const publishResult = await MerchantImportService.publishImport(targetId, validRows);
      return res.json({ ...validationResult, publishedCount: publishResult.publishedCount, status: 'PUBLISHED' });
    }

    res.json({ ...validationResult, status: 'PREVIEW' });
  } catch (err: any) {
    res.status(500).json({ error: { message: err.message } });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 PriceRadar Kenya Backend API running on port ${PORT}`);
  });
}

export default app;
