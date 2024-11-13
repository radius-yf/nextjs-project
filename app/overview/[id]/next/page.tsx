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
          <ReactTable
            columns={[
              { accessorKey: 'sec_name', header: '股票' },
              { accessorKey: 'ticker', header: '代码' },
              { accessorKey: 'industry', header: '行业' },
              { accessorKey: 'score', header: '评分' },
              { accessorKey: 'close', header: '收盘价' },
              { accessorKey: 'pb', header: '市净率' },
              { accessorKey: 'pe', header: '市盈率' },
              { accessorKey: 'ps', header: '市销率' },
              { accessorKey: 'evebitda', header: '净利润' },
              { accessorKey: 'pc', header: '股息率' },
              { accessorKey: 'sy', header: '股息' },
              { accessorKey: 'ret_m3', header: '3月回报' },
              { accessorKey: 'ret_m6', header: '6月回报' },
              { accessorKey: 'ca_liab', header: '流动负债' },
              { accessorKey: 'cash_liab', header: '流动资产' },
              { accessorKey: 'total_debt_ebitda', header: '总负债' },
              { accessorKey: 'net_debt_equity', header: '净负债' }
            ]}
            data={data}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
