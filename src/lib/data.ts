import type { Product, Category, User, Order } from './types';

const products: Product[] = [
  {
    id: 'prod1',
    name: 'RetroShot Pro Camera',
    description: 'Capture timeless moments with this vintage-inspired digital camera. Combines classic aesthetics with modern technology for stunning photos.',
    price: 799.99,
    category: 'cameras',
    brand: 'RetroLens',
    stock: 15,
    images: ['prod1-1', 'prod1-2'],
    rating: 4.8,
    reviews: 124,
    tags: ['camera', 'vintage', 'photography'],
    featured: true,
  },
  {
    id: 'prod2',
    name: 'Aura-X Noise-Cancelling Headphones',
    description: 'Immerse yourself in pure sound. The Aura-X headphones feature industry-leading noise cancellation and high-fidelity audio.',
    price: 349.00,
    salePrice: 299.00,
    category: 'audio',
    brand: 'SonicSphere',
    stock: 30,
    images: ['prod2-1', 'prod2-2'],
    rating: 4.9,
    reviews: 540,
    tags: ['audio', 'headphones', 'noise-cancelling'],
    featured: true,
  },
  {
    id: 'prod3',
    name: 'NovaPlay Gaming Controller',
    description: 'Experience next-level gaming with the NovaPlay controller. Ergonomic design, haptic feedback, and adaptive triggers.',
    price: 69.99,
    category: 'gaming',
    brand: 'Quantum Gaming',
    stock: 120,
    images: ['prod3-1', 'prod3-2'],
    rating: 4.7,
    reviews: 890,
    tags: ['gaming', 'controller', 'esports'],
    featured: true,
  },
  {
    id: 'prod4',
    name: 'Director\'s Cut Clapperboard',
    description: 'Professional-grade acrylic clapperboard for film production. Essential for syncing audio and video.',
    price: 49.99,
    category: 'accessories',
    brand: 'CinePro',
    stock: 50,
    images: ['prod4-1'],
    rating: 4.6,
    reviews: 75,
    tags: ['film', 'accessory', 'production'],
    featured: false,
  },
  {
    id: 'prod5',
    name: 'Strummer-X Electric Guitar',
    description: 'A versatile electric guitar perfect for rock, blues, and jazz. Classic design with modern pickups for a powerful sound.',
    price: 599.00,
    category: 'instruments',
    brand: 'RiffMaster',
    stock: 22,
    images: ['prod5-1'],
    rating: 4.8,
    reviews: 210,
    tags: ['instrument', 'guitar', 'music'],
    featured: true,
  },
  {
    id: 'prod6',
    name: 'Podcaster Pro Microphone',
    description: 'Studio-quality USB microphone for podcasting, streaming, and recording. Crystal clear audio with zero latency monitoring.',
    price: 129.99,
    category: 'broadcasting',
    brand: 'ClearVoice',
    stock: 78,
    images: ['prod6-1'],
    rating: 4.9,
    reviews: 1150,
    tags: ['microphone', 'podcast', 'streaming'],
    featured: false,
  },
   {
    id: 'prod7',
    name: 'AeroView 4K Drone',
    description: 'Capture breathtaking aerial footage in stunning 4K. The AeroView drone is compact, intelligent, and easy to fly.',
    price: 999.00,
    category: 'cameras',
    brand: 'SkyHigh',
    stock: 18,
    images: ['prod7-1'],
    rating: 4.7,
    reviews: 312,
    tags: ['drone', '4k', 'camera', 'aerial'],
    featured: false,
  },
  {
    id: 'prod8',
    name: 'MixMaster Go DJ Console',
    description: 'All-in-one portable DJ console. Perfect for beginners and professionals on the move. Integrated battery and streaming capabilities.',
    price: 899.99,
    category: 'audio',
    brand: 'BeatDrop',
    stock: 12,
    images: ['prod8-1'],
    rating: 4.6,
    reviews: 98,
    tags: ['dj', 'console', 'audio', 'music'],
    featured: false,
  },
];

const categories: Category[] = [
    { id: 'cameras', name: 'Cameras', image: 'cat-cam', productCount: 2 },
    { id: 'audio', name: 'Audio', image: 'cat-audio', productCount: 2 },
    { id: 'gaming', name: 'Gaming', image: 'cat-gaming', productCount: 1 },
    { id: 'accessories', name: 'Accessories', image: 'cat-acc', productCount: 1 },
    { id: 'instruments', name: 'Instruments', image: 'cat-inst', productCount: 1 },
    { id: 'broadcasting', name: 'Broadcasting', image: 'cat-broad', productCount: 1 },
];

const users: User[] = [
    { id: 'user1', name: 'Alice Johnson', email: 'alice@example.com', joined: '2023-03-15', avatar: 'user-avatar-1', orderCount: 3 },
    { id: 'user2', name: 'Bob Williams', email: 'bob@example.com', joined: '2023-05-20', avatar: 'user-avatar-2', orderCount: 1 },
    { id: 'user3', name: 'Charlie Brown', email: 'charlie@example.com', joined: '2023-07-01', avatar: 'user-avatar-1', orderCount: 5 },
];

const orders: Order[] = [
    { id: 'ord1', customerName: 'Alice Johnson', customerAvatar: 'user-avatar-1', date: '2024-05-20', status: 'Delivered', total: 349.00, itemCount: 1 },
    { id: 'ord2', customerName: 'Charlie Brown', customerAvatar: 'user-avatar-1', date: '2024-05-19', status: 'Shipped', total: 799.99, itemCount: 1 },
    { id: 'ord3', customerName: 'Bob Williams', customerAvatar: 'user-avatar-2', date: '2024-05-18', status: 'Delivered', total: 69.99, itemCount: 1 },
    { id: 'ord4', customerName: 'Alice Johnson', customerAvatar: 'user-avatar-1', date: '2024-04-10', status: 'Cancelled', total: 49.99, itemCount: 1 },
];


export const getProducts = () => products;
export const getProductById = (id: string) => products.find(p => p.id === id);
export const getProductsByIds = (ids: string[]) => products.filter(p => ids.includes(p.id));
export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getCategories = () => categories;
export const getUsers = () => users;
export const getOrders = () => orders;
