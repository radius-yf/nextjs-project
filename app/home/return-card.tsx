'use client';
import { getPortfolioReturns } from '@/api/api';
import { useAsyncReducer } from '@/hooks/useAsyncReducer';
import { format } from 'date-fns/esm';
import { forwardRef } from 'react';
import { BarChart } from '../../components/charts/bar';
import { ChartCard } from '../../components/charts/card';

export const ReturnCard = forwardRef<HTMLDivElement>((_, ref) => {
  const { data, fetchData } = useAsyncReducer(
    async (active: string) =>
      getPortfolioReturns(active as any).then((data) =>
        data.map((i) => ({
          ...i,
          date: format(new Date(i.date), active === 'M' ? 'yyyy-MM' : 'yyyy')
        }))
      ),
    ['M']
  );
  return (
    <ChartCard
      ref={ref}
      title="策略与恒指月度回报图"
      options={['M', 'Y']}
      initialValue="M"
      onChange={(value) => fetchData(value)}
    >
      <BarChart data={data} />
    </ChartCard>
  );
});

ReturnCard.displayName = 'ReturnCard';
