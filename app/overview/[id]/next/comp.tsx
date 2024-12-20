'use client';
import {
  getReportPortfolioNextHoldings,
  getReportPortfolioTradingSummary
} from '@/api/api-v2';
import { ChartCard } from '@/components/charts/card';
import { TabCard } from '@/components/tab-card';
import { useAsyncReducer } from '@/hooks/useAsyncReducer';
import { useCallback, useMemo } from 'react';

const days = getLastSixMonths();

export function NextPage({ id }: { id: string }) {
  const { data: holdings } = useAsyncReducer(getReportPortfolioNextHoldings, [
    id,
    days.at(-1)
  ]);
  const { data: summary, fetchData } = useAsyncReducer(
    getReportPortfolioTradingSummary,
    [id, days.at(-1)]
  );

  const init = useMemo(() => {
    if (holdings) {
      return {
        className: 'max-h-[500px]',
        data: holdings,
        columns: Object.keys(holdings[0])
          .filter((key) => !key.startsWith('_'))
          .map((key) => ({
            accessorKey: key,
            header: key,
            sortable: true
          }))
      };
    }
  }, [holdings]);
  const getData = useCallback(
    async (val: string) => {
      fetchData(id, val);
      const data = await getReportPortfolioNextHoldings(id, val);
      const columns = Object.keys(data[0])
        .filter((key) => !key.startsWith('_'))
        .map((key) => ({
          accessorKey: key,
          header: key,
          sortable: true
        }));
      return { data, columns };
    },
    [fetchData, id]
  );

  if (!holdings || !summary) {
    return null;
  }
  return (
    <div className="grid gap-6 [&>.grid]:gap-6">
      <TabCard
        title="下期持仓"
        render="SortTable"
        options={days}
        tabIndex={days.length - 1}
        initialData={init}
        getData={getData}
      />
      <ChartCard title="总策略加权指标">
        <div className="columns-3">
          {summary.map(([title, items]) => (
            <div key={title} className="break-inside-avoid pb-4 pr-6">
              <h4 className="font-medium">{title}</h4>
              <ul>
                {items.map((j) => (
                  <li
                    key={j.name}
                    className="flex justify-between border-b border-muted-foreground/20 font-light"
                  >
                    <span className="overflow-hidden text-ellipsis text-nowrap">
                      {j.name}
                    </span>
                    <span>{j.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

function getLastSixMonths(): string[] {
  const result: string[] = [];
  const currentDate = new Date();

  for (let i = 0; i < 6; i++) {
    // 克隆当前日期，减去 i 个月
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    // 格式化为 "YYYY-MM"
    const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    result.push(yearMonth);
  }

  return result.reverse(); // 返回从过去到现在的顺序
}
