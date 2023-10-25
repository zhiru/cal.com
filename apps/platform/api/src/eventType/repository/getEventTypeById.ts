import { db } from '../../lib/db';

export const getEventTypeById = async (id: number) => {
  return await db
    .selectFrom('EventType')
    .select(['userId', 'title', 'description', 'length', 'hidden'])
    .where('id', '=', id)
    .executeTakeFirst();
};
