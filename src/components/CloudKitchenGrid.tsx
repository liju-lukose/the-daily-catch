import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShoppingCart, Flame, Minus, Plus, X, Heart } from 'lucide-react';
import { KitchenMenuItem } from '@/lib/types';
import { getProductImage } from '@/lib/images';
import { useCart } from '@/lib/cart-context';
import { Link } from 'react-router-dom';

interface Props {
  items: KitchenMenuItem[];
  showAll?: boolean;
}

function DishPopup({ item, onClose }: { item: KitchenMenuItem; onClose: () => void }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addItem(item);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative bg-card border border-border rounded-xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-secondary transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto max-h-[85vh]">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            <img src={getProductImage(item.id)} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-card to-transparent" />
          </div>

          <div className="p-6 -mt-6 relative">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {item.tags.map(tag => (
                <span key={tag} className="tag-fresh text-[10px]">{tag}</span>
              ))}
            </div>
            <h3 className="font-display text-xl font-bold">{item.name}</h3>
            <p className="text-sm text-muted-foreground font-body mt-2 leading-relaxed">{item.description}</p>

            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground font-body">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{item.preparationTime} min</span>
              {item.calories && <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" />{item.calories} cal</span>}
            </div>

            {/* Nutritional highlights */}
            <div className="mt-5 p-4 bg-secondary/50 rounded-lg">
              <h4 className="font-display text-sm font-semibold flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-primary" /> Nutritional Benefits
              </h4>
              <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground font-body">
                <li>• Rich in lean protein for muscle recovery</li>
                <li>• Contains essential omega-3 fatty acids</li>
                <li>• Low in saturated fat and cholesterol</li>
                {item.calories && <li>• Only {item.calories} calories per serving</li>}
              </ul>
            </div>

            {/* Quantity + price */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-display text-lg font-bold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="font-display text-2xl font-bold text-primary">₹{item.price * quantity}</span>
            </div>

            <button onClick={handleAdd} className="btn-cart w-full mt-5 flex items-center justify-center gap-2 text-sm py-3 rounded-lg">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart — ₹{item.price * quantity}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CloudKitchenGrid({ items, showAll = false }: Props) {
  const [selectedItem, setSelectedItem] = useState<KitchenMenuItem | null>(null);
  const displayed = showAll ? items : items.slice(0, 4);

  return (
    <>
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
                className="product-card group cursor-pointer rounded-lg"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary rounded-t-lg">
                  <img
                    src={getProductImage(item.id)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-card/90 backdrop-blur text-foreground font-display text-xs font-semibold px-4 py-2 rounded-full">
                      View Details
                    </span>
                  </div>
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
                    <span className="font-display text-lg font-bold text-primary">₹{item.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedItem && <DishPopup item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </>
  );
}
