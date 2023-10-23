import { db } from '../../lib/db';

export const getUserAvailability = (userId: number) =>
  db.selectFrom('Availability').selectAll().where('userId', '=', userId).executeTakeFirst();
