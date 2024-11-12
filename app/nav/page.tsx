import { getBacktestFilter } from '@/api/api-v2';
import { BacktestProvider } from '@/components/forms/backtest';
import PageContainer from '@/components/layout/page-container';
import { Header } from './header';
import { BacktestItems, CardItems, NavItemsProvider } from './items';

export default async function Page() {
  const baseData = await getBacktestFilter();
  const formBaseData = baseData && JSON.parse(baseData);

  return (
    <BacktestProvider value={formBaseData}>
      <NavItemsProvider>
        <PageContainer className="grid grid-cols-1 gap-6">
          <Header />
          <CardItems />
          <BacktestItems />
        </PageContainer>
      </NavItemsProvider>
    </BacktestProvider>
  );
}
