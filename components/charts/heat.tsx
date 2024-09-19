'use client';
import { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import Chart from './chart';

const option: EChartsOption = {
  grid: {
    top: 0
  },
  tooltip: {
    valueFormatter: (value) => `${value}%`
  },
  visualMap: {
    show: false,
    min: -15,
    max: 15
  },
  xAxis: {
    type: 'category'
  },
  yAxis: {
    type: 'category',
    inverse: true
  }
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
  const series = useMemo(() => {
    if (data) {
      return [
        {
          type: 'heatmap',
          itemStyle: {
            borderWidth: 1
          },
          data: Array.from(Map.groupBy(data, (d) => d.id))
            .filter(([key, _]) => key !== 'hsi')
            .flatMap(([_, data]) =>
              Array.from(
                Map.groupBy(data, (d) => new Date(d.date).getFullYear())
              ).flatMap(([key, val]) =>
                m.map((i) => [
                  i,
                  key,
                  (
                    (val.find((j) => j.date.endsWith(i))?.value ?? 0) * 100
                  ).toFixed(2)
                ])
              )
            ),
          label: {
            show: true,
            formatter: ({ value }) =>
              `${(value as [string, string, number])[2]}%`
          }
        }
      ] as EChartsOption['series'];
    }
  }, [data]);

  return (
    <Chart
      option={{ ...option, series }}
      opts={{ height: 600, width: 900 }}
      className="flex justify-center"
    />
  );
}
