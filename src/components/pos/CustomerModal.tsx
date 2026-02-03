import { useState } from 'react';
import { useApp, useCart } from '../../context/AppContext';
import { Customer } from '../../types';

interface CustomerModalProps {
  onClose: () => void;
}

export function CustomerModal({ onClose }: CustomerModalProps) {
  const { state, dispatch } = useApp();
  const { customer: selectedCustomer, setCustomer } = useCart();
  const { customers, storeSettings } = state;

  const [search, setSearch] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const filteredCustomers = customers.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNew = () => {
    if (newCustomer.firstName && newCustomer.phone) {
      const customer: Customer = {
        id: `cust-${Date.now()}`,
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        email: newCustomer.email,
        phone: newCustomer.phone,
        loyaltyPoints: 0,
        loyaltyTier: 'bronze',
        storeCredit: 0,
        totalSpent: 0,
        orderCount: 0,
        notes: newCustomer.notes,
        taxExempt: false,
        tags: ['new'],
        createdAt: new Date(),
      };
      dispatch({ type: 'ADD_CUSTOMER', payload: customer });
      setCustomer(customer);
      onClose();
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setCustomer(customer);
    onClose();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'gold': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'silver': return 'bg-gray-200 text-gray-700 border-gray-400';
      default: return 'bg-orange-100 text-orange-700 border-orange-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Select Customer</h2>
              <p className="text-indigo-200">
                {storeSettings.loyaltyPointsPerCurrency} point per ${storeSettings.currencySymbol}1 spent
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {!showNewForm ? (
          <>
            {/* Search */}
            <div className="p-4 border-b bg-gray-50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Customer List */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Remove Customer Option */}
              {selectedCustomer && (
                <button
                  onClick={() => {
                    setCustomer(null);
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl mb-3 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚫</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-red-700">Remove Customer</p>
                    <p className="text-sm text-red-500">Continue as guest checkout</p>
                  </div>
                </button>
              )}

              {/* Customer Cards */}
              {filteredCustomers.map((customer) => {
                const isSelected = selectedCustomer?.id === customer.id;
                
                return (
                  <button
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl mb-3 transition-all border ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {customer.firstName[0]}{customer.lastName[0]}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800">{customer.firstName} {customer.lastName}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getTierColor(customer.loyaltyTier)}`}>
                          {customer.loyaltyTier}
                        </span>
                        {customer.tags.includes('vip') && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">VIP</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                      <p className="text-xs text-gray-400">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-xl">⭐</span>
                        <span className="font-bold text-indigo-600">{customer.loyaltyPoints.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-500">points</p>
                      {customer.storeCredit > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          ${customer.storeCredit.toFixed(2)} credit
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredCustomers.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <span className="text-5xl block mb-3">🔍</span>
                  <p className="font-medium">No customers found</p>
                  <p className="text-sm mt-1">Try a different search or add a new customer</p>
                </div>
              )}
            </div>

            {/* Add New Customer Button */}
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowNewForm(true)}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span className="text-lg">➕</span>
                Add New Customer
              </button>
            </div>
          </>
        ) : (
          /* New Customer Form */
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={newCustomer.firstName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newCustomer.lastName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="john.doe@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Any special notes about this customer..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewForm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleAddNew}
                disabled={!newCustomer.firstName || !newCustomer.phone}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Add Customer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
