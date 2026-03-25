import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Brain, Shield, Dumbbell, Eye, Bone, Minus, Plus, ShoppingCart, ChevronLeft, UtensilsCrossed, Scissors, MessageSquare, CalendarClock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFishDetail } from '@/hooks/useApi';
import { getProductImage } from '@/lib/images';
import { useCart } from '@/lib/cart-context';
import { fishHealthBenefits, fishDishSuggestions, defaultHealthBenefits, defaultDishSuggestions } from '@/lib/fish-data';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Heart, Brain, Shield, Dumbbell, Eye, Bone,
};

export default function FishDetailPage() {
  const { fishId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: product, isLoading } = useFishDetail(fishId || '');

  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedCutting, setSelectedCutting] = useState<string | undefined>(undefined);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Set defaults once product loads
  const weight = selectedWeight ?? product?.weightOptions[0] ?? 500;
  const cutting = selectedCutting ?? product?.cuttingTypes?.[0]?.id;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="aspect-square rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
  const unitPrice = product.pricePerKg * (weight / 1000);
  const cuttingTypes = product.cuttingTypes ?? [];
  const selectedCuttingObj = cuttingTypes.find(c => c.id === cutting);
  const cuttingPrice = selectedCuttingObj?.price ?? 0;

  const handleAddToCart = () => {
    const cuttingName = selectedCuttingObj?.name;
    addItem(product, {
      weight,
      storeId: product.storeId,
      cuttingType: cuttingName,
      cuttingPrice: cuttingPrice,
      deliveryInstructions: deliveryInstructions || undefined,
      quantity,
    });
    navigate('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 font-body">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative aspect-square rounded-xl overflow-hidden bg-secondary">
              <img src={getProductImage(product.id)} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.isPreOrder ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium font-display bg-accent text-accent-foreground rounded-sm">
                    <CalendarClock className="w-3.5 h-3.5" />
                    Pre-Order
                  </span>
                ) : product.isCatchOfTheDay ? (
                  <span className="tag-urgent">Fresh Catch</span>
                ) : null}
                {product.freshnessTags.filter(t => !t.includes('Fresh') && t !== 'Pre-Order').map(tag => (
                  <span key={tag} className="tag-fresh">{tag}</span>
                ))}
              </div>
              {!product.isPreOrder && product.isCatchOfTheDay && (
                <div className="absolute bottom-4 right-4">
                  <span className="bg-destructive text-destructive-foreground text-xs font-display px-2.5 py-1 rounded-sm">
                    Only {product.stock} Kg left
                  </span>
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
                <span className="text-sm text-muted-foreground font-body">for {weight >= 1000 ? `${weight / 1000}kg` : `${weight}g`}</span>
              </div>

              <div className="mt-5">
                <span className="text-sm font-display font-semibold">Select Weight</span>
                <div className="flex gap-2 mt-2">
                  {product.weightOptions.map(w => (
                    <button key={w} onClick={() => setSelectedWeight(w)}
                      className={`px-4 py-2 rounded-lg text-sm font-display border-2 transition-all ${weight === w ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'border-border bg-card hover:border-muted-foreground/40'}`}>
                      {w >= 1000 ? `${w / 1000} kg` : `${w}g`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <span className="text-sm font-display font-semibold">Quantity</span>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-lg border-2 border-border flex items-center justify-center hover:bg-secondary transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-display text-xl font-bold w-10 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded-lg border-2 border-border flex items-center justify-center hover:bg-secondary transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {product.isPreOrder ? (
                <p className="text-xs text-accent font-body mt-4">🚚 Pre-order — fresh fish delivered tomorrow based on your order</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-4 font-body">{product.stock} units available</p>
              )}

              <button onClick={handleAddToCart} className="btn-cart mt-6 flex items-center justify-center gap-2 text-base py-3.5 w-full md:w-auto md:px-12 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart — ₹{((unitPrice * quantity) + cuttingPrice).toFixed(0)}
              </button>
            </motion.div>
          </div>

          {cuttingTypes.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="w-5 h-5 text-primary" />
                <h2 className="section-title text-xl">Select Cutting Type</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {cuttingTypes.map(ct => (
                    <button key={ct.id} onClick={() => setSelectedCutting(ct.id)}
                      className={`bg-card border-2 rounded-xl p-4 text-left transition-all hover:shadow-md ${cutting === ct.id ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-border hover:border-muted-foreground/40'}`}>
                      <span className="text-3xl block mb-2">{ct.image}</span>
                      <span className="font-display text-sm font-semibold block">{ct.name}</span>
                      <span className="text-xs font-display font-bold text-primary block mt-1">+₹{ct.price}</span>
                      {ct.description && <span className="text-xs text-muted-foreground font-body mt-1 block">{ct.description}</span>}
                    </button>
                ))}
              </div>
            </motion.section>
          )}

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="section-title text-xl">Add Note for Cleaning / Delivery</h2>
            </div>
            <Textarea value={deliveryInstructions} onChange={e => setDeliveryInstructions(e.target.value)}
              placeholder="Add note for cleaning / delivery (optional) — e.g., extra cleaning, remove head, specific cuts, etc."
              className="max-w-xl bg-card border-border rounded-lg resize-none" rows={3} />
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-12">
            <h2 className="section-title mb-6">Health Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((b, i) => {
                const Icon = iconMap[b.icon] ?? Heart;
                return (
                  <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-display text-sm font-semibold">{b.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 font-body leading-relaxed">{b.description}</p>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
            <h2 className="section-title mb-2">Dish Ideas</h2>
            <p className="text-sm text-muted-foreground font-body mb-6">Delicious ways to prepare {product.name}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dishes.map(dish => (
                <Link key={dish.id} to={dish.kitchenMenuId ? `/cloud-kitchen?dish=${dish.kitchenMenuId}` : '/cloud-kitchen'}
                  className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-md transition-all group">
                  <UtensilsCrossed className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-display text-sm font-semibold">{dish.name}</span>
                  {dish.kitchenMenuId && <p className="text-[10px] text-primary mt-1 font-body">Available in Cloud Kitchen →</p>}
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
