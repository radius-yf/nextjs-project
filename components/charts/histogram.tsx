'use client';

import { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import Chart from './chart';

const PERCENTAGE_INTERVAL = 1;

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
        <span style="grid-column: 1 / span 3">${
          label - PERCENTAGE_INTERVAL / 2
        }% ~ ${label + PERCENTAGE_INTERVAL / 2}%</span>
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
    maxInterval: PERCENTAGE_INTERVAL,
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
      Object.groupBy(data, (d) =>
        Math.floor(d.value * (100 / PERCENTAGE_INTERVAL))
      )
    )
      .map(([k, v]) => ({
        x: Number(k),
        data: Object.groupBy(v!, (d) => d.id)
      }))
      .toSorted((a, b) => a.x - b.x);
    const result = eliminateOutliers(val);

    return Array.from(new Set(data.map((d) => d.id))).map((name, index) => ({
      type: 'bar',
      name,
      data: result.map((d) => [
        d.x * PERCENTAGE_INTERVAL + PERCENTAGE_INTERVAL / 2,
        d.data[name]?.length ?? 0
      ]),
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

function eliminateOutliers<
  T extends { x: number; data: Partial<Record<string, any[]>> }
>(data: T[]): T[] {
  while (
    data[1].x - data[0].x > 1 &&
    Object.values(data[0].data).reduce((a, b) => a + (b?.length ?? 0), 0) < 4
  ) {
    data = data.slice(1);
  }

  while (
    data[data.length - 1].x - data[data.length - 2].x > 1 &&
    Object.values(data[data.length - 1].data).reduce(
      (a, b) => a + (b?.length ?? 0),
      0
    ) < 4
  ) {
    data = data.slice(0, -1);
  }
  return data;
}

// 正态分布概率密度函数
// function normalPDF(x, mean, stdDev) {
//   return (
//     (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
//     Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2))
//   );
// }
