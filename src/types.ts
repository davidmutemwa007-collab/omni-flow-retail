export interface Store {
  id: string;
  name: string;
  location: string;
  type: 'single' | 'chain';
  ownerId: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  sku: string;
  image: string;
}

export interface InventoryItem {
  productId: string;
  storeId: string;
  quantity: number;
  lowStockThreshold: number;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  storeId: string;
  timestamp: number;
  items: SaleItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'mobile_money';
  status: 'completed' | 'refunded';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  organizationId: string;
}