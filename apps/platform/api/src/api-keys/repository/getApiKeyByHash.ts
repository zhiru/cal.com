import { db } from '../../lib/db';

export const getApiKeyByHash = (hash: string) =>
  db.selectFrom('ApiKey').selectAll().where('hashedKey', '=', hash).executeTakeFirst();
