import { db } from '../../lib/db';

export const getScheduleById = async (id: number) => {
  return await db.selectFrom('Schedule').selectAll().where('id', '=', id).executeTakeFirst();
};
