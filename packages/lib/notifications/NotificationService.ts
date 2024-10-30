import { prisma } from "@calcom/prisma";

import { EmailDeliverer } from "./deliverers/EmailDeliverer";
import { WebhookDeliverer } from "./deliverers/WebhookDeliverer";
import type { NotificationDeliverer, NotificationTriggerEvents } from "./interfaces";
import { NotificationDeliveryMethod } from "./interfaces";

export class NotificationService {
  private deliverers: Map<NotificationDeliveryMethod, NotificationDeliverer>;

  constructor() {
    this.deliverers = new Map([
      [NotificationDeliveryMethod.EMAIL, new EmailDeliverer()],
      [NotificationDeliveryMethod.WEBHOOK, new WebhookDeliverer()],
    ]);
  }

  async notify<T extends NotificationTriggerEvents>(
    event: T,
    payload: NotificationPayload<T>
  ): Promise<void> {
    // 1. Get notification template for this event
    const template = await prisma.notificationTemplate.findFirst({
      where: { triggerEvent: event },
    });

    if (!template) {
      throw new Error(`No template found for event: ${event}`);
    }

    // 2. Get notification settings for recipients
    const settings = await prisma.notificationSetting.findMany({
      where: {
        OR: [{ userId: payload.to.userId }, { teamId: payload.to.teamId }],
        templateId: template.id,
        enabled: true,
      },
    });

    // 3. Send notifications through each enabled delivery method
    const deliveryPromises = settings.map(async (setting) => {
      const deliverer = this.deliverers.get(setting.method);
      if (!deliverer) {
        throw new Error(`No deliverer found for method: ${setting.method}`);
      }
      await deliverer.deliver(payload, template);
    });

    await Promise.all(deliveryPromises);
  }
}

// Create singleton instance
export const notificationService = new NotificationService();
