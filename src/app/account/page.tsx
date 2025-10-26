'use client';
import { getOrdersByUserId, getProductsByIds, getUsers } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import ProductCard from '@/components/product-card';
import { FileText, Heart, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@/firebase';
import { useEffect, useState } from 'react';
import { Order, Product, User } from '@/lib/types';

export default function AccountPage() {
  const { user: authUser, isUserLoading } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      if (authUser) {
        // In a real app, you'd fetch the user profile from your DB using authUser.uid
        const users = await getUsers();
        const currentUser = users[0]; // Mock: find user by authUser.uid
        setUser(currentUser);

        const userOrders = await getOrdersByUserId(currentUser.id);
        setOrders(userOrders);

        // Mock favorite products
        const favIds = ['prod1', 'prod3', 'prod5']; // Replace with actual user favorite IDs
        const favs = await getProductsByIds(favIds);
        setFavoriteProducts(favs);
      }
    }
    fetchData();
  }, [authUser]);


  if (isUserLoading || !user) {
    return <div>Loading...</div>;
  }

  const userAvatar = PlaceHolderImages.find(p => p.id === user.avatar);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <Avatar className="h-24 w-24">
          {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={user.name} />}
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="font-headline text-3xl md:text-4xl">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">Joined: {user.joined}</p>
          <Button variant="outline" size="sm" className="mt-4">Edit Profile</Button>
        </div>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile"><UserIcon className="w-4 h-4 mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="orders"><FileText className="w-4 h-4 mr-2" />Order History</TabsTrigger>
          <TabsTrigger value="favorites"><Heart className="w-4 h-4 mr-2" />Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your account details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Name:</span>
                        <span>{user.name}</span>
                    </div>
                    <Separator/>
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Email:</span>
                        <span>{user.email}</span>
                    </div>
                     <Separator/>
                     <div className="flex justify-between items-center">
                        <span className="font-medium">Password:</span>
                        <Button variant="outline" size="sm">Change Password</Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>A list of your past and current orders.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orders.length > 0 ? orders.map(order => {
                return (
                  <Card key={order.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <CardDescription>Date: {order.date}</CardDescription>
                      </div>
                       <div className="text-right">
                         <p className="font-bold">${order.total.toFixed(2)}</p>
                         <span className={`px-2 py-1 text-xs rounded-full ${
                             order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                             order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                             order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                             'bg-red-500/20 text-red-400'
                         }`}>{order.status}</span>
                       </div>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground">{order.itemCount} item(s)</p>
                        <Button variant="outline" size="sm" className="mt-4">View Details</Button>
                    </CardContent>
                  </Card>
                )
              }) : (
                <p className="text-muted-foreground text-center py-8">You have no orders yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Favorites</CardTitle>
                    <CardDescription>Products you've saved for later.</CardDescription>
                </CardHeader>
                <CardContent>
                    {favoriteProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favoriteProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                         <p className="text-muted-foreground text-center py-8">You have no favorite products yet.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
