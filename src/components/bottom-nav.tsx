'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/products', icon: Store, label: 'Products' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart' },
  { href: '/account', icon: User, label: 'Account' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container mx-auto flex h-16 max-w-md items-center justify-around">
        {navItems.map((item) => {
          const isActive = (pathname === '/' && item.href === '/') || (pathname.startsWith(item.href) && item.href !== '/');
          return (
            <Link href={item.href} key={item.href} className="flex flex-col items-center justify-center text-muted-foreground">
              <item.icon className={cn("h-6 w-6", isActive && "text-primary")} />
              <span className={cn("mt-1 text-xs", isActive && "text-primary font-semibold")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
