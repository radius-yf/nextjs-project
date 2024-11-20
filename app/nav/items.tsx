'use client';
import {
  getBacktestGetConfig,
  getBacktestGetMultiProcessStatus,
  getReportOnlineIdlist
} from '@/api/api-v2';
import { useAsyncReducer } from '@/hooks/useAsyncReducer';
import { zip } from '@/lib/utils';
import { format } from 'date-fns/esm';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import { BacktestCard, NavCard } from './card';

const NavItemsContext = createContext<{
  data: { id: string; name: string; backtest: string; status: string }[];
  loading: boolean;
  nextPage: () => void;
  refresh: () => void;
  search: string;
  setSearch: (value: string) => void;
} | null>(null);
export function useNavItems() {
  const context = useContext(NavItemsContext);
  if (!context) {
    throw new Error('useNavItems must be used within a <NavItemsProvider />');
  }
  return context;
}

export const NavItemsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { data, fetchData, loading } = useAsyncReducer(
    getBacktestGetConfig,
    []
  );
  const [items, setItems] = useState(
    [] as { id: string; name: string; backtest: string; status: string }[]
  );
  useEffect(() => {
    if (data && data.length > 0) {
      const fn = async () => {
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
      };
      fn();
      const timer = setInterval(fn, 5000);
      return () => clearInterval(timer);
    }
  }, [data]);

  const [page, flipPage] = useReducer((p: number, action: 'next' | 'first') => {
    switch (action) {
      case 'next':
        return p * 5 + 3 > items.length ? p : p + 1;
      case 'first':
        return 0;
    }
  }, 0);

  const refresh = useCallback(() => {
    fetchData().then(() => {
      flipPage('first');
    });
  }, [fetchData]);

  const nextPage = useCallback(() => {
    flipPage('next');
  }, []);

  const [search, setSearch] = useState('');
  return (
    <NavItemsContext.Provider
      value={{
        data: items.slice(0, page * 5 + 3),
        loading: loading === undefined ? false : loading,
        nextPage,
        refresh,
        search,
        setSearch
      }}
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
  const { data, loading, nextPage } = useNavItems();

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            nextPage();
          }
        },
        { threshold: 1 }
      );
      if (observerRef.current) {
        observer.observe(observerRef.current);
      }
      return () => {
        observer.disconnect();
      };
    }
  }, [loading, nextPage]);
  return (
    <>
      {data.map((item) => (
        <BacktestCard key={item.id} {...item} />
      ))}
      <div ref={observerRef} className="h-4"></div>
    </>
  );
}
