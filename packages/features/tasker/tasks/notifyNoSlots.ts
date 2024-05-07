import { z } from "zod";

import { stringToDayjsZod } from "@calcom/prisma/zod-utils";
import { handleNotificationWhenNoSlots } from "@calcom/trpc/server/routers/viewer/slots/handleNotificationWhenNoSlots";

const eventDetailsSchema = z.object({
  username: z.string(),
  eventSlug: z.string(),
  startTime: stringToDayjsZod,
  visitorTimezone: z.string().optional(),
  visitorUid: z.string().optional(),
});

const payloadSchema = z.object({
  eventDetails: eventDetailsSchema,
  orgDetails: z.object({
    currentOrgDomain: z.string().nullable(),
  }),
});

export async function notifyNoSlots(payload: string): Promise<void> {
  try {
    const parsedPayload = payloadSchema.parse(JSON.parse(payload));
    await handleNotificationWhenNoSlots(parsedPayload);
  } catch (error) {
    // ... handle error
    console.error(error);
    throw error;
  }
}
