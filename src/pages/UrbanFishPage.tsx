import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UrbanFishGrid from '@/components/UrbanFishGrid';
import { useFishList } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';

export default function UrbanFishPage() {
  const { data: products, isLoading } = useFishList();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {isLoading ? (
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          </div>
        ) : (
          <UrbanFishGrid products={products ?? []} showAll />
        )}
      </main>
      <Footer />
    </div>
  );
}
