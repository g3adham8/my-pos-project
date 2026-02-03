import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function Header() {
  const { state, dispatch } = useApp();
  const { currentView, searchTerm, notifications, storeSettings, currentSession, heldOrders } = state;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read);

  const getViewTitle = () => {
    const titles: Record<string, string> = {
      pos: 'Point of Sale',
      orders: 'Order Management',
      customers: 'Customer Management',
      products: 'Product Catalog',
      inventory: 'Inventory Control',
      reports: 'Reports & Analytics',
      settings: 'Settings',
      dashboard: 'Dashboard',
      employees: 'Employee Management',
    };
    return titles[currentView] || 'QuickPOS';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{getViewTitle()}</h2>
          <p className="text-xs text-gray-500">
            {storeSettings.name} • Station #1
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar - Only show in POS view */}
        {currentView === 'pos' && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search products or scan barcode..."
              value={searchTerm}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              className="w-80 px-4 py-2 pl-10 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Held Orders Badge */}
        {heldOrders.length > 0 && (
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'pos' })}
            className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
          >
            <span>⏸️</span>
            <span className="font-medium">{heldOrders.length} Held</span>
          </button>
        )}

        {/* Session Status */}
        {currentSession && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Session Active</span>
          </div>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-xl">🔔</span>
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-bold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <span className="text-4xl block mb-2">🔔</span>
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}
                      onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: notif.id })}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">
                          {notif.type === 'success' && '✅'}
                          {notif.type === 'error' && '❌'}
                          {notif.type === 'warning' && '⚠️'}
                          {notif.type === 'info' && 'ℹ️'}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{notif.title}</p>
                          <p className="text-sm text-gray-500">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notif.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Date & Time */}
        <div className="text-right border-l border-gray-200 pl-4">
          <p className="text-sm font-medium text-gray-800">
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
          <p className="text-lg font-bold text-indigo-600">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          }}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Toggle Fullscreen"
        >
          <span className="text-xl">⛶</span>
        </button>
      </div>
    </header>
  );
}
