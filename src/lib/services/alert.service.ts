import { prisma } from '../db/prisma';

export interface CreatePriceAlertDto {
  userId: string;
  variantId: string;
  targetPriceKes: number;
}

export class PriceAlertService {
  /**
   * Create a new price alert for a product variant.
   */
  static async createAlert(dto: CreatePriceAlertDto) {
    return prisma.priceAlert.create({
      data: {
        userId: dto.userId,
        variantId: dto.variantId,
        targetPriceKes: dto.targetPriceKes,
        status: 'ACTIVE',
      },
    });
  }

  /**
   * Check active price alerts against lowest offer prices and trigger notifications.
   */
  static async checkAlertsForVariant(variantId: string, currentLowestPriceKes: number) {
    const activeAlerts = await prisma.priceAlert.findMany({
      where: {
        variantId,
        status: 'ACTIVE',
        targetPriceKes: {
          gte: currentLowestPriceKes, // Price is at or below user target
        },
      },
      include: {
        user: true,
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    const triggered: string[] = [];

    for (const alert of activeAlerts) {
      // Update status to TRIGGERED to prevent spam
      await prisma.priceAlert.update({
        where: { id: alert.id },
        data: {
          status: 'TRIGGERED',
          triggeredAt: new Date(),
        },
      });

      triggered.push(alert.id);
      console.log(`🔔 PRICE ALERT TRIGGERED: Product ${alert.variant.product.name} is now KSh ${currentLowestPriceKes.toLocaleString()} (Target: KSh ${alert.targetPriceKes.toLocaleString()}) for user ${alert.user.email}`);
    }

    return {
      checkedCount: activeAlerts.length,
      triggeredAlertIds: triggered,
    };
  }
}
