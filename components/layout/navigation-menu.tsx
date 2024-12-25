'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import ThemeToggle from './ThemeToggle/theme-toggle';
import { UserNav } from './user-nav';
import { useMemo } from 'react';

interface Menu {
  path: string;
  name: string;
  show?: (id: string) => boolean;
}

const allMenu: Menu[] = [
  {
    path: 'home',
    name: '策略首页'
  },
  {
    path: 'analysis',
    name: '收益率可视化分析'
  },
  {
    path: 'holdings',
    name: 'Holdings持仓明细'
  },
  {
    path: 'next',
    name: '下期股票清单',
    show: (id: string) => !id.startsWith('bt_')
  }
];

const hideHeader = ['/login'];

export function Navigation() {
  const path = usePathname();
  const query = useSearchParams();
  const [_, parent, id, page] = path.split('/');
  const menus = useMemo(
    () => allMenu.filter((m) => !id || (m.show?.(id) ?? true)),
    [id]
  );
  if (hideHeader.includes(path)) {
    return null;
  }
  return (
    <header className="flex items-center gap-3 p-3 shadow">
      <ul className="flex flex-1 gap-4 px-4">
        <li
          data-active={parent === 'nav'}
          className="text-primary-foreground/50 data-[active=true]:text-primary-foreground"
        >
          <Link href="/nav">导航</Link>
        </li>
        {parent === 'overview' ? (
          <>
            {menus.map((menu) => (
              <li
                key={menu.path}
                data-active={menu.path === page}
                className="text-primary-foreground/50 data-[active=true]:text-primary-foreground"
              >
                <Link
                  href={
                    [_, parent, id, menu.path].join('/') +
                    '?' +
                    query.toString()
                  }
                >
                  {menu.name}
                </Link>
              </li>
            ))}
          </>
        ) : undefined}
      </ul>
      <UserNav />
      <ThemeToggle />
    </header>
  );
}
