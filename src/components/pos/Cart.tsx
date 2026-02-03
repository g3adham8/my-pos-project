import { useState } from 'react';
import { useApp, useCart } from '../../context/AppContext';
import { HeldOrder } from '../../types';

interface CartProps {
  onCheckout: () => void;
  onOpenCustomer: () => void;
}

export function Cart({ onCheckout, onOpenCustomer }: CartProps) {
  const { state, dispatch } = useApp();
  const { items, subtotal, totalDiscount, taxAmount, total, itemCount, customer, updateItem, removeItem, clearCart } = useCart();
  const { heldOrders } = state;
  const [showHeldOrders, setShowHeldOrders] = useState(false);
  const [holdName, setHoldName] = useState('');
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemNote, setItemNote] = useState('');
  const [itemDiscount, setItemDiscount] = useState('');

  const handleHoldOrder = () => {
    if (items.length === 0) return;
    
    const heldOrder: HeldOrder = {
      id: `hold-${Date.now()}`,
      name: holdName || `Order #${Date.now().toString().slice(-4)}`,
      items: [...items],
      customer,
      discount: totalDiscount,
      createdAt: new Date(),
    };
    
    dispatch({ type: 'HOLD_ORDER', payload: heldOrder });
    setShowHoldModal(false);
    setHoldName('');
  };

  const handleRetrieveOrder = (orderId: string) => {
    if (items.length > 0) {
      if (!confirm('Current cart will be replaced. Continue?')) return;
    }
    dispatch({ type: 'RETRIEVE_HELD_ORDER', payload: orderId });
    setShowHeldOrders(false);
  };

  const handleApplyItemDiscount = (itemId: string) => {
    const discountValue = parseFloat(itemDiscount);
    if (!isNaN(discountValue) && discountValue >= 0) {
      updateItem(itemId, { 
        discount: discountValue, 
        discountType: 'percentage',
        note: itemNote || undefined 
      });
    }
    setEditingItemId(null);
    setItemDiscount('');
    setItemNote('');
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🛒</span> Current Order
            {itemCount > 0 && (
              <span className="bg-white/20 text-sm px-2 py-0.5 rounded-full">
                {itemCount} items
              </span>
            )}
          </h2>
          <div className="flex gap-2">
            {items.length > 0 && (
              <>
                <button
                  onClick={() => setShowHoldModal(true)}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  title="Hold Order"
                >
                  ⏸️
                </button>
                <button
                  onClick={clearCart}
                  className="p-2 bg-red-500/50 rounded-lg hover:bg-red-500/70 transition-colors"
                  title="Clear Cart"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Customer Selection */}
        <button
          onClick={onOpenCustomer}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/20"
        >
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl">{customer ? '👤' : '➕'}</span>
          </div>
          <div className="text-left flex-1">
            {customer ? (
              <>
                <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                <div className="flex items-center gap-2 text-xs text-indigo-200">
                  <span className={`px-1.5 py-0.5 rounded capitalize ${
                    customer.loyaltyTier === 'platinum' ? 'bg-purple-500' :
                    customer.loyaltyTier === 'gold' ? 'bg-amber-500' :
                    customer.loyaltyTier === 'silver' ? 'bg-gray-400' : 'bg-orange-600'
                  }`}>{customer.loyaltyTier}</span>
                  <span>•</span>
                  <span>{customer.loyaltyPoints} pts</span>
                  {customer.storeCredit > 0 && (
                    <>
                      <span>•</span>
                      <span>${customer.storeCredit.toFixed(2)} credit</span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="font-medium">Add Customer</p>
                <p className="text-xs text-indigo-200">Optional • Earn loyalty points</p>
              </>
            )}
          </div>
          <span className="text-indigo-200">›</span>
        </button>
      </div>

      {/* Held Orders Toggle */}
      {heldOrders.length > 0 && (
        <button
          onClick={() => setShowHeldOrders(!showHeldOrders)}
          className="mx-4 mt-3 flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 hover:bg-amber-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>⏸️</span>
            <span className="font-medium">{heldOrders.length} Held Orders</span>
          </span>
          <span>{showHeldOrders ? '▲' : '▼'}</span>
        </button>
      )}

      {/* Held Orders List */}
      {showHeldOrders && heldOrders.length > 0 && (
        <div className="mx-4 mt-2 p-3 bg-amber-50 rounded-xl border border-amber-200 max-h-40 overflow-y-auto">
          {heldOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b border-amber-200 last:border-0">
              <div>
                <p className="font-medium text-gray-800">{order.name}</p>
                <p className="text-xs text-gray-500">{order.items.length} items • {order.createdAt.toLocaleTimeString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRetrieveOrder(order.id)}
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                >
                  Retrieve
                </button>
                <button
                  onClick={() => dispatch({ type: 'DELETE_HELD_ORDER', payload: order.id })}
                  className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-6xl mb-3">🛒</span>
            <p className="font-medium text-lg">Cart is empty</p>
            <p className="text-sm mt-1">Scan or click products to add</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-gray-50 rounded-xl p-3 border transition-all ${
                  editingItemId === item.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{item.product.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{item.product.name}</p>
                    <p className="text-indigo-600 font-bold">
                      ${item.unitPrice.toFixed(2)}
                      {item.discount > 0 && (
                        <span className="text-green-600 text-xs ml-2">
                          -{item.discount}{item.discountType === 'percentage' ? '%' : '$'}
                        </span>
                      )}
                    </p>
                    {item.note && (
                      <p className="text-xs text-gray-500 mt-1">📝 {item.note}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      ${((item.unitPrice * item.quantity) - (item.discountType === 'percentage' 
                        ? (item.unitPrice * item.quantity * item.discount / 100)
                        : item.discount)).toFixed(2)}
                    </p>
                    {item.tax > 0 && (
                      <p className="text-xs text-gray-400">+${item.tax.toFixed(2)} tax</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) {
                          removeItem(item.id);
                        } else {
                          updateItem(item.id, { quantity: item.quantity - 1 });
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 1;
                        if (qty > 0 && qty <= item.product.stock) {
                          updateItem(item.id, { quantity: qty });
                        }
                      }}
                      className="w-12 text-center font-bold border border-gray-200 rounded-lg py-1"
                    />
                    <button
                      onClick={() => {
                        if (item.quantity < item.product.stock) {
                          updateItem(item.id, { quantity: item.quantity + 1 });
                        }
                      }}
                      disabled={item.quantity >= item.product.stock}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 font-bold disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingItemId(editingItemId === item.id ? null : item.id);
                        setItemDiscount(item.discount.toString());
                        setItemNote(item.note || '');
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      title="Edit Item"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Remove Item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Item Edit Panel */}
                {editingItemId === item.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={itemDiscount}
                        onChange={(e) => setItemDiscount(e.target.value)}
                        placeholder="Discount %"
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={itemNote}
                        onChange={(e) => setItemNote(e.target.value)}
                        placeholder="Add note..."
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplyItemDiscount(item.id)}
                        className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => setEditingItemId(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="p-4 border-t bg-gray-50">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({itemCount} items)</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-${totalDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold pt-3 border-t border-gray-200">
            <span>Total</span>
            <span className="text-indigo-600">${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-emerald-700 active:scale-[0.98]"
        >
          💳 Pay ${total.toFixed(2)}
        </button>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={() => setShowHoldModal(true)}
            disabled={items.length === 0}
            className="py-2 px-3 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⏸️ Hold
          </button>
          <button
            disabled={items.length === 0}
            className="py-2 px-3 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🏷️ Discount
          </button>
          <button
            disabled={items.length === 0}
            className="py-2 px-3 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📝 Note
          </button>
        </div>
      </div>

      {/* Hold Order Modal */}
      {showHoldModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Hold Order</h3>
            <input
              type="text"
              value={holdName}
              onChange={(e) => setHoldName(e.target.value)}
              placeholder="Order name (optional)"
              className="w-full px-4 py-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowHoldModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleHoldOrder}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
              >
                Hold Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
