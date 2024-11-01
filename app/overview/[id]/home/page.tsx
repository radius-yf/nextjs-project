import { getPortfolioSummary } from '@/api/api';
import {
  getReportPortfolioHoldingsIndustry,
  getReportPortfolioKeyRatios,
  getReportPortfolioValues
} from '@/api/api-v2';
import { InvestmentDistribution } from '@/components/charts/bar';
import { ChartCard } from '@/components/charts/card';
import { KeyRatios } from '@/components/charts/key-ratios';
import { LineChart } from '@/components/charts/line';
import { PieChart } from '@/components/charts/pie';
import PageContainer from '@/components/layout/page-container';

export default async function Overview({
  params,
  searchParams: p
}: {
  params: { id: string };
  searchParams: { start: string; end: string };
}) {
  const [keyRatios, industry, values, summary] = await Promise.all([
    getReportPortfolioKeyRatios(params.id, p.start, p.end),
    getReportPortfolioHoldingsIndustry(params.id, p.start, p.end),
    getReportPortfolioValues(params.id, p.start, p.end),
    getPortfolioSummary(params.id)
  ]);

  return (
    <PageContainer>
      <div className="grid gap-6 [&>.grid]:gap-6">
        <div className="grid grid-cols-[1fr_2fr]">
          <ChartCard>
            <PieChart data={industry} />
          </ChartCard>
          <ChartCard>
            <LineChart data={values} />
          </ChartCard>
        </div>
        <ChartCard title="Key Ratios">
          <KeyRatios data={keyRatios} />
        </ChartCard>
        <ChartCard>
          <InvestmentDistribution data={industry} />
        </ChartCard>
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
    </PageContainer>
  );
}
