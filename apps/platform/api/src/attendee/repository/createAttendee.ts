import { db } from '../../lib/db';

export const createAttendee = async ({
  attendeeInfo,
}: {
  attendeeInfo: {
    attendeeId: number;
    email: string;
    name: string;
    timeZone: string;
    bookingId: number;
    locale: string;
  };
}) => {
  return await db
    .insertInto('Attendee')
    .values({
      id: attendeeInfo.attendeeId,
      email: attendeeInfo.email,
      name: attendeeInfo.name,
      timeZone: attendeeInfo.timeZone,
      bookingId: attendeeInfo.bookingId,
      locale: attendeeInfo.locale,
    })
    .executeTakeFirst();
};
