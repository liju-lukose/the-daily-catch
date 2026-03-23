import { motion } from 'framer-motion';
import { FishProduct } from '@/lib/types';
import { getProductImage } from '@/lib/images';
import { Link } from 'react-router-dom';
import { CalendarClock, Package } from 'lucide-react';

interface Props {
  products: FishProduct[];
}

export default function PreOrderGrid({ products }: Props) {
  const preOrderItems = products.filter(p => p.isPreOrder);

  if (preOrderItems.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium font-display bg-accent/10 text-accent rounded-sm mb-2">
              <CalendarClock className="w-3.5 h-3.5" />
              Pre-Order
            </span>
            <h2 className="section-title mt-2">Pre-Order Fresh Fish</h2>
            <p className="text-muted-foreground font-body text-sm mt-1">
              Order now and get fresh fish delivered tomorrow
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {preOrderItems.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/fish/${product.id}`} className="product-card group block rounded-lg">
                <div className="relative aspect-square overflow-hidden bg-secondary rounded-t-lg">
                  <img
                    src={getProductImage(product.id)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium font-display bg-accent text-accent-foreground rounded-sm">
                      <CalendarClock className="w-3 h-3" />
                      Pre-Order
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="inline-flex items-center gap-1 bg-foreground/70 text-background text-[10px] font-display px-2 py-0.5 rounded-sm backdrop-blur-sm">
                      <Package className="w-3 h-3" />
                      Available
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-display text-sm font-semibold truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-display text-base font-bold text-primary">
                      ₹{product.pricePerKg}<span className="text-[10px] font-normal text-muted-foreground">/kg</span>
                    </span>
                    <span className="text-xs text-primary font-display font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Order →
                    </span>
                  </div>
                  <p className="text-[10px] text-accent font-body mt-1.5">🚚 Delivered tomorrow</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
