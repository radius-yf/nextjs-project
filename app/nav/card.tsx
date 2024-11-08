'use client';
import {
  getReportPortfolioMetrics,
  getReportPortfolioValues,
  renameBacktest
} from '@/api/api-v2';
import { RangeLineChart } from '@/components/charts/line';
import { FormDialog } from '@/components/dialog';
import { BacktestFormSchema } from '@/components/forms/backtest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAsyncReducer } from '@/hooks/useAsyncReducer';
import { formatFloat } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronsRight, Edit3, Trash2 } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';
import { stringify } from 'qs';
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
type Backtest = BacktestFormSchema & {
  alias?: string;
};

export function NavCard({
  id,
  name,
  backtest
}: {
  id: string;
  name?: string;
  backtest?: string;
}) {
  const qs = useRef<any>();
  const router = useRouter();
  const { data, loading } = useAsyncReducer(getReportPortfolioValues, [id]);
  const bt = backtest ? (JSON.parse(backtest) as Backtest) : undefined;
  return (
    <Card>
      <CardHeader className="flex-wrap">
        <div className="flex items-center">
          <CardTitle className="pr-0">{name}</CardTitle>
          {bt && (
            <FormDialog
              content={<EditName />}
              onSubmit={({ name }: { name: string }) => {
                renameBacktest(id, name);
              }}
            >
              <Button title="edit" variant={'outline'} size="icon-sm">
                <Edit3 />
              </Button>
            </FormDialog>
          )}
        </div>
        <div className="flex items-center gap-1 pr-4">
          {backtest && (
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
        <Metrics id={id} />
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

const formSchema = z.object({
  name: z.string()
});
const EditName = forwardRef(
  ({ name }: { name?: string }, ref: ForwardedRef<any>) => {
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: name ?? ''
      }
    });

    useImperativeHandle(ref, () => {
      return {
        handleSubmit: (onSubmit: (value: any) => void) =>
          form.handleSubmit(onSubmit)()
      };
    });
    return (
      <Form {...form}>
        <form className="mb-4 space-y-2 [&>div]:grid [&>div]:grid-cols-[60px_1fr] [&>div]:gap-3 [&>div]:space-y-0 [&_label]:text-right">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="items-center">
                <FormLabel>alias</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }
);
EditName.displayName = 'EditName';

function Metrics({ id }: { id: string }) {
  const { data: metrics } = useAsyncReducer(getReportPortfolioMetrics, [id]);
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
