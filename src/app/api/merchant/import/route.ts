import { NextResponse } from 'next/server';
import { MerchantImportService } from '@/lib/services/import.service';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, rows, merchantId } = body;

    // Default demo merchant if not supplied
    let targetMerchantId = merchantId;
    if (!targetMerchantId) {
      const defaultMerchant = await prisma.merchant.findFirst();
      targetMerchantId = defaultMerchant?.id || 'demo-merchant';
    }

    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: { message: 'Rows array is required' } }, { status: 400 });
    }

    // Step 1: Validate import
    const validationResult = MerchantImportService.validateImportData(rows);

    // Step 2: Publish if action is 'publish'
    if (action === 'publish') {
      const validRows = validationResult.results.filter((r) => r.isValid);
      const publishResult = await MerchantImportService.publishImport(targetMerchantId, validRows);
      return NextResponse.json({
        ...validationResult,
        publishedCount: publishResult.publishedCount,
        status: 'PUBLISHED',
      });
    }

    // Otherwise return preview
    return NextResponse.json({
      ...validationResult,
      status: 'PREVIEW',
    });
  } catch (error: any) {
    console.error('API Merchant Import Error:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
