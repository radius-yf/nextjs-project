import {
  getReportPortfolioHoldingsHistory,
  getReportPortfolioHoldingsHistoryValue
} from '@/api/api-v2';
import { ChartCard } from '@/components/charts/card';
import { SimpleLineChart } from '@/components/charts/line';
import PageContainer from '@/components/layout/page-container';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { groupBy } from '@/lib/data-conversion';
import { format } from 'date-fns/esm';
import Link from 'next/link';
import { stringify } from 'qs';

export default async function Holdings({
  params,
  searchParams: p
}: {
  params: { id: string };
  searchParams: { start: string; end: string };
}) {
  const [holdings, detail] = await Promise.all([
    getReportPortfolioHoldingsHistory(params.id, p.start, p.end),
    getReportPortfolioHoldingsHistoryValue(params.id, undefined, p.start, p.end)
  ]);
  return (
    <PageContainer scrollable={true}>
      <div className="grid grid-cols-1 gap-6 pb-16">
        <ChartCard title="Portfolio Holdings">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-center" colSpan={20}>
                  Top 20 holdings history (left to right)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings?.map((i) => (
                <TableRow key={i.date}>
                  <TableCell>
                    <Link
                      href={[
                        `./holdings/${format(new Date(i.date), 'yyyy-MM-dd')}`,
                        stringify(p)
                      ].join('?')}
                    >
                      {format(new Date(i.date), 'yyyy-MM')}
                    </Link>
                  </TableCell>
                  <TableCell>{i.s0 ?? '--'}</TableCell>
                  <TableCell>{i.s1 ?? '--'}</TableCell>
                  <TableCell>{i.s2 ?? '--'}</TableCell>
                  <TableCell>{i.s3 ?? '--'}</TableCell>
                  <TableCell>{i.s4 ?? '--'}</TableCell>
                  <TableCell>{i.s5 ?? '--'}</TableCell>
                  <TableCell>{i.s6 ?? '--'}</TableCell>
                  <TableCell>{i.s7 ?? '--'}</TableCell>
                  <TableCell>{i.s8 ?? '--'}</TableCell>
                  <TableCell>{i.s9 ?? '--'}</TableCell>
                  <TableCell>{i.s10 ?? '--'}</TableCell>
                  <TableCell>{i.s11 ?? '--'}</TableCell>
                  <TableCell>{i.s12 ?? '--'}</TableCell>
                  <TableCell>{i.s13 ?? '--'}</TableCell>
                  <TableCell>{i.s14 ?? '--'}</TableCell>
                  <TableCell>{i.s15 ?? '--'}</TableCell>
                  <TableCell>{i.s16 ?? '--'}</TableCell>
                  <TableCell>{i.s17 ?? '--'}</TableCell>
                  <TableCell>{i.s18 ?? '--'}</TableCell>
                  <TableCell>{i.s19 ?? '--'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>
        <ChartCard title="Detail">
          <div className="grid grid-cols-4 gap-x-6">
            {groupBy(detail, 'key_date')
              .reverse()
              .map(([date, item]) => (
                <Link
                  key={date}
                  href={[
                    `./holdings/${format(new Date(date), 'yyyy-MM-dd')}`,
                    stringify(p)
                  ].join('?')}
                >
                  <SimpleLineChart
                    title={format(new Date(date), 'yyyy-MM')}
                    data={item}
                  />
                </Link>
              ))}
          </div>
        </ChartCard>
      </div>
    </PageContainer>
  );
}
