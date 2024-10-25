'use client';
import { RangeLineChart } from '@/components/charts/line';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatFloat } from '@/lib/utils';
import { useRouter } from 'nextjs-toploader/app';
import { stringify } from 'qs';
import { useRef } from 'react';

export function NavCard({
  id,
  name,
  values,
  metrics,
  status,
  isBacktest
}: {
  id: string;
  name: string;
  values: {
    id: string;
    date: string;
    value: number;
  }[];
  metrics: (Record<string, string> & { id: string })[];
  status: string;
  isBacktest: boolean;
}) {
  const qs = useRef<any>();
  const router = useRouter();
  const hsi = metrics.find((m) => m.id === 'hsi');
  const metric = metrics.find((m) => m.id !== 'hsi');

  return (
    <Card>
      <CardHeader className="flex-wrap">
        <CardTitle>{name}</CardTitle>
        <div className="pr-4">
          {isBacktest && (
            <Button
              className="text-red-500 hover:text-red-600"
              variant="ghost"
              size="sm"
            >
              Delete
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              router.push(`/overview/${id}?${stringify(qs.current)}`);
            }}
          >
            Details
          </Button>
        </div>
        {status === 'done' && (
          <div className="mb-4 grid w-full grid-cols-6 gap-x-2 border-t px-4 py-1">
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
        )}
      </CardHeader>
      <CardContent className="pt-2">
        {status === 'done' ? (
          <RangeLineChart
            data={values}
            onZoomChange={(ev) => (qs.current = ev)}
          />
        ) : (
          <div>Loading...</div>
        )}
      </CardContent>
    </Card>
  );
}

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
      <span className="overflow-hidden text-ellipsis text-nowrap text-sm text-muted-foreground/50">
        {name}
      </span>
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
