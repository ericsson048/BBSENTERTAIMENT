'use client';

import Image from 'next/image';
import { getProducts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, File, ListFilter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { generateProductDescription } from '@/ai/flows/admin-ai-generated-product-descriptions';
import { useToast } from '@/hooks/use-toast';

function AddProductDialog() {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [features, setFeatures] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
    
    return (
         <Dialog>
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
                  <Button type="submit">Save Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    )
}


export default function AdminProductsPage() {
  const products = getProducts();

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
            {products.map(product => {
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
                        <DropdownMenuItem>Delete</DropdownMenuItem>
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
