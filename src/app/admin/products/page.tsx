'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, File, ListFilter, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { generateProductDescription } from '@/ai/flows/admin-ai-generated-product-descriptions';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import ProductCardSkeleton from '@/components/product-card-skeleton';

function AddProductDialog() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const [name, setName] = useState('');
    const [features, setFeatures] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleGenerateDescription = async () => {
        if (!name || !features) {
            toast({
                title: 'Missing Information',
                description: 'Please provide a product name and key features.',
                variant: 'destructive',
            });
            return;
        }
        setIsLoading(true);
        try {
            const result = await generateProductDescription({ productName: name, keyFeatures: features });
            setDescription(result.productDescription);
        } catch (error) {
            toast({
                title: 'Generation Failed',
                description: 'Could not generate a description at this time.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveProduct = () => {
        if (!name || !description || !firestore) return;
        const productsCol = collection(firestore, 'products');
        // This is a simplified product object. A real app would have more fields.
        const newProduct: Omit<Product, 'id'> = {
            name,
            description,
            price: 0,
            stock: 0,
            images: [],
            rating: 0,
            reviews: 0,
            tags: features.split(',').map(f => f.trim()),
            brand: 'BBS',
            categoryId: 'default'
        }
        addDocumentNonBlocking(productsCol, newProduct);
        toast({
            title: "Product Added",
            description: `${name} has been added to the store.`
        });
        setIsOpen(false);
        // Reset form
        setName('');
        setFeatures('');
        setDescription('');
    }
    
    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new product. You can use the AI generator for the description.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="features" className="text-right">
                      Features
                    </Label>
                    <Input id="features" placeholder="Feature 1, Feature 2, ..." value={features} onChange={(e) => setFeatures(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                     <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 min-h-[100px]" />
                  </div>
                  <div className="col-start-2 col-span-3">
                    <Button variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isLoading}>
                      {isLoading ? 'Generating...' : 'Generate with AI'}
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveProduct}>Save Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    )
}

function DeleteProductAlert({ productId, productName }: { productId: string, productName: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleDelete = () => {
        if (!firestore) return;
        const productRef = doc(firestore, 'products', productId);
        deleteDocumentNonBlocking(productRef);
        toast({
            title: "Product Deleted",
            description: `${productName} has been removed.`,
            variant: "destructive"
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    <Trash2 />
                    <span>Delete</span>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product
                        "{productName}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}


export default function AdminProductsPage() {
    const firestore = useFirestore();
    const productsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
    const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your products and view their sales performance.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <AddProductDialog />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Stock</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="hidden sm:table-cell"><ProductCardSkeleton /></TableCell>
                        <TableCell><ProductCardSkeleton /></TableCell>
                        <TableCell><ProductCardSkeleton /></TableCell>
                        <TableCell><ProductCardSkeleton /></TableCell>
                        <TableCell className="hidden md:table-cell"><ProductCardSkeleton /></TableCell>
                        <TableCell><ProductCardSkeleton /></TableCell>
                    </TableRow>
                ))
            ) : products?.map(product => {
              const image = PlaceHolderImages.find(p => p.id === product.images[0]);
              return (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    {image && <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={image.imageUrl}
                      width="64"
                       data-ai-hint={image.imageHint}
                    />}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className={product.stock > 0 ? 'bg-green-500/20 text-green-700 dark:text-green-400' : ''}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>${(product.salePrice ?? product.price).toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DeleteProductAlert productId={product.id} productName={product.name} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
