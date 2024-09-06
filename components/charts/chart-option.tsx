'use client';
import { EChartsOption } from 'echarts';
import Chart from '../chart';
import { useMemo } from 'react';
import { format } from 'date-fns/esm';

const trendChartOption: EChartsOption = {
  xAxis: {
    type: 'category'
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: (value: number) => `${value * 100}%`
    }
  },
  legend: {}
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
  const val = useMemo(() => {
    if (!data) return [];
    const t = Object.entries(Object.groupBy(data, (d) => d.id));
    return t.map(
      ([key, value]) =>
        [
          key,
          value?.map((d) => [format(new Date(d.date), 'yyyy-MM-dd'), d.value])
        ] as const
    );
  }, [data]);
  console.log(val);

  return (
    <Chart
      option={trendChartOption}
      merge={
        data
          ? {
              series: val.map(([key, value]) => ({
                type: 'line',
                name: key,
                data: value
              }))
            }
          : undefined
      }
      className="flex-1"
    />
  );
}

export const returnChart: EChartsOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [8.2, 9.32, 9.01, -9.34, 1.29, 1.33, 1.32],
      type: 'bar'
    },
    {
      data: [8.2, 9.32, 9.01, -9.34, 1.29, 1.33, 1.32],
      type: 'bar'
    }
  ]
};
