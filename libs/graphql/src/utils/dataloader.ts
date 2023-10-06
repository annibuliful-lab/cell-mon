import { Dictionary, groupBy, orderBy } from 'lodash';

type DataloaderWithIdsByCustomFieldId<T> = {
  data: T[];
  ids: string[];
  idField: keyof T;
};

export function mapDataloaderRecord<T>({
  data,
  idField,
  ids,
}: DataloaderWithIdsByCustomFieldId<T>) {
  if (data.length === 0) return Array(ids.length).fill(null);

  const dataMap = new Map(
    data.map((d) => [d[idField] as unknown as string, d]),
  );

  return ids.map((id) => dataMap.get(id));
}

type MapDatasWithIdsByCustomFieldId<T extends { id: string }> = {
  data: T[];
  ids: string[];
  idField: keyof T;
  keySortOrder?: Dictionary<{
    id: string;
    keyIds: string[];
  }>;
  sorderOrderType?: 'asc' | 'desc';
};

export function mapDataloaderRecords<T extends { id: string }>({
  data,
  ids,
  idField,
  keySortOrder,
  sorderOrderType = 'asc',
}: MapDatasWithIdsByCustomFieldId<T>) {
  const groupedData = groupBy(data, (tag) => tag[idField]);

  return ids.map((id) => {
    if (!keySortOrder) return groupedData[id];

    const itemSortOrder = keySortOrder[id].keyIds;

    return orderBy(
      groupedData[id],
      (d) => itemSortOrder.findIndex((id) => id === d.id),
      sorderOrderType,
    );
  });
}
