import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export function SettingsView() {
  const { state } = useApp();
  const { storeSettings, currentUser, currentSession } = state;
  const [activeTab, setActiveTab] = useState('store');

  const tabs = [
    { id: 'store', label: 'Store Information', icon: '🏪' },
    { id: 'pos', label: 'POS Settings', icon: '🛒' },
    { id: 'receipt', label: 'Receipt', icon: '🧾' },
    { id: 'tax', label: 'Tax Settings', icon: '📊' },
    { id: 'loyalty', label: 'Loyalty Program', icon: '⭐' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Settings Sidebar */}
      <div className="w-64 bg-white border-r p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Settings</h3>
        <nav className="space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {activeTab === 'store' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Information</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl">
                  🏪
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{storeSettings.name}</h3>
                  <p className="text-gray-500">{storeSettings.email}</p>
                  <button className="mt-2 text-indigo-600 text-sm font-medium hover:underline">
                    Change Logo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    defaultValue={storeSettings.name}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    defaultValue={storeSettings.phone}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={storeSettings.email}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  defaultValue={storeSettings.website}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  defaultValue={storeSettings.address.street}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    defaultValue={storeSettings.address.city}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    defaultValue={storeSettings.address.state}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    defaultValue={storeSettings.address.zipCode}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    defaultValue={storeSettings.currency}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    defaultValue={storeSettings.currencySymbol}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tax' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tax Settings</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Tax Inclusive Pricing</h4>
                  <p className="text-sm text-gray-500">Include tax in product prices</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={storeSettings.taxInclusive} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={storeSettings.taxRate}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">Tax Categories</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Standard Rate</span>
                    <span className="font-medium">{storeSettings.taxRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Reduced Rate (Food)</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Zero Rate (Exempt)</span>
                    <span className="font-medium">0%</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'loyalty' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Loyalty Program</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-800">Enable Loyalty Program</h4>
                  <p className="text-sm text-gray-500">Allow customers to earn and redeem points</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points per $1 Spent</label>
                  <input
                    type="number"
                    defaultValue={storeSettings.loyaltyPointsPerCurrency}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Point Value ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={storeSettings.loyaltyRedemptionRate}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">Loyalty Tiers</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <span className="text-2xl">🥉</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Bronze</p>
                      <p className="text-sm text-gray-500">0 - 999 points</p>
                    </div>
                    <span className="text-gray-600">1x points</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl border border-gray-300">
                    <span className="text-2xl">🥈</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Silver</p>
                      <p className="text-sm text-gray-500">1,000 - 2,499 points</p>
                    </div>
                    <span className="text-gray-600">1.25x points</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-2xl">🥇</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Gold</p>
                      <p className="text-sm text-gray-500">2,500 - 4,999 points</p>
                    </div>
                    <span className="text-gray-600">1.5x points</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <span className="text-2xl">💎</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Platinum</p>
                      <p className="text-sm text-gray-500">5,000+ points</p>
                    </div>
                    <span className="text-gray-600">2x points</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'receipt' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Receipt Settings</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Header</label>
                <textarea
                  defaultValue={storeSettings.receiptHeader}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Footer</label>
                <textarea
                  defaultValue={storeSettings.receiptFooter}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Print receipt automatically</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Show barcode on receipt</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Email receipt to customer</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'pos' || activeTab === 'users' || activeTab === 'integrations') && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
              <span className="text-6xl block mb-4">🚧</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Coming Soon</h3>
              <p className="text-gray-500">This feature is under development</p>
            </div>
          </div>
        )}

        {/* Session Info */}
        <div className="max-w-2xl mt-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Current Session</h2>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">User</p>
                <p className="font-medium">{currentUser?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize">{currentUser?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Session Started</p>
                <p className="font-medium">{currentSession?.startTime.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
