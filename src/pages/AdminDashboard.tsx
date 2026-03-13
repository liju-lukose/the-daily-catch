import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { mockUrbanFishProducts, mockKitchenMenu, mockStores as initialMockStores, mockOrders } from '@/lib/mock-data';
import { Order, Expense, AdminFishProduct, Store, KitchenMenuItem } from '@/lib/types';
import Header from '@/components/Header';
import {
  LayoutDashboard, Users, Package, UtensilsCrossed, Store as StoreIcon, ShoppingBag, TrendingUp, Settings, LogOut,
  Plus, X, Search, Filter, Calendar, Edit, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

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

const nextStatus: Partial<Record<Order['status'], Order['status']>> = {
  order_received: 'preparing',
  preparing: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

const dailyChartData = [
  { day: 'Mon', purchase: 4200, sales: 7800 },
  { day: 'Tue', purchase: 3800, sales: 6500 },
  { day: 'Wed', purchase: 5100, sales: 9200 },
  { day: 'Thu', purchase: 4600, sales: 8100 },
  { day: 'Fri', purchase: 5500, sales: 11000 },
  { day: 'Sat', purchase: 6200, sales: 13500 },
  { day: 'Sun', purchase: 4800, sales: 10200 },
];

const chartConfig = {
  purchase: { label: 'Purchase Cost', color: 'hsl(var(--destructive))' },
  sales: { label: 'Sales Revenue', color: 'hsl(var(--primary))' },
};

const initialExpenses: Expense[] = [
  { id: 'exp-1', name: 'Ice Purchase', description: 'Daily ice supply', amount: 2000, date: '2026-03-13', approverName: 'Admin', approverEmail: 'admin@test.com' },
  { id: 'exp-2', name: 'Supplier Payment', description: 'Fish supplier', amount: 8000, date: '2026-03-12', approverName: 'Admin', approverEmail: 'admin@test.com' },
  { id: 'exp-3', name: 'Fuel Expense', description: 'Delivery fuel', amount: 1200, date: '2026-03-11', approverName: 'Admin', approverEmail: 'admin@test.com' },
  { id: 'exp-4', name: 'Packaging Materials', description: 'Boxes and bags', amount: 900, date: '2026-03-10', approverName: 'Admin', approverEmail: 'admin@test.com' },
  { id: 'exp-5', name: 'Staff Salary', description: 'Monthly salary', amount: 5000, date: '2026-03-01', approverName: 'Admin', approverEmail: 'admin@test.com' },
  { id: 'exp-6', name: 'Electricity', description: 'Cold storage', amount: 1500, date: '2026-03-05', approverName: 'Admin', approverEmail: 'admin@test.com' },
  { id: 'exp-7', name: 'Rent', description: 'Shop rent', amount: 3000, date: '2026-03-01', approverName: 'Admin', approverEmail: 'admin@test.com' },
];

const revenueBreakdown = { cloudKitchen: 12000, fishMarket: 9500, store: 4200 };

const initialAdminProducts: AdminFishProduct[] = [
  { id: 'ap-1', name: 'Seer Fish', batchId: 'B001', purchaseDate: '2026-03-10', purchasedPerson: 'Raju', approverName: 'Admin', approverEmail: 'admin@test.com', quantity: 25, purchaseRate: 400, sellingRate: 650, sellingUnit: 'kg', purchasePlace: 'Chennai Harbor', expectedProfit: 6250, expiryDate: '2026-05-12', isCatchOfTheDay: true },
  { id: 'ap-2', name: 'Pomfret', batchId: 'B002', purchaseDate: '2026-03-11', purchasedPerson: 'Suresh', approverName: 'Admin', approverEmail: 'admin@test.com', quantity: 40, purchaseRate: 300, sellingRate: 500, sellingUnit: 'kg', purchasePlace: 'Mumbai Dock', expectedProfit: 8000, expiryDate: '2026-05-15', isCatchOfTheDay: false },
  { id: 'ap-3', name: 'Prawns', batchId: 'B003', purchaseDate: '2026-03-12', purchasedPerson: 'Raju', approverName: 'Admin', approverEmail: 'admin@test.com', quantity: 100, purchaseRate: 8, sellingRate: 15, sellingUnit: 'count', purchasePlace: 'Kochi Market', expectedProfit: 700, expiryDate: '2026-04-20', isCatchOfTheDay: true },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [adminProducts, setAdminProducts] = useState<AdminFishProduct[]>(initialAdminProducts);
  const [stores, setStores] = useState<Store[]>(initialMockStores);

  // Modal states
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [storesView, setStoresView] = useState<'list' | 'add'>('list');

  // Filter states for Urban Fish
  const [productSearch, setProductSearch] = useState('');
  const [filterBatchId, setFilterBatchId] = useState('');
  const [filterPurchaseDate, setFilterPurchaseDate] = useState('');
  const [filterExpiryDate, setFilterExpiryDate] = useState('');
  const [filterCotd, setFilterCotd] = useState(false);
  const [filterPurchasePlace, setFilterPurchasePlace] = useState('');
  const [filterSellingUnit, setFilterSellingUnit] = useState('');

  // Form states
  const [expenseForm, setExpenseForm] = useState({ name: '', description: '', amount: '', date: '', approverName: '', approverEmail: '' });
  const [productForm, setProductForm] = useState({
    name: '', batchId: '', purchaseDate: '', purchasedPerson: '', approverName: '', approverEmail: '',
    quantity: '', purchaseRate: '', sellingRate: '', sellingUnit: 'kg' as 'count' | 'kg',
    purchasePlace: '', expectedProfit: '', expiryDate: '', isCatchOfTheDay: false,
  });
  const [storeForm, setStoreForm] = useState({
    name: '', contactPerson: '', phone: '', email: '', address: '', description: '', operatingHours: '', yearStarted: '',
  });

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const totalRevenue = revenueBreakdown.cloudKitchen + revenueBreakdown.fishMarket + revenueBreakdown.store;
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpenses;

  const handleSaveExpense = () => {
    if (!expenseForm.name || !expenseForm.amount) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    const newExp: Expense = {
      id: `exp-${Date.now()}`, name: expenseForm.name, description: expenseForm.description,
      amount: Number(expenseForm.amount), date: expenseForm.date || new Date().toISOString().split('T')[0],
      approverName: expenseForm.approverName, approverEmail: expenseForm.approverEmail,
    };
    setExpenses(prev => [newExp, ...prev]);
    setExpenseForm({ name: '', description: '', amount: '', date: '', approverName: '', approverEmail: '' });
    setExpenseModalOpen(false);
    toast({ title: 'Expense added successfully' });
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.batchId || !productForm.quantity) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    const newProd: AdminFishProduct = {
      id: `ap-${Date.now()}`, name: productForm.name, batchId: productForm.batchId,
      purchaseDate: productForm.purchaseDate || new Date().toISOString().split('T')[0],
      purchasedPerson: productForm.purchasedPerson, approverName: productForm.approverName,
      approverEmail: productForm.approverEmail, quantity: Number(productForm.quantity),
      purchaseRate: Number(productForm.purchaseRate), sellingRate: Number(productForm.sellingRate),
      sellingUnit: productForm.sellingUnit, purchasePlace: productForm.purchasePlace,
      expectedProfit: Number(productForm.expectedProfit), expiryDate: productForm.expiryDate,
      isCatchOfTheDay: productForm.isCatchOfTheDay,
    };
    setAdminProducts(prev => [newProd, ...prev]);
    setProductForm({ name: '', batchId: '', purchaseDate: '', purchasedPerson: '', approverName: '', approverEmail: '', quantity: '', purchaseRate: '', sellingRate: '', sellingUnit: 'kg', purchasePlace: '', expectedProfit: '', expiryDate: '', isCatchOfTheDay: false });
    setProductModalOpen(false);
    toast({ title: 'Product added successfully' });
  };

  const handleSaveStore = () => {
    if (!storeForm.name || !storeForm.contactPerson) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    const newStore: Store = {
      id: `store-${Date.now()}`, sellerId: `seller-${Date.now()}`, name: storeForm.name,
      description: storeForm.description, rating: 0, reviewCount: 0, deliveryRadius: 10,
      operatingHours: storeForm.operatingHours || '9:00 AM - 9:00 PM', isApproved: true, isActive: true,
      contactPerson: storeForm.contactPerson, phone: storeForm.phone, email: storeForm.email,
      address: storeForm.address, yearStarted: storeForm.yearStarted ? Number(storeForm.yearStarted) : undefined,
    };
    setStores(prev => [newStore, ...prev]);
    setStoreForm({ name: '', contactPerson: '', phone: '', email: '', address: '', description: '', operatingHours: '', yearStarted: '' });
    setStoreModalOpen(false);
    toast({ title: 'Store added successfully' });
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return adminProducts.filter(p => {
      if (productSearch && !p.name.toLowerCase().includes(productSearch.toLowerCase())) return false;
      if (filterBatchId && !p.batchId.toLowerCase().includes(filterBatchId.toLowerCase())) return false;
      if (filterPurchaseDate && p.purchaseDate !== filterPurchaseDate) return false;
      if (filterExpiryDate && p.expiryDate !== filterExpiryDate) return false;
      if (filterCotd && !p.isCatchOfTheDay) return false;
      if (filterPurchasePlace && !p.purchasePlace.toLowerCase().includes(filterPurchasePlace.toLowerCase())) return false;
      if (filterSellingUnit && p.sellingUnit !== filterSellingUnit) return false;
      return true;
    });
  }, [adminProducts, productSearch, filterBatchId, filterPurchaseDate, filterExpiryDate, filterCotd, filterPurchasePlace, filterSellingUnit]);

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'urban-fish', label: 'Urban Fish', icon: Package },
    { id: 'kitchen', label: 'Cloud Kitchen', icon: UtensilsCrossed },
    { id: 'stores', label: 'Stores', icon: StoreIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-sidebar text-sidebar-foreground flex-shrink-0 hidden md:flex flex-col border-r border-sidebar-border">
          <div className="p-4 border-b border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60 font-display font-medium">Admin Dashboard</p>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-display font-medium rounded-lg transition-colors ${activeTab === tab.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`}>
                <tab.icon className="w-3.5 h-3.5" />{tab.label}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-sidebar-border">
            <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-display hover:bg-sidebar-accent/50 rounded-lg">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </aside>

        {/* Mobile tab selector */}
        <div className="md:hidden w-full border-b border-border bg-card overflow-x-auto">
          <div className="flex p-2 gap-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-display font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                <tab.icon className="w-3 h-3" />{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <h1 className="font-display text-xl font-bold mb-6">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>

          {/* ==================== OVERVIEW ==================== */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Users" value="1,247" />
                <StatCard label="Active Stores" value={String(stores.length)} />
                <StatCard label="Products" value={String(mockUrbanFishProducts.length + mockKitchenMenu.length)} />
                <StatCard label="Total Orders" value={String(orders.length)} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-display text-sm font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Daily Purchase Cost vs Sales Revenue
                  </h3>
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <BarChart data={dailyChartData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="purchase" fill="var(--color-purchase)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>

                {/* Revenue Summary */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-sm font-bold">Revenue Summary</h3>
                    <Button size="sm" onClick={() => setExpenseModalOpen(true)} className="text-xs gap-1">
                      <Plus className="w-3 h-3" /> Add Expense
                    </Button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <RevenueRow label="Cloud Kitchen" amount={revenueBreakdown.cloudKitchen} />
                    <RevenueRow label="Fish Market" amount={revenueBreakdown.fishMarket} />
                    <RevenueRow label="Store Revenue" amount={revenueBreakdown.store} />
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-display text-sm font-bold">Total Revenue</span>
                        <span className="font-display text-lg font-bold text-primary">₹{totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="border-t border-border">
                    <AccordionItem value="expenses" className="border-none">
                      <AccordionTrigger className="py-3 text-sm font-display font-bold hover:no-underline">
                        Expenses
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                          {expenses.map(exp => (
                            <div key={exp.id} className="flex justify-between text-sm font-body">
                              <span className="text-muted-foreground">{exp.name}</span>
                              <span className="font-medium">₹{exp.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-border mt-2 pt-2 flex justify-between text-sm font-display font-bold">
                          <span>Total Expenses</span>
                          <span>₹{totalExpenses.toLocaleString()}</span>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-auto border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-display text-sm font-bold">Profit</span>
                      <span className={`font-display text-xl font-bold ${profit >= 0 ? 'text-accent' : 'text-destructive'}`}>
                        ₹{profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== ORDERS ==================== */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Tabs defaultValue="order_received" className="w-full">
                <TabsList className="w-full justify-start mb-4 flex-wrap h-auto gap-1 bg-transparent p-0">
                  {ORDER_STATUSES.map(s => (
                    <TabsTrigger key={s} value={s}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg text-xs font-display">
                      {statusLabel[s]} ({orders.filter(o => o.status === s).length})
                    </TabsTrigger>
                  ))}
                </TabsList>
                {ORDER_STATUSES.map(status => (
                  <TabsContent key={status} value={status}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orders.filter(o => o.status === status).map(order => (
                        <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className="bg-card border border-border rounded-2xl p-5 space-y-3 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <span className="font-display text-sm font-bold">{order.id}</span>
                            <span className={`text-[10px] font-display font-semibold px-2.5 py-1 rounded-full ${statusColor[order.status]}`}>
                              {statusLabel[order.status]}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-body">{order.customerName}</span>
                            <span className="text-muted-foreground text-xs">({order.customerEmail})</span>
                          </div>
                          <div className="bg-secondary/30 rounded-xl p-3 space-y-1.5">
                            <p className="text-[10px] font-display uppercase text-muted-foreground tracking-wider">Items</p>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs font-body">
                                <span>{item.product.name} × {item.quantity}{item.weight ? ` (${item.weight}g)` : ''}</span>
                                <span className="font-display font-semibold text-primary">
                                  ₹{'pricePerKg' in item.product
                                    ? (item.product as any).pricePerKg * item.quantity * ((item.weight || 1000) / 1000)
                                    : (item.product as any).price * item.quantity}
                                </span>
                              </div>
                            ))}
                            {order.items.some(i => i.cuttingType) && (
                              <p className="text-[10px] text-muted-foreground">Cut: {order.items.map(i => i.cuttingType).filter(Boolean).join(', ')}</p>
                            )}
                            {order.items.some(i => i.customerNote) && (
                              <p className="text-[10px] text-muted-foreground italic">Note: {order.items.map(i => i.customerNote).filter(Boolean).join('; ')}</p>
                            )}
                          </div>
                          <div className="text-xs font-body text-muted-foreground">
                            <p className="text-[10px] font-display uppercase tracking-wider mb-1">Delivery</p>
                            <p>{order.deliveryAddress.fullName}, {order.deliveryAddress.phone}</p>
                            <p>{order.deliveryAddress.line1}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div>
                              <span className="font-display text-lg font-bold text-primary">₹{order.total}</span>
                              <span className="text-[10px] text-muted-foreground ml-2">
                                {new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                              </span>
                            </div>
                            {nextStatus[status] ? (
                              <button onClick={() => updateOrderStatus(order.id, nextStatus[status]!)}
                                className="btn-cart text-[10px] py-1.5 px-4 rounded-lg">
                                → {statusLabel[nextStatus[status]!]}
                              </button>
                            ) : (
                              <span className="text-xs text-accent font-display font-semibold">✓ Delivered</span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {orders.filter(o => o.status === status).length === 0 && (
                        <div className="col-span-full text-center py-12 text-sm text-muted-foreground font-body">No orders in this status</div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          )}

          {/* ==================== USERS ==================== */}
          {activeTab === 'users' && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm text-muted-foreground">User management will be available with backend integration.</p>
            </div>
          )}

          {/* ==================== URBAN FISH ==================== */}
          {activeTab === 'urban-fish' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-display text-base font-bold">Product Management</h2>
                <Button onClick={() => setProductModalOpen(true)} className="gap-1.5">
                  <Plus className="w-4 h-4" /> Add Product
                </Button>
              </div>

              {/* Filters */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-muted-foreground">Filters</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                    <Input placeholder="Product name" value={productSearch} onChange={e => setProductSearch(e.target.value)} className="pl-8 h-9 text-xs" />
                  </div>
                  <Input placeholder="Batch ID" value={filterBatchId} onChange={e => setFilterBatchId(e.target.value)} className="h-9 text-xs" />
                  <Input type="date" value={filterPurchaseDate} onChange={e => setFilterPurchaseDate(e.target.value)} className="h-9 text-xs" />
                  <Input type="date" value={filterExpiryDate} onChange={e => setFilterExpiryDate(e.target.value)} className="h-9 text-xs" />
                  <Input placeholder="Purchase Place" value={filterPurchasePlace} onChange={e => setFilterPurchasePlace(e.target.value)} className="h-9 text-xs" />
                  <Select value={filterSellingUnit} onValueChange={v => setFilterSellingUnit(v === 'all' ? '' : v)}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Unit" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Units</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="count">Count</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Switch checked={filterCotd} onCheckedChange={setFilterCotd} />
                    <span className="text-xs font-body">COTD</span>
                  </div>
                </div>
              </div>

              {/* Product Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredProducts.map(p => (
                    <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow relative">
                      {p.isCatchOfTheDay && (
                        <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-display font-bold px-2.5 py-1 rounded-full">
                          🐟 Catch of the Day
                        </span>
                      )}
                      <h3 className="font-display text-base font-bold mb-3">{p.name}</h3>
                      <div className="space-y-1.5 text-sm font-body">
                        <div className="flex justify-between"><span className="text-muted-foreground">Batch ID</span><span className="font-medium">{p.batchId}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="font-medium">{p.quantity} {p.sellingUnit === 'kg' ? 'Kg' : 'pcs'}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Purchase Rate</span><span className="font-medium">₹{p.purchaseRate}/{p.sellingUnit === 'kg' ? 'kg' : 'pc'}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Selling Rate</span><span className="font-medium text-primary font-display font-bold">₹{p.sellingRate}/{p.sellingUnit === 'kg' ? 'kg' : 'pc'}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Expiry Date</span><span className="font-medium">{new Date(p.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Purchase Place</span><span className="font-medium">{p.purchasePlace}</span></div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-12 text-sm text-muted-foreground font-body">No products match filters</div>
                )}
              </div>
            </motion.div>
          )}

          {/* ==================== KITCHEN ==================== */}
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

          {/* ==================== STORES ==================== */}
          {activeTab === 'stores' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center gap-3">
                <Button variant={storesView === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setStoresView('list')}>List Stores</Button>
                <Button variant={storesView === 'add' ? 'default' : 'outline'} size="sm" onClick={() => { setStoresView('add'); setStoreModalOpen(true); }}>
                  <Plus className="w-4 h-4 mr-1" /> Add Store
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map(store => (
                  <motion.div key={store.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="font-display text-xl font-bold text-primary">{store.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base font-bold truncate">{store.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 font-body mt-0.5">{store.description}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm font-body">
                      {store.contactPerson && <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span className="font-medium">{store.contactPerson}</span></div>}
                      {store.phone && <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{store.phone}</span></div>}
                      {store.email && <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium truncate max-w-[160px]">{store.email}</span></div>}
                      {store.address && <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium truncate max-w-[160px]">{store.address}</span></div>}
                      <div className="flex justify-between"><span className="text-muted-foreground">Hours</span><span className="font-medium">{store.operatingHours}</span></div>
                      {store.yearStarted && <div className="flex justify-between"><span className="text-muted-foreground">Since</span><span className="font-medium">{store.yearStarted}</span></div>}
                      <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span className="font-medium">{store.rating} ({store.reviewCount})</span></div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex gap-2">
                      <span className={`text-[10px] font-display font-semibold px-2.5 py-1 rounded-full ${store.isApproved ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                        {store.isApproved ? 'Approved' : 'Pending'}
                      </span>
                      <span className={`text-[10px] font-display font-semibold px-2.5 py-1 rounded-full ${store.isActive ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
                        {store.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ==================== SETTINGS ==================== */}
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

      {/* ==================== MODALS ==================== */}

      {/* Add Expense Modal */}
      <Dialog open={expenseModalOpen} onOpenChange={setExpenseModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Add Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Expense Name *</Label><Input value={expenseForm.name} onChange={e => setExpenseForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Fuel Expense" /></div>
            <div><Label className="text-xs">Description</Label><Input value={expenseForm.description} onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" /></div>
            <div><Label className="text-xs">Amount (₹) *</Label><Input type="number" value={expenseForm.amount} onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))} placeholder="0" /></div>
            <div><Label className="text-xs">Date</Label><Input type="date" value={expenseForm.date} onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div><Label className="text-xs">Approver Name</Label><Input value={expenseForm.approverName} onChange={e => setExpenseForm(f => ({ ...f, approverName: e.target.value }))} /></div>
            <div><Label className="text-xs">Approver Email</Label><Input type="email" value={expenseForm.approverEmail} onChange={e => setExpenseForm(f => ({ ...f, approverEmail: e.target.value }))} /></div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setExpenseModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveExpense}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Modal */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Add Product</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Label className="text-xs">Product Name *</Label><Input value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label className="text-xs">Batch ID *</Label><Input value={productForm.batchId} onChange={e => setProductForm(f => ({ ...f, batchId: e.target.value }))} /></div>
            <div><Label className="text-xs">Purchase Date</Label><Input type="date" value={productForm.purchaseDate} onChange={e => setProductForm(f => ({ ...f, purchaseDate: e.target.value }))} /></div>
            <div><Label className="text-xs">Purchased Person</Label><Input value={productForm.purchasedPerson} onChange={e => setProductForm(f => ({ ...f, purchasedPerson: e.target.value }))} /></div>
            <div><Label className="text-xs">Approver Name</Label><Input value={productForm.approverName} onChange={e => setProductForm(f => ({ ...f, approverName: e.target.value }))} /></div>
            <div><Label className="text-xs">Approver Email</Label><Input type="email" value={productForm.approverEmail} onChange={e => setProductForm(f => ({ ...f, approverEmail: e.target.value }))} /></div>
            <div><Label className="text-xs">Quantity *</Label><Input type="number" value={productForm.quantity} onChange={e => setProductForm(f => ({ ...f, quantity: e.target.value }))} /></div>
            <div><Label className="text-xs">Purchase Rate (₹)</Label><Input type="number" value={productForm.purchaseRate} onChange={e => setProductForm(f => ({ ...f, purchaseRate: e.target.value }))} /></div>
            <div><Label className="text-xs">Selling Rate (₹)</Label><Input type="number" value={productForm.sellingRate} onChange={e => setProductForm(f => ({ ...f, sellingRate: e.target.value }))} /></div>
            <div>
              <Label className="text-xs">Selling Unit</Label>
              <Select value={productForm.sellingUnit} onValueChange={v => setProductForm(f => ({ ...f, sellingUnit: v as 'count' | 'kg' }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="count">Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Purchase Place</Label><Input value={productForm.purchasePlace} onChange={e => setProductForm(f => ({ ...f, purchasePlace: e.target.value }))} /></div>
            <div><Label className="text-xs">Expected Profit (₹)</Label><Input type="number" value={productForm.expectedProfit} onChange={e => setProductForm(f => ({ ...f, expectedProfit: e.target.value }))} /></div>
            <div><Label className="text-xs">Expiry Date</Label><Input type="date" value={productForm.expiryDate} onChange={e => setProductForm(f => ({ ...f, expiryDate: e.target.value }))} /></div>
            <div className="flex items-center gap-3 col-span-2">
              <Switch checked={productForm.isCatchOfTheDay} onCheckedChange={v => setProductForm(f => ({ ...f, isCatchOfTheDay: v }))} />
              <Label className="text-xs">Catch of the Day</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setProductModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProduct}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Store Modal */}
      <Dialog open={storeModalOpen} onOpenChange={setStoreModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Add Store</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Store Name *</Label><Input value={storeForm.name} onChange={e => setStoreForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label className="text-xs">Contact Person *</Label><Input value={storeForm.contactPerson} onChange={e => setStoreForm(f => ({ ...f, contactPerson: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Phone</Label><Input value={storeForm.phone} onChange={e => setStoreForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div><Label className="text-xs">Email</Label><Input type="email" value={storeForm.email} onChange={e => setStoreForm(f => ({ ...f, email: e.target.value }))} /></div>
            </div>
            <div><Label className="text-xs">Address</Label><Input value={storeForm.address} onChange={e => setStoreForm(f => ({ ...f, address: e.target.value }))} /></div>
            <div><Label className="text-xs">Description</Label><Input value={storeForm.description} onChange={e => setStoreForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Operation Time</Label><Input value={storeForm.operatingHours} onChange={e => setStoreForm(f => ({ ...f, operatingHours: e.target.value }))} placeholder="9:00 AM - 9:00 PM" /></div>
              <div><Label className="text-xs">Year Started</Label><Input type="number" value={storeForm.yearStarted} onChange={e => setStoreForm(f => ({ ...f, yearStarted: e.target.value }))} placeholder="2020" /></div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setStoreModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveStore}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-5">
      <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">{label}</p>
      <p className="font-display text-2xl font-bold mt-1">{value}</p>
    </motion.div>
  );
}

function RevenueRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between items-center text-sm font-body">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-display font-semibold">₹{amount.toLocaleString()}</span>
    </div>
  );
}
