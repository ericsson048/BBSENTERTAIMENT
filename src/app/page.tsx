'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Film, Headphones, Gamepad, Clapperboard, Music, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/product-card';
import { getFeaturedProducts, getProductsByIds } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { personalizedProductRecommendations } from '@/ai/flows/personalized-product-recommendations';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import ProductCardSkeleton from '@/components/product-card-skeleton';

function PersonalizedRecommendations() {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      // Mock user data for personalized recommendations
      const recommendationsInput = {
        userId: 'user123',
        browsingHistory: ['prod1', 'prod3'],
        purchaseHistory: ['prod5'],
        preferences: 'Interested in high-quality audio and vintage cameras.'
      };

      try {
        const recommendations = await personalizedProductRecommendations(recommendationsInput);
        if (recommendations && recommendations.productRecommendations) {
            const products = await getProductsByIds(recommendations.productRecommendations);
            setRecommendedProducts(products);
        } else {
            setRecommendedProducts([]);
        }
      } catch (err) {
        console.error('Error fetching personalized recommendations:', err);
        setError('Could not load recommendations at this time.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, []); // Empty dependency array ensures this runs only once on the client

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }
  
  if (error) {
    return <p className="text-muted-foreground">{error}</p>;
  }

  if (!recommendedProducts || recommendedProducts.length === 0) {
    return <p className="text-muted-foreground">No recommendations for you right now. Explore our products!</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {recommendedProducts.map((product) => (
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
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const heroImage = PlaceHolderImages.find(p => p.id === "hero-home")!;

    useEffect(() => {
        getFeaturedProducts().then(products => {
            setFeaturedProducts(products);
            setIsLoading(false);
        });
    }, []);


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
          <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
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

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center font-headline text-3xl md:text-4xl">Featured Products</h2>
           <p className="mb-10 text-center text-muted-foreground">Handpicked for you.</p>
          {isLoading ? (
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center font-headline text-3xl md:text-4xl">For You</h2>
          <p className="mb-10 text-center text-muted-foreground">Personalized recommendations based on your activity.</p>
          <PersonalizedRecommendations />
        </div>
      </section>
    </div>
  );
}
