import { sendEmail } from "@calcom/features/tasker/tasks";

import type { NotificationDeliverer, NotificationPayload, NotificationTemplate } from "../interfaces";

export class EmailDeliverer implements NotificationDeliverer {
  async deliver(notification: NotificationPayload, template: NotificationTemplate): Promise<void> {
    // Implementation for sending email notifications
    const { to, data } = notification;

    // Compile template with data
    const emails = await this.getUserOrUsersEmail(to);

    emails.forEach((email) => {
      sendEmail({
        to: email,
        template: template.triggerEvent,
        payload: JSON.stringify(data),
      });
    });
  }

  private async getUserOrUsersEmail({
    userId,
    teamId,
  }:
    | {
        userId: number | undefined;
        teamId?: never;
      }
    | {
        userId?: never;
        teamId: number;
      }): Promise<string[]> {
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
        },
      });
      return user?.email ? [user.email] : [];
    }

    if (teamId) {
      const teamMemberships = await prisma.membership.findMany({
        where: { teamId },
        select: {
          user: { select: { email: true } },
        },
      });

      return teamMemberships.map((membership) => membership.user.email).filter(Boolean);
    }
  }
}
