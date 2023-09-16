import { config } from 'dotenv';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { DB } from '../generated/primary/types';
config();

let _primaryDBClient: Kysely<DB> | null = null;

function getClient(): Kysely<DB> {
  if (_primaryDBClient) {
    return _primaryDBClient;
  }

  _primaryDBClient = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
        min: 5,
        max: 10,
      }),
    }),
  });

  return _primaryDBClient;
}

export const primaryDbClient = getClient();
