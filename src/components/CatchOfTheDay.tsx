import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { FishProduct } from '@/lib/types';
import { getProductImage } from '@/lib/images';
import { Link } from 'react-router-dom';

interface Props {
  products: FishProduct[];
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 30, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) return { hours: 8, minutes: 30, seconds: 0 };
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5 font-display text-sm">
      <Clock className="w-3.5 h-3.5" />
      <span className="font-bold">{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
      <span className="text-xs text-muted-foreground ml-1">left today</span>
    </div>
  );
}

export default function CatchOfTheDay({ products }: Props) {
  return (
    <section id="catch-of-the-day" className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="tag-urgent mb-2 inline-block">Limited Availability</span>
            <h2 className="section-title mt-2">Catch of the Day</h2>
            <p className="text-muted-foreground font-body text-sm mt-1">
              The freshest selections, available until stock runs out.
            </p>
          </div>
          <CountdownTimer />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/fish/${product.id}`} className="product-card group block rounded-lg">
                <div className="relative aspect-square overflow-hidden bg-secondary rounded-t-lg">
                  <img
                    src={getProductImage(product.id)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="tag-urgent">Fresh Catch</span>
                    {product.freshnessTags.filter(t => !t.includes('Fresh')).map(tag => (
                      <span key={tag} className="tag-fresh">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-destructive text-destructive-foreground text-xs font-display px-2 py-1 rounded-sm backdrop-blur-sm">
                      Only {product.stock} Kg left
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-base font-semibold">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{product.origin}</p>
                    </div>
                    <span className="font-display text-lg font-bold text-primary whitespace-nowrap">
                      ₹{product.pricePerKg}<span className="text-xs font-normal text-muted-foreground">/kg</span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 font-body">{product.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {product.weightOptions.slice(0, 3).map(w => (
                      <span key={w} className="text-xs border border-border rounded-sm px-2 py-0.5 font-display">
                        {w >= 1000 ? `${w / 1000}kg` : `${w}g`}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-xs text-primary font-display font-semibold group-hover:underline">View Details →</span>
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
