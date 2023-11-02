import { db } from '../../lib/db';

export const getAttendeById = async (id: number) => {
  return await db.selectFrom('Attendee').selectAll().where('id', '=', id).executeTakeFirst();
};
