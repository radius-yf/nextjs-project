import {
  getBacktestFilter,
  getBacktestGetConfig,
  getBacktestGetMultiProcessStatus,
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
  const btStatus = await getBacktestGetMultiProcessStatus(
    backtest.map((b) => b.bt_id)
  );
  return Promise.all(
    (ids as { id: string; name: string; status?: string }[])
      .concat(btStatus.map((b) => ({ id: b[0], name: b[0], status: b[1] })))
      .map((item) =>
        !item.status || item.status === 'done'
          ? Promise.all([
              getReportPortfolioValues(item.id),
              getReportPortfolioMetrics(item.id)
            ]).then(([values, metrics]) => ({
              id: item.id,
              name: item.name,
              values,
              metrics,
              status: 'done',
              isBacktest: item.status !== undefined
            }))
          : Promise.resolve({
              id: item.id,
              name: item.name,
              values: [],
              metrics: [],
              status: item.status,
              isBacktest: true
            })
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
