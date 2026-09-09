import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const queueItems = await prisma.productMatchQueue.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ items: queueItems });
  } catch (error: any) {
    console.error('API Admin Matching GET Error:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchQueueId, action, targetVariantId } = body;

    if (!matchQueueId || !action) {
      return NextResponse.json({ error: { message: 'matchQueueId and action are required' } }, { status: 400 });
    }

    if (action === 'approve') {
      const queueItem = await prisma.productMatchQueue.update({
        where: { id: matchQueueId },
        data: {
          status: 'APPROVED',
          candidateVariantId: targetVariantId || undefined,
        },
      });

      // Audit entry
      const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (adminUser) {
        await prisma.auditLog.create({
          data: {
            actorId: adminUser.id,
            action: 'PRODUCT_MATCH_APPROVED',
            entityType: 'ProductMatchQueue',
            entityId: matchQueueId,
            diffJson: JSON.stringify({ action, targetVariantId }),
          },
        });
      }

      return NextResponse.json({ success: true, queueItem });
    }

    if (action === 'split') {
      const queueItem = await prisma.productMatchQueue.update({
        where: { id: matchQueueId },
        data: {
          status: 'REJECTED',
          notes: 'Split by admin: listing represents a distinct variant',
        },
      });

      return NextResponse.json({ success: true, queueItem });
    }

    return NextResponse.json({ error: { message: 'Invalid action' } }, { status: 400 });
  } catch (error: any) {
    console.error('API Admin Matching POST Error:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
