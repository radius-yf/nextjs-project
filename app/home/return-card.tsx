'use client';
import { getPortfolioReturns } from '@/api/api';
import { useAsyncReducer } from '@/hooks/useAsyncReducer';
import { forwardRef } from 'react';
import { BarChart } from '../../components/charts/bar';
import { ChartCard } from '../../components/charts/card';

export const ReturnCard = forwardRef<HTMLDivElement>((_, ref) => {
  const { data, fetchData } = useAsyncReducer(
    async (active: string) => getPortfolioReturns(active as any),
    ['M']
  );
  return (
    <ChartCard
      ref={ref}
      title="策略与恒指月度回报图"
      options={['M', 'Y']}
      initialValue="M"
      onTabChange={(value) => fetchData(value)}
    >
      <BarChart data={data} />
    </ChartCard>
  );
});

ReturnCard.displayName = 'ReturnCard';
