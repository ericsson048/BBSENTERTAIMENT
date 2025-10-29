'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Film, Headphones, Gamepad, Clapperboard, Music, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState, useMemo } from 'react';
import { Product } from '@/lib/types';
import ProductCardSkeleton from '@/components/product-card-skeleton';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';


function FeaturedProducts() {
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'products'), where('featured', '==', true), limit(4)) : null,
    [firestore]
  );
  const { data: featuredProducts, isLoading } = useCollection<Product>(productsQuery);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return <p className="text-muted-foreground">No featured products available at the moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {featuredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}


function TopRatedProducts() {
  const firestore = useFirestore();

  const topProductsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "products"), orderBy("rating", "desc"), limit(4));
  }, [firestore]);

  const { data: topProducts, isLoading, error } = useCollection<Product>(topProductsQuery);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }
  
  if (error) {
    return <p className="text-muted-foreground">Could not load top products at this time.</p>;
  }

  if (!topProducts || topProducts.length === 0) {
    return <p className="text-muted-foreground">No products found. Explore our products!</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {topProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

const categories = [
  { name: 'Cameras', icon: Film, href: '/products?category=cameras' },
  { name: 'Audio', icon: Headphones, href: '/products?category=audio' },
  { name: 'Gaming', icon: Gamepad, href: '/products?category=gaming' },
  { name: 'Accessories', icon: Clapperboard, href: '/products?category=accessories' },
  { name: 'Instruments', icon: Music, href: '/products?category=instruments' },
  { name: 'Broadcasting', icon: Radio, href: '/products?category=broadcasting' },
];

export default function Home() {
    const heroImage = PlaceHolderImages.find(p => p.id === "hero-home")!;

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] w-full text-white">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl">
            Entertainment Redefined
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Discover the finest in audiovisual, multimedia, and entertainment gear.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/products">
              Shop Now <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center font-headline text-3xl md:text-4xl">Shop by Category</h2>
          <p className="mb-10 text-center text-muted-foreground">Explore our curated collections.</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link href={category.href} key={category.name}>
                <Card className="group transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <category.icon className="h-10 w-10 text-primary" />
                    <span className="mt-4 font-semibold">{category.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      <section className="py-12 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center font-headline text-3xl md:text-4xl">Featured Products</h2>
           <p className="mb-10 text-center text-muted-foreground">Handpicked for you.</p>
          <FeaturedProducts />
        </div>
      </section>
      
      <Separator />

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center font-headline text-3xl md:text-4xl">Top Rated Products</h2>
          <p className="mb-10 text-center text-muted-foreground">Discover what our customers love the most.</p>
          <TopRatedProducts />
        </div>
      </section>
    </div>
  );
}

    