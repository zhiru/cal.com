export interface NotificationRecipient {
  userId?: number;
  teamId?: number;
}

// Base notification template interface
export interface NotificationTemplate {
  id: string;
  subject?: string;
  body: string;
  triggerEvent: NotificationTriggerEvents;
}

// Event-specific data interfaces
export interface NoSlotsForTeamData {
  teamName: string;
  startDate: Date;
  endDate: Date;
  requestedBy: {
    name: string;
    email: string;
  };
}

// Map each event to its required data structure
export interface NotificationDataMap {
  [NotificationTriggerEvents.NO_SLOTS_FOR_TEAM]: NoSlotsForTeamData;
}

// Type-safe payload that enforces correct data structure for each event
export type NotificationPayload<T extends NotificationTriggerEvents> = {
  to: NotificationRecipient;
  data: NotificationDataMap[T];
};

export interface NotificationDeliverer {
  deliver<T extends NotificationTriggerEvents>(
    notification: NotificationPayload<T>,
    template: NotificationTemplate
  ): Promise<void>;
}

export enum NotificationTriggerEvents {
  NO_SLOTS_FOR_TEAM = "NO_SLOTS_FOR_TEAM",
}

export interface NotificationSetting {
  userId?: number;
  teamId?: number;
  templateId: string;
  method: NotificationDeliveryMethod;
  enabled: boolean;
}

export enum NotificationDeliveryMethod {
  EMAIL = "EMAIL",
  WEBHOOK = "WEBHOOK",
}
