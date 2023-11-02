import { db } from '../../lib/db';

export const getAllAttendees = async () => {
  return await db.selectFrom('Attendee').selectAll().execute();
};
