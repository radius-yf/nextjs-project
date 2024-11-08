'use client';
import {
  backtestCreateProcess,
  getBacktestFilter,
  getBacktestGetConfig,
  getBacktestGetMultiProcessStatus,
  getReportOnlineIdlist,
  getReportPortfolioMetrics,
  getReportPortfolioValues
} from '@/api/api-v2';
import { FormDialog } from '@/components/dialog';
import { BacktestForm } from '@/components/forms/backtest';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { useAsyncReducer } from '@/hooks/useAsyncReducer';
import { format } from 'date-fns/esm';
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

export default function Page() {
  // const { data } = useAsyncReducer(() => getData(), []);
  const { data: idList } = useAsyncReducer(getReportOnlineIdlist, []);
  const { data: bkList } = useAsyncReducer(getBacktestGetConfig, []);
  const { data } = useAsyncReducer(getBacktestFilter, []);
  return (
    <PageContainer className="grid grid-cols-1 gap-6">
      <div className="flex justify-end">
        <FormDialog
          classNames="sm:min-w-[800px]"
          content={data ? <BacktestForm data={JSON.parse(data)} /> : undefined}
          onSubmit={backtestCreateProcess}
        >
          <Button>Create Backtest</Button>
        </FormDialog>
      </div>
      {idList ? (
        idList.map((item) => <NavCard key={item.id} {...item} />)
      ) : (
        <div>Loading...</div>
      )}
      {bkList
        ? bkList.map((item) => (
            <NavCard
              key={item.bt_id}
              id={item.bt_id}
              name={
                item.alias ??
                `backtest_${format(
                  new Date(item.update_time),
                  'yyyy-MM-dd HH:mm:ss'
                )}`
              }
              backtest={item.data}
            ></NavCard>
          ))
        : null}
    </PageContainer>
  );
}
