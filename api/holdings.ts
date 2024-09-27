import { add, addMonths, format } from 'date-fns/esm';

export interface Holding {
  date: string;
  ticker: string;
  name: string;
  industry: string;
  fret: number | null;
  fret_1m: number | null;
  fret_2m: number | null;
  fret_3m: number | null;
  fret_4m: number | null;
  fret_5m: number | null;
  fret_6m: number | null;
  fret_7m: number | null;
  fret_8m: number | null;
  fret_9m: number | null;
  fret_10m: number | null;
  fret_11m: number | null;
  fret_12m: number | null;
}
export function getFret(data: Holding) {
  const date = new Date(data.date);

  return [
    [format(date, 'yyyy-MM-dd'), data.fret_1m],
    [format(addMonths(date, 1), 'yyyy-MM-dd'), data.fret_2m],
    [format(addMonths(date, 2), 'yyyy-MM-dd'), data.fret_3m],
    [format(addMonths(date, 3), 'yyyy-MM-dd'), data.fret_4m],
    [format(addMonths(date, 4), 'yyyy-MM-dd'), data.fret_5m],
    [format(addMonths(date, 5), 'yyyy-MM-dd'), data.fret_6m],
    [format(addMonths(date, 6), 'yyyy-MM-dd'), data.fret_7m],
    [format(addMonths(date, 7), 'yyyy-MM-dd'), data.fret_8m],
    [format(addMonths(date, 8), 'yyyy-MM-dd'), data.fret_9m],
    [format(addMonths(date, 9), 'yyyy-MM-dd'), data.fret_10m],
    [format(addMonths(date, 10), 'yyyy-MM-dd'), data.fret_11m],
    [format(addMonths(date, 11), 'yyyy-MM-dd'), data.fret_12m]
  ]
    .filter((i): i is [string, number] => i[1] !== null)
    .map(([date, value]) => [date, value * 100]);
}
