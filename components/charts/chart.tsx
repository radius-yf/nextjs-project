'use client';
import { cn } from '@/lib/utils';
import { registerTheme } from 'echarts';
import EChartsReact, { EChartsReactProps } from 'echarts-for-react';
import { useTheme } from 'next-themes';
import { forwardRef, useMemo } from 'react';
import darkTheme from './chart-theme-dark.json';
import lightTheme from './chart-theme-light.json';

registerTheme('dark', darkTheme);
registerTheme('light', lightTheme);
function getBrowserTheme(theme: string | undefined) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return theme;
}

const Chart = forwardRef<EChartsReact, EChartsReactProps>((props, ref) => {
  const { style: _, className, ...rest } = props;
  const { theme: _theme } = useTheme();
  const theme = useMemo(() => getBrowserTheme(_theme), [_theme]);

  return (
    <EChartsReact
      ref={ref}
      className={cn(['min-h-[300px]', className])}
      style={{ height: undefined }}
      theme={theme}
      {...rest}
    ></EChartsReact>
  );
});
Chart.displayName = 'Chart';
export default Chart;
