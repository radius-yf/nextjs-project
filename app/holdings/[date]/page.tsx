import { getPortfolioHoldingsDetail } from '@/api/api';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { BarChart } from '@/components/charts/bar';
import { ChartCard } from '@/components/charts/card';
import { LineChart } from '@/components/charts/line';
import PageContainer from '@/components/layout/page-container';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { format } from 'date-fns/esm';
const arr = [
  'fret_1m',
  'fret_2m',
  'fret_3m',
  'fret_4m',
  'fret_5m',
  'fret_6m',
  'fret_7m',
  'fret_8m',
  'fret_9m',
  'fret_10m',
  'fret_11m',
  'fret_12m'
];

export default async function HoldingsPage({
  params: { date }
}: {
  params: { date: string };
}) {
  const data = await getPortfolioHoldingsDetail([date]);

  const lineData = data
    .filter((item) => ['portfolio', 'hsi'].includes(item.ticker))
    .map((item) =>
      arr
        .map((j) => ({
          id: item.name,
          date: j.substring(5),
          value: item[j as keyof typeof item] as number
        }))
        .filter((item) => item.value)
    );
  const barData = lineData.map((item) =>
    item.map((i, index) => ({
      id: i.id,
      date: i.date,
      value:
        index === 0 ? i.value : (i.value + 1) / (item[index - 1].value + 1) - 1
    }))
  );

  const d = format(new Date(date), 'yyyy-MM');
  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-6 pb-16">
        <Breadcrumbs
          items={[
            { title: 'Holdings', link: '/holdings' },
            { title: d, link: `/holdings/${date}` }
          ]}
        />
        <ChartCard title={d}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>股市编号</TableHead>
                <TableHead>行业</TableHead>
                {/* <TableHead>前复权价格</TableHead> */}
                <TableHead>到期收益</TableHead>
                <TableHead>持有1月</TableHead>
                <TableHead>持有2月</TableHead>
                <TableHead>持有3月</TableHead>
                <TableHead>持有4月</TableHead>
                <TableHead>持有5月</TableHead>
                <TableHead>持有6月</TableHead>
                <TableHead>持有7月</TableHead>
                <TableHead>持有8月</TableHead>
                <TableHead>持有9月</TableHead>
                <TableHead>持有10月</TableHead>
                <TableHead>持有11月</TableHead>
                <TableHead>持有12月</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((i, index) => (
                <TableRow key={index}>
                  <TableCell>{i.name}</TableCell>
                  <TableCell>{i.ticker}</TableCell>
                  <TableCell>{i.industry}</TableCell>
                  <TableCell>
                    {i.fret ? (i.fret * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                  <TableCell>
                    {i.fret_1m ? (i.fret_1m * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                  <TableCell>
                    {i.fret_2m ? (i.fret_2m * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                  <TableCell>
                    {i.fret_3m ? (i.fret_3m * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                  <TableCell>
                    {i.fret_4m ? (i.fret_4m * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                  <TableCell>
                    {i.fret_5m ? (i.fret_5m * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                  <TableCell>
                    {i.fret_6m ? (i.fret_6m * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                  <TableCell>
                    {i.fret_7m ? (i.fret_7m * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                  <TableCell>
                    {i.fret_8m ? (i.fret_8m * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                  <TableCell>
                    {i.fret_9m ? (i.fret_9m * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                  <TableCell>
                    {i.fret_10m ? (i.fret_10m * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                  <TableCell>
                    {i.fret_11m ? (i.fret_11m * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                  <TableCell>
                    {i.fret_12m ? (i.fret_12m * 100).toFixed(2) + '%' : '--'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>

        <ChartCard title="走势对比图">
          <LineChart data={lineData.flat()} fmt={null} />
        </ChartCard>
        <ChartCard title="月度对比图">
          <BarChart data={barData.flat()} />
        </ChartCard>
      </div>
    </PageContainer>
  );
}
