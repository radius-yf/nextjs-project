'use client';
import {
  backtestCreateProcess,
  getReportPortfolioMetrics,
  getReportPortfolioValues,
  renameBacktest
} from '@/api/api-v2';
import { RangeLineChart } from '@/components/charts/line';
import { FormDialog } from '@/components/dialog';
import { BacktestForm, BacktestFormSchema } from '@/components/forms/backtest';
import { EditName } from '@/components/forms/edit-name';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAsyncReducer } from '@/hooks/useAsyncReducer';
import { formatFloat } from '@/lib/utils';
import { ChevronsRight, Edit3, FileStack, Trash2 } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';
import { stringify } from 'qs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useNavItems } from './items';
type Backtest = BacktestFormSchema & {
  alias?: string;
};

export function NavCard({
  id,
  name,
  className
}: {
  id: string;
  name: string;
  className?: string;
}) {
  const qs = useRef<any>();
  const router = useRouter();
  const { data, loading } = useAsyncReducer(getReportPortfolioValues, [id]);
  const { data: metrics } = useAsyncReducer(getReportPortfolioMetrics, [id]);
  return (
    <Card className={className}>
      <CardHeader className="flex-wrap">
        <div className="flex items-center">
          <CardTitle className="pr-0">{name}</CardTitle>
        </div>
        <div className="flex items-center gap-1 pr-4">
          <Button
            title="Jump to details"
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
        <Metrics metrics={metrics} />
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

export function BacktestCard({
  id,
  name: title,
  backtest,
  status
}: {
  id: string;
  name: string;
  backtest: string;
  status: string;
}) {
  const qs = useRef<any>();
  const router = useRouter();
  const handleZoom = useCallback((ev: any) => (qs.current = ev), []);
  const handleJump = useCallback(() => {
    router.push(`/overview/${id}/home?${stringify(qs.current)}`);
  }, [id, router]);

  const {
    data,
    loading,
    fetchData: fetchValues
  } = useAsyncReducer(getReportPortfolioValues);
  const { data: metrics, fetchData: fetchMetrics } = useAsyncReducer(
    getReportPortfolioMetrics
  );
  const bt = JSON.parse(backtest) as Backtest;
  useEffect(() => {
    if (status === 'done') {
      fetchValues(id);
      fetchMetrics(id);
    }
  }, [fetchMetrics, fetchValues, id, status]);

  const [alias, setAlias] = useState(title);
  const changeAlias = useCallback(
    (ref: UseFormReturn<{ name: string }>) => {
      ref.handleSubmit(({ name }) => {
        renameBacktest(id, name);
        setAlias(name);
      })();
    },
    [id]
  );

  const { refresh, search } = useNavItems();
  const createBacktest = useCallback(
    (ref: UseFormReturn<BacktestFormSchema>) => {
      ref.handleSubmit((data) => {
        backtestCreateProcess(data);
        refresh();
      })();
    },
    [refresh]
  );
  return (
    <Card className={search && alias.includes(search) ? 'hidden' : ''}>
      <CardHeader className="flex-wrap">
        <div className="flex items-center">
          <CardTitle className="pr-0">{alias}</CardTitle>
          <FormDialog
            title="Modify the Alias"
            content={EditName}
            params={useMemo(() => ({ name: alias }), [alias])}
            confirm={changeAlias}
          >
            <Button title="edit" variant={'outline'} size="icon-sm">
              <Edit3 />
            </Button>
          </FormDialog>
        </div>
        <div className="flex items-center gap-1 pr-4">
          <FormDialog
            title="Create from ..."
            classNames="sm:min-w-[800px]"
            confirm={createBacktest}
            content={BacktestForm}
            params={{
              initialValues: {
                ...bt,
                alias: `${alias} Copy`
              }
            }}
          >
            <Button title="Create from ..." variant="outline" size="icon-sm">
              <FileStack />
            </Button>
          </FormDialog>
          <Button
            title="Delete"
            className="text-destructive hover:text-destructive"
            variant="outline"
            size="icon-sm"
          >
            <Trash2 />
          </Button>
          <Button
            title="Jump to details"
            className="text-primary hover:text-primary"
            variant="outline"
            size="icon-sm"
            onClick={handleJump}
          >
            <ChevronsRight size={32} />
          </Button>
        </div>
        <Metrics metrics={metrics} />
      </CardHeader>
      <CardContent className="pt-2">
        <RangeLineChart
          loading={loading}
          data={data}
          onZoomChange={handleZoom}
        />
      </CardContent>
    </Card>
  );
}

function Metrics({
  metrics
}: {
  metrics?: (Record<string, string> & {
    id: string;
  })[];
}) {
  const hsi = metrics?.find((m) => m.id === 'hsi');
  const metric = metrics?.find((m) => m.id !== 'hsi');
  return (
    <div className="mb-4 grid w-full grid-cols-6 gap-x-2 border-t px-4 py-1">
      <Pairs name="Total Return" value={metric?.['Total Return']} highlight />
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
      <Pairs name="Benchmark Return" value={hsi?.['Total Return']} highlight />
      <Pairs name="Alpha" value={metric?.['Alpha']} />
      <Pairs name="Beta" value={metric?.['Beta']} />
      <Pairs name="Sharpe" value={metric?.['Sharpe']} />
      <Pairs name="Sortino" value={metric?.['Sortino']} />
      <Pairs name="Max Drawdown" value={metric?.['Max Drawdown']} highlight />
      <Pairs name="Longest DD Days" value={metric?.['Longest DD Days']} />
      <Pairs
        name="Volatility (ann.)"
        value={metric?.['Volatility (ann.)']}
        highlight
      />
      <Pairs name="Information Ratio" value={metric?.['Information Ratio']} />
    </div>
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
