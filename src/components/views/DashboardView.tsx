import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';

export function DashboardView() {
  const { state } = useApp();
  const { orders, products, customers, storeSettings } = state;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay.getTime() - startOfDay.getDay() * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayOrders = orders.filter(o => o.createdAt >= startOfDay && o.status === 'completed');
  const weekOrders = orders.filter(o => o.createdAt >= startOfWeek && o.status === 'completed');
  const monthOrders = orders.filter(o => o.createdAt >= startOfMonth && o.status === 'completed');

  const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const weekSales = weekOrders.reduce((sum, o) => sum + o.total, 0);
  // monthSales available for future use
  void monthOrders;
  const todayItems = todayOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  const avgOrderValue = todayOrders.length > 0 ? todaySales / todayOrders.length : 0;

  // Payment breakdown
  const paymentBreakdown: Record<PaymentMethod, { count: number; amount: number }> = {
    cash: { count: 0, amount: 0 },
    card: { count: 0, amount: 0 },
    mobile: { count: 0, amount: 0 },
    bank_transfer: { count: 0, amount: 0 },
    gift_card: { count: 0, amount: 0 },
    store_credit: { count: 0, amount: 0 },
    split: { count: 0, amount: 0 },
  };

  todayOrders.forEach(order => {
    order.payments.forEach(payment => {
      paymentBreakdown[payment.method].count++;
      paymentBreakdown[payment.method].amount += payment.amount;
    });
  });

  // Top products
  const productSales: Record<string, { product: typeof products[0]; quantity: number; revenue: number }> = {};
  todayOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.product.id]) {
        productSales[item.product.id] = { product: item.product, quantity: 0, revenue: 0 };
      }
      productSales[item.product.id].quantity += item.quantity;
      productSales[item.product.id].revenue += item.unitPrice * item.quantity;
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  // Hourly sales
  const hourlySales: { hour: number; sales: number; orders: number }[] = [];
  for (let h = 0; h < 24; h++) {
    const hourOrders = todayOrders.filter(o => o.createdAt.getHours() === h);
    hourlySales.push({
      hour: h,
      sales: hourOrders.reduce((sum, o) => sum + o.total, 0),
      orders: hourOrders.length,
    });
  }
  const maxHourlySales = Math.max(...hourlySales.map(h => h.sales), 1);

  // Low stock alerts
  const lowStockProducts = products.filter(p => p.stock <= p.minStock && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Recent orders
  const recentOrders = orders.slice(0, 10);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500">{storeSettings.name} • {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-50">
            📅 Today
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            📥 Export Report
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Today's Sales</p>
              <p className="text-4xl font-bold mt-2">${todaySales.toFixed(2)}</p>
              <p className="text-indigo-200 text-sm mt-2">Week: ${weekSales.toFixed(2)}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Orders Today</p>
              <p className="text-4xl font-bold mt-2">{todayOrders.length}</p>
              <p className="text-emerald-200 text-sm mt-2">{todayItems} items sold</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Avg. Order Value</p>
              <p className="text-4xl font-bold mt-2">${avgOrderValue.toFixed(2)}</p>
              <p className="text-orange-200 text-sm mt-2">Per transaction</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium">Active Customers</p>
              <p className="text-4xl font-bold mt-2">{customers.length}</p>
              <p className="text-pink-200 text-sm mt-2">{customers.filter(c => c.loyaltyTier === 'platinum' || c.loyaltyTier === 'gold').length} VIP members</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Hourly Sales Chart */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Hourly Sales</h3>
          <div className="flex items-end gap-1 h-48">
            {hourlySales.map((hour) => (
              <div key={hour.hour} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-sm transition-all hover:from-indigo-600 hover:to-purple-600"
                  style={{ height: `${(hour.sales / maxHourlySales) * 100}%`, minHeight: hour.sales > 0 ? '4px' : '0' }}
                  title={`$${hour.sales.toFixed(2)} (${hour.orders} orders)`}
                />
                <span className="text-xs text-gray-400 mt-2">
                  {hour.hour === 0 ? '12a' : hour.hour < 12 ? `${hour.hour}a` : hour.hour === 12 ? '12p' : `${hour.hour - 12}p`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {Object.entries(paymentBreakdown)
              .filter(([_, data]) => data.count > 0)
              .map(([method, data]) => {
                const percentage = todaySales > 0 ? (data.amount / todaySales) * 100 : 0;
                const icons: Record<string, string> = {
                  cash: '💵', card: '💳', mobile: '📱', bank_transfer: '🏦',
                  gift_card: '🎁', store_credit: '💰', split: '✂️'
                };
                return (
                  <div key={method}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-2 text-sm text-gray-700 capitalize">
                        <span>{icons[method]}</span>
                        {method.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-medium">${data.amount.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            {Object.values(paymentBreakdown).every(d => d.count === 0) && (
              <p className="text-center text-gray-400 py-8">No payments today</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <span className="text-4xl block mb-2">📦</span>
              <p>No sales data yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topProducts.map((item, index) => (
                <div key={item.product.id} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="relative inline-block mb-2">
                    <span className="text-4xl">{item.product.image}</span>
                    {index === 0 && (
                      <span className="absolute -top-2 -right-2 text-xl">🏆</span>
                    )}
                  </div>
                  <p className="font-medium text-gray-800 text-sm truncate">{item.product.name}</p>
                  <p className="text-indigo-600 font-bold">${item.revenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{item.quantity} sold</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Stock Alerts</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {outOfStockProducts.map(product => (
              <div key={product.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                <span className="text-2xl">{product.image}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                  <p className="text-xs text-red-600 font-medium">Out of Stock</p>
                </div>
              </div>
            ))}
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-2xl">{product.image}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                  <p className="text-xs text-amber-600">Only {product.stock} left</p>
                </div>
              </div>
            ))}
            {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <span className="text-4xl block mb-2">✅</span>
                <p>All products in stock</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
          <button className="text-indigo-600 text-sm font-medium hover:underline">View All →</button>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <span className="text-4xl block mb-2">📋</span>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Payment</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium text-indigo-600">#{order.orderNumber.slice(-8)}</td>
                    <td className="py-3">
                      {order.customer 
                        ? `${order.customer.firstName} ${order.customer.lastName}` 
                        : <span className="text-gray-400">Guest</span>
                      }
                    </td>
                    <td className="py-3">
                      <div className="flex -space-x-1">
                        {order.items.slice(0, 3).map((item, i) => (
                          <span key={i} className="text-lg">{item.product.image}</span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-xs text-gray-500 ml-2">+{order.items.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 font-bold">${order.total.toFixed(2)}</td>
                    <td className="py-3">
                      {order.payments.map((p, i) => (
                        <span key={i} className="text-lg" title={p.method}>
                          {p.method === 'cash' && '💵'}
                          {p.method === 'card' && '💳'}
                          {p.method === 'mobile' && '📱'}
                        </span>
                      ))}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'refunded' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-sm">
                      {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
