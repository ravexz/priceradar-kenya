import { NextResponse } from 'next/server';
import { PriceAlertService } from '@/lib/services/alert.service';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variantId, targetPriceKes } = body;

    if (!variantId || !targetPriceKes || targetPriceKes <= 0) {
      return NextResponse.json({ error: { message: 'Valid variantId and targetPriceKes are required' } }, { status: 400 });
    }

    // Default to demo user for unauthenticated requests
    let user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'anonymous@priceradar.co.ke',
          passwordHash: 'hashed',
          name: 'Anonymous User',
          role: 'CUSTOMER',
        },
      });
    }

    const alert = await PriceAlertService.createAlert({
      userId: user.id,
      variantId,
      targetPriceKes: Number(targetPriceKes),
    });

    return NextResponse.json({ success: true, alertId: alert.id });
  } catch (error: any) {
    console.error('API Price Alert Error:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
