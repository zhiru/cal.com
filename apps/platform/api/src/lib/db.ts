import { Kysely, PostgresDialect } from 'kysely';
import type { DB } from 'kysely-codegen';
// this is the Database interface we defined earlier
import { Pool } from 'pg';

export const db = (function () {
  const dialect = new PostgresDialect({
    pool: new Pool({
      database: 'calendso',
      host: 'localhost',
      user: 'postgres',
      password: '',
      ssl: false,
      port: 5450,
      max: 10,
    }),
  });
  return new Kysely<DB>({
    dialect,
  });
})();
