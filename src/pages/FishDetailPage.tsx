import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Brain, Shield, Dumbbell, Eye, Bone, Minus, Plus, ShoppingCart, ChevronLeft, UtensilsCrossed } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockUrbanFishProducts, mockStoreProducts } from '@/lib/mock-data';
import { getProductImage } from '@/lib/images';
import { useCart } from '@/lib/cart-context';
import { fishHealthBenefits, fishDishSuggestions, defaultHealthBenefits, defaultDishSuggestions } from '@/lib/fish-data';
import type { FishProduct } from '@/lib/types';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Heart, Brain, Shield, Dumbbell, Eye, Bone,
};

export default function FishDetailPage() {
  const { fishId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Find product across all sources
  const allProducts = [
    ...mockUrbanFishProducts,
    ...Object.values(mockStoreProducts).flat(),
  ];
  const product = allProducts.find(p => p.id === fishId);

  const [selectedWeight, setSelectedWeight] = useState<number>(product?.weightOptions[0] ?? 500);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Product not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const benefits = fishHealthBenefits[product.id] ?? defaultHealthBenefits;
  const dishes = fishDishSuggestions[product.id] ?? defaultDishSuggestions;
  const unitPrice = product.pricePerKg * (selectedWeight / 1000);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedWeight, product.storeId);
    }
    navigate('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-10">
          {/* Back button */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 font-body">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {/* Hero section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
              <img src={getProductImage(product.id)} alt={product.name} className="w-full h-full object-cover" />
              {product.freshnessTags.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {product.freshnessTags.map(tag => (
                    <span key={tag} className={tag.includes('Fresh') ? 'tag-urgent' : 'tag-fresh'}>{tag}</span>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
              <span className="text-xs font-display uppercase tracking-wider text-muted-foreground">{product.category}</span>
              <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">{product.name}</h1>
              {product.origin && <p className="text-sm text-muted-foreground mt-1 font-body">Origin: {product.origin}</p>}
              <p className="text-base text-muted-foreground mt-4 font-body leading-relaxed">{product.description}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-primary">₹{unitPrice.toFixed(0)}</span>
                <span className="text-sm text-muted-foreground font-body">for {selectedWeight >= 1000 ? `${selectedWeight / 1000}kg` : `${selectedWeight}g`}</span>
              </div>

              {/* Weight selector */}
              <div className="mt-5">
                <span className="text-sm font-display font-semibold">Select Weight</span>
                <div className="flex gap-2 mt-2">
                  {product.weightOptions.map(w => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-4 py-2 rounded-md text-sm font-display border transition-all ${selectedWeight === w ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card hover:border-muted-foreground/40'}`}
                    >
                      {w >= 1000 ? `${w / 1000} kg` : `${w}g`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="mt-5">
                <span className="text-sm font-display font-semibold">Quantity</span>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-md border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-display text-xl font-bold w-10 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded-md border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stock info */}
              <p className="text-xs text-muted-foreground mt-4 font-body">{product.stock} units available</p>

              {/* Add to cart */}
              <button onClick={handleAddToCart} className="btn-cart mt-6 flex items-center justify-center gap-2 text-base py-3 w-full md:w-auto md:px-12 rounded-lg">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart — ₹{(unitPrice * quantity).toFixed(0)}
              </button>
            </motion.div>
          </div>

          {/* Health Benefits */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
            <h2 className="section-title mb-6">Health Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((b, i) => {
                const Icon = iconMap[b.icon] ?? Heart;
                return (
                  <div key={i} className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-display text-sm font-semibold">{b.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 font-body leading-relaxed">{b.description}</p>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Dish Suggestions */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
            <h2 className="section-title mb-2">Dish Ideas</h2>
            <p className="text-sm text-muted-foreground font-body mb-6">Delicious ways to prepare {product.name}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dishes.map(dish => (
                <Link
                  key={dish.id}
                  to={dish.kitchenMenuId ? `/cloud-kitchen?dish=${dish.kitchenMenuId}` : '/cloud-kitchen'}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 hover:shadow-md transition-all group"
                >
                  <UtensilsCrossed className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-display text-sm font-semibold">{dish.name}</span>
                  {dish.kitchenMenuId && (
                    <p className="text-[10px] text-primary mt-1 font-body">Available in Cloud Kitchen →</p>
                  )}
                </Link>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
