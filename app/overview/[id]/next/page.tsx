import { getReportPortfolioNextHoldings } from '@/api/api-v2';
import PageContainer from '@/components/layout/page-container';
import { ReactTable } from '@/components/tables/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Page({
  params: { id }
}: {
  params: { id: string };
}) {
  const data = await getReportPortfolioNextHoldings(id);
  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>下期持仓</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div>无数据</div>
          ) : (
            <ReactTable
              columns={Object.keys(data[0]).map((k) => ({
                accessorKey: k,
                header: k
              }))}
              data={data}
            />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
