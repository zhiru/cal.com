import { db } from '../../lib/db';

export const getBookingById = async (id: number) => {
  return await db.selectFrom('Booking').selectAll().where('id', '=', id).executeTakeFirst();
};
