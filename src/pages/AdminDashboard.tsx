import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { mockUrbanFishProducts, mockKitchenMenu, mockStores, mockOrders } from '@/lib/mock-data';
import { Order } from '@/lib/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  LayoutDashboard, Users, Package, UtensilsCrossed, Store, ShoppingBag, TrendingUp, Settings, LogOut, ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';

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

// Mock chart data
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

const expenses = [
  { name: 'Ice Purchase', amount: 2000 },
  { name: 'Supplier Payment', amount: 8000 },
  { name: 'Fuel Expense', amount: 1200 },
  { name: 'Packaging Materials', amount: 900 },
  { name: 'Staff Salary', amount: 5000 },
  { name: 'Electricity', amount: 1500 },
  { name: 'Rent', amount: 3000 },
];

const revenueBreakdown = {
  cloudKitchen: 12000,
  fishMarket: 9500,
  store: 4200,
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

  const totalRevenue = revenueBreakdown.cloudKitchen + revenueBreakdown.fishMarket + revenueBreakdown.store;
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpenses;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'urban-fish', label: 'Urban Fish', icon: Package },
    { id: 'kitchen', label: 'Cloud Kitchen', icon: UtensilsCrossed },
    { id: 'stores', label: 'Stores', icon: Store },
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

        {/* Mobile tab selector */}
        <div className="md:hidden w-full border-b border-border bg-card overflow-x-auto">
          <div className="flex p-2 gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-display font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
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
              {/* Top stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Users" value="1,247" />
                <StatCard label="Active Stores" value={String(mockStores.length)} />
                <StatCard label="Products" value={String(mockUrbanFishProducts.length + mockKitchenMenu.length)} />
                <StatCard label="Total Orders" value={String(orders.length)} />
              </div>

              {/* Chart + Revenue */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Sales Chart - Left (3 cols) */}
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

                {/* Revenue Summary - Right (2 cols) */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 flex flex-col">
                  <h3 className="font-display text-sm font-bold mb-4">Revenue Summary</h3>

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

                  {/* Expenses Accordion */}
                  <Accordion type="single" collapsible className="border-t border-border">
                    <AccordionItem value="expenses" className="border-none">
                      <AccordionTrigger className="py-3 text-sm font-display font-bold hover:no-underline">
                        Expenses
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                          {expenses.map(exp => (
                            <div key={exp.name} className="flex justify-between text-sm font-body">
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

                  {/* Profit */}
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
                    <TabsTrigger
                      key={s}
                      value={s}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg text-xs font-display"
                    >
                      {statusLabel[s]} ({orders.filter(o => o.status === s).length})
                    </TabsTrigger>
                  ))}
                </TabsList>

                {ORDER_STATUSES.map(status => (
                  <TabsContent key={status} value={status}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orders.filter(o => o.status === status).map(order => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-card border border-border rounded-2xl p-5 space-y-3 hover:shadow-md transition-shadow"
                        >
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
                              <button
                                onClick={() => updateOrderStatus(order.id, nextStatus[status]!)}
                                className="btn-cart text-[10px] py-1.5 px-4 rounded-lg"
                              >
                                → {statusLabel[nextStatus[status]!]}
                              </button>
                            ) : (
                              <span className="text-xs text-accent font-display font-semibold">✓ Delivered</span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {orders.filter(o => o.status === status).length === 0 && (
                        <div className="col-span-full text-center py-12 text-sm text-muted-foreground font-body">
                          No orders in this status
                        </div>
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
      <Footer />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-5"
    >
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
