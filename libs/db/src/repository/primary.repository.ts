import { Redis } from 'ioredis';
import { CompiledQuery, Kysely, QueryResult, SelectExpression } from 'kysely';
import { From } from 'kysely/dist/cjs/parser/table-parser';

import { primaryDbClient } from '../clients/primary.client';
import { redisClient } from '../clients/redis.client';
import { DB } from '../generated/primary/types';
export interface ICommand {
  readonly sql: string;
  readonly parameters: ReadonlyArray<unknown>;
}

export interface IExecuteTransactionParam {
  sql: CompiledQuery;
  return?: boolean;
}

export class PrimaryRepository<
  Table extends keyof DB = never,
  Context = never
> {
  protected dbColumns: SelectExpression<From<DB, Table>, Table>[] = [];
  protected context: Context;
  protected db: Kysely<DB>;
  protected redis: Redis;

  constructor(...params: Context extends never ? [] : [Context]) {
    this.context = params[0] as Context;
    this.db = primaryDbClient;
    this.redis = redisClient;
  }

  executeTransaction<T = unknown>(
    queries: IExecuteTransactionParam[]
  ): Promise<QueryResult<T> | null> {
    return this.db.transaction().execute(async (db) => {
      let result;

      for (const query of queries) {
        if (query.return) {
          result = await db.executeQuery<T>(query.sql);
          continue;
        }

        await db.executeQuery(query.sql);
      }

      return result ?? null;
    });
  }

  execute(query: CompiledQuery) {
    return this.db.executeQuery<Table>(query);
  }
}
