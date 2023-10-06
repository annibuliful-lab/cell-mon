export function mapArrayToStringRecord(values: string[] | number[]) {
  return `{${values.map((tag) => `"${tag}"`).join(',')}}` as never;
}
