import { motion } from 'framer-motion';
import { FishProduct } from '@/lib/types';
import { getProductImage } from '@/lib/images';
import { Link } from 'react-router-dom';

interface Props {
  products: FishProduct[];
  showAll?: boolean;
}

export default function UrbanFishGrid({ products, showAll = false }: Props) {
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
                    <span className="font-display text-base font-bold text-primary">
                      ₹{product.pricePerKg}<span className="text-[10px] font-normal text-muted-foreground">/kg</span>
                    </span>
                    <span className="text-xs text-primary font-display font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      View →
                    </span>
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
