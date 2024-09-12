import { getPortfolioHoldings } from '@/api/api';
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
// import { useRef } from 'react';

const data = [
  {
    title: 'Multiples',
    items: [
      { name: 'TEV/LTM Unlevered FCF', value: 1, unit: '', icon: '$' },
      { name: 'Market Cap/LTM Levered FCF', value: 1, unit: '', icon: '$' },
      { name: 'P/LTM Normalized EPS', value: 1, unit: '', icon: '$' },
      { name: 'P/LTM EPS', value: 1, unit: '', icon: '$' },
      { name: 'P/BV', value: 1, unit: '', icon: '$' },
      { name: 'P/Tangible BV', value: 1, unit: '', icon: '$' },
      { name: 'TEV/LTM Total Revenue', value: 1, unit: '', icon: '$' },
      { name: 'Market Cap/LTM Total Revenue', value: 1, unit: '', icon: '$' },
      { name: 'TEV/LTM EBITDA', value: 1, unit: '', icon: '$' },
      { name: 'TEV/LTM EBIT', value: 1, unit: '', icon: '$' }
    ]
  },
  {
    title: 'Financial Health',
    items: [
      {
        name: 'Cash & Short Term Investments / Total Debt',
        value: 1,
        unit: '',
        icon: ''
      },
      { name: 'Total Current Assets/Total Debt', value: 1, unit: '', icon: '' },
      { name: 'Total Debt/EBITDA', value: 1, unit: '', icon: '' }
    ]
  },
  {
    title: 'Growth Over Prior Year',
    items: [
      { name: 'Total Revenue', value: 1, unit: '%', icon: '' },
      { name: 'Gross Profit', value: 1, unit: '%', icon: '' },
      { name: 'EBITDA', value: 1, unit: '%', icon: '' },
      { name: 'Earnings from Cont. Ops.', value: 1, unit: '%', icon: '' },
      { name: 'Net Income', value: 1, unit: '%', icon: '' },
      { name: 'Unlevered Free Cash Flow', value: 1, unit: '%', icon: '' },
      { name: 'Dividend per Share', value: 1, unit: '%', icon: '' }
    ]
  },
  {
    title: 'Returns',
    items: [
      { name: '1月涨幅', value: 1, unit: '%', icon: '' },
      { name: '3月涨幅', value: 1, unit: '%', icon: '' },
      { name: '6月涨幅', value: 1, unit: '%', icon: '' },
      { name: 'ROE', value: 1, unit: '%', icon: '' },
      { name: 'ROA', value: 1, unit: '%', icon: '' },
      { name: 'ROC', value: 1, unit: '%', icon: '' }
    ]
  },
  {
    title: 'Margin Analysis',
    items: [
      { name: 'Gross Margin', value: 1, unit: '%', icon: '' },
      { name: 'SG&A Margin', value: 1, unit: '%', icon: '' },
      { name: 'EBITDA Margin', value: 1, unit: '%', icon: '' },
      { name: 'EBIT Margin', value: 1, unit: '%', icon: '' },
      { name: 'Earnings from Cont. Ops Margin', value: 1, unit: '%', icon: '' },
      { name: 'Net Income Margin', value: 1, unit: '%', icon: '' },
      { name: 'Levered Free Cash Flow Margin', value: 1, unit: '%', icon: '' },
      { name: 'Unlevered Free Cash Flow Margin', value: 1, unit: '%', icon: '' }
    ]
  },
  {
    title: 'Dividends',
    items: [
      { name: '分红/市值', value: 1, unit: '', icon: '' },
      { name: '回购收益率/市值', value: 1, unit: '', icon: '' },
      { name: '（分红+回购）/TEV', value: 1, unit: '', icon: '' },
      { name: '自由现金流收益率/市值', value: 1, unit: '', icon: '' },
      { name: '自由现金流收益率/TEV', value: 1, unit: '', icon: '' }
    ]
  }
];
// const menus = [
//   '策略与恒指走势对比图',
//   '策略与恒指月度回报图',
//   '总策略加权指标',
//   '目前持仓'
// ];

export default async function Home() {
  // const { data: holdings } = useAsync(getPortfolioHoldings, []);
  const holdings = await getPortfolioHoldings();

  // const ref1 = useRef<HTMLDivElement>(null);
  // const ref2 = useRef<HTMLDivElement>(null);
  // const ref3 = useRef<HTMLDivElement>(null);
  // const ref4 = useRef<HTMLDivElement>(null);

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
        {/* <div className="relative">
          <Card className="sticky top-2">
            <CardContent>
              <ul className="text-nowrap">
                {[ref1, ref2, ref3, ref4].map((ref, index) => (
                  <li
                    key={index}
                    className="cursor-pointer rounded-lg px-2 py-1 hover:bg-muted"
                    onClick={() => {
                      ref.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {menus[index]}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div> */}
        <div className="flex flex-1 flex-col gap-6">
          <TrendCard />

          <ReturnCard />

          <Card>
            <CardHeader>
              <CardTitle>总策略加权指标</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="columns-3">
                {data.map((i) => (
                  <div key={i.title} className="break-inside-avoid pb-4 pr-6">
                    <h4 className="font-medium">{i.title}</h4>
                    <ul>
                      {i.items.map((j) => (
                        <li
                          key={j.name}
                          className="border-muted-foreground/20 flex justify-between border-b font-light"
                        >
                          <span className="overflow-hidden text-ellipsis text-nowrap">
                            {j.name}
                          </span>
                          <span>
                            {j.icon}
                            {j.value}
                            {j.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                      {new Array(20).fill(0).map((_, j) => (
                        <TableCell key={j}>{i['s' + j] ?? '--'}</TableCell>
                      ))}
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
