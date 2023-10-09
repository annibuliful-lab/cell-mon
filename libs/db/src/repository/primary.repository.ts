import DataLoader from 'dataloader';
import { Redis } from 'ioredis';
import { CompiledQuery, Kysely, QueryResult, SelectExpression } from 'kysely';
import { From } from 'kysely/dist/cjs/parser/table-parser';

import { primaryDbClient } from '../clients/primary.client';
import { redisClient } from '../clients/redis.client';
import { DB } from '../generated/primary/types';
export type SqlCommand<T = unknown> = {
  readonly sql: string;
  readonly parameters: ReadonlyArray<T>;
};

export type ExecuteTransactionParam = {
  sql: CompiledQuery;
  return?: boolean;
};

export class PrimaryRepository<
  Table extends keyof DB = never,
  Context = never,
  DataLoaderType = unknown,
> {
  protected tableColumns: ReadonlyArray<
    SelectExpression<From<DB, Table>, Table>
  > = [];
  protected context: Context;
  protected db: Kysely<DB>;
  protected redis: Redis;
  protected defaultLimit = 20;
  protected defaultOffset = 0;
  dataloader!: DataLoader<string, DataLoaderType, string>;

  constructor(...params: Context extends never ? [] : [Context]) {
    this.context = params[0] as Context;
    this.db = primaryDbClient;
    this.redis = redisClient;
  }

  executeTransaction<T = unknown>(
    queries: ExecuteTransactionParam[],
  ): Promise<QueryResult<T> | null> {
    return this.db.transaction().execute(async (db) => {
      let result = null;

      for (const query of queries) {
        if (query.return) {
          result = await db.executeQuery<T>(query.sql);
          continue;
        }

        await db.executeQuery(query.sql);
      }

      return result;
    });
  }

  execute(query: CompiledQuery) {
    return this.db.executeQuery<Table>(query);
  }
}
