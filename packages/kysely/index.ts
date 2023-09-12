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

class Database {
  private static instance: Kysely<DB>;

  private constructor(dialect: PostgresDialect) {
    Database.instance = new Kysely<DB>({
      dialect,
    });
  }

  public static getInstance(): Kysely<DB> {
    if (!Database.instance) {
      new Database(dialect);
    }
    return Database.instance;
  }
}

export const db = Database.getInstance();
