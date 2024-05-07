import tasker from "@calcom/features/tasker";

import type { handleNotificationWhenNoSlots } from "./handleNotificationWhenNoSlots";

type SchedulePayload = typeof handleNotificationWhenNoSlots;

export const scheduleHandleNotificationWhenNoSlots: SchedulePayload = async (payload) => {
  await tasker.create("notifyNoSlots", JSON.stringify(payload));
  return {
    ok: true,
    status: 200,
    message: "No-slot notification scheduled successfully",
  };
};
