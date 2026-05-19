import { Product, Store, InventoryItem, User } from '../types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@omnipos.com',
  role: 'admin',
  organizationId: 'org1',
};

export const MOCK_STORES: Store[] = [
  { id: 's1', name: 'Downtown Hub', location: '123 Main St', type: 'chain', ownerId: 'u1' },
  { id: 's2', name: 'Westside Branch', location: '456 West Blvd', type: 'chain', ownerId: 'u1' },
  { id: 's3', name: 'Airport Kiosk', location: 'Terminal 2', type: 'single', ownerId: 'u1' },
];

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    name: 'Premium Coffee Beans', 
    category: 'Beverages', 
    price: 18.50, 
    cost: 10.00, 
    sku: 'COF-001', 
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/d352b4c4-9375-447e-8885-f393740af6f7/product-coffee-jpg-b3b30ee5-1779185773320.webp' 
  },
  { 
    id: 'p2', 
    name: 'Organic Energy Bar', 
    category: 'Snacks', 
    price: 3.99, 
    cost: 1.50, 
    sku: 'SNK-022', 
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/d352b4c4-9375-447e-8885-f393740af6f7/product-snack-jpg-c2e2d529-1779185772494.webp' 
  },
  { 
    id: 'p3', 
    name: 'Artisanal Spring Water', 
    category: 'Beverages', 
    price: 2.50, 
    cost: 0.80, 
    sku: 'WAT-105', 
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/d352b4c4-9375-447e-8885-f393740af6f7/product-water-jpg-2fdf2464-1779185772344.webp' 
  },
  { 
    id: 'p4', 
    name: 'Reusable Cup', 
    category: 'Merchandise', 
    price: 12.00, 
    cost: 4.50, 
    sku: 'ACC-045', 
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=200&h=200&auto=format&fit=crop' 
  },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { productId: 'p1', storeId: 's1', quantity: 45, lowStockThreshold: 10 },
  { productId: 'p2', storeId: 's1', quantity: 120, lowStockThreshold: 20 },
  { productId: 'p3', storeId: 's1', quantity: 8, lowStockThreshold: 15 },
  { productId: 'p1', storeId: 's2', quantity: 12, lowStockThreshold: 5 },
  { productId: 'p4', storeId: 's3', quantity: 30, lowStockThreshold: 5 },
];