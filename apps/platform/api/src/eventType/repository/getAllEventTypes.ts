import { db } from '../../lib/db';

export const getAllEventTypes = async () => {
  return await db.selectFrom('EventType').selectAll().execute();
};
