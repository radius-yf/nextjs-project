import { getReportPortfolioNextHoldings } from '@/api/api-v2';
import PageContainer from '@/components/layout/page-container';
import { SortTable } from '@/components/tables/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Page({
  params: { id }
}: {
  params: { id: string };
}) {
  const data = await getReportPortfolioNextHoldings(id);
  return (
    <PageContainer className="max-h-[calc(100dvh-60px)] overflow-auto">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>下期持仓</CardTitle>
        </CardHeader>
        <CardContent className="flex overflow-auto">
          {data.length === 0 ? (
            <div>无数据</div>
          ) : (
            <SortTable
              data={data}
              columns={Object.keys(data[0])
                .filter((key) => !key.startsWith('_'))
                .map((key) => ({
                  accessorKey: key,
                  header: key,
                  sortable: true
                }))}
            />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
