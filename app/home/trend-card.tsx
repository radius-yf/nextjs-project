'use client';
import { getPortfolioValues } from '@/api/api';
import { useAsyncReducer } from '@/hooks/useAsyncReducer';
import { format } from 'date-fns/esm';
import { forwardRef } from 'react';
import { ChartCard } from '../../components/charts/card';
import { LineChart } from '../../components/charts/line';

const dateRange = (active: string) => {
  const now = new Date();
  const start = new Date();
  switch (active) {
    case '6M':
      start.setMonth(now.getMonth() - 6);
      break;
    case '1Y':
      start.setFullYear(now.getFullYear() - 1);
      break;
    case '3Y':
      start.setFullYear(now.getFullYear() - 3);
      break;
    case '5Y':
      start.setFullYear(now.getFullYear() - 5);
      break;
  }
  return [format(start, 'yyyy-MM-dd'), format(now, 'yyyy-MM-dd')] as const;
};

export const TrendCard = forwardRef<HTMLDivElement>((_, ref) => {
  const { data, loading, fetchData } = useAsyncReducer(
    async (active: string) => {
      const data =
        active === 'ALL'
          ? await getPortfolioValues()
          : await getPortfolioValues(...dateRange(active));
      return data.map((i) => ({
        ...i,
        date: format(new Date(i.date), 'yyyy-MM-dd')
      }));
    },
    ['ALL']
  );
  return (
    <ChartCard
      ref={ref}
      title="策略与恒指走势对比图"
      options={['6M', '1Y', '3Y', '5Y', 'ALL']}
      initialValue="ALL"
      onChange={(value) => fetchData(value)}
    >
      <LineChart data={data} loading={loading} />
    </ChartCard>
  );
});
TrendCard.displayName = 'TrendCard';
