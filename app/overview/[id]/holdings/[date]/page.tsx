import { getReportPortfolioHoldingsHistoryValue } from '@/api/api-v2';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BarChart } from '@/components/charts/bar';
import { ChartCard } from '@/components/charts/card';
import { LineChart } from '@/components/charts/line';
import PageContainer from '@/components/layout/page-container';
import { format } from 'date-fns/esm';
import { stringify } from 'qs';

export default async function HoldingsPage({
  params,
  searchParams
}: {
  params: { id: string; date: string };
  searchParams: { start: string; end: string };
}) {
  const data = await getReportPortfolioHoldingsHistoryValue(
    params.id,
    [params.date],
    searchParams.start,
    searchParams.end,
    '5d'
  );
  const month = await getReportPortfolioHoldingsHistoryValue(
    params.id,
    [params.date],
    searchParams.start,
    searchParams.end,
    '30d'
  );

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
          <BarChart data={month} />
        </ChartCard>
      </div>
    </PageContainer>
  );
}
