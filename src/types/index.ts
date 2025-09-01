export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  storeId: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  barcode?: string;
  categoryId: string;
  categoryName?: string;
  unit: string;
  cost: number;
  price: number;
  minStock: number;
  maxStock: number;
  currentStock: number;
  imageUrl?: string;
  supplierId?: string;
  supplierName?: string;
  allergens?: string[];
  expiryDate?: Date;
  status?: 'normal' | 'low' | 'excess' | 'expired';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'disposal' | 'adjustment';
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  reason?: string;
  date: Date;
  userId: string;
  userName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'draft' | 'ordered' | 'received' | 'cancelled';
  orderDate: Date;
  expectedDate?: Date;
  receivedDate?: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Stocktaking {
  id: string;
  date: Date;
  items: StocktakingItem[];
  totalDifference: number;
  status: 'in_progress' | 'completed';
  userId: string;
  userName: string;
}

export interface StocktakingItem {
  productId: string;
  productName: string;
  theoreticalStock: number;
  actualStock: number;
  difference: number;
  differenceAmount: number;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'excess_stock' | 'expiry' | 'order_required';
  severity: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  productId?: string;
  date: Date;
  isRead: boolean;
}

export interface DashboardStats {
  totalInventoryValue: number;
  totalProducts: number;
  lowStockItems: number;
  expiringItems: number;
  pendingOrders: number;
  turnoverRate: number;
  recentTransactions: StockTransaction[];
  alerts: Alert[];
}