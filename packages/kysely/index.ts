import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import type { DB } from "./src/generated/types";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
