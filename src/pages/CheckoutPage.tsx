import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'address' | 'payment' | 'done'>('address');
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', pincode: '', phone: '' });

  if (items.length === 0 && step !== 'done') {
    navigate('/cart');
    return null;
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handlePlaceOrder = () => {
    clearCart();
    setStep('done');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-lg">
          {step === 'done' ? (
            <div className="text-center py-20">
              <CheckCircle className="w-16 h-16 text-kelp-green mx-auto mb-4" />
              <h1 className="section-title mb-2">Order Placed!</h1>
              <p className="text-muted-foreground font-body text-sm mb-6">Your order has been confirmed. You'll receive a notification shortly.</p>
              <button onClick={() => navigate('/')} className="btn-cart">Continue Shopping</button>
            </div>
          ) : (
            <>
              <h1 className="section-title mb-6">Checkout</h1>

              {step === 'address' && (
                <div className="space-y-4">
                  <h2 className="font-display text-lg font-semibold">Delivery Address</h2>
                  <input className="input-field" placeholder="Address Line 1" value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} />
                  <input className="input-field" placeholder="Address Line 2 (optional)" value={address.line2} onChange={e => setAddress({ ...address, line2: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
                    <input className="input-field" placeholder="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
                    <input className="input-field" placeholder="Phone" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} />
                  </div>
                  <button onClick={() => setStep('payment')} className="btn-cart w-full mt-2" disabled={!address.line1 || !address.city}>
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-4">
                  <h2 className="font-display text-lg font-semibold">Payment</h2>
                  <div className="product-card p-5">
                    <p className="text-sm text-muted-foreground font-body mb-3">This is a dummy payment interface. No real payment will be processed.</p>
                    <div className="border-t border-border pt-3 flex items-center justify-between">
                      <span className="font-display font-bold">Total</span>
                      <span className="font-display text-xl font-bold text-buoy-orange">₹{totalPrice.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 product-card p-3 cursor-pointer">
                      <input type="radio" name="payment" defaultChecked className="accent-buoy-orange" />
                      <span className="font-body text-sm">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center gap-3 product-card p-3 cursor-pointer">
                      <input type="radio" name="payment" className="accent-buoy-orange" />
                      <span className="font-body text-sm">Online Payment (Coming Soon)</span>
                    </label>
                  </div>
                  <button onClick={handlePlaceOrder} className="btn-cart w-full mt-2">
                    Place Order — ₹{totalPrice.toFixed(0)}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
