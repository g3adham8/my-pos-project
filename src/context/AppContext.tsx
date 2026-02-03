import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { 
  User, Session, CartItem, Order, Customer, Product, Category, 
  HeldOrder, Notification, StoreSettings, ViewType 
} from '../types';
import { 
  products as initialProducts, 
  categories as initialCategories, 
  customers as initialCustomers,
  users,
  storeSettings as initialSettings,
  heldOrders as initialHeldOrders
} from '../data/products';

interface AppState {
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
  selectedCustomer: Customer | null;
  searchTerm: string;
  selectedCategory: string;
  isLoading: boolean;
  showKeypad: boolean;
}

type AppAction =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'OPEN_SESSION'; payload: Session }
  | { type: 'CLOSE_SESSION'; payload: { closingBalance: number; notes?: string } }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity?: number } }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: string; updates: Partial<CartItem> } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'HOLD_ORDER'; payload: HeldOrder }
  | { type: 'RETRIEVE_HELD_ORDER'; payload: string }
  | { type: 'DELETE_HELD_ORDER'; payload: string }
  | { type: 'COMPLETE_ORDER'; payload: Order }
  | { type: 'REFUND_ORDER'; payload: { orderId: string; reason: string } }
  | { type: 'SET_CUSTOMER'; payload: Customer | null }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: { id: string; updates: Partial<Customer> } }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_PRODUCT_STOCK'; payload: { productId: string; quantity: number } }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<Product> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_KEYPAD' };

