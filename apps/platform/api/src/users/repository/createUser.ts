import { db } from '../../lib/db';

export const createUser = async (username: string, password: string, email: string) => {
  return await db.insertInto('users').values({ username, password, email }).executeTakeFirst();
};
