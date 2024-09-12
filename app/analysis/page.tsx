import { BarChart } from '@/components/charts/bar';
import { ChartCard } from '@/components/charts/card';
import { LineChart } from '@/components/charts/line';
import PageContainer from '@/components/layout/page-container';
import { H1, P } from '@/components/ui/typography';

export default function Analysis() {
  return (
    <PageContainer scrollable={true}>
      <div className="grid grid-cols-1 gap-6 pb-16">
        <div>
          <H1>Strategy Tearsheet</H1>
          <P>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto ut
            unde repudiandae, libero nemo incidunt atque adipisci assumenda
            cumque, voluptatum possimus eos dignissimos natus vitae expedita
            beatae explicabo iure porro.
          </P>
        </div>
        <ChartCard title="Cumulative Returns vs Benchmark">
          <LineChart data={[]} />
        </ChartCard>
        <ChartCard title="EOY Returns vs Benchmark">
          <BarChart data={[]} />
        </ChartCard>
        <ChartCard title="Distribution of Monthly Returns">
          {/* TODO 直方图📊 */}
        </ChartCard>
        <ChartCard title="Monthly Returns">
          <BarChart data={[]} />
        </ChartCard>
        <ChartCard title="Key Performance Metrics">
          {/* TODO Table */}
        </ChartCard>
        <ChartCard title="Cumulative Returns vs Benchmark (Log Scaled)">
          <LineChart data={[]} />
        </ChartCard>
        <ChartCard title="Cumulative Returns vs Benchmark (Volatility Matched)">
          <LineChart data={[]} />
        </ChartCard>
        <ChartCard title="Rolling Beta to Benchmark">
          <LineChart data={[]} />
        </ChartCard>
        <ChartCard title="EOY Returns vs Benchmark">
          {/* TODO Table */}
        </ChartCard>
        <ChartCard title="Worst 10 Drawdowns">
          <LineChart data={[]} />
        </ChartCard>
      </div>
    </PageContainer>
  );
}
