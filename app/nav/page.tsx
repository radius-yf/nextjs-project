import {
  getBacktestFilter,
  getReportOnlineIdlist,
  getReportPortfolioMetrics,
  getReportPortfolioValues
} from '@/api/api-v2';
import { BacktestFormDialog } from '@/components/forms/backtest';
import PageContainer from '@/components/layout/page-container';
import { sub } from 'date-fns';
import { NavCard } from './card';

async function getData(start: Date, end: Date) {
  const val = await getReportOnlineIdlist();
  return Promise.all(
    val.map((id) =>
      Promise.all([
        getReportPortfolioValues(id.id, start, end),
        getReportPortfolioMetrics(id.id, start, end)
      ]).then(([values, metrics]) => ({
        id: id.id,
        name: id.name,
        values,
        metrics
      }))
    )
  );
}

export default async function Page() {
  const end = new Date();
  const start = sub(end, { months: 6 });
  const [data, backtest] = await Promise.all([
    getData(start, end),
    getBacktestFilter()
  ]);
  return (
    <PageContainer className="grid grid-cols-1 gap-6">
      <div className="flex justify-end">
        <BacktestFormDialog data={backtest}></BacktestFormDialog>
      </div>
      {data.map((d) => (
        <NavCard key={d.id} {...d} range={[start, end]}></NavCard>
      ))}
    </PageContainer>
  );
}
