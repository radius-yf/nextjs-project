import PageContainer from '@/components/layout/page-container';
import { NextPage } from './comp';

export default async function Page({
  params: { id }
}: {
  params: { id: string };
}) {
  return (
    <PageContainer>
      <NextPage id={id} />
    </PageContainer>
  );
}
