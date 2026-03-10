import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { FishProduct } from '@/lib/types';
import { getProductImage } from '@/lib/images';
import { useCart } from '@/lib/cart-context';
import { Link } from 'react-router-dom';

interface Props {
  products: FishProduct[];
  showAll?: boolean;
}

export default function UrbanFishGrid({ products, showAll = false }: Props) {
  const { addItem } = useCart();
  const displayed = showAll ? products : products.filter(p => !p.isCatchOfTheDay);

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Urban Fish</h2>
            <p className="text-muted-foreground font-body text-sm mt-1">
              Premium seafood from our own inventory, direct to you.
            </p>
          </div>
          {!showAll && (
            <Link to="/urban-fish" className="btn-secondary text-xs">
              View All
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayed.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="product-card group"
            >
              <div className="relative aspect-square overflow-hidden bg-deep-water">
                <img
                  src={getProductImage(product.id)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {product.freshnessTags.length > 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="tag-fresh text-[10px]">{product.freshnessTags[0]}</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-display text-sm font-semibold truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-display text-base font-bold text-buoy-orange">
                    ₹{product.pricePerKg}<span className="text-[10px] font-normal text-muted-foreground">/kg</span>
                  </span>
                  <button
                    onClick={() => addItem(product, product.weightOptions[0])}
                    className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-sm hover:brightness-110 transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
