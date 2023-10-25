import { db } from '../../lib/db';

export const getTeamById = async (id: number) => {
  return await db
    .selectFrom('Team')
    .select(['name', 'slug', 'bio', 'timeZone'])
    .where('id', '=', id)
    .executeTakeFirst();
};
