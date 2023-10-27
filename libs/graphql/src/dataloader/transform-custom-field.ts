import { Dictionary, groupBy, orderBy } from 'lodash';

type MapDataWithIdsByCustomFieldId<T> = {
  data: T[];
  ids: string[];
  idField: keyof T;
};

export function mapDataListWithIdsByCustomFieldIds<T>({
  data,
  idField,
  ids,
}: MapDataWithIdsByCustomFieldId<T>) {
  if (data.length === 0) return Array(ids.length).fill(null);

  const dataMap = new Map(
    data.map((d) => [d[idField] as unknown as string, d]),
  );

  return ids.map((id) => dataMap.get(id.toString()));
}

type MapListWithIdsByCustomFieldId<T extends { id: string }> = {
  data: T[];
  ids: string[];
  idField: keyof T;
  keySortOrder?: Dictionary<{
    id: string;
    keyIds: string[];
  }>;
  sortOrderType?: 'asc' | 'desc';
};

export function mapDataListWithIdsByCustomField<T extends { id: string }>({
  data,
  ids,
  idField,
  keySortOrder,
  sortOrderType = 'asc',
}: MapListWithIdsByCustomFieldId<T>) {
  const groupedData = groupBy(data, (tag) => tag[idField]);

  return ids.map((id) => {
    if (!keySortOrder) return groupedData[id];

    const itemSortOrder = keySortOrder[id].keyIds;

    return orderBy(
      groupedData[id],
      (d) => itemSortOrder.findIndex((id) => id === d.id),
      sortOrderType,
    );
  });
}
