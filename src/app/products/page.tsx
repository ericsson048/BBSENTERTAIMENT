'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Product, Category } from '@/lib/types';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import ProductCardSkeleton from '@/components/product-card-skeleton';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const firestore = useFirestore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState('all');

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'));
  }, [firestore]);
  const { data: allProducts, isLoading: productsLoading } = useCollection<Product>(productsQuery);

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'categories'));
  }, [firestore]);
  const { data: allCategories, isLoading: categoriesLoading } = useCollection<Category>(categoriesQuery);

  const allBrands = useMemo(() => {
    if (!allProducts) return [];
    const brands = allProducts.map(p => p.brand).filter((b): b is string => !!b);
    return [...new Set(brands)];
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter(product => {
      const categoryMatch = selectedCategory === 'all' || product.categoryId === selectedCategory;
      const brandMatch = selectedBrand === 'all' || product.brand === selectedBrand;
      const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && brandMatch && searchMatch;
    });
  }, [allProducts, searchTerm, selectedCategory, selectedBrand]);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl">Our Products</h1>
        <p className="mt-2 text-muted-foreground">Explore our collection of entertainment gear.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="col-span-1">
            <h2 className="mb-4 text-lg font-semibold">Filters</h2>
            <Accordion type="multiple" defaultValue={['category', 'brand']} className="w-full">
                 <AccordionItem value="search">
                    <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full mb-4"
                    />
                 </AccordionItem>
                <AccordionItem value="category">
                    <AccordionTrigger>Category</AccordionTrigger>
                    <AccordionContent>
                         <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {allCategories?.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="brand">
                    <AccordionTrigger>Brand</AccordionTrigger>
                    <AccordionContent>
                        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Brands</SelectItem>
                                {allBrands.map(brand => (
                                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
        
        <main className="col-span-1 md:col-span-3">
          {(productsLoading || categoriesLoading) ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-12 text-center">
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
