'use client';
import { EChartsOption } from 'echarts';
import EChartsReact from 'echarts-for-react';
import { useMemo, useRef, useState } from 'react';
import Chart from './chart';
import { translate } from './chart-util';
import { debounce } from '@/lib/utils';

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
interface LineChartProps {
  data?: {
    id: string;
    date: string;
    value: number;
  }[];
  fmt?: string | null;
  loading?: boolean;
}
export function LineChart({
  data,
  fmt = 'yyyy-MM-dd',
  loading
}: LineChartProps) {
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

export function RangeLineChart({
  data,
  fmt = 'yyyy-MM-dd',
  loading
}: LineChartProps) {
  const series = useMemo(() => {
    if (!data) return undefined;
    return translate(data, fmt).map(([name, data]) => ({
      type: 'line',
      name,
      data
    }));
  }, [data, fmt]);
  const ref = useRef<EChartsReact>(null);

  return (
    <Chart
      ref={ref}
      option={{ ...option, series }}
      showLoading={loading}
      className="min-h-[500px]"
      notMerge={true}
      onEvents={{
        datazoom: debounce((param: { start: number }) => {
          const startIndex = Math.floor(
            (param.start / 100) * (series?.[0].data.length ?? 0)
          );
          ref.current?.getEchartsInstance().setOption(
            {
              series:
                startIndex === 0
                  ? series
                  : series?.map((s) => {
                      const startValue = s.data.at(startIndex - 1)?.[1];
                      return startValue === undefined
                        ? s
                        : {
                            ...s,
                            data: s.data.map(([d, p]) => [
                              d,
                              (p + 1) / (startValue + 1) - 1
                            ])
                          };
                    })
            },
            false
          );
        })
      }}
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
