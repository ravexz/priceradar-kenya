import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { offerId } = body;

    if (!offerId) {
      return NextResponse.json({ error: { message: 'offerId is required' } }, { status: 400 });
    }

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { merchant: true, variant: true },
    });

    if (!offer) {
      return NextResponse.json({ error: { message: 'Offer not found' } }, { status: 404 });
    }

    // Record tracking event
    const click = await prisma.outboundClick.create({
      data: {
        offerId: offer.id,
        merchantId: offer.merchant.id,
        variantId: offer.variantId,
        clickTime: new Date(),
      },
    });

    return NextResponse.json({
      clickId: click.id,
      redirectUrl: offer.url,
    });
  } catch (error: any) {
    console.error('API Outbound Click Error:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
