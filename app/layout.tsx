import '@/app/globals.css';
import { auth } from '@/auth';
import { Navigation } from '@/components/layout/navigation-menu';
import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '量数科技',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>
          <Toaster />
          <div className="flex min-h-screen flex-col">
            <Navigation />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
