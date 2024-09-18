import {
  getPortfolioDrawdowns,
  getPortfolioMetrics,
  getPortfolioReturns,
  getPortfolioRollingIndicator,
  getPortfolioValues
} from '@/api/api';
import { BarChart } from '@/components/charts/bar';
import { ChartCard } from '@/components/charts/card';
import { HistogramChart } from '@/components/charts/histogram';
import { LineChart } from '@/components/charts/line';
import PageContainer from '@/components/layout/page-container';
import { DataTable, ReactTable } from '@/components/tables/table';
import { H1, P } from '@/components/ui/typography';

export default async function Analysis() {
  const [values, returnsY, returnsM, beta, volatility, drawdowns, metrics] =
    await Promise.all([
      getPortfolioValues(),
      getPortfolioReturns('Y'),
      getPortfolioReturns('M'),
      getPortfolioRollingIndicator('beta'),
      getPortfolioRollingIndicator('volatility'),
      getPortfolioDrawdowns(),
      getPortfolioMetrics()
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
        <ChartCard title="Cumulative Returns vs Benchmark">
          <LineChart data={values} />
        </ChartCard>
        <ChartCard title="EOY Returns vs Benchmark">
          <BarChart data={returnsY} />
        </ChartCard>
        <ChartCard title="Distribution of Monthly Returns">
          <HistogramChart data={returnsM} />
        </ChartCard>
        <ChartCard title="Monthly Returns">
          <BarChart data={returnsM} />
        </ChartCard>
        <ChartCard title="Key Performance Metrics">
          <div className="flex gap-6">
            <DataTable
              data={metrics}
              groupKey="key"
              groupName="Metric"
              split={4}
            />
          </div>
        </ChartCard>
        {/* <ChartCard title="Cumulative Returns vs Benchmark (Log Scaled)">
          <LineChart data={[]} />
        </ChartCard> */}
        <ChartCard title="Cumulative Returns vs Benchmark (Volatility Matched)">
          <LineChart data={volatility} />
        </ChartCard>
        <ChartCard title="Rolling Beta to Benchmark">
          <LineChart data={beta} />
        </ChartCard>
        <ChartCard title="EOY Returns vs Benchmark">
          <div className="flex gap-6">
            <DataTable
              data={returnsY.map((i) => ({
                ...i,
                value: (i.value * 100).toFixed(2) + '%'
              }))}
              groupKey="date"
              groupName="Year"
              split={3}
            />
          </div>
        </ChartCard>
        <ChartCard title="Worst 10 Drawdowns">
          <ReactTable
            data={drawdowns}
            columns={[
              { accessorKey: 'Start', header: 'Started' },
              { accessorKey: 'End', header: 'Ended' },
              { accessorKey: 'Drawdown', header: 'Drawdown' },
              { accessorKey: 'Days', header: 'Days' }
            ]}
          />
        </ChartCard>
      </div>
    </PageContainer>
  );
}
