import { db } from '../../lib/db';

export const createBooking = async (booking: { id: number }) => {
  db.insertInto('Booking')
    .values({
      responses: {
        email: '{{$randomExampleEmail}}',
        name: '{{$randomFullName}}',
        notes: '{{$randomCatchPhrase}}',
        guests: [],
        phone: '{{$randomPhoneNumber}}',
      },
      start: '{{start}}',
      end: '{{end}}',
      eventTypeId: 3,
      timeZone: 'America/Mazatlan',
      language: 'en',
      location: '',
      metadata: {},
      hasHashedBookingLink: false,
      hashedLink: null,
    })
    .executeTakeFirst();
};
