'use client';
import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useMemo,
  useState
} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ChartCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  options?: (string | { name: string; value: string })[];
  initialValue?: string;
  children?: ReactNode;
  onTabChange?: (value: string) => void;
}

export const ChartCard = forwardRef<HTMLDivElement, ChartCardProps>(
  ({ title, options, initialValue, children, onTabChange, ...props }, ref) => {
    const option = useMemo(() => {
      if (!options) return [];
      return options.map((i) =>
        typeof i === 'string' ? { name: i, value: i } : i
      );
    }, [options]);
    const [active, setActive] = useState(initialValue ?? option?.[0]?.value);
    return (
      <Card ref={ref} {...props}>
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {option && option.length ? (
            <div className="mx-6 flex">
              {option.map((i) => (
                <button
                  key={i.value}
                  data-active={i.value === active}
                  className="px-4 py-2 text-left data-[active=true]:bg-muted"
                  onClick={() => {
                    setActive(i.value);
                    onTabChange?.(i.value);
                  }}
                >
                  {i.name}
                </button>
              ))}
            </div>
          ) : null}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    );
  }
);

ChartCard.displayName = 'ChartCard';
