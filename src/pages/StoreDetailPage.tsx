import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockStores, mockStoreProducts } from '@/lib/mock-data';
import { getProductImage } from '@/lib/images';
import { useCart } from '@/lib/cart-context';
import { Star, MapPin, Clock, ShoppingCart } from 'lucide-react';

export default function StoreDetailPage() {
  const { storeId } = useParams();
  const store = mockStores.find(s => s.id === storeId);
  const products = mockStoreProducts[storeId || ''] || [];
  const { addItem } = useCart();

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Store not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          {/* Store Header */}
          <div className="product-card p-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-sm bg-kelp-green/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-2xl font-bold text-kelp-green">{store.name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">{store.name}</h1>
                <p className="text-sm text-muted-foreground mt-1 font-body">{store.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-buoy-orange fill-buoy-orange" />
                    <span className="font-display font-semibold text-foreground">{store.rating}</span>
                    ({store.reviewCount} reviews)
                  </span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{store.deliveryRadius}km delivery</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{store.operatingHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <h2 className="section-title text-xl mb-4">Available Products</h2>
          {products.length === 0 ? (
            <p className="text-muted-foreground text-sm">No products available at this time.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <div key={product.id} className="product-card group">
                  <div className="relative aspect-square overflow-hidden bg-deep-water">
                    <img src={getProductImage(product.id)} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    {product.freshnessTags.length > 0 && (
                      <div className="absolute top-2 left-2">
                        <span className={product.isCatchOfTheDay ? 'tag-urgent text-[10px]' : 'tag-fresh text-[10px]'}>
                          {product.freshnessTags[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-sm font-semibold">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-display text-base font-bold text-buoy-orange">₹{product.pricePerKg}<span className="text-[10px] text-muted-foreground">/kg</span></span>
                      <button onClick={() => addItem(product, { weight: product.weightOptions[0], storeId: product.storeId })} className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-lg">
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
