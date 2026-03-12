import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { getProductImage } from '@/lib/images';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

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
                  const price = isFish
                    ? ((item.product as any).pricePerKg * (item.weight || 1000) / 1000)
                    : (item.product as any).price;

                  return (
                    <div key={item.product.id + (item.cuttingType || '')} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                      <img
                        src={getProductImage(item.product.id)}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-sm font-semibold truncate">{item.product.name}</h3>
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
                    </div>
                  );
                })}
              </div>

              <div className="bg-card border border-border rounded-xl p-5 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-display text-lg font-bold">₹{totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-sm text-muted-foreground">Delivery</span>
                  <span className="font-display text-sm font-semibold text-accent">Free</span>
                </div>
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <span className="font-display text-base font-bold">Total</span>
                  <span className="font-display text-xl font-bold text-primary">₹{totalPrice.toFixed(0)}</span>
                </div>
                <button onClick={handleProceed} className="btn-cart w-full mt-4 rounded-lg py-3 text-base">
                  Proceed to Payment
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
