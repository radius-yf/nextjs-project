type Data<T> = { id: string; value: T };
type Result<V, T> = { key: string } & Omit<T, 'id' | 'value'> &
  Record<string, V>;
export function group<T extends Data<any>, K extends keyof T>(
  data: T[],
  key: K
) {
  return [
    Array.from(new Set(data.map((d) => d.id))),
    groupBy(data, key).map(([key, val]) => ({
      key,
      ...val?.reduce(
        (acc, { id, value, ...rest }) => ({ ...acc, ...rest, [id]: value }),
        {}
      )
    }))
  ] as [string[], Result<T['value'], T>[]];
}

export function groupBy<T, K extends keyof T>(data: T[], key: K) {
  return Array.from(Map.groupBy(data, (d) => d[key] as string));
}
