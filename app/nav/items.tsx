'use client';
import {
  getBacktestGetConfig,
  getBacktestGetMultiProcessStatus,
  getReportOnlineIdlist
} from '@/api/api-v2';
import { useAsyncReducer } from '@/hooks/useAsyncReducer';
import { zip } from '@/lib/utils';
import { format } from 'date-fns/esm';
import { createContext, useContext, useEffect, useState } from 'react';
import { BacktestCard, NavCard } from './card';

const NavItemsContext = createContext<{
  data: {
    bt_id: string;
    data: string;
    update_time: string;
    alias: string;
  }[];
  refresh: () => void;
  search: string;
  setSearch: (value: string) => void;
}>({
  data: [],
  refresh: () => {},
  search: '',
  setSearch: () => {}
});
export function useNavItems() {
  return useContext(NavItemsContext);
}

export const NavItemsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { data, fetchData: refresh } = useAsyncReducer(
    getBacktestGetConfig,
    []
  );
  const [search, setSearch] = useState('');
  return (
    <NavItemsContext.Provider
      value={{ data: data ?? [], refresh, search, setSearch }}
    >
      {children}
    </NavItemsContext.Provider>
  );
};

export function CardItems() {
  const { data } = useAsyncReducer(getReportOnlineIdlist, []);
  const { search } = useNavItems();
  return (
    <>
      {data?.map((item) => (
        <NavCard
          className={!search || item.name.includes(search) ? '' : 'hidden'}
          key={item.id}
          {...item}
        />
      )) ?? <div>Loading...</div>}
    </>
  );
}

export function BacktestItems() {
  const { data } = useNavItems();
  const [items, setItems] = useState(
    [] as { id: string; name: string; backtest: string; status: string }[]
  );
  useEffect(() => {
    if (data && data.length > 0) {
      const timer = setInterval(async () => {
        const allStatus = await getBacktestGetMultiProcessStatus(
          data.map((item) => item.bt_id)
        );
        setItems(
          zip(data, allStatus).map(([item, status]) => ({
            id: item.bt_id,
            name:
              item.alias ??
              `backtest_${format(
                new Date(item.update_time),
                'yyyy-MM-dd HH:mm:ss'
              )}`,
            backtest: item.data,
            status
          }))
        );
        if (allStatus.every((s) => s !== 'processing')) {
          clearInterval(timer);
        }
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [data]);
  return (
    <>
      {items.map((item) => (
        <BacktestCard key={item.id} {...item} />
      ))}
    </>
  );
}
