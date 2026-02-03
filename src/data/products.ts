import { Product, Category, Customer, User, StoreSettings, Discount, GiftCard, HeldOrder } from '../types';

export const users: User[] = [
  { id: '1', username: 'admin', name: 'John Admin', email: 'admin@quickpos.com', role: 'admin', pin: '1234', avatar: '👨‍💼', createdAt: new Date('2024-01-01'), lastLogin: new Date() },
  { id: '2', username: 'manager', name: 'Sarah Manager', email: 'manager@quickpos.com', role: 'manager', pin: '5678', avatar: '👩‍💼', createdAt: new Date('2024-01-15'), lastLogin: new Date() },
  { id: '3', username: 'cashier1', name: 'Mike Cashier', email: 'mike@quickpos.com', role: 'cashier', pin: '1111', avatar: '👨', createdAt: new Date('2024-02-01'), lastLogin: new Date() },
  { id: '4', username: 'cashier2', name: 'Emily Cashier', email: 'emily@quickpos.com', role: 'cashier', pin: '2222', avatar: '👩', createdAt: new Date('2024-02-15'), lastLogin: new Date() },
];

export const storeSettings: StoreSettings = {
  name: 'QuickPOS Store',
  address: { street: '123 Main Street', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
  phone: '+1 (555) 123-4567',
  email: 'contact@quickpos.com',
  website: 'www.quickpos.com',
  currency: 'USD',
  currencySymbol: '$',
  taxRate: 8.5,
  taxInclusive: false,
  receiptHeader: 'Thank you for shopping with us!',
  receiptFooter: 'Returns accepted within 30 days with receipt.',
  loyaltyPointsPerCurrency: 1,
  loyaltyRedemptionRate: 0.01,
};

export const categories: Category[] = [
  { id: 'all', name: 'All Items', icon: '🏷️', color: '#6366f1', order: 0, isActive: true },
  { id: 'food', name: 'Food', icon: '🍔', color: '#ef4444', order: 1, isActive: true },
  { id: 'drinks', name: 'Beverages', icon: '🥤', color: '#3b82f6', order: 2, isActive: true },
  { id: 'snacks', name: 'Snacks', icon: '🍿', color: '#f59e0b', order: 3, isActive: true },
  { id: 'desserts', name: 'Desserts', icon: '🍰', color: '#ec4899', order: 4, isActive: true },
  { id: 'grocery', name: 'Grocery', icon: '🛒', color: '#10b981', order: 5, isActive: true },
  { id: 'electronics', name: 'Electronics', icon: '📱', color: '#8b5cf6', order: 6, isActive: true },
  { id: 'clothing', name: 'Apparel', icon: '👕', color: '#06b6d4', order: 7, isActive: true },
  { id: 'health', name: 'Health & Beauty', icon: '💊', color: '#84cc16', order: 8, isActive: true },
  { id: 'home', name: 'Home & Living', icon: '🏠', color: '#f97316', order: 9, isActive: true },
];

const now = new Date();

export const products: Product[] = [
  // Food
  { id: '1', name: 'Classic Burger', sku: 'FOOD-001', barcode: '100001', description: 'Juicy beef patty with fresh vegetables', price: 12.99, cost: 5.50, category: 'food', image: '🍔', stock: 50, minStock: 10, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '2', name: 'Cheese Pizza', sku: 'FOOD-002', barcode: '100002', description: 'Hand-tossed with mozzarella cheese', price: 15.99, cost: 6.00, category: 'food', image: '🍕', stock: 30, minStock: 5, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '3', name: 'Hot Dog', sku: 'FOOD-003', barcode: '100003', description: 'All-beef frankfurter with toppings', price: 6.99, cost: 2.50, category: 'food', image: '🌭', stock: 40, minStock: 10, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '4', name: 'French Fries', sku: 'FOOD-004', barcode: '100004', description: 'Crispy golden fries with seasoning', price: 4.99, cost: 1.50, category: 'food', image: '🍟', stock: 100, minStock: 20, unit: 'portion', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '5', name: 'Taco Supreme', sku: 'FOOD-005', barcode: '100005', description: 'Seasoned beef with fresh salsa', price: 8.99, cost: 3.50, category: 'food', image: '🌮', stock: 35, minStock: 8, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '6', name: 'Sushi Roll', sku: 'FOOD-006', barcode: '100006', description: 'Fresh salmon and avocado roll', price: 18.99, cost: 9.00, category: 'food', image: '🍣', stock: 25, minStock: 5, unit: 'set', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '7', name: 'Ramen Bowl', sku: 'FOOD-007', barcode: '100007', description: 'Rich pork broth with noodles', price: 14.99, cost: 5.50, category: 'food', image: '🍜', stock: 20, minStock: 5, unit: 'bowl', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '8', name: 'Caesar Salad', sku: 'FOOD-008', barcode: '100008', description: 'Fresh romaine with caesar dressing', price: 11.99, cost: 4.00, category: 'food', image: '🥗', stock: 45, minStock: 10, unit: 'bowl', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '9', name: 'Chicken Wings', sku: 'FOOD-009', barcode: '100009', description: 'Crispy wings with buffalo sauce', price: 13.99, cost: 5.00, category: 'food', image: '🍗', stock: 60, minStock: 15, unit: 'portion', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '10', name: 'Sandwich Deluxe', sku: 'FOOD-010', barcode: '100010', description: 'Turkey, bacon, and avocado', price: 10.99, cost: 4.50, category: 'food', image: '🥪', stock: 40, minStock: 10, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },

  // Drinks
  { id: '11', name: 'Cola Classic', sku: 'DRK-001', barcode: '200001', description: 'Refreshing cola beverage', price: 2.99, cost: 0.80, category: 'drinks', image: '🥤', stock: 200, minStock: 50, unit: 'bottle', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '12', name: 'Orange Juice', sku: 'DRK-002', barcode: '200002', description: 'Fresh squeezed orange juice', price: 4.99, cost: 1.50, category: 'drinks', image: '🧃', stock: 80, minStock: 20, unit: 'bottle', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '13', name: 'Espresso', sku: 'DRK-003', barcode: '200003', description: 'Strong Italian espresso', price: 3.49, cost: 0.80, category: 'drinks', image: '☕', stock: 150, minStock: 30, unit: 'cup', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '14', name: 'Cappuccino', sku: 'DRK-004', barcode: '200004', description: 'Espresso with steamed milk foam', price: 4.99, cost: 1.20, category: 'drinks', image: '☕', stock: 120, minStock: 25, unit: 'cup', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '15', name: 'Green Tea', sku: 'DRK-005', barcode: '200005', description: 'Premium Japanese green tea', price: 3.49, cost: 0.70, category: 'drinks', image: '🍵', stock: 90, minStock: 20, unit: 'cup', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '16', name: 'Vanilla Milkshake', sku: 'DRK-006', barcode: '200006', description: 'Creamy vanilla milkshake', price: 5.99, cost: 1.80, category: 'drinks', image: '🥛', stock: 60, minStock: 15, unit: 'cup', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '17', name: 'Berry Smoothie', sku: 'DRK-007', barcode: '200007', description: 'Mixed berry smoothie with yogurt', price: 6.99, cost: 2.20, category: 'drinks', image: '🍹', stock: 55, minStock: 12, unit: 'cup', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '18', name: 'Lemonade', sku: 'DRK-008', barcode: '200008', description: 'Fresh lemonade with mint', price: 3.99, cost: 1.00, category: 'drinks', image: '🍋', stock: 100, minStock: 25, unit: 'glass', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '19', name: 'Iced Latte', sku: 'DRK-009', barcode: '200009', description: 'Chilled espresso with milk', price: 5.49, cost: 1.40, category: 'drinks', image: '🧊', stock: 80, minStock: 20, unit: 'cup', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '20', name: 'Mineral Water', sku: 'DRK-010', barcode: '200010', description: 'Premium mineral water', price: 1.99, cost: 0.40, category: 'drinks', image: '💧', stock: 300, minStock: 100, unit: 'bottle', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },

  // Snacks
  { id: '21', name: 'Butter Popcorn', sku: 'SNK-001', barcode: '300001', description: 'Movie theater style popcorn', price: 5.99, cost: 1.50, category: 'snacks', image: '🍿', stock: 70, minStock: 15, unit: 'bag', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '22', name: 'Soft Pretzel', sku: 'SNK-002', barcode: '300002', description: 'Warm soft pretzel with salt', price: 4.49, cost: 1.20, category: 'snacks', image: '🥨', stock: 65, minStock: 15, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '23', name: 'Loaded Nachos', sku: 'SNK-003', barcode: '300003', description: 'Nachos with cheese and jalapeños', price: 8.99, cost: 3.00, category: 'snacks', image: '🧀', stock: 40, minStock: 10, unit: 'plate', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '24', name: 'Mixed Nuts', sku: 'SNK-004', barcode: '300004', description: 'Premium mixed nuts', price: 6.99, cost: 3.50, category: 'snacks', image: '🥜', stock: 100, minStock: 25, unit: 'bag', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '25', name: 'Potato Chips', sku: 'SNK-005', barcode: '300005', description: 'Crispy salted potato chips', price: 3.99, cost: 1.00, category: 'snacks', image: '🥔', stock: 150, minStock: 40, unit: 'bag', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '26', name: 'Granola Bar', sku: 'SNK-006', barcode: '300006', description: 'Healthy oat and honey bar', price: 2.49, cost: 0.80, category: 'snacks', image: '🍫', stock: 200, minStock: 50, unit: 'bar', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },

  // Desserts
  { id: '27', name: 'Vanilla Ice Cream', sku: 'DES-001', barcode: '400001', description: 'Creamy vanilla ice cream', price: 4.99, cost: 1.50, category: 'desserts', image: '🍦', stock: 50, minStock: 10, unit: 'scoop', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '28', name: 'Chocolate Cake', sku: 'DES-002', barcode: '400002', description: 'Rich chocolate layer cake', price: 6.99, cost: 2.50, category: 'desserts', image: '🍰', stock: 30, minStock: 5, unit: 'slice', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '29', name: 'Glazed Donut', sku: 'DES-003', barcode: '400003', description: 'Classic glazed ring donut', price: 2.99, cost: 0.80, category: 'desserts', image: '🍩', stock: 80, minStock: 20, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '30', name: 'Chocolate Cookie', sku: 'DES-004', barcode: '400004', description: 'Fresh baked chocolate chip cookie', price: 1.99, cost: 0.50, category: 'desserts', image: '🍪', stock: 120, minStock: 30, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '31', name: 'Cheesecake', sku: 'DES-005', barcode: '400005', description: 'New York style cheesecake', price: 7.99, cost: 3.00, category: 'desserts', image: '🧁', stock: 25, minStock: 5, unit: 'slice', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '32', name: 'Brownie', sku: 'DES-006', barcode: '400006', description: 'Fudgy chocolate brownie', price: 3.99, cost: 1.20, category: 'desserts', image: '🟫', stock: 60, minStock: 15, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '33', name: 'Apple Pie', sku: 'DES-007', barcode: '400007', description: 'Classic apple pie slice', price: 5.99, cost: 2.00, category: 'desserts', image: '🥧', stock: 35, minStock: 8, unit: 'slice', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '34', name: 'Macarons', sku: 'DES-008', barcode: '400008', description: 'French macarons assorted', price: 8.99, cost: 4.00, category: 'desserts', image: '🎂', stock: 40, minStock: 10, unit: 'box', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },

  // Grocery
  { id: '35', name: 'Whole Milk', sku: 'GRO-001', barcode: '500001', description: 'Fresh whole milk 1 gallon', price: 4.99, cost: 2.50, category: 'grocery', image: '🥛', stock: 50, minStock: 15, unit: 'gallon', taxRate: 0, isActive: true, createdAt: now, updatedAt: now },
  { id: '36', name: 'Fresh Eggs', sku: 'GRO-002', barcode: '500002', description: 'Farm fresh eggs dozen', price: 5.99, cost: 3.00, category: 'grocery', image: '🥚', stock: 80, minStock: 20, unit: 'dozen', taxRate: 0, isActive: true, createdAt: now, updatedAt: now },
  { id: '37', name: 'Wheat Bread', sku: 'GRO-003', barcode: '500003', description: 'Whole wheat bread loaf', price: 3.99, cost: 1.50, category: 'grocery', image: '🍞', stock: 60, minStock: 15, unit: 'loaf', taxRate: 0, isActive: true, createdAt: now, updatedAt: now },
  { id: '38', name: 'Butter', sku: 'GRO-004', barcode: '500004', description: 'Unsalted butter stick', price: 4.49, cost: 2.20, category: 'grocery', image: '🧈', stock: 70, minStock: 20, unit: 'pack', taxRate: 0, isActive: true, createdAt: now, updatedAt: now },
  { id: '39', name: 'Cheddar Cheese', sku: 'GRO-005', barcode: '500005', description: 'Aged cheddar cheese block', price: 6.99, cost: 3.50, category: 'grocery', image: '🧀', stock: 45, minStock: 10, unit: 'block', taxRate: 0, isActive: true, createdAt: now, updatedAt: now },
  { id: '40', name: 'Fresh Apples', sku: 'GRO-006', barcode: '500006', description: 'Red delicious apples', price: 4.99, cost: 2.00, category: 'grocery', image: '🍎', stock: 100, minStock: 25, unit: 'lb', taxRate: 0, isActive: true, createdAt: now, updatedAt: now },
  { id: '41', name: 'Bananas', sku: 'GRO-007', barcode: '500007', description: 'Fresh yellow bananas', price: 1.99, cost: 0.80, category: 'grocery', image: '🍌', stock: 120, minStock: 30, unit: 'bunch', taxRate: 0, isActive: true, createdAt: now, updatedAt: now },
  { id: '42', name: 'Avocados', sku: 'GRO-008', barcode: '500008', description: 'Ripe Hass avocados', price: 5.99, cost: 3.00, category: 'grocery', image: '🥑', stock: 60, minStock: 15, unit: 'each', taxRate: 0, isActive: true, createdAt: now, updatedAt: now },

  // Electronics
  { id: '43', name: 'USB-C Charger', sku: 'ELC-001', barcode: '600001', description: 'Fast charging USB-C adapter', price: 24.99, cost: 10.00, category: 'electronics', image: '🔌', stock: 25, minStock: 5, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '44', name: 'Wireless Earbuds', sku: 'ELC-002', barcode: '600002', description: 'Bluetooth wireless earbuds', price: 49.99, cost: 20.00, category: 'electronics', image: '🎧', stock: 20, minStock: 5, unit: 'pair', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '45', name: 'Lightning Cable', sku: 'ELC-003', barcode: '600003', description: 'MFI certified lightning cable', price: 14.99, cost: 5.00, category: 'electronics', image: '🔗', stock: 50, minStock: 10, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '46', name: 'Power Bank 10000', sku: 'ELC-004', barcode: '600004', description: '10000mAh portable charger', price: 39.99, cost: 15.00, category: 'electronics', image: '🔋', stock: 15, minStock: 3, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '47', name: 'Phone Case', sku: 'ELC-005', barcode: '600005', description: 'Universal smartphone case', price: 19.99, cost: 6.00, category: 'electronics', image: '📱', stock: 40, minStock: 10, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '48', name: 'Screen Protector', sku: 'ELC-006', barcode: '600006', description: 'Tempered glass protector', price: 9.99, cost: 2.00, category: 'electronics', image: '🛡️', stock: 60, minStock: 15, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '49', name: 'Bluetooth Speaker', sku: 'ELC-007', barcode: '600007', description: 'Portable Bluetooth speaker', price: 34.99, cost: 14.00, category: 'electronics', image: '🔊', stock: 18, minStock: 4, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '50', name: 'USB Hub', sku: 'ELC-008', barcode: '600008', description: '4-port USB 3.0 hub', price: 29.99, cost: 12.00, category: 'electronics', image: '🔲', stock: 22, minStock: 5, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },

  // Clothing
  { id: '51', name: 'Classic T-Shirt', sku: 'CLO-001', barcode: '700001', description: 'Cotton crew neck t-shirt', price: 24.99, cost: 8.00, category: 'clothing', image: '👕', stock: 40, minStock: 10, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '52', name: 'Baseball Cap', sku: 'CLO-002', barcode: '700002', description: 'Adjustable baseball cap', price: 19.99, cost: 6.00, category: 'clothing', image: '🧢', stock: 35, minStock: 8, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '53', name: 'Athletic Socks', sku: 'CLO-003', barcode: '700003', description: 'Comfortable athletic socks', price: 9.99, cost: 3.00, category: 'clothing', image: '🧦', stock: 60, minStock: 15, unit: 'pair', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '54', name: 'Denim Jeans', sku: 'CLO-004', barcode: '700004', description: 'Classic fit denim jeans', price: 49.99, cost: 18.00, category: 'clothing', image: '👖', stock: 30, minStock: 8, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '55', name: 'Hoodie', sku: 'CLO-005', barcode: '700005', description: 'Fleece pullover hoodie', price: 44.99, cost: 16.00, category: 'clothing', image: '🧥', stock: 25, minStock: 6, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '56', name: 'Running Shoes', sku: 'CLO-006', barcode: '700006', description: 'Lightweight running shoes', price: 79.99, cost: 35.00, category: 'clothing', image: '👟', stock: 20, minStock: 5, unit: 'pair', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },

  // Health & Beauty
  { id: '57', name: 'Hand Sanitizer', sku: 'HLT-001', barcode: '800001', description: 'Antibacterial hand sanitizer', price: 4.99, cost: 1.50, category: 'health', image: '🧴', stock: 100, minStock: 25, unit: 'bottle', taxRate: 0, isActive: true, createdAt: now, updatedAt: now },
  { id: '58', name: 'Face Mask', sku: 'HLT-002', barcode: '800002', description: 'Disposable face masks pack', price: 9.99, cost: 4.00, category: 'health', image: '😷', stock: 80, minStock: 20, unit: 'pack', taxRate: 0, isActive: true, createdAt: now, updatedAt: now },
  { id: '59', name: 'Lip Balm', sku: 'HLT-003', barcode: '800003', description: 'Moisturizing lip balm', price: 3.99, cost: 1.00, category: 'health', image: '💋', stock: 90, minStock: 25, unit: 'tube', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '60', name: 'Sunscreen', sku: 'HLT-004', barcode: '800004', description: 'SPF 50 sunscreen lotion', price: 12.99, cost: 5.00, category: 'health', image: '☀️', stock: 45, minStock: 10, unit: 'bottle', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '61', name: 'Pain Relief', sku: 'HLT-005', barcode: '800005', description: 'Pain relief tablets', price: 8.99, cost: 3.00, category: 'health', image: '💊', stock: 70, minStock: 20, unit: 'bottle', taxRate: 0, isActive: true, createdAt: now, updatedAt: now },
  { id: '62', name: 'Vitamins', sku: 'HLT-006', barcode: '800006', description: 'Daily multivitamins', price: 14.99, cost: 6.00, category: 'health', image: '💪', stock: 55, minStock: 12, unit: 'bottle', taxRate: 0, isActive: true, createdAt: now, updatedAt: now },

  // Home & Living
  { id: '63', name: 'Scented Candle', sku: 'HOM-001', barcode: '900001', description: 'Vanilla scented candle', price: 14.99, cost: 5.00, category: 'home', image: '🕯️', stock: 40, minStock: 10, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '64', name: 'Coffee Mug', sku: 'HOM-002', barcode: '900002', description: 'Ceramic coffee mug', price: 12.99, cost: 4.00, category: 'home', image: '☕', stock: 50, minStock: 12, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '65', name: 'Plant Pot', sku: 'HOM-003', barcode: '900003', description: 'Decorative plant pot', price: 19.99, cost: 7.00, category: 'home', image: '🪴', stock: 30, minStock: 8, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '66', name: 'Photo Frame', sku: 'HOM-004', barcode: '900004', description: 'Wooden photo frame', price: 16.99, cost: 6.00, category: 'home', image: '🖼️', stock: 35, minStock: 8, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '67', name: 'Throw Pillow', sku: 'HOM-005', barcode: '900005', description: 'Decorative throw pillow', price: 24.99, cost: 9.00, category: 'home', image: '🛋️', stock: 28, minStock: 6, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
  { id: '68', name: 'Desk Lamp', sku: 'HOM-006', barcode: '900006', description: 'LED desk lamp', price: 34.99, cost: 14.00, category: 'home', image: '💡', stock: 22, minStock: 5, unit: 'piece', taxRate: 8.5, isActive: true, createdAt: now, updatedAt: now },
];

export const customers: Customer[] = [
  { id: '1', firstName: 'John', lastName: 'Anderson', email: 'john.anderson@email.com', phone: '+1 (555) 123-4567', address: { street: '123 Oak Street', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' }, loyaltyPoints: 2450, loyaltyTier: 'gold', storeCredit: 25.00, totalSpent: 1850.50, orderCount: 42, notes: 'Prefers paper bags', taxExempt: false, tags: ['vip', 'frequent'], createdAt: new Date('2023-06-15'), lastVisit: new Date() },
  { id: '2', firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah.m@email.com', phone: '+1 (555) 234-5678', address: { street: '456 Pine Avenue', city: 'Los Angeles', state: 'CA', zipCode: '90001', country: 'USA' }, loyaltyPoints: 5200, loyaltyTier: 'platinum', storeCredit: 50.00, totalSpent: 3420.00, orderCount: 78, notes: 'Allergic to nuts', taxExempt: false, tags: ['vip', 'platinum'], createdAt: new Date('2023-03-20'), lastVisit: new Date() },
  { id: '3', firstName: 'Michael', lastName: 'Brown', email: 'mbrown@email.com', phone: '+1 (555) 345-6789', loyaltyPoints: 850, loyaltyTier: 'silver', storeCredit: 0, totalSpent: 650.25, orderCount: 18, taxExempt: false, tags: ['new'], createdAt: new Date('2024-01-10'), lastVisit: new Date() },
  { id: '4', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@email.com', phone: '+1 (555) 456-7890', address: { street: '789 Elm Road', city: 'Chicago', state: 'IL', zipCode: '60601', country: 'USA' }, loyaltyPoints: 1200, loyaltyTier: 'silver', storeCredit: 15.50, totalSpent: 920.75, orderCount: 25, taxExempt: false, tags: ['frequent'], createdAt: new Date('2023-09-05'), lastVisit: new Date() },
  { id: '5', firstName: 'David', lastName: 'Wilson', email: 'dwilson@email.com', phone: '+1 (555) 567-8901', loyaltyPoints: 380, loyaltyTier: 'bronze', storeCredit: 0, totalSpent: 285.00, orderCount: 8, taxExempt: false, tags: [], createdAt: new Date('2024-02-20'), lastVisit: new Date() },
  { id: '6', firstName: 'Jennifer', lastName: 'Taylor', email: 'jtaylor@email.com', phone: '+1 (555) 678-9012', address: { street: '321 Maple Lane', city: 'Houston', state: 'TX', zipCode: '77001', country: 'USA' }, loyaltyPoints: 3100, loyaltyTier: 'gold', storeCredit: 35.00, totalSpent: 2150.00, orderCount: 55, notes: 'Birthday in March', taxExempt: false, tags: ['vip', 'birthday-march'], createdAt: new Date('2023-05-12'), lastVisit: new Date() },
  { id: '7', firstName: 'Robert', lastName: 'Martinez', email: 'rmartinez@email.com', phone: '+1 (555) 789-0123', loyaltyPoints: 150, loyaltyTier: 'bronze', storeCredit: 0, totalSpent: 120.50, orderCount: 3, taxExempt: false, tags: ['new'], createdAt: new Date('2024-03-01'), lastVisit: new Date() },
  { id: '8', firstName: 'Lisa', lastName: 'Garcia', email: 'lgarcia@email.com', phone: '+1 (555) 890-1234', address: { street: '654 Cedar Court', city: 'Phoenix', state: 'AZ', zipCode: '85001', country: 'USA' }, loyaltyPoints: 1800, loyaltyTier: 'gold', storeCredit: 20.00, totalSpent: 1420.00, orderCount: 38, taxExempt: true, tags: ['tax-exempt', 'business'], createdAt: new Date('2023-07-22'), lastVisit: new Date() },
  { id: '9', firstName: 'James', lastName: 'Rodriguez', email: 'jrodriguez@email.com', phone: '+1 (555) 901-2345', loyaltyPoints: 620, loyaltyTier: 'bronze', storeCredit: 5.00, totalSpent: 480.25, orderCount: 12, taxExempt: false, tags: [], createdAt: new Date('2023-11-08'), lastVisit: new Date() },
  { id: '10', firstName: 'Amanda', lastName: 'Lee', email: 'alee@email.com', phone: '+1 (555) 012-3456', address: { street: '987 Birch Street', city: 'Philadelphia', state: 'PA', zipCode: '19101', country: 'USA' }, loyaltyPoints: 4500, loyaltyTier: 'platinum', storeCredit: 75.00, totalSpent: 2980.50, orderCount: 65, notes: 'Prefers email receipts', taxExempt: false, tags: ['vip', 'platinum', 'email-receipt'], createdAt: new Date('2023-04-18'), lastVisit: new Date() },
];

export const discounts: Discount[] = [
  { id: '1', name: 'New Customer', code: 'WELCOME10', type: 'percentage', value: 10, minOrderAmount: 20, isActive: true, usageLimit: 1, usageCount: 0, startDate: new Date() },
  { id: '2', name: 'Summer Sale', code: 'SUMMER20', type: 'percentage', value: 20, minOrderAmount: 50, maxDiscount: 30, isActive: true, usageLimit: 100, usageCount: 45, startDate: new Date(), endDate: new Date('2024-08-31') },
  { id: '3', name: 'Flat $5 Off', code: 'SAVE5', type: 'fixed', value: 5, minOrderAmount: 25, isActive: true, usageCount: 0, startDate: new Date() },
  { id: '4', name: 'VIP Discount', type: 'percentage', value: 15, isActive: true, usageCount: 0, startDate: new Date() },
  { id: '5', name: 'Employee Discount', code: 'STAFF25', type: 'percentage', value: 25, isActive: true, usageCount: 0, startDate: new Date() },
  { id: '6', name: 'Senior Citizen', type: 'percentage', value: 10, isActive: true, usageCount: 0, startDate: new Date() },
  { id: '7', name: 'Happy Hour', type: 'percentage', value: 15, applicableCategories: ['drinks'], isActive: true, usageCount: 0, startDate: new Date() },
  { id: '8', name: 'Bundle Deal', code: 'BUNDLE15', type: 'percentage', value: 15, minOrderAmount: 100, isActive: true, usageCount: 0, startDate: new Date() },
];

export const giftCards: GiftCard[] = [
  { id: '1', code: 'GC-1234-5678', balance: 50.00, originalAmount: 50.00, isActive: true, createdAt: new Date('2024-01-15') },
  { id: '2', code: 'GC-2345-6789', balance: 25.00, originalAmount: 100.00, isActive: true, customerId: '2', createdAt: new Date('2024-02-01') },
  { id: '3', code: 'GC-3456-7890', balance: 75.00, originalAmount: 75.00, isActive: true, expiryDate: new Date('2025-01-01'), createdAt: new Date('2024-03-01') },
  { id: '4', code: 'GC-4567-8901', balance: 0.00, originalAmount: 50.00, isActive: false, createdAt: new Date('2023-12-01') },
  { id: '5', code: 'GC-5678-9012', balance: 150.00, originalAmount: 150.00, isActive: true, createdAt: new Date('2024-03-10') },
];

export const heldOrders: HeldOrder[] = [];
