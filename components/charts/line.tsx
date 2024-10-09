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
  fmt = 'yyyy-MM-dd',
  loading
}: {
  data?: {
    id: string;
    date: string;
    value: number;
  }[];
  fmt?: string | null;
  loading?: boolean;
}) {
  const series: EChartsOption['series'] = useMemo(() => {
    if (!data) return undefined;
    return translate(data, fmt).map(([name, data]) => ({
      type: 'line',
      name,
      data
    }));
  }, [data, fmt]);
  return (
    <Chart
      option={{ ...option, series }}
      showLoading={loading}
      notMerge={true}
      className="min-h-[500px]"
    />
  );
}

const simpleOption: EChartsOption = {
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
  tooltip: {
    trigger: 'axis',
    valueFormatter: (value) => `${Number(value).toFixed(2)}%`
  }
};
export function SimpleLineChart({
  title,
  data
}: {
  title?: string;
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
      name,
      data
    }));
  }, [data]);
  return (
    <Chart
      option={{
        ...simpleOption,
        title: title ? { text: title, left: 'center' } : undefined,
        series
      }}
      notMerge
      className="h-[260px]"
    />
  );
}
