'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts, getCategories } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Product, Category } from '@/lib/types';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState('all');

  useEffect(() => {
    getProducts().then(products => {
      setAllProducts(products);
      const uniqueBrands = [...new Set(products.map(p => p.brand))];
      setAllBrands(uniqueBrands);
    });
    getCategories().then(setAllCategories);
  }, []);

  const filteredProducts = allProducts.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      (selectedBrand === 'all' || product.brand === selectedBrand)
    );
  });

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
                                {allCategories.map(cat => (
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
                            </Trigger>
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
          {filteredProducts.length > 0 ? (
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
