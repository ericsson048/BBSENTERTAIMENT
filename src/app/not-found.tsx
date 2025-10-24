import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clapperboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <Clapperboard className="h-16 w-16 text-primary" />
      <h1 className="mt-8 font-headline text-5xl md:text-7xl">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Oops! The page you're looking for doesn't seem to exist.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
