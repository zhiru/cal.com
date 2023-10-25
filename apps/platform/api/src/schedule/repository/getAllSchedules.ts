import { db } from '../../lib/db';

export const getAllSchedules = async () => {
  return await db.selectFrom('Schedule').selectAll().execute();
};
