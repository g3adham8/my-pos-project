import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, PaymentMethod } from '../../types';

export function OrdersView() {
  const { state, dispatch } = useApp();
  const { orders } = state;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  const filterOrders = () => {
    let filtered = [...orders];

    // Date filter
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay.getTime() - startOfDay.getDay() * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(o => o.createdAt >= startOfDay);
        break;
      case 'week':
        filtered = filtered.filter(o => o.createdAt >= startOfWeek);
        break;
      case 'month':
        filtered = filtered.filter(o => o.createdAt >= startOfMonth);
        break;
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    // Search filter
    if (search) {
      filtered = filtered.filter(o => 
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customer?.firstName.toLowerCase().includes(search.toLowerCase()) ||
        o.customer?.lastName.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredOrders = filterOrders();

  const getStatusBadge = (status: Order['status']) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      refunded: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
      held: 'bg-amber-100 text-amber-700',
      draft: 'bg-blue-100 text-blue-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    const icons: Record<PaymentMethod, string> = {
      cash: '💵',
      card: '💳',
      mobile: '📱',
      bank_transfer: '🏦',
      gift_card: '🎁',
      store_credit: '💰',
      split: '✂️',
    };
    return icons[method] || '💳';
  };

  const handleRefund = () => {
    if (!selectedOrder || !refundReason) return;
    dispatch({ 
      type: 'REFUND_ORDER', 
      payload: { orderId: selectedOrder.id, reason: refundReason } 
    });
    setShowRefundModal(false);
    setRefundReason('');
    setSelectedOrder(null);
  };

  const stats = {
    total: filteredOrders.length,
    completed: filteredOrders.filter(o => o.status === 'completed').length,
    refunded: filteredOrders.filter(o => o.status === 'refunded').length,
    revenue: filteredOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
            <p className="text-gray-500">{stats.total} orders • ${stats.revenue.toFixed(2)} revenue</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
              <span>📥</span> Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-indigo-100 text-sm">Total Orders</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
            <p className="text-green-100 text-sm">Completed</p>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white">
            <p className="text-red-100 text-sm">Refunded</p>
            <p className="text-2xl font-bold">{stats.refunded}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
            <p className="text-amber-100 text-sm">Revenue</p>
            <p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-7xl mb-4">📋</span>
            <p className="text-xl font-medium">No orders found</p>
            <p className="text-sm mt-1">Orders will appear here after checkout</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-xl shadow-sm border p-6 cursor-pointer transition-all hover:shadow-md ${
                  selectedOrder?.id === order.id ? 'ring-2 ring-indigo-500' : ''
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-800">#{order.orderNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.createdAt.toLocaleString()} • Cashier: {order.cashier.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">${order.total.toFixed(2)}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {order.payments.map((p, i) => (
                        <span key={i} className="text-lg" title={p.method}>
                          {getPaymentIcon(p.method)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {order.customer && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-lg">👤</span>
                    <span>{order.customer.firstName} {order.customer.lastName}</span>
                    <span className="text-indigo-600">•</span>
                    <span className="text-indigo-600">+{Math.floor(order.total)} pts earned</span>
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  {order.items.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-xl">{item.product.image}</span>
                      <span className="text-sm font-medium">{item.product.name}</span>
                      <span className="text-sm text-gray-500">×{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 5 && (
                    <span className="text-sm text-gray-500">+{order.items.length - 5} more</span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
                    {order.totalDiscount > 0 && (
                      <span className="text-green-600">Discount: -${order.totalDiscount.toFixed(2)}</span>
                    )}
                    <span>Tax: ${order.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                      onClick={(e) => { e.stopPropagation(); window.print(); }}
                    >
                      🖨️ Print
                    </button>
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                      📧 Email
                    </button>
                    {order.status === 'completed' && (
                      <button 
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setShowRefundModal(true); }}
                      >
                        ↩️ Refund
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Refund Order</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to refund order #{selectedOrder.orderNumber} for ${selectedOrder.total.toFixed(2)}?
            </p>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Reason for refund..."
              className="w-full px-4 py-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowRefundModal(false); setRefundReason(''); }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={!refundReason}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
