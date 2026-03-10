import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Star, LogOut, User } from 'lucide-react';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) {
    navigate('/login');
    return null;
  }

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="section-title">My Account</h1>
              <p className="text-sm text-muted-foreground font-body mt-1">Welcome, {user.name}</p>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} className="btn-secondary text-xs flex items-center gap-1.5">
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-display font-medium rounded-sm border transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="dashboard-card">
            {activeTab === 'orders' && (
              <div className="text-center py-10">
                <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-body">No orders yet. Start shopping!</p>
              </div>
            )}
            {activeTab === 'addresses' && (
              <div className="text-center py-10">
                <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-body">No saved addresses.</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="text-center py-10">
                <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-body">No reviews yet.</p>
              </div>
            )}
            {activeTab === 'profile' && (
              <div className="space-y-3 max-w-sm">
                <div>
                  <label className="text-xs text-muted-foreground font-display">Name</label>
                  <input className="input-field mt-1" value={user.name} readOnly />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-display">Email</label>
                  <input className="input-field mt-1" value={user.email} readOnly />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-display">Phone</label>
                  <input className="input-field mt-1" value={user.phone} readOnly />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
