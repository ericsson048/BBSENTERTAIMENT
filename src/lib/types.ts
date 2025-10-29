export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: string;
  brand?: string;
  stock: number;
  images: string[];
  rating: number;
  reviews: number;
  tags: string[];
  featured?: boolean;
};

export type Category = {
  id: string;
  name: string;
  image: string;
  productCount: number;
};

export type Order = {
  id: string;
  userId: string;
  customerName: string;
  customerAvatar: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  itemCount: number;
};

export type User = {
    id: string;
    name: string;
    email: string;
    joined: string;
    avatar: string;
    orderCount: number;
    isAdmin?: boolean;
    favoriteProductIds?: string[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

    