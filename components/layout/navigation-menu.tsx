'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '../icons';
import ThemeToggle from './ThemeToggle/theme-toggle';
import { UserNav } from './user-nav';

const menus = [
  {
    path: '/home',
    name: '策略首页'
  },
  {
    path: '/yield-analysis',
    name: '收益率可视化分析'
  },
  {
    path: '/holdings',
    name: 'Holdings持仓明细'
  },
  {
    path: '/simulator',
    name: '实盘模拟策略'
  }
];

const hideHeader = ['/login'];

export function Navigation() {
  const path = usePathname();
  const activeMenu = menus.find((menu) => path.startsWith(menu.path));
  if (hideHeader.includes(path)) {
    return null;
  }
  return (
    <header className="flex items-center gap-3 p-3">
      <Link href="/" className="flex items-center gap-1 text-blue-600">
        <Icons.logo className={`size-6 flex-none`} />
        <div> 量数科技 </div>
      </Link>
      <ul className="flex flex-1 gap-4 px-4 text-primary-foreground/50">
        {menus.map((menu) => (
          <li
            key={menu.path}
            className={
              activeMenu?.path === menu.path ? 'text-primary-foreground' : ''
            }
          >
            <Link href={menu.path}>{menu.name}</Link>
          </li>
        ))}
      </ul>
      <UserNav />
      <ThemeToggle />
    </header>
  );
}
