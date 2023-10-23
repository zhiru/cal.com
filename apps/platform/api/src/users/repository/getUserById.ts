import { db } from '../../lib/db';

export const getUserById = async (id: number) => {
  return await db
    .selectFrom('users')
    .select(['name', 'email'])
    .where('id', '=', id)
    .executeTakeFirst();
};
