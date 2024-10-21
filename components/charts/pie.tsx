'use client';

import { EChartsOption } from 'echarts';
import Chart from './chart';

const options: EChartsOption = {
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['30%', '70%'],
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
};

export function PieChart() {
  return <Chart option={options ?? {}} notMerge className="min-h-[500px]" />;
}
