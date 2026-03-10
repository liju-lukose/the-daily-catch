import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockStores } from '@/lib/mock-data';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';

export default function StoresPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <h1 className="section-title mb-2">Fish Stores</h1>
          <p className="text-muted-foreground font-body text-sm mb-8">Browse trusted third-party fish sellers on our platform.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockStores.map(store => (
              <Link key={store.id} to={`/stores/${store.id}`} className="product-card p-5 hover:border-buoy-orange/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-sm bg-kelp-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-xl font-bold text-kelp-green">{store.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold">{store.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 font-body">{store.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-buoy-orange fill-buoy-orange" />
                        <span className="font-display font-semibold text-foreground">{store.rating}</span>
                        ({store.reviewCount})
                      </span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{store.deliveryRadius}km</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{store.operatingHours}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
