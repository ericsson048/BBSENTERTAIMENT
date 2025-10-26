import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Product, Category, User, Order } from './types';
import { firestore } from './firebase'; // Assume this is your initialized firestore instance

const productsCol = collection(firestore, 'products');
const categoriesCol = collection(firestore, 'categories');
const usersCol = collection(firestore, 'users');
const ordersCol = collection(firestore, 'orders');


export const getProducts = async () => {
    const snapshot = await getDocs(productsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export const getProductById = async (id: string) => {
    const docRef = doc(firestore, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return undefined;
}

export const getProductsByIds = async (ids: string[]) => {
    if (ids.length === 0) return [];
    const q = query(productsCol, where('id', 'in', ids));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export const getFeaturedProducts = async () => {
    const q = query(productsCol, where('featured', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export const getCategories = async () => {
    const snapshot = await getDocs(categoriesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

export const getUsers = async () => {
    const snapshot = await getDocs(usersCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export const getOrders = async () => {
    const snapshot = await getDocs(ordersCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

export const getOrdersByUserId = async (userId: string) => {
    const q = query(ordersCol, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}
