import { motion } from 'framer-motion';
import { Clock, ShoppingCart, Flame } from 'lucide-react';
import { KitchenMenuItem } from '@/lib/types';
import { getProductImage } from '@/lib/images';
import { useCart } from '@/lib/cart-context';
import { Link } from 'react-router-dom';

interface Props {
  items: KitchenMenuItem[];
  showAll?: boolean;
}

export default function CloudKitchenGrid({ items, showAll = false }: Props) {
  const { addItem } = useCart();
  const displayed = showAll ? items : items.slice(0, 4);

  return (
    <section className="py-10 md:py-14 bg-ice-blue">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Cloud Kitchen</h2>
            <p className="text-muted-foreground font-body text-sm mt-1">
              Healthy seafood dishes, prepared fresh and delivered hot.
            </p>
          </div>
          {!showAll && (
            <Link to="/cloud-kitchen" className="btn-secondary text-xs">
              View Menu
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayed.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="product-card group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-shallow-grey">
                <img
                  src={getProductImage(item.id)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  {item.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="tag-fresh text-[10px]">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-semibold">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-body">{item.description}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.preparationTime} min</span>
                  {item.calories && <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{item.calories} cal</span>}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-display text-lg font-bold text-buoy-orange">₹{item.price}</span>
                  <button
                    onClick={() => addItem(item)}
                    className="btn-cart text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Add
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
