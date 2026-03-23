import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/hooks/useApi';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  ClipboardList, Package, IndianRupee, Wallet, AlertTriangle, CheckCircle2, ArrowLeft,
} from 'lucide-react';
import type { FishProduct } from '@/lib/types';

interface DemandRow {
  fishName: string;
  fishId: string;
  totalQuantity: number;
  unit: string;
  orderCount: number;
  sellingRate: number;
}

interface ProcurementEntry {
  purchaseQty: string;
  supplierName: string;
  purchaseRate: string;
  procured: boolean;
}

const HIGH_DEMAND_THRESHOLD = 30;

const MOCK_SUPPLIERS = ['Chennai Harbor', 'Mumbai Dock', 'Kochi Market', 'Vizag Port', 'Mangalore Coast'];

export default function ProcurementDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: orders = [], isLoading } = useOrders();

  const [procurementData, setProcurementData] = useState<Record<string, ProcurementEntry>>({});

  // Aggregate pre-order demand from orders
  const demandSummary = useMemo(() => {
    const map = new Map<string, DemandRow>();

    orders.forEach(order => {
      order.items.forEach(item => {
        const product = item.product as FishProduct;
        if (!product.pricePerKg) return; // skip non-fish items (kitchen)
        if (!product.isPreOrder) return;

        const key = product.id;
        const existing = map.get(key);
        const qty = item.weight ? item.weight / 1000 : item.quantity;

        if (existing) {
          existing.totalQuantity += qty;
          existing.orderCount += 1;
        } else {
          map.set(key, {
            fishName: product.name,
            fishId: product.id,
            totalQuantity: qty,
            unit: 'Kg',
            orderCount: 1,
            sellingRate: product.pricePerKg,
          });
        }
      });
    });

    // Add mock demand data for demo if no pre-orders exist
    if (map.size === 0) {
      const mockDemand: DemandRow[] = [
        { fishName: 'Hilsa Fish', fishId: 'hilsa-1', totalQuantity: 45, unit: 'Kg', orderCount: 12, sellingRate: 1600 },
        { fishName: 'Surmai (King Mackerel)', fishId: 'surmai-1', totalQuantity: 30, unit: 'Kg', orderCount: 18, sellingRate: 1300 },
        { fishName: 'Rohu Fish', fishId: 'rohu-1', totalQuantity: 60, unit: 'Kg', orderCount: 25, sellingRate: 350 },
        { fishName: 'Catla Fish', fishId: 'catla-1', totalQuantity: 20, unit: 'Kg', orderCount: 10, sellingRate: 300 },
        { fishName: 'Seer Fish', fishId: 'seer-1', totalQuantity: 15, unit: 'Kg', orderCount: 8, sellingRate: 1100 },
      ];
      mockDemand.forEach(d => map.set(d.fishId, d));
    }

    return Array.from(map.values()).sort((a, b) => b.totalQuantity - a.totalQuantity);
  }, [orders]);

  // Summary metrics
  const totalPreOrders = demandSummary.reduce((s, d) => s + d.orderCount, 0);
  const totalQuantity = demandSummary.reduce((s, d) => s + d.totalQuantity, 0);
  const totalExpectedRevenue = demandSummary.reduce((s, d) => s + d.totalQuantity * d.sellingRate, 0);
  const totalPartialPayments = totalPreOrders * 100; // ₹100 per pre-order

  const getEntry = (fishId: string): ProcurementEntry =>
    procurementData[fishId] ?? { purchaseQty: '', supplierName: '', purchaseRate: '', procured: false };

  const updateEntry = (fishId: string, field: keyof ProcurementEntry, value: string | boolean) => {
    setProcurementData(prev => ({
      ...prev,
      [fishId]: { ...getEntry(fishId), [field]: value },
    }));
  };

  const getExpectedCost = (fishId: string) => {
    const entry = getEntry(fishId);
    const qty = parseFloat(entry.purchaseQty) || 0;
    const rate = parseFloat(entry.purchaseRate) || 0;
    return qty * rate;
  };

  const getExpectedProfit = (row: DemandRow) => {
    const entry = getEntry(row.fishId);
    const qty = parseFloat(entry.purchaseQty) || row.totalQuantity;
    const cost = getExpectedCost(row.fishId);
    const revenue = qty * row.sellingRate;
    return revenue - (cost || 0);
  };

  const handleMarkProcured = (fishId: string, fishName: string) => {
    const entry = getEntry(fishId);
    if (!entry.purchaseQty || !entry.purchaseRate) {
      toast({ title: 'Missing fields', description: 'Please enter purchase quantity and rate', variant: 'destructive' });
      return;
    }
    updateEntry(fishId, 'procured', true);
    toast({ title: 'Marked as Procured', description: `${fishName} procurement recorded successfully` });
  };

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Back nav */}
        <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={() => navigate('/admin')}>
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Button>

        <h1 className="font-display text-xl md:text-2xl font-bold mb-6">Procurement Dashboard</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <SummaryCard icon={ClipboardList} label="Total Pre-Orders Today" value={String(totalPreOrders)} />
              <SummaryCard icon={Package} label="Total Quantity Ordered" value={`${totalQuantity.toFixed(1)} Kg`} />
              <SummaryCard icon={IndianRupee} label="Expected Revenue" value={`₹${totalExpectedRevenue.toLocaleString()}`} />
              <SummaryCard icon={Wallet} label="Partial Payments Collected" value={`₹${totalPartialPayments.toLocaleString()}`} />
            </div>

            {/* Fish-wise Demand Summary */}
            <Card className="mb-8">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">Fish-wise Demand Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fish Name</TableHead>
                        <TableHead className="text-right">Total Qty Ordered</TableHead>
                        <TableHead className="text-right">No. of Orders</TableHead>
                        <TableHead className="text-right">Selling Rate</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demandSummary.map(row => {
                        const isHighDemand = row.totalQuantity >= HIGH_DEMAND_THRESHOLD;
                        const entry = getEntry(row.fishId);
                        return (
                          <TableRow key={row.fishId} className={isHighDemand ? 'bg-destructive/5' : ''}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {row.fishName}
                                {isHighDemand && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-display font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                                    <AlertTriangle className="w-3 h-3" /> High Demand
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-display font-semibold">
                              {row.totalQuantity} {row.unit}
                            </TableCell>
                            <TableCell className="text-right">{row.orderCount} Orders</TableCell>
                            <TableCell className="text-right font-display">₹{row.sellingRate}/Kg</TableCell>
                            <TableCell className="text-center">
                              {entry.procured ? (
                                <span className="inline-flex items-center gap-1 text-xs font-display font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" /> Procured
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">Pending</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Procurement Planning */}
            <h2 className="font-display text-lg font-bold mb-4">Procurement Planning</h2>
            <div className="space-y-4">
              {demandSummary.map(row => {
                const entry = getEntry(row.fishId);
                const expectedCost = getExpectedCost(row.fishId);
                const expectedProfit = getExpectedProfit(row);
                const isHighDemand = row.totalQuantity >= HIGH_DEMAND_THRESHOLD;

                return (
                  <motion.div
                    key={row.fishId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className={`${entry.procured ? 'border-accent/40 bg-accent/5' : ''} ${isHighDemand && !entry.procured ? 'border-destructive/30' : ''}`}>
                      <CardContent className="p-4 md:p-5">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          {/* Fish info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-display font-bold text-sm">{row.fishName}</h3>
                              {isHighDemand && (
                                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                              )}
                              {entry.procured && (
                                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Demand: <span className="font-semibold text-foreground">{row.totalQuantity} {row.unit}</span> from {row.orderCount} orders
                              &nbsp;·&nbsp; Selling @ ₹{row.sellingRate}/{row.unit}
                            </p>
                          </div>

                          {/* Planning inputs */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                            <div>
                              <Label className="text-xs">Purchase Qty ({row.unit})</Label>
                              <Input
                                type="number"
                                placeholder={String(row.totalQuantity)}
                                value={entry.purchaseQty}
                                onChange={e => updateEntry(row.fishId, 'purchaseQty', e.target.value)}
                                disabled={entry.procured}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Supplier</Label>
                              <Input
                                placeholder="Select supplier"
                                list={`suppliers-${row.fishId}`}
                                value={entry.supplierName}
                                onChange={e => updateEntry(row.fishId, 'supplierName', e.target.value)}
                                disabled={entry.procured}
                                className="mt-1"
                              />
                              <datalist id={`suppliers-${row.fishId}`}>
                                {MOCK_SUPPLIERS.map(s => <option key={s} value={s} />)}
                              </datalist>
                            </div>
                            <div>
                              <Label className="text-xs">Purchase Rate (₹/{row.unit})</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={entry.purchaseRate}
                                onChange={e => updateEntry(row.fishId, 'purchaseRate', e.target.value)}
                                disabled={entry.procured}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          {/* Calculated + Action */}
                          <div className="flex flex-col items-end gap-2 min-w-[140px]">
                            {expectedCost > 0 && (
                              <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Est. Cost</p>
                                <p className="font-display font-bold text-sm">₹{expectedCost.toLocaleString()}</p>
                              </div>
                            )}
                            {expectedCost > 0 && (
                              <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Est. Profit</p>
                                <p className={`font-display font-bold text-sm ${expectedProfit >= 0 ? 'text-accent' : 'text-destructive'}`}>
                                  ₹{expectedProfit.toLocaleString()}
                                </p>
                              </div>
                            )}
                            {!entry.procured ? (
                              <Button
                                size="sm"
                                className="mt-1 gap-1.5 text-xs"
                                onClick={() => handleMarkProcured(row.fishId, row.fishName)}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Mark as Procured
                              </Button>
                            ) : (
                              <span className="text-xs font-display font-semibold text-accent">✓ Procured</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-display uppercase tracking-wider">{label}</p>
              <p className="font-display text-lg md:text-xl font-bold mt-0.5">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
