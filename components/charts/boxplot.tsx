'use client';
import { EChartsOption } from 'echarts';
import Chart from './chart';

const option: EChartsOption = {
  dataset: [
    {
      // prettier-ignore
      source: [
        [850, 740, 900, 170, 930, 850, 950, 980, 980, 880, 100, 980, 930, 650, 760, 810, 100, 100, 960, 960],
        [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
        [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
        [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
        [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870, 1234]
      ]
    },
    {
      transform: {
        type: 'boxplot',
        config: {
          itemNameFormatter: 'expr {value}'
        }
      }
    },
    {
      fromDatasetIndex: 1,
      fromTransformResult: 1
    }
  ],
  tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: 64,
    right: 12
  },
  xAxis: {
    type: 'category',
    splitArea: {
      show: false
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'boxplot',
      type: 'boxplot',
      colorBy: 'data',
      encode: {
        x: 'ItemName', // X轴使用 "Item"
        y: ['Low', 'Q1', 'Q2', 'Q3', 'High'] // Y轴使用数据集中的每一列
      },
      datasetIndex: 1
    },
    {
      name: 'outlier',
      type: 'scatter',
      datasetIndex: 2
    }
  ]
};
export function Boxplot() {
  return <Chart option={option} notMerge className="min-h-[500px]" />;
}
