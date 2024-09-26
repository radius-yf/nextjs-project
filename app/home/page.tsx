import { getPortfolioHoldings, getPortfolioSummary } from '@/api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { ReturnCard } from './return-card';
import { TrendCard } from './trend-card';
import { ChartCard } from '@/components/charts/card';

export default async function Home() {
  const [holdings, summary] = await Promise.all([
    getPortfolioHoldings(),
    getPortfolioSummary()
  ]);

  return (
    <ScrollArea className="h-[calc(100dvh-60px)]">
      <div className="grid grid-cols-1 gap-6 p-4 pb-16 md:px-8">
        <div>
          <H1>港股价值趋势策略</H1>

          <P className="mb-8 w-1/2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            maiores similique non quae itaque eius beatae perferendis laudantium
            voluptas quibusdam repellat perspiciatis, vitae temporibus ad nulla
            sunt veniam, error nobis.
          </P>
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <TrendCard />

          <ReturnCard />

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
          {/* <Card>
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>目前持仓</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="text-center">
                <TableHeader>
                  <TableRow className="hover:bg-inherit">
                    <TableHead className="text-center">Period</TableHead>
                    <TableHead className="text-center" colSpan={20}>
                      Top 20 holdings history (left to right)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdings?.map((i) => (
                    <TableRow key={i.date}>
                      <TableCell>
                        {format(new Date(i.date), 'yyyy-MM')}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
