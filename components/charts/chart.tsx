'use client';
import { cn } from '@/lib/utils';
import { registerTheme } from 'echarts';
import EChartsReact, { EChartsReactProps } from 'echarts-for-react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
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

export default function Chart(props: EChartsReactProps) {
  const { style: _, className, ...rest } = props;
  const { theme: _theme } = useTheme();
  const theme = useMemo(() => getBrowserTheme(_theme), [_theme]);

  return (
    <EChartsReact
      className={cn(['min-h-[300px]', className])}
      style={{ height: undefined }}
      theme={theme}
      loadingOption={{
        maskColor:
          theme === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(255, 255, 255, 0.8)'
      }}
      {...rest}
    ></EChartsReact>
  );
}
