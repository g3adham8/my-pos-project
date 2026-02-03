import { useState } from 'react';
import { useApp, useCart } from '../../context/AppContext';
import { Order, Payment, PaymentMethod } from '../../types';

interface PaymentModalProps {
  onClose: () => void;
}

export function PaymentModal({ onClose }: PaymentModalProps) {
  const { state, dispatch } = useApp();
  const { items, subtotal, totalDiscount, taxAmount, total, customer } = useCart();
  const { currentUser, currentSession, storeSettings } = state;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [splitPayments, setSplitPayments] = useState<Payment[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [tip, setTip] = useState(0);
  const [cardLast4, setCardLast4] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');

  const paidAmount = parseFloat(amountPaid) || 0;
  const totalWithTip = total + tip;
  const splitTotal = splitPayments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = totalWithTip - splitTotal;
  const change = paymentMethod === 'cash' ? paidAmount - remainingAmount : 0;

  const quickAmounts = [20, 50, 100, Math.ceil(totalWithTip / 10) * 10, Math.ceil(totalWithTip)];
  const tipOptions = [0, 10, 15, 20, 25];

  const paymentMethods: { id: PaymentMethod; label: string; icon: string; color: string }[] = [
    { id: 'cash', label: 'Cash', icon: '💵', color: 'bg-green-500' },
    { id: 'card', label: 'Card', icon: '💳', color: 'bg-blue-500' },
    { id: 'mobile', label: 'Mobile Pay', icon: '📱', color: 'bg-purple-500' },
    { id: 'gift_card', label: 'Gift Card', icon: '🎁', color: 'bg-pink-500' },
    { id: 'store_credit', label: 'Store Credit', icon: '💰', color: 'bg-amber-500' },
    { id: 'split', label: 'Split Payment', icon: '✂️', color: 'bg-gray-500' },
  ];

  const handleAddSplitPayment = () => {
    if (paidAmount <= 0 || paidAmount > remainingAmount) return;

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      method: paymentMethod === 'split' ? 'cash' : paymentMethod,
      amount: paidAmount,
      timestamp: new Date(),
      cardLast4: paymentMethod === 'card' ? cardLast4 : undefined,
    };

    setSplitPayments([...splitPayments, payment]);
    setAmountPaid('');
    setCardLast4('');
  };

  const canComplete = () => {
    if (paymentMethod === 'split') {
      return remainingAmount <= 0;
    }
    if (paymentMethod === 'cash') {
      return paidAmount >= remainingAmount;
    }
    return true;
  };

  const handleComplete = () => {
    if (!canComplete() || !currentUser || !currentSession) return;

    let payments: Payment[] = [];

    if (paymentMethod === 'split') {
      payments = splitPayments;
    } else {
      payments = [{
        id: `pay-${Date.now()}`,
        method: paymentMethod,
        amount: paymentMethod === 'cash' ? paidAmount : totalWithTip,
        change: paymentMethod === 'cash' && change > 0 ? change : undefined,
        timestamp: new Date(),
        cardLast4: paymentMethod === 'card' ? cardLast4 : undefined,
      }];
    }

    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
      items: [...items],
      customer,
      subtotal,
      totalDiscount,
      taxAmount,
      total: totalWithTip,
      payments,
      status: 'completed',
      cashier: currentUser,
      sessionId: currentSession.id,
      createdAt: new Date(),
      completedAt: new Date(),
      receiptPrinted: false,
      emailSent: false,
    };

    setCompletedOrder(order);
    setShowReceipt(true);
  };

  const handleFinish = () => {
    if (completedOrder) {
      dispatch({ type: 'COMPLETE_ORDER', payload: completedOrder });
    }
    onClose();
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (showReceipt && completedOrder) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Success Header */}
          <div className="p-6 text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-2xl">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
            <p className="text-green-100 mt-1">Order #{completedOrder.orderNumber}</p>
          </div>

          {/* Receipt */}
          <div className="p-6 bg-gray-50 font-mono text-sm">
            <div className="text-center mb-4 pb-4 border-b border-dashed border-gray-300">
              <h3 className="font-bold text-lg">{storeSettings.name}</h3>
              <p className="text-xs text-gray-500">{storeSettings.address.street}</p>
              <p className="text-xs text-gray-500">{storeSettings.address.city}, {storeSettings.address.state} {storeSettings.address.zipCode}</p>
              <p className="text-xs text-gray-500 mt-1">Tel: {storeSettings.phone}</p>
              <p className="text-xs text-gray-400 mt-2">{completedOrder.completedAt?.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Cashier: {completedOrder.cashier.name}</p>
            </div>

            {customer && (
              <div className="mb-4 pb-4 border-b border-dashed border-gray-300">
                <p className="text-center">Customer: {customer.firstName} {customer.lastName}</p>
                <p className="text-center text-indigo-600 font-bold">
                  +{Math.floor(completedOrder.total * storeSettings.loyaltyPointsPerCurrency)} points earned!
                </p>
              </div>
            )}
            
            <div className="mb-4 pb-4 border-b border-dashed border-gray-300">
              {completedOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between mb-1">
                  <span className="flex-1">{item.quantity}x {item.product.name}</span>
                  <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 mb-4 pb-4 border-b border-dashed border-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${completedOrder.subtotal.toFixed(2)}</span>
              </div>
              {completedOrder.totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${completedOrder.totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${completedOrder.taxAmount.toFixed(2)}</span>
              </div>
              {tip > 0 && (
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>${tip.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>TOTAL</span>
                <span>${completedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-4 pb-4 border-b border-dashed border-gray-300">
              {completedOrder.payments.map((payment, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                  <span>${payment.amount.toFixed(2)}</span>
                </div>
              ))}
              {completedOrder.payments[0]?.change && completedOrder.payments[0].change > 0 && (
                <div className="flex justify-between font-bold text-green-600 mt-2">
                  <span>Change</span>
                  <span>${completedOrder.payments[0].change.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>{storeSettings.receiptHeader}</p>
              <p className="mt-2">{storeSettings.receiptFooter}</p>
              <div className="mt-4 flex justify-center">
                <div className="bg-gray-200 px-4 py-2 rounded">
                  {/* Barcode placeholder */}
                  <p className="font-mono">{completedOrder.orderNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 flex gap-3">
            <button
              onClick={handleFinish}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              New Order
            </button>
            <button
              onClick={handlePrintReceipt}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
            >
              🖨️
            </button>
            <button
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
            >
              📧
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">Payment</h2>
            <p className="text-indigo-200">{items.length} items • {customer ? `${customer.firstName} ${customer.lastName}` : 'Guest'}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Order Total</p>
                <p className="text-4xl font-bold text-indigo-600">${total.toFixed(2)}</p>
              </div>
              {tip > 0 && (
                <div className="text-right">
                  <p className="text-gray-500 text-sm">With Tip</p>
                  <p className="text-2xl font-bold text-green-600">${totalWithTip.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Tip Selection */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Add Tip</p>
              <div className="flex gap-2">
                {tipOptions.map((tipPercent) => (
                  <button
                    key={tipPercent}
                    onClick={() => setTip(tipPercent === 0 ? 0 : total * (tipPercent / 100))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      (tipPercent === 0 && tip === 0) || (tipPercent > 0 && Math.abs(tip - total * (tipPercent / 100)) < 0.01)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tipPercent === 0 ? 'No Tip' : `${tipPercent}%`}
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Custom"
                  className="w-20 px-2 py-2 text-center border rounded-lg text-sm"
                  onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Payment Method</p>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  disabled={method.id === 'store_credit' && (!customer || customer.storeCredit <= 0)}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === method.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="text-3xl">{method.icon}</span>
                  <span className="font-medium text-sm">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Split Payment Display */}
          {paymentMethod === 'split' && splitPayments.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <p className="font-medium text-gray-700 mb-3">Split Payments</p>
              {splitPayments.map((payment, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                  <span className="font-bold">${payment.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-dashed">
                <span className="font-bold text-lg">Remaining</span>
                <span className={`font-bold text-xl ${remainingAmount <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                  ${remainingAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Cash Amount Input */}
          {(paymentMethod === 'cash' || paymentMethod === 'split') && remainingAmount > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                {paymentMethod === 'split' ? 'Add Payment' : 'Amount Received'}
              </p>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="Enter amount..."
                className="w-full p-4 text-2xl font-bold text-center border-2 rounded-xl focus:outline-none focus:border-indigo-600 transition-colors"
              />
              <div className="grid grid-cols-5 gap-2 mt-3">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAmountPaid(amount.toString())}
                    className="py-2 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              {paymentMethod === 'cash' && paidAmount >= remainingAmount && (
                <div className="mt-4 p-4 bg-green-50 rounded-xl text-center border border-green-200">
                  <p className="text-sm text-green-600">Change Due</p>
                  <p className="text-3xl font-bold text-green-700">${change.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          {/* Card Input */}
          {paymentMethod === 'card' && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Card Details</p>
              <input
                type="text"
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Last 4 digits (optional)"
                maxLength={4}
                className="w-full p-4 text-center border-2 rounded-xl focus:outline-none focus:border-indigo-600"
              />
              <p className="text-center text-gray-500 text-sm mt-3">
                Please swipe, insert, or tap the card on the terminal
              </p>
            </div>
          )}

          {/* Gift Card Input */}
          {paymentMethod === 'gift_card' && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Gift Card Code</p>
              <input
                type="text"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                placeholder="Enter gift card code..."
                className="w-full p-4 text-center border-2 rounded-xl focus:outline-none focus:border-indigo-600 font-mono"
              />
            </div>
          )}

          {/* Store Credit Display */}
          {paymentMethod === 'store_credit' && customer && (
            <div className="mb-6 p-4 bg-amber-50 rounded-xl text-center border border-amber-200">
              <p className="text-sm text-amber-700">Available Store Credit</p>
              <p className="text-3xl font-bold text-amber-600">${customer.storeCredit.toFixed(2)}</p>
              {customer.storeCredit < totalWithTip && (
                <p className="text-sm text-amber-600 mt-2">
                  Additional payment of ${(totalWithTip - customer.storeCredit).toFixed(2)} required
                </p>
              )}
            </div>
          )}

          {/* Split Payment Add Button */}
          {paymentMethod === 'split' && remainingAmount > 0 && (
            <button
              onClick={handleAddSplitPayment}
              disabled={paidAmount <= 0 || paidAmount > remainingAmount}
              className="w-full mb-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Split Payment
            </button>
          )}

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={!canComplete()}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paymentMethod === 'cash' && paidAmount >= remainingAmount
              ? `Complete Payment • Change: $${change.toFixed(2)}`
              : `Complete Payment`}
          </button>

          {/* Keyboard Shortcuts */}
          <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
            <span>F1: Cash</span>
            <span>F2: Card</span>
            <span>F3: Mobile</span>
            <span>ESC: Cancel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
