'use client';
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
import { useAsyncReducer } from '@/hooks/useAsyncReducer';

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

export default function Page() {
  // const { data } = useAsyncReducer(() => getData(), []);
  const { data: backtest } = useAsyncReducer(getBacktestFilter, []);
  const { data: idList } = useAsyncReducer(getReportOnlineIdlist, []);
  const { data: bkList } = useAsyncReducer(getBacktestGetConfig, []);

  return (
    <PageContainer className="grid grid-cols-1 gap-6">
      <div className="flex justify-end">
        {backtest && <BacktestFormDialog data={backtest}></BacktestFormDialog>}
      </div>
      {idList ? (
        idList.map((item) => (
          <NavCard key={item.id} id={item.id} name={item.name} />
        ))
      ) : (
        <div>Loading...</div>
      )}
      {bkList
        ? bkList.map((d) => (
            <NavCard
              key={d.bt_id}
              id={d.bt_id}
              name={d.bt_id}
              isBacktest
            ></NavCard>
          ))
        : null}
    </PageContainer>
  );
}
