'use client';
import { getPortfolioValues } from '@/api/api';
import { useAsync } from '@/hooks/useAsync';
import { EChartsOption } from 'echarts';
import { forwardRef, useMemo, useState } from 'react';
import Chart from './chart';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { translate } from './chart-util';
import { format } from 'date-fns/esm';

const trendChartOption: EChartsOption = {
  grid: {
    left: 64,
    right: 12
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisPointer: {
      type: 'line'
    }
  },
  yAxis: {
    type: 'value',
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
      // start: 80,
      minValueSpan: 30
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
export function TrendChart({
  data
}: {
  data?: {
    id: string;
    date: string;
    value: number;
  }[];
}) {
  const series: EChartsOption['series'] = useMemo(() => {
    if (!data) return undefined;
    return translate(data).map(([name, data]) => ({
      type: 'line',
      symbol: 'none',
      name,
      data
    }));
  }, [data]);
  return (
    <Chart
      option={{ ...trendChartOption, series }}
      notMerge={true}
      className="min-h-[500px]"
    />
  );
}

const dateRange = (active: string) => {
  const now = new Date();
  const start = new Date();
  switch (active) {
    case '6M':
      start.setMonth(now.getMonth() - 6);
      break;
    case '1Y':
      start.setFullYear(now.getFullYear() - 1);
      break;
    case '3Y':
      start.setFullYear(now.getFullYear() - 3);
      break;
    case '5Y':
      start.setFullYear(now.getFullYear() - 5);
      break;
  }
  return [format(start, 'yyyy-MM-dd'), format(now, 'yyyy-MM-dd')] as const;
};

export const TrendCard = forwardRef<HTMLDivElement>((_, ref) => {
  const [active, setActive] = useState('ALL');
  const { data } = useAsync(async () => {
    const data =
      active === 'ALL'
        ? await getPortfolioValues()
        : await getPortfolioValues(...dateRange(active));
    return data.map((i) => ({
      ...i,
      date: format(new Date(i.date), 'yyyy-MM-dd')
    }));
  }, [active]);
  return (
    <Card ref={ref}>
      <CardHeader>
        <CardTitle>策略与恒指走势对比图</CardTitle>
        <div className="mr-6 flex">
          {(['6M', '1Y', '3Y', '5Y', 'ALL'] as const).map((i) => (
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
        <TrendChart data={data} />
      </CardContent>
    </Card>
  );
});
TrendCard.displayName = 'TrendCard';
