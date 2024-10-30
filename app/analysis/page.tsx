import {
  getPortfolioDrawdowns,
  getPortfolioMetrics,
  getPortfolioReturns,
  getPortfolioRollingIndicator,
  getPortfolioValues
} from '@/api/api';
import { ChartCard } from '@/components/charts/card';
import { HeatChart } from '@/components/charts/heat';
import { HistogramChart } from '@/components/charts/histogram';
import PageContainer from '@/components/layout/page-container';
import { TabCard } from '@/components/tab-card';
import { ReactTable } from '@/components/tables/table';
import { H1, H4, P } from '@/components/ui/typography';
import { groupBy } from '@/lib/data-conversion';

export default async function Analysis() {
  const [values, returnsY, returnsM, beta, drawdowns, metrics] =
    await Promise.all([
      getPortfolioValues(),
      getPortfolioReturns('Y'),
      getPortfolioReturns('M'),
      getPortfolioRollingIndicator('beta'),
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
            const data = await getPortfolioValues(
              undefined,
              undefined,
              undefined,
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
            { name: 'Year', value: 'Y' },
            { name: 'Month', value: 'M' }
          ]}
          render="BarChart"
          initialData={{ data: returnsY }}
          getData={async (val) => {
            'use server';
            const data = await getPortfolioReturns(val as any);
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
          render="LineChart"
          initialData={{ data: beta }}
          getData={async (val) => {
            'use server';
            const data = await getPortfolioRollingIndicator(val as any);
            return { data };
          }}
        />
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
        <ChartCard title="Key Performance Metrics">
          <div className="columns-4">
            {groupBy(metrics[1], 'group')
              .filter(([k]) => k)
              .map(([key, item]) => (
                <div key={key} className="break-inside-avoid pb-4 pr-6">
                  <H4>{key}</H4>
                  <ReactTable
                    data={item}
                    columns={[
                      { accessorKey: 'key', header: 'Metric' },
                      // { accessorKey: 'group', header: 'group' },
                      ...metrics[0].map((i) => ({
                        accessorKey: i,
                        header: i
                      }))
                    ]}
                  />
                </div>
              ))}
          </div>
        </ChartCard>
        {/* <ChartCard title="Cumulative Returns vs Benchmark">
          <LineChart data={values} />
        </ChartCard>
        <ChartCard title="EOY Returns vs Benchmark">
          <BarChart data={returnsY} />
        </ChartCard>
        <ChartCard title="Monthly Returns">
          <BarChart data={returnsM} />
        </ChartCard>
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
        <ChartCard title="Boxplot">
          <Boxplot />
        </ChartCard> */}
      </div>
    </PageContainer>
  );
}
