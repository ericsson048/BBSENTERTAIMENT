'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { getProductById } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart, Star, StarHalf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    notFound();
  }
  
  const handleAddToCart = () => {
    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name}`,
    });
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => <Star key={`full-${i}`} className="h-5 w-5 fill-primary text-primary" />)}
        {halfStar && <StarHalf className="h-5 w-5 fill-primary text-primary" />}
        {Array(emptyStars).fill(0).map((_, i) => <Star key={`empty-${i}`} className="h-5 w-5 text-muted" />)}
        <span className="ml-2 text-sm text-muted-foreground">({product.reviews} reviews)</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map(imageId => {
                  const image = PlaceHolderImages.find(p => p.id === imageId);
                  return (
                    <CarouselItem key={imageId}>
                      <Card>
                        <CardContent className="relative aspect-square p-0">
                          {image && <Image src={image.imageUrl} alt={product.name} fill className="object-cover rounded-lg" data-ai-hint={image.imageHint} />}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div>
          <h1 className="font-headline text-3xl md:text-4xl">{product.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{product.brand}</p>
          <div className="mt-4">{renderStars(product.rating)}</div>
          <Separator className="my-6" />
          <p className="text-base leading-relaxed">{product.description}</p>
          <div className="mt-6">
            {product.tags.map(tag => <Badge key={tag} variant="secondary" className="mr-2 capitalize">{tag}</Badge>)}
          </div>
          <Separator className="my-6" />

          <div className="flex items-baseline space-x-2">
             {product.salePrice ? (
              <>
                <p className="text-3xl font-bold text-destructive">${product.salePrice.toFixed(2)}</p>
                <p className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</p>
              </>
            ) : (
              <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
            )}
          </div>
          <p className="mt-2 text-sm text-green-500">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
          
          <div className="mt-8 flex items-center space-x-4">
            <div className="flex items-center rounded-md border">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
