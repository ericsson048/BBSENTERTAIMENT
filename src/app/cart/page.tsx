'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const initialCartItems: CartItem[] = [
  { product: getProductById('prod1')!, quantity: 1 },
  { product: getProductById('prod3')!, quantity: 2 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const { toast } = useToast();

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCartItems(cartItems.map(item =>
      item.product.id === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ).filter(item => item.quantity > 0));
  };
  
  const removeItem = (productId: string) => {
    const productName = cartItems.find(item => item.product.id === productId)?.product.name;
    setCartItems(cartItems.filter(item => item.product.id !== productId));
    toast({
        title: "Item removed",
        description: `${productName} has been removed from your cart.`,
        variant: 'destructive'
    })
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.salePrice ?? item.product.price) * item.quantity, 0);
  const shipping = 15.00;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl md:text-5xl text-center mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center rounded-lg border-2 border-dashed border-muted p-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild className="mt-6">
                <Link href="/products">Start Shopping</Link>
            </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
                const image = PlaceHolderImages.find(p => p.id === item.product.images[0]);
                return (
                    <Card key={item.product.id} className="flex items-center p-4">
                        <div className="relative h-24 w-24 rounded-md overflow-hidden">
                            {image && <Image src={image.imageUrl} alt={item.product.name} fill className="object-cover" data-ai-hint={image.imageHint} />}
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="font-semibold">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                            <p className="text-lg font-bold mt-1">${(item.product.salePrice ?? item.product.price).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                           <div className="flex items-center rounded-md border">
                                <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(item.product.id)}>
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </Card>
                )
            })}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Input placeholder="Discount code" />
                    <Button variant="outline">Apply</Button>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full">Proceed to Checkout</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
