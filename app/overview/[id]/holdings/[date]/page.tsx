import { getReportPortfolioHoldingsHistoryValue } from '@/api/api-v2';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { MonthlyBarChart } from '@/components/charts/bar';
import { ChartCard } from '@/components/charts/card';
import { translate } from '@/components/charts/chart-util';
import { LineChart } from '@/components/charts/line';
import PageContainer from '@/components/layout/page-container';
import { SortTable } from '@/components/tables/table';
import { format } from 'date-fns/esm';
import { stringify } from 'qs';

export default async function HoldingsPage({
  params,
  searchParams
}: {
  params: { id: string; date: string };
  searchParams: { start: string; end: string };
}) {
  const p: [string, string[], string, string] = [
    params.id,
    [params.date],
    searchParams.start,
    searchParams.end
  ];
  const [data, month, monthAll] = await Promise.all([
    getReportPortfolioHoldingsHistoryValue(...p, '5d'),
    getReportPortfolioHoldingsHistoryValue(...p, 'ME'),
    getReportPortfolioHoldingsHistoryValue(...p, 'ME', true)
  ]);
  const tableData = translate(monthAll, 'yyyy-MM').map(([name, data]) => ({
    name,
    ...data.reduce(
      (acc, [date, value]) => ({ ...acc, [date]: value.toFixed(2) }),
      {}
    )
  }));

  const d = format(new Date(params.date), 'yyyy-MM');
  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-6 pb-16">
        <Breadcrumbs
          items={[
            {
              title: 'Holdings',
              link: '../holdings?' + stringify(searchParams)
            },
            { title: d, link: '' }
          ]}
        />

        <ChartCard title="走势对比图">
          <LineChart data={data} />
        </ChartCard>
        <ChartCard title="月度对比图">
          <MonthlyBarChart data={month} />
        </ChartCard>
        <ChartCard title="详细收益表">
          <SortTable
            data={tableData}
            columns={Object.keys(tableData[0]).map((key) => ({
              accessorKey: key,
              header: key,
              sortable: key !== 'name'
            }))}
          />
        </ChartCard>
      </div>
    </PageContainer>
  );
}
