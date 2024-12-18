'use client';
import { useAsyncReducer } from '@/hooks/useAsyncReducer';
import { ComponentPropsWithoutRef, useMemo, useState } from 'react';
import { BarChart } from './charts/bar';
import { BaseLineChart, LineChart, RangeLineChart } from './charts/line';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type Mapper = {
  LineChart: ComponentPropsWithoutRef<typeof LineChart>;
  BaseLineChart: ComponentPropsWithoutRef<typeof BaseLineChart>;
  RangeLineChart: ComponentPropsWithoutRef<typeof RangeLineChart>;
  BarChart: ComponentPropsWithoutRef<typeof BarChart>;
};
const mapper = {
  LineChart,
  BaseLineChart,
  RangeLineChart,
  BarChart
};

interface TabCardProps<C extends keyof Mapper> {
  title?: string;
  options?: (string | { name: string; value: string })[];
  tabIndex?: number;
  initialData?: Mapper[C];
  render: C;
  getData: (val: string) => Promise<Mapper[C]>;
}

function getComponent<C extends keyof Mapper>(render: C, props?: Mapper[C]) {
  const Component: any = mapper[render];
  return <Component {...props} />;
}

export function TabCard<C extends keyof Mapper>({
  title,
  options,
  getData,
  tabIndex,
  initialData,
  render
}: TabCardProps<C>) {
  const option = useMemo(() => {
    if (!options) return [];
    return options.map((i) =>
      typeof i === 'string' ? { name: i, value: i } : i
    );
  }, [options]);
  const { data, fetchData, loading } = useAsyncReducer(
    getData,
    [option?.[tabIndex ?? 0]?.value],
    initialData
  );
  const [index, setIndex] = useState(tabIndex ?? 0);
  const Comp = useMemo(() => {
    return getComponent(render, { ...initialData, ...data, loading } as any);
  }, [data, initialData, loading, render]);
  return (
    <Card>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {option && option.length ? (
          <div className="mx-6 flex">
            {option.map((item, i) => (
              <button
                key={item.value}
                data-active={i === index}
                className="px-4 py-2 text-left data-[active=true]:bg-muted"
                onClick={() => {
                  setIndex(i);
                  fetchData(item.value);
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        ) : null}
      </CardHeader>
      <CardContent>{Comp}</CardContent>
    </Card>
  );
}
