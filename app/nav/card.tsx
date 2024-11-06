'use client';
import {
  getReportPortfolioMetrics,
  getReportPortfolioValues
} from '@/api/api-v2';
import { RangeLineChart } from '@/components/charts/line';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAsyncReducer } from '@/hooks/useAsyncReducer';
import { formatFloat } from '@/lib/utils';
import { ChevronsRight, Trash2 } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';
import { stringify } from 'qs';
import { useRef } from 'react';

export function NavCard({
  id,
  name,
  isBacktest
}: {
  id: string;
  name: string;
  isBacktest?: boolean;
}) {
  const qs = useRef<any>();
  const router = useRouter();
  const { data, loading } = useAsyncReducer(getReportPortfolioValues, [id]);

  const { data: metrics } = useAsyncReducer(getReportPortfolioMetrics, [id]);
  const hsi = metrics?.find((m) => m.id === 'hsi');
  const metric = metrics?.find((m) => m.id !== 'hsi');

  return (
    <Card>
      <CardHeader className="flex-wrap">
        <CardTitle>{name}</CardTitle>
        <div className="flex items-center gap-1 pr-4">
          {isBacktest && (
            <Button
              title="delete"
              className="text-destructive hover:text-destructive"
              variant="outline"
              size="icon-sm"
            >
              <Trash2 />
            </Button>
          )}
          <Button
            title="jump to details"
            className="text-primary hover:text-primary"
            variant="outline"
            size="icon-sm"
            onClick={() => {
              router.push(`/overview/${id}/home?${stringify(qs.current)}`);
            }}
          >
            <ChevronsRight size={32} />
          </Button>
        </div>
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
      </CardHeader>
      <CardContent className="pt-2">
        <RangeLineChart
          loading={loading}
          data={data}
          onZoomChange={(ev) => (qs.current = ev)}
        />
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
        {value ?? '-'}
      </span>
    </div>
  );
}
