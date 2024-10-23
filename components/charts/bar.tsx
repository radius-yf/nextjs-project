'use client';
import { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import { translate } from './chart-util';
import Chart from './chart';
import { formatFloat } from '@/lib/utils';

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
    <Chart option={{ ...option, series }} notMerge className="min-h-[500px]" />
  );
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
  data: {
    id: string;
    value: number;
  }[];
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
      data: data.reverse().map(({ id, value }) => [
        value,
        id
        // `${id} ${formatFloat(value * 100)
        //   .toString()
        //   .padStart(12, ' ')}%`
      ])
    };
  }, [data]);
  return (
    <Chart option={{ ...option2, series }} notMerge className="min-h-[500px]" />
  );
}
