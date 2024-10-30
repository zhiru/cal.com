import type { NotificationDataMap, NotificationTriggerEvents } from "./interfaces";

export { notificationService } from "./NotificationService";
export * from "./interfaces";

// Type-safe system events
export const systemEvents = {
  emit: async <T extends NotificationTriggerEvents>(
    event: T,
    payload: {
      to: { userId?: number; teamId?: number };
      data: NotificationDataMap[T];
    }
  ) => {
    await notificationService.notify(event, payload);
  },
};
