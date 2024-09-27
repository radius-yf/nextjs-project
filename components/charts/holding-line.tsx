'use client';

import { getFret, Holding } from '@/api/holdings';
import { groupBy } from '@/lib/data-conversion';
import { EChartsOption } from 'echarts';
import Chart from './chart';
import { format } from 'date-fns/esm';

function layout(row: number, col: number): EChartsOption {
  const arr = new Array(row * col).fill(0);

  const grid: EChartsOption['grid'] = arr.map((_, i) => {
    const x = i % col;
    const y = Math.floor(i / col);
    return {
      show: true,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.2)',

      width: (1 / col) * 100 - 6 + '%',
      height: (1 / row) * 100 - 12 + '%',
      left: x * (100 / col) + 3 + '%',
      top: y * (100 / row) + 6 + '%'
    };
  });
  const xAxis: EChartsOption['xAxis'] = arr.map((_, i) => ({
    show: true,
    type: 'category',
    boundaryGap: false,
    gridIndex: i,
    axisLabel: {
      formatter: (value) => format(new Date(value), 'yyyy-MM'),
      // interval: 2,
      rotate: 30
    }
  }));
  const yAxis: EChartsOption['yAxis'] = arr.map((_, i) => ({
    show: true,
    type: 'value',
    gridIndex: i,
    axisLabel: {
      formatter: (value) => `${value as number}%`
    }
  }));

  return {
    grid,
    xAxis,
    yAxis
  };
}

function generateOptions(data: Holding[]): EChartsOption {
  const l = layout(3, 4);
  const grid = l.grid as { left: string; width: string; top: string }[];
  const group = groupBy(data, 'date').reverse();
  return {
    tooltip: {
      show: true,
      trigger: 'axis',
      valueFormatter: (value) =>
        value ? `${(value as number)?.toFixed(2)}%` : '-'
    },
    ...l,
    title: group.map(([date, _item], index) => ({
      text: format(new Date(date), 'yyyy-MM'),
      textAlign: 'center',
      textStyle: {
        fontSize: 14
      },
      left:
        parseFloat(grid[index].left) + parseFloat(grid[index].width) / 2 + '%',
      top: parseFloat(grid[index].top) - 4 + '%'
    })),
    series: group.flatMap(([_, item], index) =>
      item.map((i) => ({
        name: i.name,
        type: 'line',
        xAxisIndex: index,
        yAxisIndex: index,
        data: getFret(i)
      }))
    )
  };
}

export default function HoldingLine({ data }: { data: Holding[] }) {
  const option = generateOptions(
    data.filter((i) => ['基准', '策略'].includes(i.name))
  );

  return <Chart option={option} notMerge className="min-h-[680px]" />;
}
