import { getPortfolioHoldings } from '@/api/api';
import { ChartCard } from '@/components/charts/card';
import PageContainer from '@/components/layout/page-container';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { H1, P } from '@/components/ui/typography';
import { format } from 'date-fns/esm';
import Link from 'next/link';

export default async function Holdings() {
  const holdings = await getPortfolioHoldings();
  return (
    <PageContainer scrollable={true}>
      <div className="grid grid-cols-1 gap-6 pb-16">
        <div>
          <H1>Portfolio Holdings</H1>
          <P className="mb-8 w-1/2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto ut
            unde repudiandae, libero nemo incidunt atque adipisci assumenda
            cumque, voluptatum possimus eos dignissimos natus vitae expedita
            beatae explicabo iure porro.
          </P>
        </div>
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
                    <Link href={`/holdings/${i.date}`}>
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
      </div>
    </PageContainer>
  );
}
