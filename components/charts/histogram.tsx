'use client';

import { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import Chart from './chart';

const PERCENTAGE_INTERVAL = 2;

const option: EChartsOption = {
  grid: {
    left: 64,
    right: 12
  },
  tooltip: {
    trigger: 'axis',
    formatter: (params) => {
      const p = Array.isArray(params) ? params : [params];

      const [label] = p[0].value as [number, number];
      return `<div style="display: grid; grid-template-columns: repeat(3, auto);">
        <span style="grid-column: 1 / span 3">${label - (PERCENTAGE_INTERVAL / 2)}% ~ ${
          label + (PERCENTAGE_INTERVAL / 2)
        }%</span>
        ${p
          .map(
            ({ marker, seriesName, data }) =>
              `<span>${marker}</span>
               <span style="margin-right: 8px">${seriesName}:</span>
               <span style="font-weight: bold">${(data as any)[1]}</span>`
          )
          .join('')}
      </div>`;
    }
  },
  xAxis: {
    type: 'value',
    maxInterval: PERCENTAGE_INTERVAL < 4 ? PERCENTAGE_INTERVAL * 2 : PERCENTAGE_INTERVAL,
    axisLabel: {
      formatter: '{value}%'
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      onZero: false
    }
  },
  legend: {}
};

export function HistogramChart({
  data
}: {
  data?: {
    id: string;
    date: string;
    value: number;
  }[];
}) {
  const series = useMemo(() => {
    if (!data) return [];
    const val = Object.entries(
      Object.groupBy(data, (d) => Math.floor(d.value * (100 / PERCENTAGE_INTERVAL)))
    )
      .map(([k, v]) => ({
        x: Number(k),
        data: Object.groupBy(v!, (d) => d.id)
      }))
      .toSorted((a, b) => a.x - b.x)
      .flatMap((item, index, arr) => {
        if (arr[index + 1] && arr[index + 1].x - item.x > 1) {
          return [
            item,
            ...new Array(arr[index + 1].x - item.x - 1).fill(0).map((_, i) => ({
              x: item.x + i + 1,
              data: {} as typeof item.data
            }))
          ];
        } else {
          return [item];
        }
      });
    return Array.from(new Set(data.map((d) => d.id))).map((name, index) => ({
      type: 'bar',
      name,
      data: val.map((d) => [d.x * PERCENTAGE_INTERVAL + (PERCENTAGE_INTERVAL / 2), d.data[name]?.length ?? 0]),
      barGap: '-100%',
      barWidth: '99%',
      itemStyle: {
        opacity: index === 0 ? 1 : 0.8
      }
    }));
  }, [data]);

  return (
    <Chart
      option={{ ...option, series }}
      notMerge
      className="min-h-[500px]"
    ></Chart>
  );
}
