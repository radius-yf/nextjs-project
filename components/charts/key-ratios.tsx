'use client';

export function KeyRatios({
  data
}: {
  data: {
    key: string;
    low: number;
    mean: number;
    up: number;
    value: number;
  }[];
}) {
  const d = data.map((i) => ({ key: i.key, value: transform(i) }));
  return (
    <>
      {d.map((item) => (
        <div
          key={item.key}
          className="flex gap-6 border-b px-4 py-2 hover:bg-primary-foreground/5"
        >
          <div className="flex-1">{item.key}</div>
          <div className="flex h-6 flex-[0_0_320px]">
            <div className="flex flex-1 justify-end rounded-l-sm bg-primary-foreground/10">
              <div
                className="rounded-l-sm bg-green-600"
                style={{ width: `${item.value < 0 ? item.value * -100 : 0}%` }}
              ></div>
            </div>
            <div className="scale-y-125 border-r border-primary-foreground/20"></div>
            <div className="flex flex-1 rounded-r-sm bg-primary-foreground/10">
              <div
                className="rounded-r-sm bg-green-600"
                style={{ width: `${item.value > 0 ? item.value * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function transform({
  low,
  mean,
  up,
  value
}: {
  low: number;
  mean: number;
  up: number;
  value: number;
}) {
  const val = value - mean;
  return val > 0 ? val / (up - mean) : val / (mean - low);
}
