'use client';

import { EChartsOption } from 'echarts';
import { useMemo } from 'react';
import Chart from './chart';
import { groupBy } from '@/lib/data-conversion';

const PERCENTAGE_INTERVAL = 1;

const option: EChartsOption = {
  grid: {
    left: 64,
    right: 12
  },
  legend: {},
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
  yAxis: [
    {
      type: 'value',
      axisLine: {
        onZero: false
      }
    },
    {
      type: 'value',
      show: false,
      axisLine: {
        onZero: false
      }
    }
  ]
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
    const series1 = Array.from(new Set(data.map((d) => d.id))).map((name) => ({
      type: 'bar',
      name,
      data: eliminateOutliers(val).map(
        (d) =>
          [
            d.x * PERCENTAGE_INTERVAL + PERCENTAGE_INTERVAL / 2,
            d.data[name]?.length ?? 0
          ] as [number, number]
      ),
      barGap: '-100%',
      barWidth: '99%',
      itemStyle: {
        opacity: 0.7
      }
    }));
    const line = groupBy(data, 'id').reduce(
      (acc, [name, items]) => ({
        ...acc,
        [name]: norm(items.map((d) => d.value))
      }),
      {} as Record<string, { mean: number; std: number }>
    );
    const series2 = series1.map((s) => ({
      type: 'line',
      name: s.name,
      data: s.data.map(([x]) => [
        x - PERCENTAGE_INTERVAL / 2,
        normalPDF(
          (x - PERCENTAGE_INTERVAL / 2) / 100,
          line[s.name].mean,
          line[s.name].std
        )
      ]),
      xAxisIndex: 0,
      yAxisIndex: 1,
      smooth: true,
      showSymbol: false,
      lineStyle: {
        shadowBlur: 4,
        shadowColor: 'rgba(255, 255, 255, 0.7)'
      },
      tooltip: {
        show: false
      }
    }));

    return [...series1, ...series2];
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

function norm(data: number[]) {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const std = Math.sqrt(
    data.reduce((a, b) => a + (b - mean) ** 2, 0) / data.length
  );
  return { mean, std };
}
function normalPDF(x: number, mean: number, stdDev: number) {
  return (
    (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2))
  );
}
