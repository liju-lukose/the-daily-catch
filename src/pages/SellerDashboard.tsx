import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { mockStoreProducts } from '@/lib/mock-data';
import {
  LayoutDashboard, Package, ShoppingBag, Store, Upload, LogOut,
} from 'lucide-react';

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'seller') {
    navigate('/login');
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'store', label: 'Store', icon: Store },
    { id: 'bulk', label: 'Bulk Upload', icon: Upload },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-56 bg-sidebar text-sidebar-foreground flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <span className="font-display text-base font-bold">
            Urban<span className="text-buoy-orange">Fish</span>
          </span>
          <p className="text-[10px] text-sidebar-foreground/60 mt-0.5">Seller Dashboard</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="dashboard-card">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Total Products</p>
              <p className="font-display text-2xl font-bold mt-1">2</p>
            </div>
            <div className="dashboard-card">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Active Orders</p>
              <p className="font-display text-2xl font-bold mt-1">0</p>
            </div>
            <div className="dashboard-card">
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">Revenue</p>
              <p className="font-display text-2xl font-bold mt-1 text-buoy-orange">₹0</p>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <button className="btn-cart text-sm mb-4">+ Add Product</button>
            <p className="text-sm text-muted-foreground">Product management features will be functional with backend integration.</p>
          </div>
        )}

        {activeTab === 'orders' && (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        )}

        {activeTab === 'store' && (
          <div className="max-w-md space-y-3">
            <div>
              <label className="text-xs text-muted-foreground font-display">Store Name</label>
              <input className="input-field mt-1" placeholder="Your Fish Store" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-display">Description</label>
              <textarea className="input-field mt-1 h-20 resize-none" placeholder="Describe your store..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground font-display">Delivery Radius (km)</label>
                <input className="input-field mt-1" type="number" placeholder="10" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-display">Operating Hours</label>
                <input className="input-field mt-1" placeholder="6AM - 8PM" />
              </div>
            </div>
            <button className="btn-cart text-sm">Save Store Profile</button>
          </div>
        )}

        {activeTab === 'bulk' && (
          <div className="dashboard-card max-w-md">
            <h3 className="font-display text-base font-semibold mb-3">Bulk Product Upload</h3>
            <p className="text-xs text-muted-foreground font-body mb-4">Upload an Excel file to add multiple products at once.</p>
            <a href="#" className="text-xs text-buoy-orange font-display font-medium hover:underline block mb-3">Download Excel Template</a>
            <div className="border-2 border-dashed border-border rounded-sm p-8 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Drag & drop or click to upload .xlsx file</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
