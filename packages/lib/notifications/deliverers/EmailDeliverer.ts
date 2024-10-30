import { sendEmail } from "@calcom/lib/server/emails";

import type { NotificationDeliverer, NotificationPayload, NotificationTemplate } from "../interfaces";

export class EmailDeliverer implements NotificationDeliverer {
  async deliver(notification: NotificationPayload, template: NotificationTemplate): Promise<void> {
    // Implementation for sending email notifications
    const { to, data } = notification;

    // Compile template with data
    const compiledSubject = this.compileTemplate(template.subject || "", data);
    const compiledBody = this.compileTemplate(template.body, data);

    await sendEmail({
      to: to.userId // Get user email from DB : undefined,
        ? subject
        : compiledSubject,
      html: compiledBody,
      // Add other email options as needed
    });
  }

  private compileTemplate(template: string, data: Record<string, any>): string {
    // Implement template compilation logic
    // Could use a template engine like handlebars
    return template; // Placeholder
  }
}
