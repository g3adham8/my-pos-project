// User & Authentication
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  avatar?: string;
  pin?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Session {
  id: string;
  user: User;
  startTime: Date;
  endTime?: Date;
  openingBalance: number;
  closingBalance?: number;
  status: 'open' | 'closed';
  cashMovements: CashMovement[];
  notes?: string;
}

export interface CashMovement {
  id: string;
  type: 'in' | 'out';
  amount: number;
  reason: string;
  timestamp: Date;
  userId: string;
}

// Products & Inventory
export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  price: number;
  cost: number;
  category: string;
  image: string;
  stock: number;
  minStock: number;
  unit: string;
  taxRate: number;
  isActive: boolean;
  variants?: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: { [key: string]: string };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  parentId?: string;
  order: number;
  isActive: boolean;
}

// Cart & Orders
export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  note?: string;
  tax: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  customer: Customer | null;
  subtotal: number;
  totalDiscount: number;
  taxAmount: number;
  total: number;
  payments: Payment[];
  status: 'draft' | 'pending' | 'completed' | 'refunded' | 'cancelled' | 'held';
  holdReason?: string;
  notes?: string;
  cashier: User;
  sessionId: string;
  createdAt: Date;
  completedAt?: Date;
  refundedAt?: Date;
  refundReason?: string;
  receiptPrinted: boolean;
  emailSent: boolean;
}

export interface HeldOrder {
  id: string;
  name: string;
  items: CartItem[];
  customer: Customer | null;
  discount: number;
  notes?: string;
  createdAt: Date;
  tableNumber?: string;
}

// Payments
export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'bank_transfer' | 'gift_card' | 'store_credit' | 'split';

export interface Payment {
  id: string;
  method: PaymentMethod;
  amount: number;
  reference?: string;
  cardLast4?: string;
  change?: number;
  timestamp: Date;
}

export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  originalAmount: number;
  isActive: boolean;
  expiryDate?: Date;
  customerId?: string;
  createdAt: Date;
}

// Customers
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: Address;
  loyaltyPoints: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  storeCredit: number;
  totalSpent: number;
  orderCount: number;
  notes?: string;
  taxExempt: boolean;
  tags: string[];
  createdAt: Date;
  lastVisit?: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Discounts & Promotions
export interface Discount {
  id: string;
  name: string;
  code?: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  startDate: Date;
  endDate?: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

// Store Settings
export interface StoreSettings {
  name: string;
  logo?: string;
  address: Address;
  phone: string;
  email: string;
  website?: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  taxInclusive: boolean;
  receiptHeader?: string;
  receiptFooter?: string;
  loyaltyPointsPerCurrency: number;
  loyaltyRedemptionRate: number;
}

// Reports
export interface SalesReport {
  date: Date;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalDiscount: number;
  totalTax: number;
  netSales: number;
  paymentBreakdown: { method: PaymentMethod; amount: number; count: number }[];
  topProducts: { product: Product; quantity: number; revenue: number }[];
  hourlyBreakdown: { hour: number; sales: number; orders: number }[];
}

// Notifications
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// App State
export type ViewType = 
  | 'pos' 
  | 'orders' 
  | 'customers' 
  | 'products' 
  | 'inventory' 
  | 'reports' 
  | 'settings' 
  | 'dashboard'
  | 'employees';

export interface AppState {
  currentView: ViewType;
  currentUser: User | null;
  currentSession: Session | null;
  isAuthenticated: boolean;
  cart: CartItem[];
  heldOrders: HeldOrder[];
  orders: Order[];
  customers: Customer[];
  products: Product[];
  categories: Category[];
  notifications: Notification[];
  storeSettings: StoreSettings;
}
