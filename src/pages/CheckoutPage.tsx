import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { usePincode } from '@/lib/pincode-context';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, CreditCard, ChevronLeft, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FishProduct } from '@/lib/types';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, deliverySlot, paymentType, hasPreOrderItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { pincode: savedPincode } = usePincode();
  const navigate = useNavigate();
  const [step, setStep] = useState<'address' | 'payment' | 'done'>('address');
  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: user?.phone || '', house: '', street: '', city: '', pincode: savedPincode || '',
  });
  const [orderId, setOrderId] = useState('');

  if (items.length === 0 && step !== 'done') {
    navigate('/cart');
    return null;
  }

  if (!isAuthenticated) {
    navigate('/login', { state: { returnTo: '/checkout' } });
    return null;
  }

  const handlePlaceOrder = () => {
    const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
    setOrderId(newOrderId);
    clearCart();
    setStep('done');
  };

  const isAddressValid = address.fullName && address.phone && address.house && address.city && address.pincode;

  const slotLabel = deliverySlot === 'morning' ? '🌅 Morning: 8:00 AM – 12:00 PM' : '🌇 Evening: 2:00 PM – 7:00 PM';
  const payAmount = hasPreOrderItems && paymentType === 'partial' ? 100 : totalPrice;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-lg">
          <AnimatePresence mode="wait">
            {step === 'done' ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-accent" />
                </div>
                <h1 className="section-title mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground font-body text-sm mb-6">Your order has been placed successfully.</p>
                
                <div className="bg-card border border-border rounded-xl p-5 text-left mb-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-body">Order ID</span>
                    <span className="font-display font-bold text-primary">{orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-body">Delivery Slot</span>
                    <span className="font-display text-sm font-semibold">{slotLabel}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-accent font-body text-center">
                      🐟 Your order is confirmed. Fresh fish will be procured based on your order.
                    </p>
                  </div>
                </div>

                <button onClick={() => navigate('/')} className="btn-cart rounded-lg">Continue Shopping</button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Progress steps */}
                <div className="flex items-center gap-2 mb-8">
                  <div className={`flex items-center gap-2 text-sm font-display font-semibold ${step === 'address' ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 'address' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}`}>1</div>
                    Address
                  </div>
                  <div className="flex-1 h-0.5 bg-border" />
                  <div className={`flex items-center gap-2 text-sm font-display font-semibold ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>2</div>
                    Payment
                  </div>
                </div>

                {step === 'address' && (
                  <motion.div key="addr" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h2 className="font-display text-lg font-semibold">Delivery Address</h2>
                    </div>
                    <input className="input-field rounded-lg" placeholder="Full Name" value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} />
                    <input className="input-field rounded-lg" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} />
                    <input className="input-field rounded-lg" placeholder="House / Flat Number" value={address.house} onChange={e => setAddress({ ...address, house: e.target.value })} />
                    <input className="input-field rounded-lg" placeholder="Street / Area / Landmark" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                      <input className="input-field rounded-lg" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
                      <input className="input-field rounded-lg" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
                    </div>

                    {/* Map placeholder */}
                    <div className="bg-card border border-border rounded-xl p-4">
                      <p className="text-xs text-muted-foreground font-body mb-2">📍 Map Location Picker</p>
                      <div className="bg-secondary rounded-lg h-40 flex items-center justify-center">
                        <p className="text-xs text-muted-foreground font-body">Google Maps integration will be available with backend setup</p>
                      </div>
                    </div>

                    <button onClick={() => setStep('payment')} className="btn-cart w-full rounded-lg py-3" disabled={!isAddressValid}>
                      Continue to Payment
                    </button>
                  </motion.div>
                )}

                {step === 'payment' && (
                  <motion.div key="pay" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <button onClick={() => setStep('address')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body mb-2">
                      <ChevronLeft className="w-4 h-4" /> Back to Address
                    </button>

                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <h2 className="font-display text-lg font-semibold">Payment</h2>
                    </div>

                    {/* Order summary */}
                    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                      <h3 className="font-display text-sm font-semibold">Order Summary</h3>
                      {items.map(item => {
                        const isFish = 'pricePerKg' in item.product;
                        const price = isFish
                          ? ((item.product as FishProduct).pricePerKg * (item.weight || 1000) / 1000)
                          : (item.product as any).price;
                        return (
                          <div key={item.product.id} className="flex justify-between text-sm font-body">
                            <span className="text-muted-foreground">{item.product.name} × {item.quantity}</span>
                            <span className="font-semibold">₹{(price * item.quantity).toFixed(0)}</span>
                          </div>
                        );
                      })}
                      <div className="border-t border-border pt-3 flex items-center justify-between">
                        <span className="font-display font-bold">Total</span>
                        <span className="font-display text-xl font-bold text-primary">₹{totalPrice.toFixed(0)}</span>
                      </div>
                    </div>

                    {/* Delivery info */}
                    <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                      <p className="text-xs font-display font-semibold">Delivering to:</p>
                      <p className="text-sm font-body text-muted-foreground">{address.fullName}, {address.house}, {address.street}, {address.city} - {address.pincode}</p>
                      {deliverySlot && (
                        <div className="flex items-center gap-2 pt-1">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-display font-semibold">{slotLabel}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-colors">
                        <input type="radio" name="payment" defaultChecked className="accent-primary w-4 h-4" />
                        <span className="font-body text-sm">Cash on Delivery</span>
                      </label>
                      <label className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 cursor-pointer opacity-60">
                        <input type="radio" name="payment" className="accent-primary w-4 h-4" disabled />
                        <span className="font-body text-sm">Online Payment (Coming Soon)</span>
                      </label>
                    </div>

                    <button onClick={handlePlaceOrder} className="btn-cart w-full rounded-lg py-3.5 text-base shadow-lg">
                      Pay Now — ₹{payAmount.toFixed(0)}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
