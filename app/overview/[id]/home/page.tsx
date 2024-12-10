import {
  getReportPortfolioDescribe,
  getReportPortfolioHoldingsIndustry,
  getReportPortfolioHoldingsPercent,
  getReportPortfolioKeyRatios,
  getReportPortfolioSummary,
  getReportPortfolioValues
} from '@/api/api-v2';
import { InvestmentDistribution } from '@/components/charts/bar';
import { ChartCard } from '@/components/charts/card';
import { KeyRatios } from '@/components/charts/key-ratios';
import { LineChart } from '@/components/charts/line';
import { PieChart } from '@/components/charts/pie';
import PageContainer from '@/components/layout/page-container';
import { MarkdownViewer } from '@/components/markdown';

export default async function Overview({
  params,
  searchParams: p
}: {
  params: { id: string };
  searchParams: { start: string; end: string };
}) {
  const [desc, keyRatios, percent, industry, values, summary] =
    await Promise.all([
      getReportPortfolioDescribe(params.id),
      getReportPortfolioKeyRatios(params.id, p.start, p.end),
      getReportPortfolioHoldingsPercent(params.id, p.start, p.end),
      getReportPortfolioHoldingsIndustry(params.id, p.start, p.end),
      getReportPortfolioValues(params.id, p.start, p.end),
      getReportPortfolioSummary(params.id, p.start, p.end)
    ]);

  return (
    <PageContainer>
      <div className="grid gap-6 [&>.grid]:gap-6">
        <MarkdownViewer content={desc} />
        <div className="grid grid-cols-[1fr_2fr]">
          <ChartCard title="Market Value">
            <PieChart data={percent} />
          </ChartCard>
          <ChartCard title="Returns">
            <LineChart data={values} />
          </ChartCard>
        </div>
        <ChartCard title="Key Ratios">
          <KeyRatios data={keyRatios} />
        </ChartCard>
        <ChartCard title="行业市值分布">
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
