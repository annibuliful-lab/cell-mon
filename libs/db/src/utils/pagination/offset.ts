import { SelectQueryBuilder, sql, StringReference } from 'kysely';
import { uniq } from 'lodash';

export type OffsetPaginationResult<O> = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  rows: O[];
};

export async function offsetPagination<O, DB, TB extends keyof DB>(
  qb: SelectQueryBuilder<DB, TB, O>,
  opts: {
    perPage: number;
    page: number;
    experimental_deferredJoinPrimaryKey?: StringReference<DB, TB>;
  },
): Promise<OffsetPaginationResult<O>> {
  qb = qb.limit(opts.perPage + 1).offset((opts.page - 1) * opts.perPage);

  const deferredJoinPrimaryKey = opts.experimental_deferredJoinPrimaryKey;

  if (deferredJoinPrimaryKey) {
    const primaryKeys = await qb
      .clearSelect()
      .select((eb) => eb.ref(deferredJoinPrimaryKey).as('primaryKey'))
      .execute()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((rows) => rows.map((row) => (row as any).primaryKey));

    qb = qb
      .where((eb) =>
        primaryKeys.length > 0
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            eb(deferredJoinPrimaryKey, 'in', uniq(primaryKeys) as any)
          : eb(sql`1`, '=', 0),
      )
      .clearOffset()
      .clearLimit();
  }

  const rows = await qb.execute();
  const hasNextPage = rows.length > 0 ? rows.length > opts.perPage : false;
  const hasPrevPage = rows.length > 0 ? opts.page > 1 : false;

  // If we fetched an extra row to determine if we have a next page, that
  // shouldn't be in the returned results
  if (rows.length > opts.perPage) {
    rows.pop();
  }

  return {
    hasNextPage,
    hasPrevPage,
    rows,
  };
}
