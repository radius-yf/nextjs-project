'use client';
import { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import Chart from './chart';
import { formatFloat } from '@/lib/utils';
import { groupBy } from '@/lib/data-conversion';
interface Data {
  id: string;
  date: string;
  value: number;
}

const option: EChartsOption = {
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
export function BarChart({
  data,
  customTranslate,
  loading
}: {
  data?: Data[];
  customTranslate?: (data: Data[]) => Data[];
  loading?: boolean;
}) {
  const series = useMemo(() => {
    if (!data) return undefined;
    const d = groupBy(data, 'id').map(
      ([name, data]) =>
        [name, customTranslate ? customTranslate(data) : data] as const
    );

    return d.map(
      ([name, data]) =>
        ({
          type: 'bar',
          name,
          data: data.map((d) => [d.date, d.value * 100]),
          barGap: '0%',
          barCategoryGap: '50%'
        }) as EChartsOption['series']
    );
  }, [data, customTranslate]);
  return (
    <Chart
      option={{ ...option, series }}
      notMerge
      className="min-h-[500px]"
      showLoading={loading}
    />
  );
}
const monthData = (data: Data[]) => {
  const [f, ...o] = data;
  return o.reduce(
    (a, b, i) => {
      a.push({ ...b, value: (b.value + 1) / (data[i].value + 1) - 1 });
      return a;
    },
    [f]
  );
};
export function MonthlyBarChart({
  data,
  loading
}: {
  data?: Data[];
  loading?: boolean;
}) {
  return <BarChart data={data} customTranslate={monthData} loading={loading} />;
}

const option2: EChartsOption = {
  grid: {
    left: 280,
    right: 12
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category',
    offset: 240,
    axisLabel: {
      align: 'left'
    },
    axisPointer: {
      type: 'shadow'
    }
  },
  tooltip: {
    trigger: 'axis',
    valueFormatter: (value) => `${formatFloat((value as number) * 100)}%`
  }
};
export function InvestmentDistribution({
  data
}: {
  data: Omit<Data, 'date'>[];
}) {
  const series = useMemo(() => {
    if (!data) return undefined;
    return {
      type: 'bar',
      label: {
        show: true,
        position: 'left',
        formatter: ({ value: [val] }: { value: [number, string] }) =>
          `${formatFloat(val * 100)}%`
      },
      data: data.reverse().map(({ id, value }) => [value, id])
    };
  }, [data]);
  return (
    <Chart option={{ ...option2, series }} notMerge className="min-h-[500px]" />
  );
}
