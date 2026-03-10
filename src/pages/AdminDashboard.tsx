import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { mockUrbanFishProducts, mockKitchenMenu, mockStores } from '@/lib/mock-data';
import {
  LayoutDashboard, Users, Package, UtensilsCrossed, Store, ShoppingBag, TrendingUp, Settings, LogOut
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'urban-fish', label: 'Urban Fish', icon: Package },
    { id: 'kitchen', label: 'Cloud Kitchen', icon: UtensilsCrossed },
    { id: 'stores', label: 'Stores', icon: Store },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-56 bg-sidebar text-sidebar-foreground flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <span className="font-display text-base font-bold">
            Urban<span className="text-buoy-orange">Fish</span>
          </span>
          <p className="text-[10px] text-sidebar-foreground/60 mt-0.5">Master Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-display font-medium rounded-sm transition-colors ${
                activeTab === tab.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-display hover:bg-sidebar-accent/50 rounded-sm">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="font-display text-xl font-bold mb-6">
          {tabs.find(t => t.id === activeTab)?.label}
        </h1>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="dashboard-card">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Total Users</p>
              <p className="font-display text-2xl font-bold mt-1">1,247</p>
            </div>
            <div className="dashboard-card">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Active Stores</p>
              <p className="font-display text-2xl font-bold mt-1">{mockStores.length}</p>
            </div>
            <div className="dashboard-card">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Products</p>
              <p className="font-display text-2xl font-bold mt-1">{mockUrbanFishProducts.length + mockKitchenMenu.length}</p>
            </div>
            <div className="dashboard-card">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Revenue</p>
              <p className="font-display text-2xl font-bold mt-1 text-buoy-orange">₹2,45,680</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="dashboard-card">
            <p className="text-sm text-muted-foreground">User management will be available with backend integration.</p>
          </div>
        )}

        {activeTab === 'urban-fish' && (
          <div>
            <button className="btn-cart text-sm mb-4">+ Add Product</button>
            <div className="space-y-2">
              {mockUrbanFishProducts.map(p => (
                <div key={p.id} className="dashboard-card flex items-center justify-between">
                  <div>
                    <span className="font-display text-sm font-semibold">{p.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{p.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm font-bold text-buoy-orange">₹{p.pricePerKg}/kg</span>
                    <span className="text-xs text-muted-foreground">Stock: {p.stock}</span>
                    {p.isCatchOfTheDay && <span className="tag-urgent text-[10px]">COTD</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'kitchen' && (
          <div>
            <button className="btn-cart text-sm mb-4">+ Add Menu Item</button>
            <div className="space-y-2">
              {mockKitchenMenu.map(item => (
                <div key={item.id} className="dashboard-card flex items-center justify-between">
                  <div>
                    <span className="font-display text-sm font-semibold">{item.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{item.category}</span>
                  </div>
                  <span className="font-display text-sm font-bold text-buoy-orange">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stores' && (
          <div className="space-y-2">
            {mockStores.map(store => (
              <div key={store.id} className="dashboard-card flex items-center justify-between">
                <div>
                  <span className="font-display text-sm font-semibold">{store.name}</span>
                  <span className={`ml-2 text-[10px] font-display font-medium px-1.5 py-0.5 rounded-sm ${store.isApproved ? 'bg-kelp-green/10 text-kelp-green' : 'bg-buoy-orange/10 text-buoy-orange'}`}>
                    {store.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Rating: {store.rating}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && <p className="text-sm text-muted-foreground">No orders to display.</p>}

        {activeTab === 'analytics' && (
          <div className="dashboard-card">
            <p className="text-sm text-muted-foreground">Analytics dashboard will be available with backend integration.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-md space-y-3">
            <div>
              <label className="text-xs text-muted-foreground font-display">Commission Rate (%)</label>
              <input className="input-field mt-1" type="number" defaultValue={10} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-display">Delivery Fee (₹)</label>
              <input className="input-field mt-1" type="number" defaultValue={0} />
            </div>
            <button className="btn-cart text-sm">Save Settings</button>
          </div>
        )}
      </main>
    </div>
  );
}
