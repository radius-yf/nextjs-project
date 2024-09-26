'use client';
import { EChartsOption, ECharts, connect } from 'echarts';
import { useEffect, useMemo, useRef } from 'react';
import Chart from './chart';

const createOption = (
  data: {
    date: string;
    id: string;
    value: number;
  }[]
): EChartsOption[] => {
  return Array.from(Map.groupBy(data ?? [], (d) => d.id)).map(
    (p) =>
      ({
        title: {
          text: p[0],
          left: 'center'
        },
        grid: { top: 32, bottom: 64, left: '7%', right: '3%' },
        tooltip: {
          valueFormatter: (value) => `${value}%`
        },
        visualMap: {
          show: false,
          min: -15,
          max: 15
        },
        xAxis: { type: 'category' },
        yAxis: { type: 'category', inverse: true },
        series: {
          type: 'heatmap',
          name: p[0],
          itemStyle: {
            borderWidth: 1
          },
          data: Array.from(
            Map.groupBy(p[1], (d) => new Date(d.date).getFullYear())
          ).flatMap(([key, val]) =>
            m.map((i) => [
              i,
              key,
              ((val.find((j) => j.date.endsWith(i))?.value ?? 0) * 100).toFixed(
                2
              )
            ])
          ),
          label: {
            show: true,
            formatter: ({ value }) =>
              `${(value as [string, string, number])[2]}%`
          }
        }
      }) as EChartsOption
  );
};
const m = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
];

export function HeatChart({
  data
}: {
  data: {
    date: string;
    id: string;
    value: number;
  }[];
}) {
  const option = useMemo(() => createOption(data), [data]);
  const refs = useRef<ECharts[]>([]);

  useEffect(() => {
    connect(refs.current);
  }, []);

  return (
    <div className="flex">
      {option.map((item, index) => (
        <Chart
          key={index}
          onChartReady={(chart) => (refs.current[index] = chart)}
          option={item}
          className="flex min-h-[580px] flex-1 justify-center"
        />
      ))}
    </div>
  );
}
