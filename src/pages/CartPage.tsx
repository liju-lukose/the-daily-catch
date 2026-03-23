import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { getProductImage } from '@/lib/images';
import { Minus, Plus, Trash2, Clock, CalendarClock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FishProduct, DeliverySlot } from '@/lib/types';
import { motion } from 'framer-motion';

const DELIVERY_SLOTS: { id: DeliverySlot; label: string; time: string; icon: string }[] = [
  { id: 'morning', label: 'Morning Slot', time: '8:00 AM – 12:00 PM', icon: '🌅' },
  { id: 'evening', label: 'Evening Slot', time: '2:00 PM – 7:00 PM', icon: '🌇' },
];

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart, deliverySlot, setDeliverySlot, paymentType, setPaymentType, hasPreOrderItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!deliverySlot) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const partialAmount = 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="section-title mb-6">Your Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-body mb-4">Your cart is empty.</p>
              <Link to="/" className="btn-cart rounded-lg">Start Shopping</Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map(item => {
                  const isFish = 'pricePerKg' in item.product;
                  const isPreOrder = isFish && (item.product as FishProduct).isPreOrder;
                  const price = isFish
                    ? ((item.product as FishProduct).pricePerKg * (item.weight || 1000) / 1000)
                    : (item.product as any).price;

                  return (
                    <motion.div
                      key={item.product.id + (item.cuttingType || '')}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
                    >
                      <img
                        src={getProductImage(item.product.id)}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-sm font-semibold truncate">{item.product.name}</h3>
                          {isPreOrder && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium font-display bg-accent text-accent-foreground rounded-sm">
                              <CalendarClock className="w-2.5 h-2.5" />
                              Pre-Order
                            </span>
                          )}
                          {isFish && !(item.product as FishProduct).isPreOrder && (item.product as FishProduct).isCatchOfTheDay && (
                            <span className="tag-urgent text-[10px]">Fresh</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-0.5">
                          {isFish && item.weight && (
                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{item.weight >= 1000 ? `${item.weight / 1000}kg` : `${item.weight}g`}</span>
                          )}
                          {item.cuttingType && (
                            <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">{item.cuttingType}</span>
                          )}
                        </div>
                        {item.customerNote && (
                          <p className="text-xs text-muted-foreground mt-1 italic">Note: {item.customerNote}</p>
                        )}
                        <p className="font-display text-sm font-bold text-primary mt-1">₹{price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-secondary transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-display text-sm font-semibold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-secondary transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.product.id)} className="text-destructive hover:text-destructive/80 ml-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Delivery Slot Selection */}
              <div className="bg-card border border-border rounded-xl p-5 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">Select Delivery Slot</h3>
                  <span className="text-xs text-destructive font-body">*Required</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {DELIVERY_SLOTS.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setDeliverySlot(slot.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        deliverySlot === slot.id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border hover:border-muted-foreground/40'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{slot.icon}</span>
                      <span className="font-display text-sm font-semibold block">{slot.label}</span>
                      <span className="text-xs text-muted-foreground font-body">{slot.time}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Type for Pre-Orders */}
              {hasPreOrderItems && (
                <div className="bg-card border border-border rounded-xl p-5 mt-4">
                  <h3 className="font-display text-base font-semibold mb-3">Payment Option</h3>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentType === 'full' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/40'}`}>
                      <input type="radio" name="paymentType" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} className="accent-primary w-4 h-4" />
                      <div>
                        <span className="font-display text-sm font-semibold block">Full Payment</span>
                        <span className="text-xs text-muted-foreground font-body">Pay ₹{totalPrice.toFixed(0)} now</span>
                      </div>
                    </label>
                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentType === 'partial' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/40'}`}>
                      <input type="radio" name="paymentType" checked={paymentType === 'partial'} onChange={() => setPaymentType('partial')} className="accent-primary w-4 h-4" />
                      <div>
                        <span className="font-display text-sm font-semibold block">Partial Payment</span>
                        <span className="text-xs text-muted-foreground font-body">Pay ₹{partialAmount} now to confirm order, rest on delivery</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-card border border-border rounded-xl p-5 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-display text-lg font-bold">₹{totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-sm text-muted-foreground">Delivery</span>
                  <span className="font-display text-sm font-semibold text-accent">Free</span>
                </div>
                {hasPreOrderItems && paymentType === 'partial' && (
                  <div className="flex items-center justify-between mb-4 bg-accent/5 -mx-5 px-5 py-2">
                    <span className="font-body text-sm text-accent">Pay now to confirm</span>
                    <span className="font-display text-sm font-bold text-accent">₹{partialAmount}</span>
                  </div>
                )}
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <span className="font-display text-base font-bold">Total</span>
                  <span className="font-display text-xl font-bold text-primary">₹{totalPrice.toFixed(0)}</span>
                </div>
                <button
                  onClick={handleProceed}
                  disabled={!deliverySlot}
                  className="btn-cart w-full mt-4 rounded-lg py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!deliverySlot ? 'Select a Delivery Slot' : `Proceed to Payment — ₹${hasPreOrderItems && paymentType === 'partial' ? partialAmount : totalPrice.toFixed(0)}`}
                </button>
                <button onClick={clearCart} className="w-full text-center text-xs text-muted-foreground mt-2 hover:text-destructive transition-colors">
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
