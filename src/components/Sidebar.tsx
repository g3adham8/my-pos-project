import { useApp } from '../context/AppContext';
import { ViewType } from '../types';

const menuItems: { id: ViewType; label: string; icon: string; roles: string[] }[] = [
  { id: 'pos', label: 'Point of Sale', icon: '🛒', roles: ['admin', 'manager', 'cashier'] },
  { id: 'orders', label: 'Orders', icon: '📋', roles: ['admin', 'manager', 'cashier'] },
  { id: 'customers', label: 'Customers', icon: '👥', roles: ['admin', 'manager', 'cashier'] },
  { id: 'products', label: 'Products', icon: '📦', roles: ['admin', 'manager'] },
  { id: 'inventory', label: 'Inventory', icon: '📊', roles: ['admin', 'manager'] },
  { id: 'reports', label: 'Reports', icon: '📈', roles: ['admin', 'manager'] },
  { id: 'employees', label: 'Employees', icon: '👨‍💼', roles: ['admin'] },
  { id: 'settings', label: 'Settings', icon: '⚙️', roles: ['admin', 'manager'] },
];

export function Sidebar() {
  const { state, dispatch } = useApp();
  const { currentView, currentUser, currentSession, notifications } = state;

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredMenu = menuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <aside className="w-20 lg:w-64 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🛒</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-white font-bold text-xl">QuickPOS</h1>
            <p className="text-slate-400 text-xs">Enterprise Edition</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {currentUser && (
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xl">
              {currentUser.avatar || '👤'}
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-white font-medium truncate">{currentUser.name}</p>
              <p className="text-slate-400 text-xs capitalize">{currentUser.role}</p>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${currentSession?.status === 'open' ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {filteredMenu.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  currentView === item.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="hidden lg:block font-medium">{item.label}</span>
                {item.id === 'orders' && state.heldOrders.length > 0 && (
                  <span className="hidden lg:flex ml-auto bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {state.heldOrders.length}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Dashboard Quick Access */}
      <div className="p-2 border-t border-slate-700">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' as ViewType })}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
            currentView === 'dashboard'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <span className="text-xl">📊</span>
          <span className="hidden lg:block font-medium">Dashboard</span>
        </button>
      </div>

      {/* Notifications */}
      {unreadCount > 0 && (
        <div className="p-4 border-t border-slate-700">
          <div className="bg-amber-500/20 rounded-xl p-3 border border-amber-500/30">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔔</span>
              <div className="hidden lg:block">
                <p className="text-amber-200 text-sm font-medium">{unreadCount} Alerts</p>
                <p className="text-amber-300/60 text-xs">Needs attention</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Info */}
      {currentSession && (
        <div className="p-4 border-t border-slate-700">
          <div className="hidden lg:block text-center">
            <p className="text-slate-400 text-xs">Session Started</p>
            <p className="text-white text-sm font-medium">
              {currentSession.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            <span>🚪</span>
            <span className="hidden lg:block text-sm">End Session</span>
          </button>
        </div>
      )}
    </aside>
  );
}
