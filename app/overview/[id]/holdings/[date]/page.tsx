import { getReportPortfolioHoldingsHistoryValue } from '@/api/api-v2';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BarChart } from '@/components/charts/bar';
import { ChartCard } from '@/components/charts/card';
import { LineChart } from '@/components/charts/line';
import PageContainer from '@/components/layout/page-container';
import { groupBy } from '@/lib/data-conversion';
import { format } from 'date-fns/esm';

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
    searchParams.end
  );

  const barData = groupBy(data, 'id').map(([_, item]) =>
    item.map((i, index) => ({
      id: i.id,
      date: i.date,
      value:
        index === 0 ? i.value : (i.value + 1) / (item[index - 1].value + 1) - 1
    }))
  );

  const d = format(new Date(params.date), 'yyyy-MM');
  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-6 pb-16">
        <Breadcrumbs
          items={[
            { title: 'Holdings', link: '/holdings' },
            { title: d, link: `/holdings/${params.date}` }
          ]}
        />

        <ChartCard title="走势对比图">
          <LineChart data={data} />
        </ChartCard>
        <ChartCard title="月度对比图">
          <BarChart data={barData.flat()} />
        </ChartCard>
      </div>
    </PageContainer>
  );
}