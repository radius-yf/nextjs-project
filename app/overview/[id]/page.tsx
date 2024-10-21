import { ChartCard } from '@/components/charts/card';
import { LineChart } from '@/components/charts/line';
import { PieChart } from '@/components/charts/pie';
import PageContainer from '@/components/layout/page-container';

export default function Overview({ params }: { params: { id: string } }) {
  return (
    <PageContainer>
      <div className="grid grid-cols-[1fr_2fr] gap-6">
        <ChartCard>
          <PieChart />
        </ChartCard>
        <ChartCard>
          <LineChart />
        </ChartCard>
      </div>
    </PageContainer>
  );
}
