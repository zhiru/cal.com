import type { NotificationDeliverer, NotificationPayload, NotificationTemplate } from "../interfaces";

export class WebhookDeliverer implements NotificationDeliverer {
  async deliver(notification: NotificationPayload, template: NotificationTemplate): Promise<void> {
    // Implementation for sending webhook notifications
    const { to, data } = notification;

    // Get webhook URL from settings/DB
    // Make HTTP request to webhook
  }
}
