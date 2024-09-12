'use client';
import { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import Chart from './chart';
import { translate } from './chart-util';

const option: EChartsOption = {
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

export function LineChart({
  data,
  loading
}: {
  data?: {
    id: string;
    date: string;
    value: number;
  }[];
  loading?: boolean;
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
      option={{ ...option, series }}
      showLoading={loading}
      notMerge={true}
      className="min-h-[500px]"
    />
  );
}
