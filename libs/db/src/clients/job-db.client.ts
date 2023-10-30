import { config } from 'dotenv';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { DB } from '../generated/job/types';
config();

let _primaryDBClient: Kysely<DB> | null = null;

function getClient(): Kysely<DB> {
  if (!process.env.JOB_DATABASE_URL) {
    throw new Error('please add JOB_DATABASE_URL to .env');
  }

  if (_primaryDBClient) {
    return _primaryDBClient;
  }

  _primaryDBClient = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.JOB_DATABASE_URL,
        min: 5,
        max: 10,
      }),
    }),
  });

  return _primaryDBClient;
}

export const jobDbClient = getClient();
