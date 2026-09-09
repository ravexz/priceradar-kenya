import { Worker, Job } from 'bullmq';
import { prisma } from './lib/db/prisma';
import { MerchantImportService } from './lib/services/import.service';
import { PriceAlertService } from './lib/services/alert.service';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
};

console.log('⚡ Starting PriceRadar Kenya BullMQ Worker Process...');

// 1. Merchant Import Queue Worker
const importWorker = new Worker(
  'merchant-import-queue',
  async (job: Job) => {
    console.log(`[Worker] Processing merchant import job ${job.id} for merchant ${job.data.merchantId}`);
    const { merchantId, rows } = job.data;
    const validationResult = MerchantImportService.validateImportData(rows);
    const validRows = validationResult.results.filter((r) => r.isValid);
    const publishResult = await MerchantImportService.publishImport(merchantId, validRows);
    console.log(`[Worker] Import job ${job.id} completed. Published ${publishResult.publishedCount} offers.`);
    return publishResult;
  },
  { connection: redisConnection }
);

// 2. Price Alert Queue Worker
const alertWorker = new Worker(
  'price-alert-queue',
  async (job: Job) => {
    console.log(`[Worker] Processing price alert check for variant ${job.data.variantId}`);
    const { variantId, currentLowestPriceKes } = job.data;
    const alertResult = await PriceAlertService.checkAlertsForVariant(variantId, currentLowestPriceKes);
    console.log(`[Worker] Alert check completed. Triggered ${alertResult.triggeredAlertIds.length} alerts.`);
    return alertResult;
  },
  { connection: redisConnection }
);

// 3. Price Anomaly Detection Worker
const anomalyWorker = new Worker(
  'price-anomaly-queue',
  async (job: Job) => {
    console.log(`[Worker] Running price anomaly detection scan...`);
    const offers = await prisma.offer.findMany({
      include: { variant: { include: { offers: true } } },
    });

    let anomalyCount = 0;
    for (const offer of offers) {
      const allPrices = offer.variant.offers.map((o) => o.priceKes);
      const avgPrice = allPrices.reduce((a, b) => a + b, 0) / (allPrices.length || 1);
      
      // If price is >35% below average, flag as anomaly for review
      if (offer.priceKes < avgPrice * 0.65) {
        await prisma.offer.update({
          where: { id: offer.id },
          data: { isAnomaly: true },
        });
        anomalyCount++;
        console.log(`⚠️ Price Anomaly Flagged: Offer ${offer.id} (KSh ${offer.priceKes}) vs Avg KSh ${avgPrice}`);
      }
    }

    return { anomalyCount };
  },
  { connection: redisConnection }
);

importWorker.on('completed', (job) => console.log(`[Worker] Job ${job.id} completed!`));
importWorker.on('failed', (job, err) => console.error(`[Worker] Job ${job?.id} failed:`, err));

console.log('✅ BullMQ Worker ready & listening to queues.');
