import Image from 'next/image';
import Link from 'next/link';
import { Star, StarHalf } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ProductCardProps = {
  product: Product;
};

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <>
      {Array(fullStars).fill(0).map((_, i) => <Star key={`full-${i}`} className="h-4 w-4 fill-primary text-primary" />)}
      {halfStar && <StarHalf className="h-4 w-4 fill-primary text-primary" />}
      {Array(emptyStars).fill(0).map((_, i) => <Star key={`empty-${i}`} className="h-4 w-4 text-muted" />)}
    </>
  );
};

export default function ProductCard({ product }: ProductCardProps) {
  const productImage = PlaceHolderImages.find(p => p.id === product.images[0])!;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <Link href={`/products/${product.id}`} className="block">
        <CardContent className="p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={productImage.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={productImage.imageHint}
            />
            {product.salePrice && (
              <Badge variant="destructive" className="absolute top-2 left-2">SALE</Badge>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex-col items-start p-4">
        <Link href={`/products/${product.id}`} className="block w-full">
          <h3 className="font-semibold truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <div className="mt-2 flex items-center">
            {product.salePrice ? (
              <>
                <p className="text-lg font-bold text-destructive">${product.salePrice.toFixed(2)}</p>
                <p className="ml-2 text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</p>
              </>
            ) : (
              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
            )}
          </div>
        </Link>
        <div className="mt-2 flex items-center" aria-label={`Rating: ${product.rating} out of 5 stars`}>
          {renderStars(product.rating)}
          <span className="ml-2 text-xs text-muted-foreground">({product.reviews})</span>
        </div>
      </CardFooter>
    </Card>
  );
}
