import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CategoryBar } from './components/pos/CategoryBar';
import { ProductGrid } from './components/pos/ProductGrid';
import { Cart } from './components/pos/Cart';
import { PaymentModal } from './components/pos/PaymentModal';
import { CustomerModal } from './components/pos/CustomerModal';
import { OrdersView } from './components/views/OrdersView';
import { CustomersView } from './components/views/CustomersView';
import { DashboardView } from './components/views/DashboardView';
import { ProductsView } from './components/views/ProductsView';
import { SettingsView } from './components/views/SettingsView';

function POSScreen() {
  const [showPayment, setShowPayment] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main POS Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <CategoryBar />
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <ProductGrid />
        </div>
      </div>

      {/* Cart Sidebar */}
      <Cart 
        onCheckout={() => setShowPayment(true)} 
        onOpenCustomer={() => setShowCustomer(true)}
      />

      {/* Modals */}
      {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
      {showCustomer && <CustomerModal onClose={() => setShowCustomer(false)} />}
    </div>
  );
}

function MainContent() {
  const { state } = useApp();
  const { currentView } = state;

  return (
    <>
      {currentView === 'pos' && <POSScreen />}
      {currentView === 'orders' && <OrdersView />}
      {currentView === 'customers' && <CustomersView />}
      {currentView === 'products' && <ProductsView />}
      {currentView === 'inventory' && <ProductsView />}
      {currentView === 'reports' && <DashboardView />}
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'settings' && <SettingsView />}
      {currentView === 'employees' && (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <span className="text-7xl block mb-4">👨‍💼</span>
            <h2 className="text-2xl font-bold text-gray-700">Employee Management</h2>
            <p className="text-gray-500 mt-2">Coming soon...</p>
          </div>
        </div>
      )}
    </>
  );
}

function AppLayout() {
  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