const initialState: AppState = {
  currentView: 'pos',
  currentUser: users[0], // Auto-login for demo
  currentSession: {
    id: 'session-1',
    user: users[0],
    startTime: new Date(),
    openingBalance: 500,
    status: 'open',
    cashMovements: [],
  },
  isAuthenticated: true, // Auto-authenticated for demo
  cart: [],
  heldOrders: initialHeldOrders,
  orders: [],
  customers: initialCustomers,
  products: initialProducts,
  categories: initialCategories,
  notifications: [],
  storeSettings: initialSettings,
  selectedCustomer: null,
  searchTerm: '',
  selectedCategory: 'all',
  isLoading: false,
  showKeypad: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };

    case 'LOGIN':
      return { 
        ...state, 
        currentUser: action.payload, 
        isAuthenticated: true,
        notifications: [...state.notifications, {
          id: Date.now().toString(),
          type: 'success',
          title: 'Welcome!',
          message: `Logged in as ${action.payload.name}`,
          timestamp: new Date(),
          read: false,
        }]
      };

    case 'LOGOUT':
      return { 
        ...state, 
        currentUser: null, 
        isAuthenticated: false,
        currentSession: null,
        cart: [],
        selectedCustomer: null,
      };

    case 'OPEN_SESSION':
      return { ...state, currentSession: action.payload };

    case 'CLOSE_SESSION':
      if (!state.currentSession) return state;
      return { 
        ...state, 
        currentSession: {
          ...state.currentSession,
          status: 'closed',
          endTime: new Date(),
          closingBalance: action.payload.closingBalance,
          notes: action.payload.notes,
        }
      };

    case 'ADD_TO_CART': {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.cart.findIndex(item => item.product.id === product.id);
      
      if (existingIndex >= 0) {
        const newCart = [...state.cart];
        const newQty = newCart[existingIndex].quantity + quantity;
        if (newQty <= product.stock) {
          newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: newQty,
          };
        }
        return { ...state, cart: newCart };
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${product.id}`,
        product,
        quantity,
        unitPrice: product.price,
        discount: 0,
        discountType: 'percentage',
        tax: product.price * quantity * (product.taxRate / 100),
      };
      return { ...state, cart: [...state.cart, newItem] };
    }

    case 'UPDATE_CART_ITEM': {
      const { id, updates } = action.payload;
      return {
        ...state,
        cart: state.cart.map(item => {
          if (item.id === id) {
            const updated = { ...item, ...updates };
            // Recalculate tax
            const subtotal = updated.unitPrice * updated.quantity;
            const discountAmount = updated.discountType === 'percentage' 
              ? subtotal * (updated.discount / 100)
              : updated.discount;
            updated.tax = (subtotal - discountAmount) * (updated.product.taxRate / 100);
            return updated;
          }
          return item;
        }),
      };
    }

    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };

    case 'CLEAR_CART':
      return { ...state, cart: [], selectedCustomer: null };

    case 'SET_CART':
      return { ...state, cart: action.payload };

    case 'HOLD_ORDER':
      return { 
        ...state, 
        heldOrders: [...state.heldOrders, action.payload],
        cart: [],
        selectedCustomer: null,
        notifications: [...state.notifications, {
          id: Date.now().toString(),
          type: 'info',
          title: 'Order Held',
          message: `Order "${action.payload.name}" has been saved`,
          timestamp: new Date(),
          read: false,
        }]
      };

    case 'RETRIEVE_HELD_ORDER': {
      const order = state.heldOrders.find(o => o.id === action.payload);
      if (!order) return state;
      return {
        ...state,
        cart: order.items,
        selectedCustomer: order.customer,
        heldOrders: state.heldOrders.filter(o => o.id !== action.payload),
      };
    }

    case 'DELETE_HELD_ORDER':
      return { ...state, heldOrders: state.heldOrders.filter(o => o.id !== action.payload) };

    case 'COMPLETE_ORDER': {
      // Update product stock
      const updatedProducts = state.products.map(product => {
        const orderItem = action.payload.items.find(item => item.product.id === product.id);
        if (orderItem) {
          return { ...product, stock: product.stock - orderItem.quantity };
        }
        return product;
      });

      // Update customer stats if applicable
      let updatedCustomers = state.customers;
      if (action.payload.customer) {
        const loyaltyPointsEarned = Math.floor(action.payload.total * state.storeSettings.loyaltyPointsPerCurrency);
        updatedCustomers = state.customers.map(c => {
          if (c.id === action.payload.customer?.id) {
            return {
              ...c,
              loyaltyPoints: c.loyaltyPoints + loyaltyPointsEarned,
              totalSpent: c.totalSpent + action.payload.total,
              orderCount: c.orderCount + 1,
              lastVisit: new Date(),
            };
          }
          return c;
        });
      }

      return {
        ...state,
        orders: [action.payload, ...state.orders],
        cart: [],
        selectedCustomer: null,
        products: updatedProducts,
        customers: updatedCustomers,
        notifications: [...state.notifications, {
          id: Date.now().toString(),
          type: 'success',
          title: 'Order Completed',
          message: `Order #${action.payload.orderNumber} - $${action.payload.total.toFixed(2)}`,
          timestamp: new Date(),
          read: false,
        }]
      };
    }

    case 'REFUND_ORDER':
      return {
        ...state,
        orders: state.orders.map(order => {
          if (order.id === action.payload.orderId) {
            return {
              ...order,
              status: 'refunded',
              refundedAt: new Date(),
              refundReason: action.payload.reason,
            };
          }
          return order;
        }),
      };

    case 'SET_CUSTOMER':
      return { ...state, selectedCustomer: action.payload };

    case 'ADD_CUSTOMER':
      return { 
        ...state, 
        customers: [...state.customers, action.payload],
        notifications: [...state.notifications, {
          id: Date.now().toString(),
          type: 'success',
          title: 'Customer Added',
          message: `${action.payload.firstName} ${action.payload.lastName} has been added`,
          timestamp: new Date(),
          read: false,
        }]
      };

    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c => 
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };

    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };

    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };

    case 'DISMISS_NOTIFICATION':
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload) 
      };

    case 'UPDATE_PRODUCT_STOCK':
      return {
        ...state,
        products: state.products.map(p => 
          p.id === action.payload.productId 
            ? { ...p, stock: action.payload.quantity }
            : p
        ),
      };

    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => 
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'TOGGLE_KEYPAD':
      return { ...state, showKeypad: !state.showKeypad };

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for low stock notifications
  useEffect(() => {
    const lowStockProducts = state.products.filter(p => p.stock <= p.minStock && p.stock > 0);
    const outOfStockProducts = state.products.filter(p => p.stock === 0);

    if (lowStockProducts.length > 0 && state.notifications.every(n => n.title !== 'Low Stock Alert')) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `low-stock-${Date.now()}`,
          type: 'warning',
          title: 'Low Stock Alert',
          message: `${lowStockProducts.length} products are running low on stock`,
          timestamp: new Date(),
          read: false,
        }
      });
    }

    if (outOfStockProducts.length > 0 && state.notifications.every(n => n.title !== 'Out of Stock')) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `out-stock-${Date.now()}`,
          type: 'error',
          title: 'Out of Stock',
          message: `${outOfStockProducts.length} products are out of stock`,
          timestamp: new Date(),
          read: false,
        }
      });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Helper hooks
export function useCart() {
  const { state, dispatch } = useApp();
  
  const subtotal = state.cart.reduce((sum, item) => {
    return sum + (item.unitPrice * item.quantity);
  }, 0);

  const totalDiscount = state.cart.reduce((sum, item) => {
    const itemSubtotal = item.unitPrice * item.quantity;
    return sum + (item.discountType === 'percentage' 
      ? itemSubtotal * (item.discount / 100)
      : item.discount);
  }, 0);

  const taxAmount = state.cart.reduce((sum, item) => sum + item.tax, 0);
  const total = subtotal - totalDiscount + taxAmount;

  const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items: state.cart,
    subtotal,
    totalDiscount,
    taxAmount,
    total,
    itemCount,
    customer: state.selectedCustomer,
    addToCart: (product: Product, quantity?: number) => 
      dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } }),
    updateItem: (id: string, updates: Partial<CartItem>) =>
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { id, updates } }),
    removeItem: (id: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: id }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    setCustomer: (customer: Customer | null) => dispatch({ type: 'SET_CUSTOMER', payload: customer }),
  };
}
