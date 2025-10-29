'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Home, Package, ShoppingCart, Users, User, Power, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Logo from '@/components/logo';
import { useUser } from '@/firebase';
import { useEffect, createContext, useContext, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { User as AppUser } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Customers', icon: Users },
];


interface AdminAuthContextType {
  isAuthorized: boolean;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminLayout');
  }
  return context;
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user: authUser } = useUser();
    const { data: userProfile } = useAdminAuthData();

    const NavContent = () => (
     <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname === item.href && "bg-muted text-primary"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    );

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Logo />
                </div>
                <div className="flex-1">
                <NavContent />
                </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Clapperboard className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col">
                    <div className="mt-4">
                        <NavContent />
                    </div>
                    </SheetContent>
                </Sheet>
                <div className="w-full flex-1">
                    {/* Can add breadcrumbs or search here */}
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Toggle notifications</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={authUser?.photoURL || "https://picsum.photos/seed/admin/100/100"} />
                        <AvatarFallback>{userProfile?.firstName?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/"><Power className="mr-2 h-4 w-4" /> Log out</Link>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

function useAdminAuthData() {
    const { user: authUser, isUserLoading } = useUser();
    const firestore = useFirestore();
    
    const userDocRef = useMemoFirebase(() => authUser ? doc(firestore, 'users', authUser.uid) : null, [firestore, authUser]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<AppUser>(userDocRef);

    return { authUser, isUserLoading, userProfile, isProfileLoading };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { authUser, isUserLoading, userProfile, isProfileLoading } = useAdminAuthData();

  const isLoading = isUserLoading || isProfileLoading;
  const isAuthorized = !isLoading && !!authUser && !!userProfile?.isAdmin;

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.push('/');
    }
  }, [isLoading, isAuthorized, router]);

  const authContextValue = useMemo(() => ({
    isAuthorized,
    isLoading
  }), [isAuthorized, isLoading]);

  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    );
  }
  
  return (
    <AdminAuthContext.Provider value={authContextValue}>
      {isAuthorized ? <AdminLayoutContent>{children}</AdminLayoutContent> : (
        <div className="flex h-screen w-full items-center justify-center">
            <div>Redirecting...</div>
        </div>
      )}
    </AdminAuthContext.Provider>
  );
}
