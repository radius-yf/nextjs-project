'use client';
import { getPortfolioReturns } from '@/api/api';
import { useAsync } from '@/hooks/useAsync';
import { forwardRef, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { EChartsOption } from 'echarts';
import Chart from './chart';
import { translate } from './chart-util';
import { format } from 'date-fns/esm';

const returnChart: EChartsOption = {
  grid: {
    left: 64,
    right: 12
  },
  xAxis: {
    type: 'category',
    axisPointer: {
      type: 'shadow'
    }
  },
  yAxis: {
    type: 'value',
    min: (val) => {
      const t = Math.max(Math.abs(val.min), Math.abs(val.max));
      return -Math.ceil((t + 3) / 10) * 10;
    },
    max: (val) => {
      const t = Math.max(Math.abs(val.min), Math.abs(val.max));
      return Math.ceil((t + 3) / 10) * 10;
    },
    axisLabel: {
      formatter: '{value}%'
    },
    axisPointer: {
      show: false
    }
  },
  legend: {},
  dataZoom: [
    {
      type: 'inside',
      start: 85,
      minValueSpan: 12
      // filterMode: 'empty',
    },
    {
      type: 'slider'
    }
  ],
  tooltip: {
    trigger: 'axis',
    valueFormatter: (value) => `${Number(value).toFixed(2)}%`
  }
};

export function ReturnChart({
  data
}: {
  data?: {
    id: string;
    date: string;
    value: number;
  }[];
}) {
  const series = useMemo(() => {
    if (!data) return undefined;

    return translate(data).map(
      ([name, data]) =>
        ({
          type: 'bar',
          name,
          data,
          barGap: '0%',
          barCategoryGap: '50%'
        }) as EChartsOption['series']
    );
  }, [data]);
  return (
    <Chart
      option={{ ...returnChart, series }}
      notMerge
      className="min-h-[500px]"
    />
  );
}

export const ReturnCard = forwardRef<HTMLDivElement>((_, ref) => {
  const [active, setActive] = useState<'M' | 'Y'>('M');
  const { data: returns } = useAsync(
    () =>
      getPortfolioReturns(active).then((data) =>
        data.map((i) => ({
          ...i,
          date: format(new Date(i.date), active === 'M' ? 'yyyy-MM' : 'yyyy')
        }))
      ),
    [active]
  );
  return (
    <Card ref={ref}>
      <CardHeader>
        <CardTitle>策略与恒指月度回报图</CardTitle>
        <div className="mr-6 flex">
          {(['M', 'Y'] as const).map((i) => (
            <button
              key={i}
              data-active={i === active}
              onClick={() => setActive(i)}
              className="px-4 py-3 text-left data-[active=true]:bg-muted"
            >
              {i}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ReturnChart data={returns} />
      </CardContent>
    </Card>
  );
});

ReturnCard.displayName = 'ReturnCard';
