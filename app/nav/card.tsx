'use client';
import { RangeLineChart } from '@/components/charts/line';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatFloat } from '@/lib/utils';
import { useRouter } from 'nextjs-toploader/app';
function isPositiveNumber(value: string | number | undefined): boolean {
  if (value === undefined) {
    return false;
  }
  if (typeof value === 'number') {
    return value > 0;
  }
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}
export function NavCard({
  id,
  name,
  values,
  metrics,
  range
}: {
  id: string;
  name: string;
  values: {
    id: string;
    date: string;
    value: number;
  }[];
  metrics: (Record<string, string> & { id: string })[];
  range: [Date, Date];
}) {
  const router = useRouter();
  // const { data, fetchData } = useAsyncReducer(
  //   ({ from, to }: DateRange) =>
  //     Promise.all([
  //       getReportPortfolioValues(id, from, to),
  //       getReportPortfolioMetrics(id, from, to)
  //     ]).then(([values, metrics]) => ({ values, metrics })),
  //   undefined,
  //   { values, metrics }
  // );
  const hsi = metrics.find((m) => m.id === 'hsi');
  const metric = metrics.find((m) => m.id !== 'hsi');
  return (
    <Card>
      <CardHeader className="flex-wrap">
        <CardTitle
          className="cursor-pointer"
          onClick={() => router.push(`/overview/${id}`)}
        >
          {name}
        </CardTitle>
        <div className="mb-4 grid w-full grid-cols-6 gap-2 border-t px-4 py-3">
          <Pairs
            name="Total Return"
            value={metric?.['Total Return']}
            highlight
          />
          <Pairs
            name="CAGR% (Annual Return)"
            value={metric?.['CAGR% (Annual Return)']}
            highlight
          />
          <Pairs
            name="Excess Return"
            value={
              formatFloat(
                parseFloat(metric?.['Total Return'] || '0') -
                  parseFloat(hsi?.['Total Return'] || '0')
              ) + '%'
            }
            highlight
          />
          <Pairs
            name="Benchmark Return"
            value={hsi?.['Total Return']}
            highlight
          />
          <Pairs name="Alpha" value={metric?.['Alpha']} />
          <Pairs name="Beta" value={metric?.['Beta']} />
          <Pairs name="Sharpe" value={metric?.['Sharpe']} />
          <Pairs name="Sortino" value={metric?.['Sortino']} />
          <Pairs
            name="Max Drawdown"
            value={metric?.['Max Drawdown']}
            highlight
          />
          <Pairs name="Longest DD Days" value={metric?.['Longest DD Days']} />
          <Pairs
            name="Volatility (ann.)"
            value={metric?.['Volatility (ann.)']}
            highlight
          />
          <Pairs
            name="Information Ratio"
            value={metric?.['Information Ratio']}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          {/* <CalendarDateRangePicker
            value={{ from: range[0], to: range[1] }}
            onChange={fetchData}
          /> */}
        </div>
        <RangeLineChart data={values} />
      </CardContent>
    </Card>
  );
}

function Pairs({
  name,
  value,
  highlight = false
}: {
  name: string;
  value?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground/50">{name}</span>
      <span
        className={
          highlight
            ? isPositiveNumber(value)
              ? 'text-red-500'
              : 'text-green-600'
            : ''
        }
      >
        {value}
      </span>
    </div>
  );
}
