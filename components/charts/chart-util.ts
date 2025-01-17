import { format } from 'date-fns/esm';

export const translate = (
  data: { id: string; date: string; value: number }[],
  fmt?: string | null
): [string, [string, number][]][] =>
  Array.from(Map.groupBy(data, (d) => d.id)).map(
    ([key, val]) =>
      [
        key,
        val.map((d) => [
          fmt ? format(new Date(d.date), fmt) : d.date,
          d.value * 100
        ])
      ] as [string, [string, number][]]
  );
