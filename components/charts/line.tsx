'use client';
import { debounce } from '@/lib/utils';
import { Duration } from 'date-fns';
import { format, sub } from 'date-fns/esm';
import { ECharts, EChartsOption } from 'echarts';
import { useEffect, useMemo, useRef } from 'react';
import Chart from './chart';
import { translate } from './chart-util';

const option: EChartsOption = {
  grid: {
    top: 32,
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
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
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
  loading,
  onZoomChange
}: LineChartProps & {
  onZoomChange?: (ev: { start: string; end: string }) => void;
}) {
  const series = useMemo(() => {
    if (!data) return undefined;
    return translate(data, fmt).map(([name, data]) => ({
      type: 'line',
      name,
      data
    }));
  }, [data, fmt]);
  const ref = useRef<ECharts>();

  useEffect(() => {
    if (series) {
      const handler = debounce((param: any) => {
        const p = param.batch?.[0] ? param.batch[0] : param;
        const data = series?.[0].data ?? [];
        const startIndex = Math.floor((p.start / 100) * data.length);
        const endIndex = Math.ceil((p.end / 100) * data.length);
        onZoomChange?.({
          start: data[startIndex][0],
          end: data[endIndex]?.[0]
        });
        const s =
          startIndex === 0
            ? series
            : series?.map((s) => {
                const startValue = s.data.at(startIndex)?.[1];
                return startValue === undefined
                  ? s
                  : {
                      ...s,
                      data: s.data.map(([d, p]) => [
                        d,
                        (p + 1) / (startValue + 1) - 1
                      ])
                    };
              });
        ref.current?.setOption({ series: s }, false);
      });
      ref.current!.on('dataZoom', handler);
      ref.current!.setOption({ series });
      ref.current!.dispatchAction({
        type: 'dataZoom',
        start: calculateStart(series?.[0].data.map(([d]) => d) ?? [], {
          years: 3
        })
      });
    }
  }, [series, onZoomChange]);
  return (
    <Chart
      option={option}
      showLoading={loading}
      className="min-h-[300px]"
      notMerge={true}
      onChartReady={(instance: ECharts) => {
        ref.current = instance;
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
  fmt = 'yyyy-MM-dd',
  data
}: {
  title?: string;
  fmt?: string | null;
  data?: {
    id: string;
    date: string;
    value: number;
  }[];
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

function calculateStart(dateData: string[], subOptions: Duration): number {
  const currentDate = new Date();
  const subtractedDate = sub(currentDate, subOptions); // 根据传入的 sub 参数减去对应的时间
  const subtractedDateString = format(subtractedDate, 'yyyy-MM-dd'); // 转换为 'YYYY-MM-DD' 格式

  const startIndex = dateData.findIndex((date) => date >= subtractedDateString);

  if (startIndex === -1) {
    return 0;
  }

  const startPercent = startIndex / dateData.length;
  return startPercent * 100;
}
