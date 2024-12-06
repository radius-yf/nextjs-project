import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function PageContainer({
  children,
  className = '',
  scrollable = false
}: {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-60px)]">
          <div className={cn('h-full p-4 md:px-8', className)}>{children}</div>
        </ScrollArea>
      ) : (
        <div className={cn('flex flex-1 flex-col p-4 md:px-8', className)}>
          {children}
        </div>
      )}
    </>
  );
}
