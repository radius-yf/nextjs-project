import {
  getBacktestFilter,
  getBacktestGetConfig,
  getReportOnlineIdlist,
  getReportPortfolioMetrics,
  getReportPortfolioValues
} from '@/api/api-v2';
import { BacktestFormDialog } from '@/components/forms/backtest';
import PageContainer from '@/components/layout/page-container';
import { NavCard } from './card';

async function getData() {
  const [ids, backtest] = await Promise.all([
    getReportOnlineIdlist(),
    getBacktestGetConfig()
  ]);
  return Promise.all(
    ids
      .concat(backtest.map((b) => ({ id: b.bt_id, name: b.bt_id })))
      .map((item) =>
        Promise.all([
          getReportPortfolioValues(item.id),
          getReportPortfolioMetrics(item.id)
        ]).then(([values, metrics]) => ({
          id: item.id,
          name: item.name,
          values,
          metrics
        }))
      )
  );
}

export default async function Page() {
  const [data, backtest] = await Promise.all([getData(), getBacktestFilter()]);
  return (
    <PageContainer className="grid grid-cols-1 gap-6">
      <div className="flex justify-end">
        <BacktestFormDialog data={backtest}></BacktestFormDialog>
      </div>
      {data.map((d) => (
        <NavCard key={d.id} {...d}></NavCard>
      ))}
    </PageContainer>
  );
}
