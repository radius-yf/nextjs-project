'use client';
import { debounce } from '@/lib/utils';
import { Duration } from 'date-fns';
import { format, startOfYear, sub } from 'date-fns/esm';
import { ECharts, EChartsOption } from 'echarts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Chart from './chart';
import { translate } from './chart-util';
import { groupBy } from '@/lib/data-conversion';

interface LineChartProps {
  data?: {
    id: string;
    date: string;
    value: number;
  }[];
  fmt?: string | null;
  loading?: boolean;
}
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
  onZoomChange?: (ev: { start?: string; end?: string }) => void;
}) {
  const ref = useRef<ECharts>();
  const [range, setRange] = useState({ start: 0, end: 100, startIndex: 0 });

  const series = useMemo(() => {
    if (!data) return undefined;
    return groupBy(data, 'id').map(([name, data]) => ({
      type: 'line',
      name,
      data: data.map((d) => [format(new Date(d.date), fmt!), d.value] as const)
    }));
  }, [data, fmt]);
  const chartData = useMemo(() => {
    if (!series) return undefined;
    return {
      dataZoom: [
        {
          type: 'inside',
          start: range.start,
          end: range.end
        },
        { type: 'slider' }
      ],
      series:
        range.startIndex === 0
          ? series.map((s) => ({
              ...s,
              data: s.data.map(([d, p]) => [d, p * 100])
            }))
          : series?.map((s) => {
              const startValue = s.data.at(range.startIndex - 1)?.[1];
              return startValue === undefined
                ? s
                : {
                    ...s,
                    data: s.data.map(([d, p]) => [
                      d,
                      ((p + 1) / (startValue + 1) - 1) * 100
                    ])
                  };
            })
    };
  }, [series, range]);

  const ready = useCallback((instance: ECharts) => {
    ref.current = instance;
  }, []);
  const onEvents = useMemo(
    () => ({
      dataZoom: debounce((param: any) => {
        const p = param.batch?.[0] ? param.batch[0] : param;
        const data = series?.[0].data ?? [];

        const startIndex = Math.round((p.start / 100) * (data.length - 1));
        const endIndex = Math.round((p.end / 100) * (data.length - 1));

        setRange({
          start: p.start,
          end: p.end,
          startIndex
        });

        onZoomChange?.({
          start: data[startIndex]?.[0],
          end: data[endIndex]?.[0]
        });
      })
    }),
    [onZoomChange, series]
  );
  const onTabChange = useCallback(
    (value: Duration | Date | null) => {
      const data = series?.[0].data.map(([d]) => d) ?? [];
      const start = calculateStart(data, value);
      setRange({ ...start, end: 100 });
      onZoomChange?.({ start: data[start.startIndex] });
    },
    [onZoomChange, series]
  );

  useEffect(() => {
    if (series) {
      onTabChange({ years: 3 });
    }
  }, [onTabChange, series]);
  return (
    <div>
      <CheckButton onTabChange={onTabChange} />
      <Chart
        option={useMemo(() => ({ ...option, ...chartData }), [chartData])}
        showLoading={loading}
        className="min-h-[300px]"
        onChartReady={ready}
        onEvents={onEvents}
      />
    </div>
  );
}

const baseOption: EChartsOption = {
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
    axisPointer: {
      show: false
    }
  },
  tooltip: {
    trigger: 'axis'
  }
};
export function BaseLineChart({
  data,
  title
}: {
  title?: string;
  data?: {
    date: string;
    value: number;
  }[];
}) {
  const series = useMemo(() => {
    if (!data) return undefined;
    return {
      type: 'line',
      data: data.map(
        (d) => [format(new Date(d.date), 'yyyy-MM-dd'), d.value] as const
      )
    };
  }, [data]);
  return (
    <Chart
      option={{ ...baseOption, title: { left: 'center', text: title }, series }}
      notMerge={true}
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

function calculateStart(
  dateData: string[],
  subOptions: Duration | Date | null
): { start: number; startIndex: number } {
  if (!subOptions) {
    return { start: 0, startIndex: 0 };
  }
  const endIndex = dateData.length - 1;
  const endDate = new Date(dateData[endIndex]);
  const subtractedDate =
    subOptions instanceof Date ? subOptions : sub(endDate, subOptions); // 根据传入的 sub 参数减去对应的时间
  const subtractedDateString = format(subtractedDate, 'yyyy-MM-dd'); // 转换为 'YYYY-MM-DD' 格式

  const startIndex = dateData.findIndex((date) => date >= subtractedDateString);

  if (startIndex === -1) {
    return { start: 0, startIndex: 0 };
  }

  const startPercent = startIndex / endIndex;
  return { start: startPercent * 100, startIndex };
}

const options = [
  { name: '5D', value: { days: 5 } },
  { name: '1M', value: { months: 1 } },
  { name: '6M', value: { months: 6 } },
  { name: 'YTD', value: startOfYear(new Date()) },
  { name: '1Y', value: { years: 1 } },
  { name: '3Y', value: { years: 3 } },
  { name: '5Y', value: { years: 5 } },
  { name: '10Y', value: { years: 10 } },
  { name: 'MAX', value: null }
];
const CheckButton = ({
  onTabChange
}: {
  onTabChange?: (value: any) => void;
}) => {
  const [active, setActive] = useState('3Y');
  const onClick = useCallback(
    (i: { name: string; value: any }) => () => {
      setActive(i.name);
      onTabChange?.(i.value);
    },
    [onTabChange]
  );
  return (
    <div className="flex">
      <div className="flex gap-2 rounded-md border border-primary-foreground/10 ">
        {options.map((i) => (
          <button
            key={i.name}
            data-active={i.name === active}
            className="px-2 text-left data-[active=true]:bg-muted"
            onClick={onClick(i)}
          >
            {i.name}
          </button>
        ))}
      </div>
    </div>
  );
};
