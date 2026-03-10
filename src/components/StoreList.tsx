import { motion } from 'framer-motion';
import { Star, MapPin, Clock } from 'lucide-react';
import { Store } from '@/lib/types';
import { Link } from 'react-router-dom';

interface Props {
  stores: Store[];
}

export default function StoreList({ stores }: Props) {
  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Fish Stores</h2>
            <p className="text-muted-foreground font-body text-sm mt-1">
              Trusted local fish sellers on our platform.
            </p>
          </div>
          <Link to="/stores" className="btn-secondary text-xs">
            All Stores
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stores.map((store, i) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/stores/${store.id}`} className="block product-card p-5 hover:border-buoy-orange/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-sm bg-kelp-green/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-lg font-bold text-kelp-green">
                      {store.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold truncate">{store.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-body">{store.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-buoy-orange fill-buoy-orange" />
                        <span className="font-display font-semibold text-foreground">{store.rating}</span>
                        ({store.reviewCount})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{store.deliveryRadius}km
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{store.operatingHours.split('-')[0].trim()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
