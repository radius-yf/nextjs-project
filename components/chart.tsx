'use client';
import { cn } from '@/lib/utils';
import { EChartsOption, EChartsType } from 'echarts';
import EChartsReact, { EChartsReactProps } from 'echarts-for-react';
import { useTheme } from 'next-themes';
import { forwardRef, useEffect, useRef } from 'react';

interface ChartProps extends EChartsReactProps {
  option: EChartsOption;
  merge?: EChartsOption;
}

const Chart = forwardRef<EChartsReact, ChartProps>((props, ref) => {
  const { option, merge, onChartReady, style, className, ...rest } = props;
  const chartRef = useRef<EChartsType>();
  const { theme } = useTheme();
  useEffect(() => {
    if (chartRef.current && merge) {
      chartRef.current.setOption(merge, false);
    }
  }, [merge, theme]);
  return (
    <EChartsReact
      option={option}
      ref={ref}
      className={cn(['min-h-[300px]', className])}
      style={{ height: undefined, ...style }}
      theme={theme}
      onChartReady={(instance) => {
        chartRef.current = instance;
        onChartReady?.(instance);
      }}
      {...rest}
    ></EChartsReact>
  );
});
Chart.displayName = 'Chart';
export default Chart;
