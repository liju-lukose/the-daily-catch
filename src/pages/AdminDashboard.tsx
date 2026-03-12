import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { mockUrbanFishProducts, mockKitchenMenu, mockStores, mockOrders } from '@/lib/mock-data';
import { Order } from '@/lib/types';
import {
  LayoutDashboard, Users, Package, UtensilsCrossed, Store, ShoppingBag, TrendingUp, Settings, LogOut
} from 'lucide-react';

const ORDER_STATUSES: Order['status'][] = ['order_received', 'preparing', 'out_for_delivery', 'delivered'];

const statusLabel: Record<Order['status'], string> = {
  order_received: 'Order Received',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusColor: Record<Order['status'], string> = {
  order_received: 'bg-primary/10 text-primary',
  preparing: 'bg-yellow-100 text-yellow-700',
  out_for_delivery: 'bg-blue-100 text-blue-700',
  delivered: 'bg-accent/10 text-accent',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Sales calculations
  const today = new Date();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today.toDateString());
  const monthOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'urban-fish', label: 'Urban Fish', icon: Package },
    { id: 'kitchen', label: 'Cloud Kitchen', icon: UtensilsCrossed },
    { id: 'stores', label: 'Stores', icon: Store },
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
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-display font-medium rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-display hover:bg-sidebar-accent/50 rounded-lg">
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
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Total Users</p>
              <p className="font-display text-2xl font-bold mt-1">1,247</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Active Stores</p>
              <p className="font-display text-2xl font-bold mt-1">{mockStores.length}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Products</p>
              <p className="font-display text-2xl font-bold mt-1">{mockUrbanFishProducts.length + mockKitchenMenu.length}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Revenue</p>
              <p className="font-display text-2xl font-bold mt-1 text-primary">₹{orders.reduce((s, o) => s + o.total, 0).toLocaleString()}</p>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="font-display text-sm font-bold">{order.id}</span>
                    <span className="text-xs text-muted-foreground ml-2 font-body">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <span className={`text-xs font-display font-medium px-3 py-1 rounded-full ${statusColor[order.status]}`}>
                    {statusLabel[order.status]}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm font-body">
                  <div>
                    <span className="text-muted-foreground text-xs block">Customer</span>
                    <span className="font-semibold">{order.customerName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block">Items</span>
                    <span>{order.items.map(i => i.product.name).join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block">Total</span>
                    <span className="font-display font-bold text-primary">₹{order.total}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground font-body block mb-2">
                    📍 {order.deliveryAddress.line1}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ORDER_STATUSES.map(s => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(order.id, s)}
                        className={`text-xs font-display font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                          order.status === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                        }`}
                      >
                        {statusLabel[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Daily */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Daily Sales Report
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground font-display uppercase">Orders Today</p>
                    <p className="font-display text-3xl font-bold mt-1">{todayOrders.length}</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground font-display uppercase">Revenue Today</p>
                    <p className="font-display text-3xl font-bold mt-1 text-primary">₹{todayOrders.reduce((s, o) => s + o.total, 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              {/* Monthly */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" /> Monthly Sales Report
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground font-display uppercase">Orders This Month</p>
                    <p className="font-display text-3xl font-bold mt-1">{monthOrders.length}</p>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground font-display uppercase">Revenue This Month</p>
                    <p className="font-display text-3xl font-bold mt-1 text-primary">₹{monthOrders.reduce((s, o) => s + o.total, 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order status breakdown */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display text-base font-bold mb-4">Order Status Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ORDER_STATUSES.map(s => (
                  <div key={s} className={`rounded-xl p-4 text-center ${statusColor[s]}`}>
                    <p className="text-xs font-display font-medium">{statusLabel[s]}</p>
                    <p className="font-display text-2xl font-bold mt-1">{orders.filter(o => o.status === s).length}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">User management will be available with backend integration.</p>
          </div>
        )}

        {activeTab === 'urban-fish' && (
          <div>
            <button className="btn-cart text-sm mb-4 rounded-lg">+ Add Product</button>
            <div className="space-y-2">
              {mockUrbanFishProducts.map(p => (
                <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-display text-sm font-semibold">{p.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{p.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm font-bold text-primary">₹{p.pricePerKg}/kg</span>
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
            <button className="btn-cart text-sm mb-4 rounded-lg">+ Add Menu Item</button>
            <div className="space-y-2">
              {mockKitchenMenu.map(item => (
                <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-display text-sm font-semibold">{item.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{item.category}</span>
                  </div>
                  <span className="font-display text-sm font-bold text-primary">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stores' && (
          <div className="space-y-2">
            {mockStores.map(store => (
              <div key={store.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="font-display text-sm font-semibold">{store.name}</span>
                  <span className={`ml-2 text-[10px] font-display font-medium px-2 py-0.5 rounded-full ${store.isApproved ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                    {store.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Rating: {store.rating}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-md space-y-3">
            <div>
              <label className="text-xs text-muted-foreground font-display">Commission Rate (%)</label>
              <input className="input-field mt-1 rounded-lg" type="number" defaultValue={10} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-display">Delivery Fee (₹)</label>
              <input className="input-field mt-1 rounded-lg" type="number" defaultValue={0} />
            </div>
            <button className="btn-cart text-sm rounded-lg">Save Settings</button>
          </div>
        )}
      </main>
    </div>
  );
}
