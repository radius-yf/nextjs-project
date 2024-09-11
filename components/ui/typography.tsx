import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

export const H1 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      className
    )}
    {...props}
  />
));
H1.displayName = 'H1';

export const H2 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      className
    )}
    {...props}
  />
));
H2.displayName = 'H2';

export const H3 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'scroll-m-20 text-2xl font-semibold tracking-tight',
      className
    )}
    {...props}
  />
));
H3.displayName = 'H3';

export const H4 = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      'scroll-m-20 text-xl font-semibold tracking-tight',
      className
    )}
    {...props}
  />
));
H4.displayName = 'H4';

export const P = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
    {...props}
  />
));
P.displayName = 'P';

export const Blockquote = forwardRef<
  HTMLQuoteElement,
  HTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn('mt-6 border-l-2 pl-6 italic', className)}
    {...props}
  />
));
Blockquote.displayName = 'Blockquote';

export const InlineCode = forwardRef<
  HTMLPreElement,
  HTMLAttributes<HTMLPreElement>
>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      className
    )}
    {...props}
  />
));
InlineCode.displayName = 'InlineCode';

export const Lead = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-lg text-muted-foreground', className)}
    {...props}
  />
));
Lead.displayName = 'Lead';

export const Muted = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
Muted.displayName = 'Muted';
