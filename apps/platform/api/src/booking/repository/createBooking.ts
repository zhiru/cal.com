import { db } from '../../lib/db';

export const createBooking = async ({
  name,
  email,
  timeZone,
}: {
  name: string;
  email: string;
  timeZone: string;
}) => {
  await db
    .insertInto('Attendee')
    .values({
      id: 6969,
      email: 'sahalrajiv690000000@gmail.com',
      name: 'Ryukeeeeee',
      timeZone: 'Europe/London',
      bookingId: 16,
      locale: 'en',
    })
    .execute();

  // db.insertInto('Booking')
  //   .values({
  //     responses: {
  //       email: '{{$randomExampleEmail}}',
  //       name: '{{$randomFullName}}',
  //       notes: '{{$randomCatchPhrase}}',
  //       guests: [],
  //       phone: '{{$randomPhoneNumber}}',
  //     },
  //     start: '{{start}}',
  //     end: '{{end}}',
  //     eventTypeId: 3,
  //     timeZone: 'America/Mazatlan',
  //     language: 'en',
  //     location: '',
  //     metadata: {},
  //     hasHashedBookingLink: false,
  //     hashedLink: null,
  //   })
  //   .executeTakeFirst();
};
