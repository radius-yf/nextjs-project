import {
  getReportPortfolioDdUnderwater,
  getReportPortfolioDrawdowns,
  getReportPortfolioMetricsRowData,
  getReportPortfolioReturns,
  getReportPortfolioRollingIndicator,
  getReportPortfolioValues
} from '@/api/api-v2';
import { ChartCard } from '@/components/charts/card';
import { HeatChart } from '@/components/charts/heat';
import { HistogramChart } from '@/components/charts/histogram';
import { BaseLineChart } from '@/components/charts/line';
import PageContainer from '@/components/layout/page-container';
import { TabCard } from '@/components/tab-card';
import { DataTable, ReactTable } from '@/components/tables/table';
import { H1, P } from '@/components/ui/typography';

export default async function Analysis({
  params,
  searchParams: p
}: {
  params: { id: string };
  searchParams: { start: string; end: string };
}) {
  const [values, returnsY, returnsM, beta, underwater, drawdowns, metrics] =
    await Promise.all([
      getReportPortfolioValues(params.id, p.start, p.end, ''),
      getReportPortfolioReturns(params.id, 'y', p.start, p.end),
      getReportPortfolioReturns(params.id, 'm', p.start, p.end),
      getReportPortfolioRollingIndicator(params.id, p.start, p.end, 'beta'),
      getReportPortfolioDdUnderwater(params.id, p.start, p.end),
      getReportPortfolioDrawdowns(params.id, p.start, p.end),
      getReportPortfolioMetricsRowData(params.id, p.start, p.end)
    ]);

  return (
    <PageContainer scrollable={true}>
      <div className="grid grid-cols-1 gap-6 pb-16">
        <div>
          <H1>Strategy Tearsheet</H1>
          <P className="mb-8 w-1/2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto ut
            unde repudiandae, libero nemo incidunt atque adipisci assumenda
            cumque, voluptatum possimus eos dignissimos natus vitae expedita
            beatae explicabo iure porro.
          </P>
        </div>
        <TabCard
          title="Cumulative Returns vs Benchmark"
          options={[
            { name: 'Normal', value: '' },
            { name: 'Volatility Matched', value: 'match volatility' }
          ]}
          render="LineChart"
          initialData={{ data: values }}
          getData={async (val) => {
            'use server';
            const data = await getReportPortfolioValues(
              params.id,
              p.start,
              p.end,
              val as any
            );
            return { data };
          }}
        />
        <ChartCard title="Monthly Returns">
          <HeatChart data={returnsM} />
        </ChartCard>
        <TabCard
          title="Returns vs Benchmark"
          options={[
            { name: 'Year', value: 'y' },
            { name: 'Month', value: 'm' }
          ]}
          render="BarChart"
          initialData={{ data: returnsY }}
          getData={async (val) => {
            'use server';
            const data = await getReportPortfolioReturns(
              params.id,
              val as any,
              p.start,
              p.end
            );
            return { data };
          }}
        />
        <ChartCard title="Distribution of Monthly Returns">
          <HistogramChart data={returnsM} />
        </ChartCard>
        <TabCard
          title="Rolling indicator"
          options={[
            { name: 'Beta', value: 'beta' },
            { name: 'Volatility', value: 'volatility' },
            { name: 'Sharpe', value: 'sharpe' },
            { name: 'Sortino', value: 'sortino' }
          ]}
          render="BaseLineChart"
          initialData={{ data: beta }}
          getData={async (val) => {
            'use server';
            const data = await getReportPortfolioRollingIndicator(
              params.id,
              p.start,
              p.end,
              val as any
            );
            return { data };
          }}
        />
        <ChartCard title="Drawdowns">
          <div className="grid grid-cols-2 gap-6">
            <BaseLineChart data={underwater} title="Underwater Plot" />
            <ReactTable
              data={drawdowns}
              columns={[
                { accessorKey: 'Start', header: 'Started' },
                { accessorKey: 'End', header: 'Ended' },
                { accessorKey: 'Drawdown', header: 'Drawdown' },
                { accessorKey: 'Days', header: 'Days' }
              ]}
            />
          </div>
        </ChartCard>
        <ChartCard title="Key Performance Metrics">
          <div className="grid grid-cols-3 gap-6">
            <DataTable
              data={metrics}
              groupKey="key"
              groupName="Metric"
              split={3}
            />
          </div>
        </ChartCard>
      </div>
    </PageContainer>
  );
}
