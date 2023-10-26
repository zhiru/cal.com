import { db } from '../../lib/db';

export const getAllBooking = async () => {
  return await db.selectFrom('Booking').selectAll().execute();
};
