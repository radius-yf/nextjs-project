'use client';
import { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import { translate } from './chart-util';
import Chart from './chart';

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
  data
}: {
  data?: {
    id: string;
    date: string;
    value: number;
  }[];
}) {
  const options = useMemo(() => {
    if (!data) return undefined;

    const series = translate(data).map(
      ([name, data]) =>
        ({
          type: 'bar',
          name,
          data,
          barGap: '0%',
          barCategoryGap: '50%'
        }) as EChartsOption['series']
    );
    return { ...option, series };
  }, [data]);
  return <Chart option={options ?? {}} notMerge className="min-h-[500px]" />;
}
