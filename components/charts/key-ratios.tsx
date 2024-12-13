'use client';

import { formatFloat } from '@/lib/utils';

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
  const d = data.map((i) => ({ ...i, width: transform(i) }));
  return (
    <>
      {d.map((item) => (
        <div
          key={item.key}
          className="flex gap-6 border-b px-4 py-2 hover:bg-primary-foreground/5"
        >
          <div className="text-muted-foreground/80">
            <div>{item.key}</div>
            <div className="flex gap-2">
              <div>
                <span className="text-muted-foreground/50">low: </span>
                <strong className="inline-block w-12">
                  {formatFloat(item.low)}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground/50">mean: </span>
                <strong className="inline-block w-12">
                  {formatFloat(item.mean)}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground/50">up: </span>
                <strong className="inline-block w-12">
                  {formatFloat(item.up)}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground/50">value: </span>
                <strong className="inline-block w-12">
                  {formatFloat(item.value)}
                </strong>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="text-center text-muted-foreground/50">
              VS. BENCHMARKET
            </div>
            <div className="flex w-full flex-1">
              <div className="flex flex-1 justify-end rounded-l-sm bg-primary-foreground/10">
                <div
                  className="rounded-l-sm bg-green-600"
                  style={{
                    width: `${item.width < 0 ? item.width * -100 : 0}%`
                  }}
                ></div>
              </div>
              <div className="scale-y-125 border-r border-primary-foreground/20"></div>
              <div className="flex flex-1 rounded-r-sm bg-primary-foreground/10">
                <div
                  className="rounded-r-sm bg-green-600"
                  style={{ width: `${item.width > 0 ? item.width * 100 : 0}%` }}
                ></div>
              </div>
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
