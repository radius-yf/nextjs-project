import { getReportPortfolioNextHoldings } from '@/api/api-v2';

export default async function Page({
  params: { id }
}: {
  params: { id: string };
}) {
  const data = await getReportPortfolioNextHoldings(id);
  return <div>{JSON.stringify(data)}</div>;
}
