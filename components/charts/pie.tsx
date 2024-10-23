'use client';

import { EChartsOption } from 'echarts';
import Chart from './chart';
import { useMemo } from 'react';
import { formatFloat } from '@/lib/utils';

const options: EChartsOption = {
  tooltip: {
    trigger: 'item',
    valueFormatter: (value) => `${formatFloat((value as number) * 100)}%`
  }
};

export function PieChart({ data }: { data: { id: string; value: number }[] }) {
  const series = useMemo(
    () => ({
      type: 'pie',
      radius: ['20%', '50%'],
      data: data.map(({ id, value }) => ({ value, name: id }))
    }),
    [data]
  );
  return (
    <Chart option={{ ...options, series }} notMerge className="min-h-[500px]" />
  );
}
