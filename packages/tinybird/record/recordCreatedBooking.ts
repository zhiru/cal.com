import { BookingStatus } from "@calcom/prisma/enums";

export interface TbRecordCreatedBookingInput {
  id: number;
  userId: number;
  eventTypeId: number;
  startTime: Date;
  endTime: Date;
}

export const recordCreatedBooking = async ({
  id,
  userId,
  eventTypeId,
  startTime,
  endTime,
}: TbRecordCreatedBookingInput) => {
  return await fetch(`${process.env.TINYBIRD_API_URL}/v0/events?name=bookings&wait=true`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
    },
    body: JSON.stringify({
      calcomId: id,
      userId,
      eventTypeId,
      status: BookingStatus.ACCEPTED,
      startTime,
      endTime,
    }),
  });
};
