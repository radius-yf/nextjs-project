export const translate = (
  data: { id: string; date: string; value: number }[]
) =>
  Object.entries(Object.groupBy(data, (d) => d.id)).map(
    ([key, val]) => [key, val!.map((d) => [d.date, d.value * 100])] as const
  );
